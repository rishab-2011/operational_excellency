import type { ContextClass } from '@/types/framework'

/** §8.1 — the position. */
export const contextPosition = {
  ref: '§8.1',
  statement:
    'Service context is an operated asset with its own contract, not a one-time data-collection exercise. Context that is not maintained is not context; it is a historical record being mistaken for a current one.',
  why: 'Context decay is the reason service-context programmes fail. CMDB accuracy degrades measurably from the moment the last audit ends. Every framework in this space — SRE, ITIL, Well-Architected, the AIOps vendors — leaves context maintenance as an exercise for the reader. That gap is available.',
}

/** §8.2 — the three engineered properties. */
export const contextProperties = [
  {
    id: 'provenance', name: 'Provenance', ref: '§8.2',
    requirement:
      'Every context fact carries its source class — declared (asserted by the owning team), discovered (observed from the running estate), or inferred (derived, with method stated) — and a named owner.',
  },
  {
    id: 'freshness', name: 'Freshness', ref: '§8.2',
    requirement:
      'Every fact carries a maximum age appropriate to its volatility. Ownership may be valid for 90 days; dependency topology for 7. An expired fact is rendered stale, never silently trusted.',
  },
  {
    id: 'decay', name: 'Decay monitoring', ref: '§8.2',
    requirement:
      'Drift between declared and discovered context is measured continuously. Drift rate is itself a maturity indicator and frequently the earliest signal that an operating model is degrading.',
  },
]

/**
 * Context classes.
 *
 * README §8.2 states exactly two freshness values — ownership at 90 days and dependency
 * topology at 7 days. Those two are marked exact. The remaining classes are derived from
 * the §7.3 contract core areas, with volatility-appropriate windows shown as illustrative.
 */
export const contextClasses: ContextClass[] = [
  { id: 'ownership', label: 'Ownership', provenance: 'declared', freshnessDays: 90, ref: '§8.2', exact: true, whenStale: 'Incidents route to a team that no longer owns the service. Escalation stalls while the real owner is found.' },
  { id: 'topology', label: 'Dependency topology', provenance: 'discovered', freshnessDays: 7, ref: '§8.2', exact: true, whenStale: 'Blast radius is computed against a graph that no longer holds. Automated action enlarges impact rather than containing it.' },
  { id: 'criticality', label: 'Criticality and risk tier', provenance: 'declared', freshnessDays: 180, ref: '§7.3 · §9.5', exact: false, whenStale: 'Authority caps are enforced against the wrong tier. A service that has become critical is still governed as if it were not.' },
  { id: 'health', label: 'Health model', provenance: 'declared', freshnessDays: 60, ref: '§7.3', exact: false, whenStale: 'Alerts fire on conditions that no longer indicate harm. Signal-to-noise degrades and pages lose meaning.' },
  { id: 'change', label: 'Change and deployment state', provenance: 'discovered', freshnessDays: 1, ref: '§7.3', exact: false, whenStale: 'Change correlation in UNDERSTAND fails. A deployment-caused incident is diagnosed as an infrastructure fault.' },
  { id: 'runbooks', label: 'Runbooks and procedures', provenance: 'declared', freshnessDays: 120, ref: '§7.3', exact: false, whenStale: 'Responders execute steps against a system that has moved. Recovery time extends and confidence falls.' },
  { id: 'authority', label: 'Authority grants', provenance: 'declared', freshnessDays: 30, ref: '§7.3 · §9.6', exact: false, whenStale: 'Machines act under grants whose supporting evidence has expired. This is the above-diagonal condition.' },
  { id: 'outcomes', label: 'Business outcome mapping', provenance: 'declared', freshnessDays: 180, ref: '§7.3', exact: false, whenStale: 'Customer impact cannot be computed. Severity is assigned on technical signal alone.' },
]

/** §8.3 — measurables. */
export const contextMeasures = [
  { id: 'integrity', label: 'Context integrity', def: 'Percentage of declared facts within their freshness SLA', ref: '§8.3' },
  { id: 'drift', label: 'Declared-versus-discovered drift rate', def: 'Percentage of facts where assertion and observation disagree', ref: '§8.3' },
  { id: 'coverage', label: 'Context coverage', def: 'Percentage of Operated Services with a complete core contract', ref: '§8.3' },
  { id: 'stale-incident', label: 'Stale-context incident rate', def: 'Incidents where response was delayed or misrouted by out-of-date context', ref: '§8.3', note: 'The measure that converts this from a hygiene argument into a reliability argument.' },
]

/** §8.4 — why context gates the framework's own claims. */
export const contextGates = {
  ref: '§8.4',
  points: [
    'M3 (Context-Aware) is unreachable without it.',
    'A3+ automation authority is unsafe without it — automated action on stale dependency data enlarges blast radius rather than containing it.',
    'Every AI use case degrades in proportion to context staleness.',
  ],
  conclusion: 'Context integrity is therefore a gate, not a pillar among equals.',
}

/**
 * Pipeline shown in the decay interaction.
 * Note: "confidence" is not a README v0.2 term. It is presented as a derived reading of
 * provenance × freshness, and labelled as such in the UI.
 */
export const contextPipeline = [
  { id: 'source', label: 'Source', exact: true, ref: '§8.2' },
  { id: 'provenance', label: 'Provenance', exact: true, ref: '§8.2' },
  { id: 'freshness', label: 'Freshness', exact: true, ref: '§8.2' },
  { id: 'confidence', label: 'Confidence', exact: false, ref: 'derived' },
  { id: 'decay', label: 'Decay', exact: true, ref: '§8.2' },
  { id: 'use', label: 'Operational use', exact: true, ref: '§8.4' },
]
