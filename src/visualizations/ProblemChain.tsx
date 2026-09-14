import { useMemo, useState } from 'react'
import { taxonomy } from '@/content/taxonomy'
import { pathsFromRoot } from '@/lib/attribution'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

const roots = taxonomy.filter((n) => n.layer === 'root')
const counts = {
  root: roots.length,
  mechanism: taxonomy.filter((n) => n.layer === 'mechanism').length,
  symptom: taxonomy.filter((n) => n.layer === 'symptom').length,
  outcome: taxonomy.filter((n) => n.layer === 'outcome').length,
}

/**
 * §3 — the causal chain, traced. One path at a time, because §3.1 permits exactly
 * one attribution path per claimed benefit. The fan indicator shows how many others exist.
 */
export function ProblemChain() {
  const [rootId, setRootId] = useState('r3')
  const [pathIdx, setPathIdx] = useState(0)

  const paths = useMemo(() => pathsFromRoot(rootId), [rootId])
  const path = paths[Math.min(pathIdx, paths.length - 1)]

  const steps = [
    { band: `Root cause · ${counts.root}`, label: path.root.label, claimable: false },
    { band: `Mechanism · ${counts.mechanism}`, label: path.mechanism.label, claimable: false },
    { band: `Symptom · ${counts.symptom}`, label: path.symptom.label, claimable: false },
    { band: `Business outcome · ${counts.outcome}`, label: path.outcome.label, claimable: true },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Root causes">
        {roots.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={rootId === r.id}
            onClick={() => { setRootId(r.id); setPathIdx(0) }}
            className={`chip border ${
              rootId === r.id
                ? 'border-accent-ink bg-accent-wash text-accent-ink'
                : 'border-ink-900/15 text-ink-900/62 hover:border-ink-900/35'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ol className="mt-5 grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {steps.map((s, i) => (
          <li key={s.band} className="contents">
            <div
              className={`rounded-lg border p-4 ${
                s.claimable
                  ? 'border-accent-ink/45 bg-accent-wash'
                  : 'border-ink-900/12 bg-paper-50'
              }`}
            >
              <span className={`eyebrow block ${s.claimable ? 'text-accent-ink' : 'text-ink-900/62'}`}>{s.band}</span>
              <span className="mt-2 block font-serif text-[1.05rem] leading-snug text-ink-900">{s.label}</span>
              {s.claimable && (
                <span className="mt-2 inline-block rounded bg-accent-ink/12 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-accent-ink">
                  value claimable here only
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden className="hidden items-center justify-center text-ink-900/62 lg:flex">→</span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-900/12 bg-paper-200/40 px-4 py-3">
        <p className="text-sm leading-relaxed text-ink-900/72">
          <span className="font-medium text-ink-900">One path per claimed benefit.</span>{' '}
          This root reaches its outcomes by <span className="tnum">{paths.length}</span> routes — a benefit may use one.{' '}
          <Ref s="§3.1" tone="light" />
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPathIdx((i) => (i + 1) % paths.length)}
            className="chip border border-ink-900/25 text-ink-900/70 hover:border-accent-ink hover:text-accent-ink"
          >
            Show another route
          </button>
        </div>
      </div>

      <div className="mt-3">
        <DeeperLink tone="light" to="problem">Full taxonomy — 26 items, four layers</DeeperLink>
      </div>
    </div>
  )
}
