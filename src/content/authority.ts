import type { ActionClass, AuthorityLevel, MaturityLevel, RiskTier } from '@/types/framework'

/** §9.2 — Operational Maturity. Earned. Higher is better. */
export const maturityLevels: MaturityLevel[] = [
  { id: 'M0', name: 'Reactive', ref: '§9.2', condition: 'Human-dependent, fragmented, inconsistent. Failure is learned about from users.' },
  { id: 'M1', name: 'Visible', ref: '§9.2', condition: 'Ownership, basic monitoring and operational awareness exist. Health is asserted.' },
  { id: 'M2', name: 'Standardised', ref: '§9.2', condition: 'A common operating baseline and repeatable practices exist and are followed.' },
  { id: 'M3', name: 'Context-Aware', ref: '§9.2', condition: 'Signals are enriched with service, dependency, customer and business context, and that context meets its integrity thresholds.' },
  { id: 'M4', name: 'Risk-Adaptive', ref: '§9.2', condition: 'Operational decisions use risk, anomaly, change and impact intelligence; the operating model adapts from measured outcomes.' },
]

/** §9.3 — Automation Authority. Granted, not achieved. Higher is not better. */
export const authorityLevels: AuthorityLevel[] = [
  { id: 'A0', name: 'Manual', ref: '§9.3', machine: 'Nothing', human: 'Everything' },
  { id: 'A1', name: 'Assisted', ref: '§9.3', machine: 'Recommends', human: 'Decides and performs' },
  { id: 'A2', name: 'Supervised', ref: '§9.3', machine: 'Performs', human: 'Approves each execution' },
  { id: 'A3', name: 'Guardrailed', ref: '§9.3', machine: 'Performs within declared bounds', human: 'Is notified, can abort' },
  { id: 'A4', name: 'Delegated', ref: '§9.3', machine: 'Performs and validates', human: 'Reviews after the fact' },
  { id: 'A5', name: 'Conditional Autonomy', ref: '§9.3', machine: 'Operates within a policy envelope', human: 'Governs the envelope, not the actions' },
]

export const authorityAnalogue = {
  ref: '§9.3',
  note: 'This ladder is deliberately shaped to mirror SAE J3016 driving-automation levels, which gives an executive audience an immediately legible analogue and gives the framework external precedent instead of a seventh invented scale.',
}

/** §9.4 — the four rules that make the two-axis model work. */
export const authorityRules = [
  { n: 1, title: 'Authority is granted per action class per Operated Service — never per service wholesale.', body: 'On the same service, "restart a stateless worker" may sit at A4 while "fail over the region" remains at A1. This is the single most important rule. v0.1\'s per-service ladder could not express it.', ref: '§9.4' },
  { n: 2, title: 'Target authority is set by risk tier and evidence, not ambition.', body: 'Risk tier caps the maximum grantable level.', ref: '§9.4' },
  { n: 3, title: 'Scoring is against target, not against A5.', body: 'A service operating at its authorised level scores full marks. There is no penalty for being correctly manual.', ref: '§9.4' },
  { n: 4, title: 'Advancement requires evidence, and demotion is automatic on evidence loss.', body: 'Authority is not a status; it is a revocable grant.', ref: '§9.4' },
]

/** §9.5 — risk tiers cap grantable authority. */
export const riskTiers: RiskTier[] = [
  { id: 'R1', ref: '§9.5', definition: 'Customer-facing revenue, safety or regulatory impact; wide blast radius', cap: 'A3 — exceptions require governance board approval', capIndex: 3 },
  { id: 'R2', ref: '§9.5', definition: 'Significant business impact; contained blast radius', cap: 'A4', capIndex: 4 },
  { id: 'R3', ref: '§9.5', definition: 'Moderate impact; recoverable; limited propagation', cap: 'A5', capIndex: 5 },
  { id: 'R4', ref: '§9.5', definition: 'Low impact; internal; trivially reversible', cap: 'A5', capIndex: 5 },
]

