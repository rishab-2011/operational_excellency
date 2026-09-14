import { taxonomy } from '@/content/taxonomy'
import type { TaxonomyNode } from '@/types/framework'

export const byId = new Map(taxonomy.map((n) => [n.id, n]))
export const byLayer = (layer: TaxonomyNode['layer']) => taxonomy.filter((n) => n.layer === layer)

/**
 * §3.1 — a claimed benefit must trace exactly one path:
 * root cause → mechanism → business outcome (via an observable symptom).
 *
 * Returns every path reachable from a root so the UI can show that many paths exist,
 * while the rule permits exactly one to be claimed per benefit.
 */
export interface AttributionPath {
  root: TaxonomyNode
  mechanism: TaxonomyNode
  symptom: TaxonomyNode
  outcome: TaxonomyNode
  key: string
}

export function pathsFromRoot(rootId: string): AttributionPath[] {
  const root = byId.get(rootId)
  if (!root) return []
  const out: AttributionPath[] = []
  for (const mId of root.drives) {
    const mechanism = byId.get(mId)
    if (!mechanism) continue
    for (const sId of mechanism.drives) {
      const symptom = byId.get(sId)
      if (!symptom) continue
      for (const oId of symptom.drives) {
        const outcome = byId.get(oId)
        if (!outcome) continue
        out.push({ root, mechanism, symptom, outcome, key: `${root.id}-${mechanism.id}-${symptom.id}-${outcome.id}` })
      }
    }
  }
  return out
}

/** All node ids reachable downstream of a node — used to light up the causal graph. */
export function downstreamOf(id: string): Set<string> {
  const seen = new Set<string>()
  const walk = (nodeId: string) => {
    const node = byId.get(nodeId)
    if (!node) return
    for (const next of node.drives) {
      if (seen.has(next)) continue
      seen.add(next)
      walk(next)
    }
  }
  walk(id)
  return seen
}

/** All node ids upstream of a node — used when a reader selects an outcome. */
export function upstreamOf(id: string): Set<string> {
  const seen = new Set<string>()
  let frontier = [id]
  while (frontier.length) {
    const next: string[] = []
    for (const n of taxonomy) {
      if (n.drives.some((d) => frontier.includes(d)) && !seen.has(n.id)) {
        seen.add(n.id)
        next.push(n.id)
      }
    }
    frontier = next
  }
  return seen
}
