import { useState } from 'react'
import { motion } from 'framer-motion'
import { CornerLeftUp, RefreshCw } from 'lucide-react'
import { improveTargets, loopStages, loopSubstrate, validateDistinction } from '@/content/loop'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion, useRovingIndex } from '@/hooks'

const inner = loopStages.filter((s) => s.loop === 'inner')
const outer = loopStages.filter((s) => s.loop === 'outer')

/** §6.3 — inner loop at incident time, outer loop at review cadence, contract as substrate. */
export function LoopDiagram() {
  const [sel, setSel] = useState('sense')
  const reduced = usePrefersReducedMotion()
  const stage = loopStages.find((s) => s.id === sel)!
  const onKey = useRovingIndex(loopStages.length, (i) => setSel(loopStages[i].id))

  return (
    <div>
      {/* Substrate */}
      <div className="rounded-lg border border-accent/30 bg-accent-wash px-5 py-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="eyebrow text-accent">Substrate</span>
          <span className="font-serif text-lg text-paper-50">{loopSubstrate.title}</span>
          <Ref s={loopSubstrate.ref} />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-paper-100/72">{loopSubstrate.body}</p>
      </div>

      <div aria-hidden className="mx-auto h-6 w-px bg-gradient-to-b from-accent/40 to-paper-100/15" />

      {/* Inner loop */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <span className="eyebrow text-paper-100/55">Inner loop</span>
          <span className="text-xs text-paper-100/55">operates at incident and event time</span>
        </div>
        <div
          role="tablist"
          aria-label="Inner loop stages"
          className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
        >
          {inner.map((s, i) => (
            <StageButton
              key={s.id}
              stage={s}
              selected={sel === s.id}
              onSelect={() => setSel(s.id)}
              onKeyDown={(e) => onKey(e, loopStages.findIndex((x) => x.id === s.id))}
              showArrow={i < inner.length - 1}
            />
          ))}
        </div>
        {/* Return path — the loop closing. */}
        <div aria-hidden className="mt-2 hidden items-center gap-2 sm:flex">
          <span className="h-px flex-1 bg-gradient-to-r from-paper-100/20 to-paper-100/5" />
          <span className="flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
            <RefreshCw className="h-3 w-3" /> continuous
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-paper-100/20 to-paper-100/5" />
        </div>
      </div>

      <div aria-hidden className="mx-auto mt-4 h-6 w-px bg-paper-100/15" />

      {/* Outer loop */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <span className="eyebrow text-paper-100/55">Outer loop</span>
          <span className="text-xs text-paper-100/55">operates at review cadence</span>
        </div>
        <div role="tablist" aria-label="Outer loop stages" className="flex flex-col gap-2 sm:flex-row">
          {outer.map((s, i) => (
            <StageButton
              key={s.id}
              stage={s}
              selected={sel === s.id}
              onSelect={() => setSel(s.id)}
              onKeyDown={(e) => onKey(e, loopStages.findIndex((x) => x.id === s.id))}
              showArrow={i < outer.length - 1}
            />
          ))}
          <div className="flex items-center gap-2 rounded-md border border-dashed border-accent/35 bg-accent-wash/50 px-4 py-3 sm:flex-1">
            <CornerLeftUp aria-hidden className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-xs leading-snug text-paper-100/70">
              Improve rewrites the substrate — including the authority grants themselves.
            </span>
          </div>
        </div>
      </div>

      {/* Stage detail */}
              <motion.div
          key={stage.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="tabpanel"
          data-testid="loop-panel"
          className="mt-6 overflow-hidden rounded-lg border border-paper-100/12 bg-ink-850"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-100/10 bg-ink-800/60 px-5 py-3.5">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h4 className="font-serif text-xl text-paper-50">{stage.name}</h4>
              <Ref s={stage.ref} />
            </div>
            <span
              className={`chip border ${
                stage.mapek
                  ? 'border-paper-100/20 text-paper-100/55'
                  : 'border-accent/55 bg-accent-wash text-accent'
              }`}
            >
              {stage.mapek ? `MAPE-K · ${stage.mapek}` : 'No MAPE-K equivalent'}
            </span>
          </div>

          <dl className="grid gap-px bg-paper-100/8 sm:grid-cols-2">
            <Field label="Purpose" value={stage.purpose} />
            <Field label="Input" value={stage.input} />
            <Field label="Evidence" value={stage.evidence} />
            <Field label="Decision responsibility" value={stage.responsibility} />
            <Field label="Human / machine" value={stage.humanMachine} />
            <Field label="Output" value={stage.output} />
          </dl>

          <div className="border-t border-paper-100/10 px-5 py-4">
            <span className="eyebrow text-paper-100/55">Capabilities typically involved</span>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {stage.capabilities.map((c) => (
                <span key={c} className="chip border-paper-100/15 text-paper-100/60">{c}</span>
              ))}
            </div>
          </div>

          {stage.id === 'validate' && (
            <div className="border-t border-accent/25 bg-accent-wash px-5 py-4">
              <span className="eyebrow text-accent">Why this stage stands alone</span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded border border-paper-100/12 bg-ink-900/60 p-3.5">
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
                    Action completion
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper-100/70">{validateDistinction.completion}</p>
                </div>
                <div className="rounded border border-accent/35 bg-ink-900/60 p-3.5">
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">Actual recovery</span>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper-100/80">{validateDistinction.recovery}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-paper-100/72">{validateDistinction.point}</p>
            </div>
          )}

          {stage.id === 'improve' && (
            <div className="border-t border-paper-100/10 px-5 py-4">
              <span className="eyebrow text-accent">What Improve is permitted to change</span>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {improveTargets.map((t) => (
                  <span
                    key={t}
                    className={`chip border ${
                      t === 'Automation authority grants'
                        ? 'border-accent/55 bg-accent-wash text-accent'
                        : 'border-paper-100/15 text-paper-100/60'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
    </div>
  )
}

function StageButton({
  stage, selected, onSelect, onKeyDown, showArrow,
}: {
  stage: (typeof loopStages)[number]
  selected: boolean
  onSelect: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  showArrow: boolean
}) {
  const isValidate = stage.id === 'validate'
  return (
    <>
      <button
        role="tab"
        aria-selected={selected}
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        className={`flex-1 rounded-md border px-3.5 py-3 text-left transition-all duration-200 ${
          selected
            ? 'border-accent bg-accent-wash'
            : isValidate
              ? 'border-accent/30 bg-ink-850 hover:border-accent/55'
              : 'border-paper-100/12 bg-ink-850 hover:border-paper-100/30'
        }`}
      >
        <span
          className={`block font-mono text-2xs uppercase tracking-[0.12em] ${
            selected ? 'text-accent' : 'text-paper-100/55'
          }`}
        >
          {stage.mapek ?? 'added'}
        </span>
        <span className={`mt-1 block font-serif text-lg ${selected ? 'text-paper-50' : 'text-paper-100/80'}`}>
          {stage.name}
        </span>
      </button>
      {showArrow && (
        <span
          aria-hidden
          className="hidden shrink-0 self-center font-mono text-2xs text-paper-100/55 sm:inline"
        >
          →
        </span>
      )}
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-850 px-5 py-3.5">
      <dt className="font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">{label}</dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-paper-100/78">{value}</dd>
    </div>
  )
}
