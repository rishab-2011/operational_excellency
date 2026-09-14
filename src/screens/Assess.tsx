import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Screen } from '@/app/AppShell'
import { Badge, Meter, Panel } from '@/components/product'
import { PilotPath } from '@/visualizations/PilotPath'
import { diagnosticDisclaimer, diagnosticQuestions, boundaries } from '@/content/meta'
import { adoptionPractices, authorityWork, humansRemain, workforcePosition } from '@/content/people'
import { scoreDiagnostic } from '@/lib/diagnostic'

type ScopeKey = 'size' | 'sponsor' | 'stability'

const SCOPE: { key: ScopeKey; question: string; options: { label: string; ok: boolean; note?: string }[] }[] = [
  {
    key: 'size',
    question: 'Roughly how many production services would be in scope?',
    options: [
      { label: 'Fewer than 15', ok: false, note: 'Below this the overhead exceeds the benefit. SRE practices applied directly are the better recommendation; an assessment should not be sold.' },
      { label: '15 to 100', ok: true },
      { label: 'More than 100', ok: true },
    ],
  },
  {
    key: 'sponsor',
    question: 'Is there an executive who can arbitrate a disputed service ownership?',
    options: [
      { label: 'Yes, and they would', ok: true },
      { label: 'Nominally, but not in practice', ok: false, note: 'Unresolved ownership is the most common cause of stall. Without a real arbiter the assessment halts at the accountability test.' },
      { label: 'No', ok: false, note: 'This is a disqualifying condition, not a risk to manage. The framework will stall at the accountability test.' },
    ],
  },
  {
    key: 'stability',
    question: 'Is the estate stable enough to establish a baseline?',
    options: [
      { label: 'Yes', ok: true },
      { label: 'Mid-replatform or active M&A', ok: false, note: 'The estate is not stable enough to baseline. Defer, or scope to the stable remainder only.' },
      { label: 'Externally regulated automation', ok: true, note: 'Maturity assessment applies fully. The authority axis is capped by the regulator and is not ours to advance — say so before the client does.' },
    ],
  },
]

const STEPS = [
  { id: 'scope', label: 'Scope', sub: 'Is this applicable at all?' },
  { id: 'position', label: 'Position', sub: 'Where does the estate stand?' },
  { id: 'result', label: 'Result', sub: 'Indicative position and gaps' },
  { id: 'pilot', label: 'Pilot', sub: 'A contained validation' },
]

