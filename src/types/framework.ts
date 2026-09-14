/**
 * Type definitions for Enterprise Production Operations Framework (EPOF) v0.2 content.
 *
 * All content in src/content is sourced from README.md v0.2 on main, which is the
 * authoritative requirement. Presentation code must not embed framework text directly.
 */

/** Claim confidence, surfaced in the UI so unproven material is never shown as settled. */
export type ClaimStatus = 'claim' | 'hypothesis' | 'synthesis' | 'withdrawn' | 'illustrative'

export interface Sourced {
  /** README v0.2 section this content derives from, e.g. "§9.3". */
  ref: string
  status?: ClaimStatus
}

/* ---------- §3 Causal problem taxonomy ---------- */
export type TaxonomyLayer = 'root' | 'mechanism' | 'symptom' | 'outcome'

export interface TaxonomyNode extends Sourced {
  id: string
  n: number
  label: string
  layer: TaxonomyLayer
  /** ids in the next layer down that this node drives. */
  drives: string[]
  note?: string
}

/* ---------- §2 Operated Service ---------- */
export interface OsTest extends Sourced {
  id: 'T1' | 'T2' | 'T3' | 'T4' | 'T5'
  name: string
  question: string
  failsIf: string
}

export type OsVerdict =
  | 'operated-service'
  | 'component'
  | 'out-of-boundary'
  | 'dependent-service'

export interface OsCandidate extends Sourced {
  id: string
  label: string
  kind: string
  /** Outcome of each of the five tests, keyed by test id. */
  results: Record<OsTest['id'], { pass: boolean; reason: string }>
  verdict: OsVerdict
  verdictNote: string
}

/* ---------- §7 Operational Contract ---------- */
export interface ContractArea extends Sourced {
  id: string
  name: string
  /** 'core' applies to every Operated Service; 'profile' varies by service type. */
  scope: 'core' | 'profile'
  fields: string[]
  why: string
}

export interface ContractInstance extends Sourced {
  id: string
  label: string
  profile: string
  riskTier: string
  /** area id -> rendered value for this worked example. */
  values: Record<string, string>
  broke: string
}

/* ---------- §8 Service Context Substrate ---------- */
export interface ContextClass extends Sourced {
  id: string
  label: string
  /** Declared / discovered / inferred, per §8.2 provenance classes. */
  provenance: 'declared' | 'discovered' | 'inferred'
  /** Freshness SLA in days. */
  freshnessDays: number
  /** What breaks operationally once this class goes stale. */
  whenStale: string
  exact: boolean
}

/* ---------- §6 Operational loop ---------- */
export interface LoopStage extends Sourced {
  id: string
  name: string
  loop: 'inner' | 'outer'
  mapek: string | null
  purpose: string
  input: string
  evidence: string
  responsibility: string
  humanMachine: string
  output: string
  capabilities: string[]
}

/* ---------- §9 Maturity, authority, risk ---------- */
export interface MaturityLevel extends Sourced {
  id: string
  name: string
  condition: string
}

export interface AuthorityLevel extends Sourced {
  id: string
  name: string
  machine: string
  human: string
}

export interface RiskTier extends Sourced {
  id: string
  definition: string
  cap: string
  capIndex: number
}

export interface ActionClass extends Sourced {
  id: string
  label: string
  current: number
  target: number
  reversibility: string
  blastRadius: string
  note: string
}

/* ---------- §11 / §12 Measurement and evidence ---------- */
export interface MeasurementTier extends Sourced {
  id: 'T1' | 'T2' | 'T3'
  name: string
  meaning: string
  method: string
  canClaim: string
  /** Strength rank: 1 is strongest. Mirrors README ordering. */
  rank: number
}

export interface EvidenceGrade extends Sourced {
  id: 'E1' | 'E2' | 'E3' | 'E4'
  source: string
  usable: string
  rank: number
}

/* ---------- §13 Pillars ---------- */
export interface Pillar extends Sourced {
  id: string
  n: number
  name: string
  absorbs: string
  role: string
  /** Pillar ids this one gates, per §13 (pillar 1 gates 3, 5, 6). */
  gates: string[]
}

/* ---------- §18 Prior art ---------- */
export interface PriorArt extends Sourced {
  id: string
  name: string
  category: string
  solvesWell: string
  epofBinds: string
}

/* ---------- §22 lifecycle, §19 boundaries, §26 claims ---------- */
export interface LifecycleStage extends Sourced {
  id: string
  name: string
  content: string
  isNew?: boolean
}

export interface Boundary extends Sourced {
  condition: string
  position: string
}

export interface Claim extends Sourced {
  id: string
  title: string
  body: string
  status: ClaimStatus
  statusNote: string
}

/* ---------- §21 diagnostic ---------- */
export interface DiagnosticQuestion extends Sourced {
  id: string
  theme: string
  question: string
  options: { label: string; score: 0 | 1 | 2 | 3 }[]
}

export interface Challenge extends Sourced {
  id: string
  objection: string
  answer: string
}
