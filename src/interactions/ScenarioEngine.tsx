import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ShieldAlert, X } from 'lucide-react'
import { authorityLevels, riskTiers } from '@/content/authority'
import { authorityOutcome, resolveAuthority, type ScenarioFactors } from '@/lib/authorityEngine'
import { Ref, StatusTag } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

const DEFAULTS: ScenarioFactors = {
  riskTier: 'R1',
  blastRadiusDeclared: true,
  rollbackTested: true,
  contextFresh: true,
  executionHistory: 34,
  failureModeKnown: true,
  observabilityComplete: true,
  grantedLevel: 4,
}

const toggles: { key: keyof ScenarioFactors; label: string; on: string; off: string; ref: string }[] = [
  { key: 'blastRadiusDeclared', label: 'Blast radius', on: 'Declared and bounded', off: 'Not declared', ref: '§9.6' },
  { key: 'rollbackTested', label: 'Abort path', on: 'Tested', off: 'Documented only', ref: '§9.6' },
  { key: 'contextFresh', label: 'Context freshness', on: 'Within SLA', off: 'Expired', ref: '§8.4' },
  { key: 'observabilityComplete', label: 'Recovery validation', on: 'Can be verified', off: 'Cannot be verified', ref: '§6.3' },
  { key: 'failureModeKnown', label: 'Failure mode', on: 'Known', off: 'Novel', ref: '§17.2' },
]

/**
 * Illustrative only. README v0.2 defines the risk caps (§9.5) and gate criteria (§9.6);
 * it does not define an algorithm combining them. This applies the stated rules in order.
 */
