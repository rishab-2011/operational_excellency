import { useState } from 'react'
import { Lock } from 'lucide-react'
import { measurementTiers } from '@/content/evidence'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/** §14.10 + §11.2 — the value states, and the gate that decides how far you may go. */
export function ValueFlow() {
  const [tier, setTier] = useState<'T1' | 'T2' | 'T3'>('T2')
  const reach = tier === 'T1' ? 4 : tier === 'T2' ? 3 : 2
  const t = measurementTiers.find((x) => x.id === tier)!

  const states = [
    { id: 'baseline', label: 'Baseline', def: 'What is true today' },
    { id: 'target', label: 'Target', def: 'What we aim at' },
    { id: 'estimated', label: 'Estimated value', def: 'Modelled benefit' },
    { id: 'realised', label: 'Realised value', def: 'Observed after the fact' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Measurement readiness">
        <span className="eyebrow text-ink-900/62">How well can the estate measure?</span>
        {measurementTiers.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={tier === m.id}
            onClick={() => setTier(m.id)}
            className={`chip border ${
              tier === m.id
                ? 'border-accent-ink bg-accent-wash text-accent-ink'
                : 'border-ink-900/15 text-ink-900/62 hover:border-ink-900/35'
            }`}
          >
            {m.id} <span className="normal-case tracking-normal">{m.name}</span>
          </button>
        ))}
      </div>

      <ol className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {states.map((s, i) => {
          const reachable = i + 1 <= reach
          const isGate = s.id === 'realised'
          return (
            <li key={s.id} className="flex flex-1 items-stretch gap-2">
              {isGate && (
                <span aria-hidden className="hidden flex-col items-center justify-center px-1 lg:flex">
                  <Lock className={`h-3.5 w-3.5 ${reachable ? 'text-accent-ink' : 'text-ink-900/62'}`} />
                </span>
              )}
              <div
                className={`flex-1 rounded-lg border p-4 transition-opacity ${
                  reachable
                    ? isGate ? 'border-accent-ink/45 bg-accent-wash' : 'border-ink-900/15 bg-paper-50'
                    : 'border-dashed border-ink-900/15 bg-paper-50 opacity-45'
                }`}
              >
                <span className={`eyebrow block ${isGate && reachable ? 'text-accent-ink' : 'text-ink-900/62'}`}>
                  {s.label}
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-ink-900/75">{s.def}</span>
                {!reachable && (
                  <span className="mt-2 block font-mono text-2xs uppercase tracking-[0.1em] text-ink-900/62">
                    not claimable at {tier}
                  </span>
                )}
              </div>
              {i < states.length - 1 && !states[i + 1] && null}
              {i < states.length - 1 && (
                <span aria-hidden className="hidden items-center text-ink-900/62 lg:flex">→</span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-4 rounded-lg border border-accent-ink/25 bg-accent-wash px-4 py-3">
        <p className="text-sm leading-relaxed text-ink-900/80">
          <span className="font-medium text-ink-900">At {t.id} {t.name.toLowerCase()}:</span> {t.canClaim}{' '}
          <Ref s="§11.2" tone="light" />
        </p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-900/65">
        And every claim must also trace <span className="text-ink-900">exactly one</span> path from root cause to
        outcome. Two constraints, both mandatory — which is why no figure on this page is invented.
      </p>

      <div className="mt-3">
        <DeeperLink tone="light" to="value">Build a claim against both constraints</DeeperLink>
      </div>
    </div>
  )
}
