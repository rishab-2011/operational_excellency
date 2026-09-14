import { useState } from 'react'
import { authorityLevels } from '@/content/authority'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/**
 * §8.2 + §8.4 + §9.6 — context decay as a state transition.
 * Each transition is triggered by a fact passing its own freshness SLA.
 */
const STATES = [
  {
    id: 'fresh', day: 'Day 0', title: 'All context within SLA',
    facts: [{ k: 'Ownership', sla: '90d', ok: true }, { k: 'Dependency topology', sla: '7d', ok: true }, { k: 'Authority evidence', sla: '30d', ok: true }],
    level: 4, gate: 'open', note: 'The grant recorded in the contract can be exercised in full.',
  },
  {
    id: 'topology', day: 'Day 8', title: 'Dependency topology expired',
    facts: [{ k: 'Ownership', sla: '90d', ok: true }, { k: 'Dependency topology', sla: '7d', ok: false }, { k: 'Authority evidence', sla: '30d', ok: true }],
    level: 2, gate: 'narrowed', note: 'A3+ is unsafe on stale context — automated action on an out-of-date graph enlarges blast radius rather than containing it.',
  },
  {
    id: 'evidence', day: 'Day 31', title: 'Authority evidence expired',
    facts: [{ k: 'Ownership', sla: '90d', ok: true }, { k: 'Dependency topology', sla: '7d', ok: false }, { k: 'Authority evidence', sla: '30d', ok: false }],
    level: 1, gate: 'closed', note: 'The grant no longer has evidence behind it. Declared demotion triggers fire; the machine advises and a human acts.',
  },
] as const

export function DecayToAuthority() {
  const [i, setI] = useState(0)
  const s = STATES[i]

  return (
    <div>
      {/* State transition rail */}
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {STATES.map((st, idx) => (
          <li key={st.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              aria-pressed={i === idx}
              onClick={() => setI(idx)}
              className={`w-full rounded-lg border px-3.5 py-3 text-left transition-colors ${
                i === idx
                  ? 'border-accent bg-accent-wash'
                  : 'border-paper-100/12 bg-ink-850 hover:border-paper-100/30'
              }`}
            >
              <span className="block font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">{st.day}</span>
              <span className={`mt-1 block text-[0.86rem] leading-snug ${i === idx ? 'text-paper-50' : 'text-paper-100/78'}`}>
                {st.title}
              </span>
            </button>
            {idx < STATES.length - 1 && (
              <span aria-hidden className="hidden shrink-0 text-paper-100/55 sm:block">→</span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Facts */}
        <div className="rounded-lg border border-paper-100/12 bg-ink-850 p-4">
          <span className="eyebrow text-paper-100/55">Context facts</span>
          <ul className="mt-3 space-y-2">
            {s.facts.map((f) => (
              <li key={f.k} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full ${f.ok ? 'bg-signal-pos' : 'bg-signal-neg'}`}
                />
                <span className="flex-1 text-[0.84rem] text-paper-100/85">{f.k}</span>
                <span className="font-mono text-2xs text-paper-100/55">SLA {f.sla}</span>
                <span
                  className={`w-16 text-right font-mono text-2xs uppercase tracking-[0.1em] ${
                    f.ok ? 'text-signal-pos' : 'text-signal-neg'
                  }`}
                >
                  {f.ok ? 'current' : 'stale'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resulting authority */}
        <div
          className={`rounded-lg border p-4 ${
            s.gate === 'open' ? 'border-signal-pos/40 bg-signal-pos/[0.07]'
              : s.gate === 'narrowed' ? 'border-signal-warn/40 bg-signal-warn/[0.07]'
              : 'border-signal-neg/45 bg-signal-neg/[0.08]'
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="eyebrow text-paper-100/55">Authority gate</span>
            <span
              className={`font-mono text-2xs uppercase tracking-[0.12em] ${
                s.gate === 'open' ? 'text-signal-pos' : s.gate === 'narrowed' ? 'text-signal-warn' : 'text-signal-neg'
              }`}
            >
              {s.gate}
            </span>
          </div>
          <p className="mt-2 font-serif text-xl text-paper-50">
            {authorityLevels[s.level].id} · {authorityLevels[s.level].name}
          </p>
          <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${authorityLevels.length}, minmax(0,1fr))` }}>
            {authorityLevels.map((l, idx) => (
              <span
                key={l.id}
                aria-hidden
                className={`h-1.5 rounded-full ${idx <= s.level ? 'bg-accent' : 'bg-paper-100/12'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-paper-100/78">{s.note}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-paper-100/62">
        Nothing was deployed, changed or broken. Only the <span className="text-paper-50">age of what is known</span>{' '}
        changed — and the machine's permission fell with it. <Ref s="§8.4 · §9.6" />
      </p>

      <div className="mt-3">
        <DeeperLink to="context">Provenance, freshness and drift in full</DeeperLink>
      </div>
    </div>
  )
}