/** §9.6 — authority gate criteria. All must hold to advance one level. */
export const gateCriteria = [
  { id: 'blast', text: 'Blast radius is declared and bounded', ref: '§9.6' },
  { id: 'rollback', text: 'A rollback or abort path exists and has been tested, not merely documented', ref: '§9.6' },
  { id: 'context', text: 'Context facts the action depends on are within their freshness SLA', ref: '§9.6 · §8' },
  { id: 'history', text: 'Minimum execution history at the current level: ≥ 20 executions with ≥ 95% success and zero unrecovered side effects', ref: '§9.6', hypothesis: true },
  { id: 'approver', text: 'A named accountable authority holder has approved the grant', ref: '§9.6' },
  { id: 'demotion', text: 'Demotion triggers are declared in advance', ref: '§9.6' },
]

export const gateThresholdNote = {
  ref: '§9.6',
  text: 'The execution-history thresholds are explicitly a hypothesis in the requirement. They must be validated in pilot, not asserted.',
}

/** §9.7 — reading the grid. */
export const gridReadings = [
  { id: 'below', title: 'Below the diagonal', subtitle: 'Maturity exceeds granted authority', body: 'Usually safe, often wasteful: the estate has earned automation it has not been permitted. This is where capacity release lives.', tone: 'warn' as const, ref: '§9.7' },
  { id: 'above', title: 'Above the diagonal', subtitle: 'Authority exceeds maturity', body: 'Operational danger. Machines are acting with more freedom than the context and evidence justify. No existing maturity model surfaces this.', tone: 'neg' as const, ref: '§9.7' },
]

/**
 * Illustrative action classes for one Operated Service, showing that authority is
 * action-specific (§9.4 rule 1). Values follow §10.2 where stated there.
 */
export const actionClasses: ActionClass[] = [
  { id: 'read', label: 'Read diagnostics', ref: '§9.4', status: 'illustrative', current: 5, target: 5, reversibility: 'No state change', blastRadius: 'None', note: 'Non-mutating. Nothing to reverse, nothing to contain.' },
  { id: 'restart', label: 'Restart unhealthy instance', ref: '§10.2', status: 'illustrative', current: 4, target: 4, reversibility: 'Self-recovering', blastRadius: 'Single instance', note: 'Stateless and repeatable. Delegated, with after-the-fact review.' },
  { id: 'rollback', label: 'Roll back deployment', ref: '§10.2', status: 'illustrative', current: 3, target: 3, reversibility: 'Tested rollback path', blastRadius: 'One service version', note: 'Guardrailed: performed within declared bounds, human notified and able to abort.' },
  { id: 'failover', label: 'Fail over stateful service to region', ref: '§10.2', status: 'illustrative', current: 1, target: 2, reversibility: 'Slow and costly to reverse', blastRadius: 'Regional, multi-service', note: 'Capped by risk tier and by blast radius. Machine recommends; human decides.' },
  { id: 'destructive', label: 'Delete or truncate production data', ref: '§9.5', status: 'illustrative', current: 0, target: 0, reversibility: 'Irreversible', blastRadius: 'Unbounded', note: 'Target is A0. Some actions are correctly manual permanently.' },
]

/** §14.6 / §9.4(4) — how a grant moves. */
export const authorityTransitions = [
  { id: 'promote', trigger: 'Evidence accumulates', effect: 'Authority may be promoted', detail: 'Execution history meets the gate, blast radius stays bounded, rollback remains tested, context stays fresh.', dir: 1, ref: '§9.6' },
  { id: 'degrade', trigger: 'Evidence degrades', effect: 'Authority may be reduced', detail: 'The evidence supporting the grant expires or is withdrawn. Authority is a revocable grant, not a status.', dir: -1, ref: '§9.4' },
  { id: 'fail', trigger: 'Automation fails repeatedly', effect: 'Authority is demoted', detail: 'Declared demotion triggers fire. The grant falls to a supervised level pending fresh evidence.', dir: -1, ref: '§9.6' },
  { id: 'stale', trigger: 'Context becomes stale', effect: 'Autonomous action no longer qualifies', detail: 'A3+ is unsafe without fresh context — automated action on stale dependency data enlarges blast radius rather than containing it.', dir: -1, ref: '§8.4' },
  { id: 'override', trigger: 'Human overrides reveal weakness', effect: 'The outer loop learns', detail: 'Overrides are captured in LEARN and feed IMPROVE, which revises the grant itself.', dir: 0, ref: '§6.3' },
]
