import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CornerDownRight, RotateCcw } from 'lucide-react'
import { layerMeta, noDoubleCounting, taxonomy } from '@/content/taxonomy'
import { byLayer, downstreamOf, pathsFromRoot, upstreamOf } from '@/lib/attribution'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'
import type { TaxonomyNode } from '@/types/framework'

const LAYERS: TaxonomyNode['layer'][] = ['root', 'mechanism', 'symptom', 'outcome']

/**
 * §3 — four-layer causal taxonomy.
 * Selecting a node lights its causal reach. Selecting a root and then an outcome
 * resolves the single attribution path §3.1 permits a benefit to be claimed against.
 */
export function CausalGraph() {
  // Pre-selected so the causal mechanic is visible without a first click.
  const [sel, setSel] = useState<string | null>('r3')
  const [outcome, setOutcome] = useState<string | null>(null)
  const reduced = usePrefersReducedMotion()

  const lit = useMemo(() => {
    if (!sel) return null
    const node = taxonomy.find((n) => n.id === sel)!
    const set = node.layer === 'outcome' ? upstreamOf(sel) : downstreamOf(sel)
    set.add(sel)
    return set
  }, [sel])

  const selNode = sel ? taxonomy.find((n) => n.id === sel) ?? null : null

  const paths = useMemo(() => {
    if (!selNode || selNode.layer !== 'root') return []
    const all = pathsFromRoot(selNode.id)
    return outcome ? all.filter((p) => p.outcome.id === outcome) : all
  }, [selNode, outcome])

  const reachableOutcomes = useMemo(() => {
    if (!selNode || selNode.layer !== 'root') return new Set<string>()
    return new Set(pathsFromRoot(selNode.id).map((p) => p.outcome.id))
  }, [selNode])

  const reset = () => { setSel('r3'); setOutcome(null) }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-2xs uppercase tracking-[0.14em] text-ink-900/62">
          {sel ? 'Causal reach shown' : 'Select any item to trace causality'}
        </p>
        {sel && (
          <button
            type="button"
            onClick={reset}
            className="chip border-ink-900/20 text-ink-900/62 hover:border-accent-ink/60 hover:text-accent-ink"
          >
            <RotateCcw aria-hidden className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10 lg:grid-cols-4">
        {LAYERS.map((layer) => {
          const meta = layerMeta[layer]
          const nodes = byLayer(layer)
          return (
            <div key={layer} className="bg-paper-50 p-4 sm:p-5">
              <div className="mb-3">
                <span
                  className={`eyebrow block min-h-[2.1rem] ${
                    layer === 'outcome' ? 'text-accent-ink' : 'text-ink-900/62'
                  }`}
                >
                  {meta.kicker}
                </span>
                <h4 className="font-serif text-lg text-ink-900">{meta.title}</h4>
                <p className="mt-1 min-h-[3.4rem] text-xs leading-relaxed text-ink-900/62">{meta.blurb}</p>
              </div>
              <ul className="space-y-1.5">
                {nodes.map((n) => {
                  const dim = lit !== null && !lit.has(n.id)
                  const isSel = sel === n.id
                  const isOutcomeSel = outcome === n.id
                  const selectable =
                    layer === 'root' || layer === 'outcome' ||
                    (lit !== null && lit.has(n.id))
                  const canPickOutcome =
                    selNode?.layer === 'root' && layer === 'outcome' && reachableOutcomes.has(n.id)

                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        aria-pressed={isSel || isOutcomeSel}
                        onClick={() => {
                          if (canPickOutcome) { setOutcome(isOutcomeSel ? null : n.id); return }
                          if (isSel) { reset(); return }
                          setSel(n.id); setOutcome(null)
                        }}
                        className={`group flex w-full items-start gap-2.5 rounded border px-2.5 py-2 text-left transition-all duration-200 ${
                          isSel || isOutcomeSel
                            ? 'border-accent-ink/50 bg-accent-wash text-ink-900'
                            : dim
                              ? 'border-ink-900/[0.06] text-ink-900/62'
                              : selectable
                                ? 'border-ink-900/12 text-ink-900/80 hover:border-accent-ink/45 hover:bg-accent-wash/60'
                                : 'border-ink-900/[0.08] text-ink-900/65 hover:border-ink-900/25 hover:text-ink-900/85'
                        }`}
                      >
                        <span
                          className={`mt-[3px] font-mono text-[0.6rem] tnum ${
                            isSel || isOutcomeSel ? 'text-accent-ink' : 'text-ink-900/62'
                          }`}
                        >
                          {String(n.n).padStart(2, '0')}
                        </span>
                        <span className="text-[0.82rem] leading-snug">{n.label}</span>
                        {canPickOutcome && !isOutcomeSel && (
                          <span aria-hidden className="ml-auto mt-0.5 text-accent-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <CornerDownRight className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Attribution readout — the rule made visible. */}
              {selNode?.layer === 'root' && (
          <motion.div
            key={`${selNode.id}-${outcome ?? 'all'}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 rounded-lg border border-ink-900/12 bg-paper-200/40 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="eyebrow text-accent-ink">Attribution paths</span>
              <span className="font-mono text-2xs text-ink-900/62 tnum">
                {paths.length} {outcome ? 'path to selected outcome' : 'available'}
              </span>
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-ink-900/70">
              {outcome
                ? 'One benefit may be claimed against exactly one of these paths.'
                : 'Select a highlighted business outcome to narrow to the paths that reach it.'}
            </p>

            <ul className="mt-4 space-y-2">
              {paths.slice(0, outcome ? 8 : 4).map((p) => (
                <li
                  key={p.key}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded border border-ink-900/8 bg-paper-50 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-ink-900/85">{p.root.label}</span>
                  <Arrow />
                  <span className="text-ink-900/70">{p.mechanism.label}</span>
                  <Arrow />
                  <span className="text-ink-900/62 line-through decoration-ink-900/25" title="Symptoms are observable but are not a claimable layer">
                    {p.symptom.label}
                  </span>
                  <Arrow />
                  <span className="font-medium text-accent-ink">{p.outcome.label}</span>
                </li>
              ))}
            </ul>
            {!outcome && paths.length > 4 && (
              <p className="mt-2 font-mono text-2xs text-ink-900/62">
                +{paths.length - 4} more — narrow by selecting an outcome
              </p>
            )}
          </motion.div>
        )}

      <div className="mt-6 rounded-lg border border-accent-ink/25 bg-accent-wash p-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="eyebrow text-accent-ink">The no-double-counting rule</span>
          <Ref s={noDoubleCounting.ref} tone="light" />
        </div>
        <p className="mt-2.5 font-serif text-[1.05rem] leading-relaxed text-ink-900 text-pretty">
          {noDoubleCounting.rule}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-900/65">{noDoubleCounting.detail}</p>
      </div>
    </div>
  )
}

function Arrow() {
  return <span aria-hidden className="font-mono text-[0.65rem] text-ink-900/62">→</span>
}
