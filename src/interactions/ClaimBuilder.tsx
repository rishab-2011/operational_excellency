import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, X } from 'lucide-react'
import { taxonomy } from '@/content/taxonomy'
import { measurementTiers, valueStates } from '@/content/evidence'
import { pathsFromRoot } from '@/lib/attribution'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

const outcomes = taxonomy.filter((n) => n.layer === 'outcome')

/**
 * Binds §3.1 (exactly one attribution path per benefit) to §11.2 (what each
 * measurement tier permits). Both constraints must be satisfied for a value claim.
 */
export function ClaimBuilder() {
  const [outcome, setOutcome] = useState<string | null>(null)
  const [pathKey, setPathKey] = useState<string | null>(null)
  const [tier, setTier] = useState<string | null>(null)
  const reduced = usePrefersReducedMotion()

  const paths = useMemo(() => {
    if (!outcome) return []
    return taxonomy
      .filter((n) => n.layer === 'root')
      .flatMap((r) => pathsFromRoot(r.id))
      .filter((p) => p.outcome.id === outcome)
  }, [outcome])

  const path = paths.find((p) => p.key === pathKey) ?? null
  const tierObj = measurementTiers.find((t) => t.id === tier) ?? null
  const complete = path && tierObj

  const verdict = !complete
    ? null
    : tierObj.id === 'T1'
      ? { state: 'realised', label: 'Realised value may be claimed', ok: true, why: 'Measured from a system of record, with one attribution path. Both constraints are satisfied.' }
      : tierObj.id === 'T2'
        ? { state: 'estimated', label: 'Estimated value only', ok: true, why: 'Derived data supports a modelled benefit, with the method and error bounds stated alongside it. It may not be reported as value achieved.' }
        : { state: 'opportunity', label: 'Opportunity sizing only', ok: false, why: 'Expert judgement may size the prize. It may never support a benefit claim.' }

  const reset = () => { setOutcome(null); setPathKey(null); setTier(null) }

  return (
    <div>
      {/* Progression */}
      <ol className="mb-6 flex flex-wrap items-stretch gap-2">
        {valueStates.map((v, i) => (
          <li key={v.id} className="flex items-center gap-2">
            <span
              className={`flex h-full max-w-[17rem] flex-col rounded-md border px-3 py-2.5 ${
                v.id === 'realised' ? 'border-accent-ink/40 bg-accent-wash' : 'border-ink-900/12 bg-paper-50'
              }`}
            >
              <span className={`block font-mono text-2xs uppercase tracking-[0.1em] ${
                v.id === 'realised' ? 'text-accent-ink' : 'text-ink-900/62'
              }`}>
                {v.label}
              </span>
              <span className="mt-1 block text-xs leading-snug text-ink-900/62">{v.def}</span>
            </span>
            {i < valueStates.length - 1 && <span aria-hidden className="font-mono text-2xs text-ink-900/62">→</span>}
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-ink-900/12 bg-paper-50 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow text-accent-ink">Build a value claim</span>
          {(outcome || tier) && (
            <button
              type="button"
              onClick={reset}
              className="chip border-ink-900/20 text-ink-900/62 hover:border-accent-ink/60 hover:text-accent-ink"
            >
              <RotateCcw aria-hidden className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {/* Step 1 */}
        <Step n={1} label="Which business outcome improved?" hint="Value may be claimed at this layer only" refS="§3.1">
          <div className="flex flex-wrap gap-1.5">
            {outcomes.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={outcome === o.id}
                onClick={() => { setOutcome(o.id); setPathKey(null) }}
                className={`chip border ${
                  outcome === o.id
                    ? 'border-accent-ink bg-accent-wash text-accent-ink'
                    : 'border-ink-900/15 text-ink-900/65 hover:border-ink-900/35'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Step>

        {/* Step 2 */}
        <AnimatePresence>
          {outcome && (
            <motion.div
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <Step
                n={2}
                label="Through exactly one attribution path"
                hint={`${paths.length} paths reach this outcome — a benefit may use one`}
                refS="§3.1"
              >
                <div className="space-y-1.5">
                  {paths.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      aria-pressed={pathKey === p.key}
                      onClick={() => setPathKey(p.key)}
                      className={`flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded border px-3 py-2 text-left text-xs transition-colors ${
                        pathKey === p.key
                          ? 'border-accent-ink/50 bg-accent-wash'
                          : 'border-ink-900/10 hover:border-ink-900/25 hover:bg-paper-200/50'
                      }`}
                    >
                      <span className="font-medium text-ink-900/85">{p.root.label}</span>
                      <span aria-hidden className="font-mono text-[0.65rem] text-ink-900/62">→</span>
                      <span className="text-ink-900/70">{p.mechanism.label}</span>
                      <span aria-hidden className="font-mono text-[0.65rem] text-ink-900/62">→</span>
                      <span className="font-medium text-accent-ink">{p.outcome.label}</span>
                    </button>
                  ))}
                </div>
              </Step>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3 */}
        <AnimatePresence>
          {path && (
            <motion.div
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <Step n={3} label="How well can you measure it today?" hint="T1 is the strongest tier" refS="§11.2">
                <div className="flex flex-wrap gap-1.5">
                  {measurementTiers.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={tier === t.id}
                      onClick={() => setTier(t.id)}
                      className={`chip border ${
                        tier === t.id
                          ? 'border-accent-ink bg-accent-wash text-accent-ink'
                          : 'border-ink-900/15 text-ink-900/65 hover:border-ink-900/35'
                      }`}
                    >
                      {t.id} <span className="normal-case tracking-normal">{t.name}</span>
                    </button>
                  ))}
                </div>
              </Step>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verdict — keyed, so it swaps instantly rather than waiting on an exit */}
        {verdict && (
          <motion.div
            key={verdict.state}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              data-testid="claim-verdict"
              className={`mt-5 flex gap-3 rounded-lg border p-5 ${
                verdict.state === 'realised'
                  ? 'border-signal-pos/40 bg-signal-pos/[0.08]'
                  : verdict.state === 'estimated'
                    ? 'border-signal-warn/40 bg-signal-warn/[0.08]'
                    : 'border-signal-neg/40 bg-signal-neg/[0.07]'
              }`}
            >
              <span aria-hidden className="mt-0.5 shrink-0">
                {verdict.ok ? (
                  <Check className={`h-4 w-4 ${verdict.state === 'realised' ? 'text-signal-pos-ink' : 'text-signal-warn-ink'}`} strokeWidth={3} />
                ) : (
                  <X className="h-4 w-4 text-signal-neg-ink" strokeWidth={3} />
                )}
              </span>
              <div>
                <p className="font-serif text-lg leading-snug text-ink-900">{verdict.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-900/70">{verdict.why}</p>
              </div>
            </motion.div>
          )}
      </div>
    </div>
  )
}

function Step({
  n, label, hint, refS, children,
}: { n: number; label: string; hint: string; refS: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink-900/8 py-4 first:border-t-0 first:pt-0">
      <div className="mb-2.5 flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-2xs tnum text-accent-ink">{String(n).padStart(2, '0')}</span>
        <span className="text-[0.86rem] font-medium text-ink-900">{label}</span>
        <span className="text-xs text-ink-900/62">— {hint}</span>
        <Ref s={refS} tone="light" />
      </div>
      {children}
    </div>
  )
}
