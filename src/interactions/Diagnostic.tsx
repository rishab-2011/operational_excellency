import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { diagnosticDisclaimer, diagnosticQuestions } from '@/content/meta'
import { scoreDiagnostic } from '@/lib/diagnostic'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** §21 — exploratory only. All logic runs locally; nothing is transmitted or stored. */
export function Diagnostic() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const reduced = usePrefersReducedMotion()
  const result = useMemo(() => scoreDiagnostic(answers), [answers])
  const pct = result ? Math.round(result.ratio * 100) : 0

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-measure text-xs leading-relaxed text-ink-900/62">{diagnosticDisclaimer}</p>
        {result && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="chip border-ink-900/20 text-ink-900/62 hover:border-accent-ink/60 hover:text-accent-ink"
          >
            <RotateCcw aria-hidden className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <ol className="space-y-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10">
        {diagnosticQuestions.map((q, i) => (
          <li key={q.id} className="bg-paper-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-2xs tnum text-ink-900/62">{String(i + 1).padStart(2, '0')}</span>
              <span className="eyebrow text-accent-ink">{q.theme}</span>
              <Ref s={q.ref} tone="light" />
            </div>
            <p className="mt-2 text-[0.92rem] leading-snug text-ink-900">{q.question}</p>
            <div role="radiogroup" aria-label={q.question} className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
              {q.options.map((o) => {
                const on = answers[q.id] === o.score
                return (
                  <button
                    key={o.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.score }))}
                    className={`rounded border px-3 py-2 text-left text-xs leading-snug transition-all duration-200 ${
                      on
                        ? 'border-accent-ink bg-accent-wash text-ink-900'
                        : 'border-ink-900/12 text-ink-900/65 hover:border-ink-900/30 hover:bg-paper-200/40'
                    }`}
                  >
                    <span className={`mr-1.5 font-mono text-[0.6rem] ${on ? 'text-accent-ink' : 'text-ink-900/62'}`}>
                      {o.score}
                    </span>
                    {o.label}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 rounded-lg border border-accent-ink/25 bg-accent-wash p-6"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow text-accent-ink">Indicative position</span>
                <p className="mt-1.5 font-serif text-3xl text-ink-900">{result.band.label}</p>
              </div>
              <div className="text-right">
                <span className="block font-mono text-2xs uppercase tracking-[0.12em] text-ink-900/62">
                  Transparent score
                </span>
                <span className="mt-1 block font-mono text-lg tnum text-ink-900">
                  {result.raw}/{result.max} · {pct}%
                </span>
                <span className="block font-mono text-2xs text-ink-900/62">
                  {result.answered} of {result.total} answered
                </span>
              </div>
            </div>

            <div aria-hidden className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-900/12">
              <motion.div
                className="h-full rounded-full bg-accent-deep"
                animate={{ width: `${pct}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-900/72">{result.band.blurb}</p>

            {result.byTheme.length > 1 && (
              <div className="mt-5 border-t border-accent-ink/15 pt-4">
                <span className="eyebrow text-ink-900/62">Weakest themes first</span>
                <ul className="mt-2.5 space-y-1.5">
                  {result.byTheme.slice(0, 4).map((t) => (
                    <li key={t.theme} className="flex items-center gap-3 text-xs">
                      <span className="w-40 shrink-0 text-ink-900/70">{t.theme}</span>
                      <span aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                        <span
                          className="block h-full rounded-full bg-accent-deep/70"
                          style={{ width: `${t.ratio * 100}%` }}
                        />
                      </span>
                      <span className="w-10 shrink-0 text-right font-mono tnum text-ink-900/62">
                        {t.score}/{t.max}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
