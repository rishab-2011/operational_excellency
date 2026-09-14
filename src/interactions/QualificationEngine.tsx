import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { osCandidates, osTests, verdictMeta } from '@/content/operatedService'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion, useRovingIndex } from '@/hooks'

const toneCls = {
  pos: 'border-signal-pos/50 bg-signal-pos/10 text-signal-pos',
  neutral: 'border-paper-100/25 bg-paper-100/5 text-paper-100/70',
  warn: 'border-signal-warn/50 bg-signal-warn/10 text-signal-warn',
  info: 'border-signal-info/50 bg-signal-info/10 text-signal-info',
} as const

/** §2.1 — apply the five tests to a candidate and show the verdict with reasoning. */
export function QualificationEngine() {
  const [idx, setIdx] = useState(0)
  const reduced = usePrefersReducedMotion()
  const onKey = useRovingIndex(osCandidates.length, setIdx)
  const c = osCandidates[idx]
  const v = verdictMeta[c.verdict]
  const passCount = osTests.filter((t) => c.results[t.id].pass).length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-8">
      {/* Candidate selector */}
      <div className="min-w-0">
        <p className="eyebrow mb-3 text-paper-100/55">Candidate</p>
        <div
          role="tablist"
          aria-label="Operated Service candidates"
          aria-orientation="vertical"
          className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 no-scrollbar"
        >
          {osCandidates.map((cand, i) => {
            const on = i === idx
            return (
              <button
                key={cand.id}
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onKeyDown={(e) => onKey(e, i)}
                onClick={() => setIdx(i)}
                className={`shrink-0 rounded-md border px-3.5 py-2.5 text-left transition-all duration-200 lg:shrink lg:w-full ${
                  on
                    ? 'border-accent/55 bg-accent-wash'
                    : 'border-paper-100/10 hover:border-paper-100/28 hover:bg-paper-100/[0.03]'
                }`}
              >
                <span className={`block text-[0.82rem] leading-snug ${on ? 'text-paper-50' : 'text-paper-100/72'}`}>
                  {cand.label}
                </span>
                <span className="mt-0.5 block font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
                  {cand.kind}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Test results */}
              <motion.div
          key={c.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-serif text-2xl text-paper-50">{c.label}</h4>
            <span className="font-mono text-2xs tnum text-paper-100/55">
              {passCount}/5 tests passed
            </span>
          </div>

          <ul className="mt-5 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
            {osTests.map((t, i) => {
              const r = c.results[t.id]
              return (
                <motion.li
                  key={t.id}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: reduced ? 0 : i * 0.05 }}
                  className="flex items-start gap-3 bg-ink-850 px-4 py-3.5"
                >
                  {/* Shape + text, never colour alone. */}
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                      r.pass ? 'border-signal-pos/60 bg-signal-pos/15 text-signal-pos' : 'border-paper-100/20 text-paper-100/55'
                    }`}
                  >
                    {r.pass ? <Check className="h-3 w-3" strokeWidth={3} /> : <Minus className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">{t.id}</span>
                      <span className="text-[0.82rem] font-medium text-paper-100/90">{t.name}</span>
                      <span className="sr-only">{r.pass ? 'Passes' : 'Fails'}.</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/55">{t.question}</p>
                    <p className={`mt-1.5 text-[0.8rem] leading-relaxed ${r.pass ? 'text-paper-100/78' : 'text-signal-warn/85'}`}>
                      {r.reason}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ul>

          <div data-testid="os-verdict" className="mt-4 rounded-lg border border-paper-100/10 bg-ink-800/60 p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="eyebrow text-paper-100/55">Verdict</span>
              <span className={`chip border ${toneCls[v.tone]}`}>{v.label}</span>
              <Ref s={c.ref} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-paper-100/75 text-pretty">{c.verdictNote}</p>
          </div>
        </motion.div>
    </div>
  )
}
