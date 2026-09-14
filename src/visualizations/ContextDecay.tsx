import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { contextClasses } from '@/content/context'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

const MAX_DAYS = 200

/**
 * §8.2 — freshness and decay made visible.
 * Advancing elapsed time expires facts against their own SLA. Two windows are exact
 * (ownership 90d, topology 7d); the rest are volatility-appropriate and marked derived.
 */
export function ContextDecay() {
  // Opens part-way through the ageing curve so the mechanic is visible without a drag:
  // dependency topology (7d) is already stale, which is what gates A3+.
  const [days, setDays] = useState(20)
  const reduced = usePrefersReducedMotion()

  const rows = useMemo(
    () =>
      contextClasses.map((c) => {
        const ratio = Math.min(1, days / c.freshnessDays)
        return { ...c, ratio, stale: days > c.freshnessDays }
      }),
    [days],
  )

  const staleCount = rows.filter((r) => r.stale).length
  const integrity = Math.round(((rows.length - staleCount) / rows.length) * 100)
  const a3Safe = !rows.find((r) => r.id === 'topology')?.stale && !rows.find((r) => r.id === 'authority')?.stale

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-ink-900/12 bg-paper-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label htmlFor="decay-days" className="eyebrow text-ink-900/62">
            Days since last verification
          </label>
          <div className="mt-3 flex items-center gap-4">
            <input
              id="decay-days"
              type="range"
              min={0}
              max={MAX_DAYS}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              aria-valuetext={`${days} days elapsed, ${staleCount} of ${rows.length} context classes stale`}
              className="text-ink-900/62"
            />
            <span className="w-16 shrink-0 text-right font-mono text-sm tnum text-ink-900">{days}d</span>
          </div>
        </div>
        <div className="flex gap-5 sm:pl-6 sm:border-l sm:rule-light">
          <Stat label="Context integrity" value={`${integrity}%`} ref_="§8.3" />
          <Stat label="A3+ permitted" value={a3Safe ? 'Yes' : 'No'} tone={a3Safe ? 'pos' : 'neg'} ref_="§8.4" />
        </div>
      </div>

      <ul className="mt-4 space-y-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10">
        {rows.map((r) => (
          <li key={r.id} className="grid items-center gap-x-4 gap-y-1.5 bg-paper-50 px-4 py-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto]">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[0.84rem] font-medium text-ink-900">{r.label}</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-900/62">
                {r.provenance}
              </span>
              {!r.exact && (
                <span className="font-mono text-[0.6rem] text-ink-900/62" title="Window derived from volatility, not stated in the requirement">
                  derived
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${r.stale ? 'bg-signal-neg' : 'bg-signal-pos'}`}
                  animate={{ width: `${r.ratio * 100}%` }}
                  transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-2xs tnum text-ink-900/62">
                SLA {r.freshnessDays}d
              </span>
            </div>

            <span
              className={`justify-self-start rounded px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] sm:justify-self-end ${
                r.stale ? 'bg-signal-neg/12 text-signal-neg-ink' : 'bg-signal-pos/12 text-signal-pos-ink'
              }`}
            >
              {r.stale ? 'Stale' : 'Current'}
            </span>

            {r.stale && (
              <motion.p
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.25 }}
                className="text-xs leading-relaxed text-signal-neg-ink/90 sm:col-span-3 sm:pl-0"
              >
                {r.whenStale}
              </motion.p>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-3 font-mono text-2xs uppercase tracking-[0.12em] text-ink-900/62">
        Ownership (90d) and dependency topology (7d) are stated in the requirement <Ref s="§8.2" tone="light" />.
        Remaining windows are volatility-appropriate and marked derived.
      </p>
    </div>
  )
}

function Stat({ label, value, tone, ref_ }: { label: string; value: string; tone?: 'pos' | 'neg'; ref_: string }) {
  return (
    <div>
      <span className="eyebrow block text-ink-900/62">{label}</span>
      <span
        className={`mt-1 block font-serif text-2xl tnum ${
          tone === 'neg' ? 'text-signal-neg-ink' : tone === 'pos' ? 'text-signal-pos-ink' : 'text-ink-900'
        }`}
      >
        {value}
      </span>
      <Ref s={ref_} tone="light" />
    </div>
  )
}