export function ScenarioEngine() {
  const [f, setF] = useState<ScenarioFactors>(DEFAULTS)
  const reduced = usePrefersReducedMotion()
  const r = useMemo(() => resolveAuthority(f), [f])
  const outcome = authorityOutcome(r.effective)
  const capped = r.effective < r.granted

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusTag status="illustrative" />
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">
          Decision logic derived from §9.5 and §9.6 — the requirement states the rules, not an algorithm
        </span>
      </div>

      {/* Scenario */}
      <div className="rounded-lg border border-paper-100/12 bg-ink-800/60 p-5">
        <span className="eyebrow text-paper-100/55">Scenario</span>
        <p className="mt-2 font-serif text-lg leading-snug text-paper-50 text-pretty">
          A customer-facing API is experiencing severe latency. An agent recommends restarting three
          workload instances. It is technically capable of doing so right now.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-4">
          <fieldset>
            <legend className="eyebrow mb-2.5 text-paper-100/55">Risk tier of the service</legend>
            <div className="flex flex-wrap gap-1.5">
              {riskTiers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={f.riskTier === t.id}
                  onClick={() => setF({ ...f, riskTier: t.id as ScenarioFactors['riskTier'] })}
                  title={t.definition}
                  className={`chip border ${
                    f.riskTier === t.id
                      ? 'border-accent bg-accent-wash text-accent'
                      : 'border-paper-100/15 text-paper-100/60 hover:border-paper-100/35'
                  }`}
                >
                  {t.id}
                  <span className="text-paper-100/55">cap {t.cap.slice(0, 2)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-2.5 text-paper-100/55">Conditions</legend>
            <div className="space-y-1.5">
              {toggles.map((t) => {
                const on = f[t.key] as boolean
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() => setF({ ...f, [t.key]: !on })}
                    className="flex w-full items-center justify-between gap-3 rounded-md border border-paper-100/10 bg-ink-850 px-3.5 py-2.5 text-left transition-colors hover:border-paper-100/25"
                  >
                    <span>
                      <span className="block text-[0.8rem] text-paper-100/80">{t.label}</span>
                      <span className={`block text-xs ${on ? 'text-signal-pos' : 'text-signal-neg'}`}>
                        {on ? t.on : t.off}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                        on ? 'bg-signal-pos/35' : 'bg-paper-100/12'
                      }`}
                    >
                      <motion.span
                        layout={!reduced}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-0.5 h-4 w-4 rounded-full ${
                          on ? 'left-[1.15rem] bg-signal-pos' : 'left-0.5 bg-paper-100/45'
                        }`}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-2 text-paper-100/55">
              Successful executions at current level
            </legend>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={60}
                value={f.executionHistory}
                onChange={(e) => setF({ ...f, executionHistory: Number(e.target.value) })}
                aria-label="Successful executions at current level"
                className="text-paper-100/55"
              />
              <span className="w-8 shrink-0 text-right font-mono text-sm tnum text-paper-100/80">
                {f.executionHistory}
              </span>
            </div>
          </fieldset>
        </div>

        {/* Resolution */}
        <div>
          <div className="eyebrow mb-2.5 text-paper-100/55">Authority ladder</div>
          <ol className="space-y-1.5">
            {authorityLevels.map((lvl, i) => {
              const isEffective = i === r.effective
              const isGranted = i === r.granted
              const withinEffective = i <= r.effective
              const strippedBack = i <= r.granted && i > r.effective
              return (
                <li key={lvl.id}>
                  <div
                    className={`relative flex flex-wrap items-center gap-x-3 gap-y-1.5 overflow-hidden rounded-md border px-3.5 py-2.5 transition-all duration-300 ${
                      isEffective
                        ? 'border-accent bg-accent-wash'
                        : strippedBack
                          ? 'border-signal-neg/35 bg-signal-neg/[0.06]'
                          : withinEffective
                            ? 'border-paper-100/15 bg-ink-850'
                            : 'border-paper-100/[0.06] bg-ink-900/40 opacity-50'
                    }`}
                  >
                    <span
                      className={`font-mono text-2xs tnum ${
                        isEffective ? 'text-accent' : strippedBack ? 'text-signal-neg' : 'text-paper-100/55'
                      }`}
                    >
                      {lvl.id}
                    </span>
                    <span
                      className={`text-[0.82rem] ${
                        isEffective ? 'text-paper-50' : strippedBack ? 'text-paper-100/55 line-through' : 'text-paper-100/65'
                      }`}
                    >
                      {lvl.name}
                    </span>
                    <span className="ml-auto flex flex-wrap items-center gap-1.5">
                      {isGranted && !isEffective && (
                        <span className="chip border-paper-100/25 text-paper-100/55">
                          granted · withheld
                        </span>
                      )}
                      {isGranted && isEffective && (
                        <span className="chip border-paper-100/25 text-paper-100/55">granted</span>
                      )}
                      {isEffective && (
                        <span className="chip border-accent bg-accent text-ink-950">permitted now</span>
                      )}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>

          <motion.div
            layout={!reduced}
            className={`mt-4 rounded-lg border p-5 ${
              capped ? 'border-signal-neg/35 bg-signal-neg/[0.07]' : 'border-signal-pos/30 bg-signal-pos/[0.06]'
            }`}
          >
            <div className="flex items-start gap-3">
              {capped ? (
                <ShieldAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-signal-neg" />
              ) : (
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-signal-pos" />
              )}
              <div className="min-w-0">
                <p className="font-serif text-lg leading-snug text-paper-50">{outcome.verdict}</p>
                <p className="mt-1 text-sm leading-relaxed text-paper-100/70">{outcome.detail}</p>
                {r.binding && (
                  <p className="mt-2.5 border-t border-paper-100/10 pt-2.5 text-sm leading-relaxed text-signal-neg/90">
                    Reduced from the recorded grant: {r.binding.reason}. <Ref s={r.binding.ref} />
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mt-4">
            <span className="eyebrow text-paper-100/55">Gate criteria</span>
            <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
              {r.gates.map((g) => (
                <li key={g.id} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                      g.met ? 'border-signal-pos/50 text-signal-pos' : 'border-signal-neg/50 text-signal-neg'
                    }`}
                  >
                    {g.met ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <X className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span className={g.met ? 'text-paper-100/65' : 'text-paper-100/55'}>
                    {g.label} <Ref s={g.ref} />
                    <span className="sr-only">{g.met ? ' — met' : ' — not met'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
