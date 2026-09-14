import type { TaxonomyNode } from '@/types/framework'

/**
 * §3 Causal problem taxonomy.
 *
 * v0.1 listed 25 problems as peers across four levels of abstraction. v0.2 structures
 * them causally so that value cannot be double-counted (§3.1).
 *
 * `drives` edges express the attribution paths the framework permits. They are the
 * framework's own causal reasoning made explicit for navigation; the node text is
 * verbatim from README v0.2.
 */
export const taxonomy: TaxonomyNode[] = [
  // Layer 1 — root causes (structural)
  { id: 'r1', n: 1, label: 'Ownership ambiguity', layer: 'root', ref: '§3', drives: ['m11', 'm12', 'm14'] },
  { id: 'r2', n: 2, label: 'Tool fragmentation and duplicated capability', layer: 'root', ref: '§3', drives: ['m7', 'm8', 'm12'] },
  { id: 'r3', n: 3, label: 'Absent or decaying service context', layer: 'root', ref: '§3', drives: ['m8', 'm9', 'm11'] },
  { id: 'r4', n: 4, label: 'Absent or inconsistent operational standards', layer: 'root', ref: '§3', drives: ['m8', 'm10', 'm13'] },
  { id: 'r5', n: 5, label: 'Skills and incentive misalignment', layer: 'root', ref: '§3', drives: ['m11', 'm14'] },
  { id: 'r6', n: 6, label: 'Integration and data-quality debt', layer: 'root', ref: '§3', drives: ['m7', 'm9', 'm10'] },

  // Layer 2 — mechanisms
  { id: 'm7', n: 7, label: 'Signal noise and false positives', layer: 'mechanism', ref: '§3', drives: ['s15', 's18', 's19'] },
  { id: 'm8', n: 8, label: 'Weak or inconsistent health definitions', layer: 'mechanism', ref: '§3', drives: ['s15', 's16'] },
  { id: 'm9', n: 9, label: 'Dependency blindness', layer: 'mechanism', ref: '§3', drives: ['s15', 's17'] },
  { id: 'm10', n: 10, label: 'Manual change validation', layer: 'mechanism', ref: '§3', drives: ['s19', 's17'] },
  { id: 'm11', n: 11, label: 'Tribal-knowledge dependency', layer: 'mechanism', ref: '§3', drives: ['s18', 's19'] },
  { id: 'm12', n: 12, label: 'Excessive human handoffs', layer: 'mechanism', ref: '§3', drives: ['s15', 's18'] },
  { id: 'm13', n: 13, label: 'Weak reversibility and rollback readiness', layer: 'mechanism', ref: '§3', drives: ['s17', 's16'] },
  { id: 'm14', n: 14, label: 'Weak post-incident learning loop', layer: 'mechanism', ref: '§3', drives: ['s17', 's16', 's20'] },

  // Layer 3 — symptoms
  { id: 's15', n: 15, label: 'Slow incident triage', layer: 'symptom', ref: '§3', drives: ['o21', 'o23'] },
  { id: 's16', n: 16, label: 'Reactive operating posture', layer: 'symptom', ref: '§3', drives: ['o21', 'o26'] },
  { id: 's17', n: 17, label: 'Repeat incidents', layer: 'symptom', ref: '§3', drives: ['o21', 'o23'] },
  { id: 's18', n: 18, label: 'High escalation rate', layer: 'symptom', ref: '§3', drives: ['o22', 'o25'] },
  { id: 's19', n: 19, label: 'High manual toil', layer: 'symptom', ref: '§3', drives: ['o22', 'o25'] },
  { id: 's20', n: 20, label: 'Unrealised tool capability', layer: 'symptom', ref: '§3', drives: ['o24', 'o25'] },

  // Layer 4 — business outcomes (the only layer at which value may be claimed)
  { id: 'o21', n: 21, label: 'Customer-impact minutes', layer: 'outcome', ref: '§3', drives: [] },
  { id: 'o22', n: 22, label: 'Linear support-cost growth as the estate scales', layer: 'outcome', ref: '§3', drives: [] },
  { id: 'o23', n: 23, label: 'Change-failure cost', layer: 'outcome', ref: '§3', drives: [] },
  { id: 'o24', n: 24, label: 'Unrealised platform investment', layer: 'outcome', ref: '§3', drives: [] },
  { id: 'o25', n: 25, label: 'Constrained ability to scale operations', layer: 'outcome', ref: '§3', drives: [] },
  { id: 'o26', n: 26, label: 'Unquantified operational risk exposure', layer: 'outcome', ref: '§3', drives: [] },
]

export const layerMeta: Record<
  TaxonomyNode['layer'],
  { title: string; kicker: string; blurb: string }
> = {
  root: {
    title: 'Root causes',
    kicker: 'Layer 1 · Structural',
    blurb: 'Conditions in the operating model itself. Remediation here is slow but compounding.',
  },
  mechanism: {
    title: 'Mechanisms',
    kicker: 'Layer 2 · How root causes bite',
    blurb: 'The operational behaviours through which structure becomes daily friction.',
  },
  symptom: {
    title: 'Symptoms',
    kicker: 'Layer 3 · Observable in operations',
    blurb: 'What operations teams experience and report. Usually where programmes start — and stop.',
  },
  outcome: {
    title: 'Business outcomes',
    kicker: 'Layer 4 · What the executive feels',
    blurb: 'The only layer at which value may be claimed.',
  },
}

/** §3.1 — the rule that prevents a value model from becoming an addition exercise. */
export const noDoubleCounting = {
  ref: '§3.1',
  rule: 'Value may be claimed only at Layer 4, and must be attributed through a named Layer 2 mechanism to a named Layer 1 root cause.',
  detail:
    'A remediation that addresses one mechanism may not claim benefit against every symptom that mechanism touches. Each claimed benefit carries exactly one attribution path.',
}