export function Assess() {
  const [step, setStep] = useState(0)
  const [scope, setScope] = useState<Record<string, number>>({})
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const blockers = useMemo(
    () => SCOPE.filter((s) => scope[s.key] !== undefined && !s.options[scope[s.key]].ok)
      .map((s) => ({ q: s.question, note: s.options[scope[s.key]].note! })),
    [scope],
  )
  const scopeComplete = SCOPE.every((s) => scope[s.key] !== undefined)
  const result = useMemo(() => scoreDiagnostic(answers), [answers])
  const themes = useMemo(() => [...new Set(diagnosticQuestions.map((q) => q.theme))], [])

  return (
    <Screen>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-start">
        {/* Step rail */}
        <nav aria-label="Assessment steps">
          <ol className="overflow-hidden rounded-lg border border-paper-100/12 bg-ink-850">
            {STEPS.map((s, i) => {
              const on = i === step
              const done = i < step
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={on ? 'step' : undefined}
                    onClick={() => setStep(i)}
                    className={`flex w-full items-start gap-3 border-b border-paper-100/8 px-4 py-3 text-left transition-colors last:border-b-0 ${
                      on ? 'bg-accent-wash' : 'hover:bg-paper-100/[0.035]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6rem] ${
                        done ? 'border-signal-pos/60 bg-signal-pos/15 text-signal-pos'
                          : on ? 'border-accent text-accent' : 'border-paper-100/25 text-paper-100/55'
                      }`}
                    >
                      {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[0.86rem] ${on ? 'text-paper-50' : 'text-paper-100/80'}`}>{s.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-paper-100/62">{s.sub}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 px-1 text-xs leading-relaxed text-paper-100/62">{diagnosticDisclaimer}</p>
        </nav>

        <div className="min-w-0 space-y-4" data-testid="assess-body">
          {step === 0 && (
            <>
              <Panel title="Applicability">
                <p className="max-w-measure text-sm leading-relaxed text-paper-100/72">
                  Three questions decide whether this framework should be applied at all. Two of the
                  answers below are disqualifying, and the honest recommendation is to stop.
                </p>
                <div className="mt-5 space-y-5">
                  {SCOPE.map((s) => (
                    <fieldset key={s.key}>
                      <legend className="text-[0.88rem] text-paper-50">{s.question}</legend>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {s.options.map((o, oi) => (
                          <button
                            key={o.label}
                            type="button"
                            aria-pressed={scope[s.key] === oi}
                            onClick={() => setScope((p) => ({ ...p, [s.key]: oi }))}
                            className={`chip border ${
                              scope[s.key] === oi
                                ? o.ok ? 'border-signal-pos/60 bg-signal-pos/10 text-signal-pos' : 'border-signal-neg/60 bg-signal-neg/10 text-signal-neg'
                                : 'border-paper-100/15 text-paper-100/68 hover:border-paper-100/35'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </Panel>

              {scopeComplete && (
                <Panel
                  title={blockers.length ? 'Not recommended' : 'Applicable'}
                  tone={blockers.length ? 'warn' : 'accent'}
                  dense
                >
                  {blockers.length ? (
                    <ul>
                      {blockers.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 border-b border-paper-100/8 px-4 py-3 last:border-b-0">
                          <X aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-neg" />
                          <div>
                            <p className="text-[0.84rem] text-paper-50">{b.q}</p>
                            <p className="mt-1 text-xs leading-relaxed text-paper-100/78">{b.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-sm leading-relaxed text-paper-100/80">
                      No disqualifying condition. Continue to establish position.
                    </p>
                  )}
                </Panel>
              )}

              <StepNav onNext={() => setStep(1)} nextLabel="Establish position" disabled={!scopeComplete} />
            </>
          )}

          {step === 1 && (
            <>
              {themes.map((theme) => (
                <Panel key={theme} title={theme} dense>
                  {diagnosticQuestions.filter((q) => q.theme === theme).map((q) => (
                    <div key={q.id} className="border-b border-paper-100/8 px-4 py-3 last:border-b-0">
                      <p className="text-[0.88rem] leading-snug text-paper-100/90">{q.question}</p>
                      <div role="radiogroup" aria-label={q.question} className="mt-2.5 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4">
                        {q.options.map((o) => {
                          const on = answers[q.id] === o.score
                          return (
                            <button
                              key={o.label}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.score }))}
                              className={`rounded border px-3 py-2 text-left text-xs leading-snug transition-colors ${
                                on ? 'border-accent bg-accent-wash text-paper-50' : 'border-paper-100/12 text-paper-100/68 hover:border-paper-100/32'
                              }`}
                            >
                              {o.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </Panel>
              ))}
              <StepNav
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                nextLabel="See result"
                disabled={!result}
                note={`${Object.keys(answers).length} of ${diagnosticQuestions.length} answered`}
              />
            </>
          )}

          {step === 2 && (
            <>
              {result ? (
                <>
                  <Panel title="Indicative position" tone="accent" dense>
                    <div className="flex flex-wrap items-end justify-between gap-4 px-4 py-4">
                      <div>
                        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-accent">Band</span>
                        <p className="mt-1 font-serif text-3xl text-paper-50">{result.band.label}</p>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/62">Transparent score</span>
                        <span className="mt-1 block font-mono text-lg tnum text-paper-50">
                          {result.raw}/{result.max}
                        </span>
                        <span className="block font-mono text-2xs text-paper-100/62">
                          {result.answered} of {result.total} answered
                        </span>
                      </div>
                    </div>
                    <div className="px-4 pb-3"><Meter value={result.ratio * 100} /></div>
                    <p className="border-t border-paper-100/10 px-4 py-3 text-sm leading-relaxed text-paper-100/80">
                      {result.band.blurb}
                    </p>
                  </Panel>

                  <Panel title="Weakest themes first" dense>
                    <ul>
                      {result.byTheme.slice(0, 6).map((t) => (
                        <li key={t.theme} className="grid items-center gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto]">
                          <span className="text-[0.84rem] text-paper-100/85">{t.theme}</span>
                          <Meter value={t.ratio * 100} tone={t.ratio < 0.4 ? 'neg' : t.ratio < 0.7 ? 'warn' : 'pos'} />
                          <span className="font-mono text-2xs tnum text-paper-100/62">{t.score}/{t.max}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </>
              ) : (
                <Panel title="No answers yet"><p className="text-sm text-paper-100/68">Answer at least one question in Position.</p></Panel>
              )}
              <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Plan a pilot" />
            </>
          )}

          {step === 3 && (
            <>
              <Panel title="Validation path">
                <PilotPath />
              </Panel>
              <Panel title="Adoption">
                <p className="max-w-measure text-sm leading-relaxed text-paper-100/72">
                  A standard imposed on teams fails on politics rather than content, so consent is
                  designed in rather than assumed.
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {adoptionPractices.map((a) => (
                    <li key={a.id} className="rounded border border-paper-100/10 bg-ink-800/50 p-3.5">
                      <p className="text-[0.85rem] font-medium leading-snug text-paper-50">{a.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-paper-100/68">{a.body}</p>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="What changes for the teams">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div>
                    <p className="text-sm leading-relaxed text-paper-100/68">{workforcePosition.problem}</p>
                    <p className="mt-4 border-l border-accent/40 pl-4 font-serif text-[1.15rem] leading-snug text-paper-50">
                      {workforcePosition.answer}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-paper-100/72">{workforcePosition.argument}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/62">
                      Work the authority model creates
                    </h4>
                    <ul className="mt-2.5 overflow-hidden rounded border border-paper-100/10">
                      {authorityWork.map((w) => (
                        <li key={w.work} className="grid gap-x-3 gap-y-0.5 border-b border-paper-100/8 bg-ink-800/40 px-3.5 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                          <span className="text-[0.83rem] text-paper-50">{w.work}</span>
                          <span className="text-xs leading-relaxed text-paper-100/68">{w.who}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm leading-relaxed text-paper-100/80">{humansRemain.commitment}</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Where this does not apply" dense>
                <ul>
                  {boundaries.map((b) => (
                    <li key={b.condition} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
                      <span className="text-[0.84rem] font-medium text-paper-50">{b.condition}</span>
                      <span className="text-[0.82rem] leading-relaxed text-paper-100/72">{b.position}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <StepNav onBack={() => setStep(2)} />
            </>
          )}
        </div>
      </div>
    </Screen>
  )
}

function StepNav({
  onBack, onNext, nextLabel, disabled, note,
}: { onBack?: () => void; onNext?: () => void; nextLabel?: string; disabled?: boolean; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {onBack && (
        <button type="button" onClick={onBack} className="rounded-md border border-paper-100/20 px-3.5 py-2 text-[0.84rem] text-paper-100/80 transition-colors hover:border-paper-100/40">
          Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="rounded-md border border-accent bg-accent-wash px-3.5 py-2 text-[0.84rem] text-paper-50 transition-colors enabled:hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
        </button>
      )}
      {note && <Badge tone="muted">{note}</Badge>}
    </div>
  )
}
