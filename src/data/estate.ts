/**
 * ILLUSTRATIVE SAMPLE ESTATE.
 *
 * Not connected to any system. No customer, vendor or production data appears here.
 * These records exist to show the shape of the artefacts the framework produces —
 * an Operated Service register, a contract state, an authority position — at a
 * realistic scale and mix. Every surface that renders them says so.
 *
 * Values are properties of the ARTEFACTS (is a contract field present, is a declared
 * fact within its stated review window, what authority level is recorded). Nothing
 * here is a measurement of a running system, because nothing is measured.
 */

export type RiskTier = 'R1' | 'R2' | 'R3' | 'R4'
export type Profile = 'Request/Response' | 'Scheduled Workload' | 'Vendor-Operated' | 'Shared Platform' | 'Event/Stream'

export interface ActionGrant {
  action: string
  /** Recorded grant, A0–A5. */
  granted: number
  /** Level the risk tier and evidence would support. */
  target: number
  reversible: 'Self-recovering' | 'Tested rollback' | 'Slow to reverse' | 'Irreversible' | 'No state change'
  blast: string
  /** null where authority is structurally not grantable (vendor internals). */
  grantable: boolean
  /**
   * Whether the action changes state.
   *
   * MODELLING DECISION, not stated in the requirement: §9.5 caps grantable authority by
   * risk tier, and §9.4 grants authority per action class — but the requirement does not
   * say whether a non-mutating action with no blast radius is bound by the service's
   * ceiling. This product treats it as not bound, and says so on screen. It is a real
   * ambiguity in the framework and is surfaced rather than silently resolved.
   */
  mutating: boolean
}

export interface ContextFact {
  label: string
  source: 'declared' | 'discovered' | 'inferred'
  windowDays: number
  ageDays: number
}

export type FindingKind = 'authority-above-evidence' | 'context-stale' | 'rollback-untested' | 'ownership-disputed' | 'no-outcome-path'

export interface Finding {
  kind: FindingKind
  detail: string
}

export interface OperatedService {
  id: string
  name: string
  domain: string
  profile: Profile
  risk: RiskTier
  owner: string
  /** Operational maturity, M0–M4. */
  maturity: number
  /** Contract areas completed, of eleven. */
  contractAreas: number
  grants: ActionGrant[]
  context: ContextFact[]
  findings: Finding[]
  /** Set where this record exists to show a boundary rather than a service we operate. */
  note?: string
}

export const FINDING_META: Record<FindingKind, { label: string; severity: 'high' | 'medium' | 'low' }> = {
  'authority-above-evidence': { label: 'Authority above evidence', severity: 'high' },
  'context-stale': { label: 'Context past review window', severity: 'medium' },
  'rollback-untested': { label: 'Abort path untested', severity: 'high' },
  'ownership-disputed': { label: 'Ownership unresolved', severity: 'high' },
  'no-outcome-path': { label: 'No traced outcome path', severity: 'medium' },
}

const ctx = (label: string, source: ContextFact['source'], windowDays: number, ageDays: number): ContextFact =>
  ({ label, source, windowDays, ageDays })

export const estate: OperatedService[] = [
  {
    id: 'quote-api', name: 'Quote API', domain: 'Distribution', profile: 'Request/Response', risk: 'R2',
    owner: 'Quotes engineering', maturity: 3, contractAreas: 11,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart unhealthy instance', granted: 4, target: 4, reversible: 'Self-recovering', blast: 'Single instance', grantable: true, mutating: true },
      { action: 'Roll back deployment', granted: 3, target: 3, reversible: 'Tested rollback', blast: 'One service version', grantable: true, mutating: true },
      { action: 'Fail over to secondary region', granted: 1, target: 2, reversible: 'Slow to reverse', blast: 'Regional, multi-service', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 12), ctx('Dependency topology', 'discovered', 7, 2), ctx('Risk tier', 'declared', 180, 40), ctx('Authority evidence', 'declared', 30, 9)],
    findings: [],
  },
  {
    id: 'settlement', name: 'Overnight settlement chain', domain: 'Finance operations', profile: 'Scheduled Workload', risk: 'R1',
    owner: 'Settlement operations', maturity: 2, contractAreas: 10,
    grants: [
      { action: 'Rerun failed stage', granted: 3, target: 3, reversible: 'Tested rollback', blast: 'One stage, checkpointed', grantable: true, mutating: true },
      { action: 'Extend processing window', granted: 0, target: 0, reversible: 'Irreversible', blast: 'Business commitment', grantable: true, mutating: true },
      { action: 'Reprioritise partner file intake', granted: 1, target: 2, reversible: 'Slow to reverse', blast: 'Downstream reconciliation', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 31), ctx('Stage dependency order', 'declared', 30, 6), ctx('Partner file expectations', 'declared', 14, 19), ctx('Authority evidence', 'declared', 30, 11)],
    findings: [{ kind: 'context-stale', detail: 'Partner file expectations are 19 days old against a 14-day window.' }],
  },
  {
    id: 'idv', name: 'Identity verification', domain: 'Onboarding', profile: 'Vendor-Operated', risk: 'R1',
    owner: 'Onboarding platform', maturity: 2, contractAreas: 9,
    grants: [
      { action: 'Activate fallback provider', granted: 3, target: 3, reversible: 'Tested rollback', blast: 'Verification path only', grantable: true, mutating: true },
      { action: 'Anything inside the vendor', granted: 0, target: 0, reversible: 'Irreversible', blast: 'Out of boundary', grantable: false, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 22), ctx('Integration boundary', 'declared', 180, 96), ctx('Vendor status source', 'declared', 90, 45), ctx('Authority evidence', 'declared', 30, 14)],
    findings: [],
    note: 'Vendor internals are declared out of boundary. Authority there is not grantable at any level — a different state from choosing not to automate.',
  },
  {
    id: 'ledger', name: 'Payments ledger', domain: 'Finance operations', profile: 'Request/Response', risk: 'R1',
    owner: 'Ledger engineering', maturity: 3, contractAreas: 11,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart read replica', granted: 3, target: 3, reversible: 'Self-recovering', blast: 'One replica', grantable: true, mutating: true },
      { action: 'Promote replica to primary', granted: 4, target: 1, reversible: 'Slow to reverse', blast: 'All ledger consumers', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 8), ctx('Dependency topology', 'discovered', 7, 11), ctx('Risk tier', 'declared', 180, 60), ctx('Authority evidence', 'declared', 30, 44)],
    findings: [
      { kind: 'authority-above-evidence', detail: 'Replica promotion is recorded at A4 on an R1 service whose supporting evidence expired 14 days ago.' },
      { kind: 'context-stale', detail: 'Dependency topology is 11 days old against a 7-day window, so blast radius is computed on a stale graph.' },
    ],
  },
  {
    id: 'profile-store', name: 'Customer profile store', domain: 'Customer', profile: 'Request/Response', risk: 'R2',
    owner: 'Customer data', maturity: 2, contractAreas: 8,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart service instance', granted: 2, target: 4, reversible: 'Self-recovering', blast: 'Single instance', grantable: true, mutating: true },
      { action: 'Restore from snapshot', granted: 0, target: 1, reversible: 'Slow to reverse', blast: 'All profile consumers', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 55), ctx('Dependency topology', 'discovered', 7, 3), ctx('Authority evidence', 'declared', 30, 21)],
    findings: [{ kind: 'rollback-untested', detail: 'Snapshot restore is documented but has not been exercised, so it cannot support a grant above A0.' }],
  },
  {
    id: 'notify', name: 'Notification dispatch', domain: 'Customer', profile: 'Event/Stream', risk: 'R3',
    owner: 'Messaging', maturity: 3, contractAreas: 11,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart consumer group', granted: 5, target: 5, reversible: 'Self-recovering', blast: 'One consumer group', grantable: true, mutating: true },
      { action: 'Drain and replay queue', granted: 3, target: 4, reversible: 'Tested rollback', blast: 'Delayed delivery window', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 5), ctx('Dependency topology', 'discovered', 7, 1), ctx('Authority evidence', 'declared', 30, 4)],
    findings: [],
  },
  {
    id: 'container-platform', name: 'Container platform', domain: 'Platform', profile: 'Shared Platform', risk: 'R2',
    owner: 'Platform engineering', maturity: 3, contractAreas: 10,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Drain and replace node', granted: 4, target: 4, reversible: 'Self-recovering', blast: 'Workloads on one node', grantable: true, mutating: true },
      { action: 'Upgrade control plane', granted: 1, target: 2, reversible: 'Slow to reverse', blast: 'Every tenant workload', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 17), ctx('Tenant dependency map', 'discovered', 7, 4), ctx('Authority evidence', 'declared', 30, 12)],
    findings: [],
  },
  {
    id: 'pricing', name: 'Pricing engine', domain: 'Distribution', profile: 'Request/Response', risk: 'R2',
    owner: 'Disputed', maturity: 1, contractAreas: 4,
    grants: [
      { action: 'Read diagnostics', granted: 4, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart service instance', granted: 0, target: 3, reversible: 'Self-recovering', blast: 'Single instance', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 140), ctx('Dependency topology', 'discovered', 7, 6)],
    findings: [
      { kind: 'ownership-disputed', detail: 'Two teams assert change authority. Until arbitrated, this candidate does not satisfy the accountability test.' },
      { kind: 'context-stale', detail: 'Ownership record is 140 days old against a 90-day window.' },
    ],
  },
  {
    id: 'doc-archive', name: 'Document archive', domain: 'Corporate', profile: 'Request/Response', risk: 'R4',
    owner: 'Workplace systems', maturity: 1, contractAreas: 6,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart service instance', granted: 5, target: 5, reversible: 'Self-recovering', blast: 'Single instance', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 63), ctx('Dependency topology', 'discovered', 7, 5)],
    findings: [{ kind: 'no-outcome-path', detail: 'No customer journey or business capability has been traced to this service.' }],
  },
  {
    id: 'fraud', name: 'Fraud scoring', domain: 'Risk', profile: 'Request/Response', risk: 'R1',
    owner: 'Financial crime', maturity: 4, contractAreas: 11,
    grants: [
      { action: 'Read diagnostics', granted: 5, target: 5, reversible: 'No state change', blast: 'None', grantable: true, mutating: false },
      { action: 'Restart scoring worker', granted: 3, target: 3, reversible: 'Self-recovering', blast: 'One worker', grantable: true, mutating: true },
      { action: 'Shed load to rules fallback', granted: 3, target: 3, reversible: 'Tested rollback', blast: 'Scoring quality, not availability', grantable: true, mutating: true },
      { action: 'Change scoring thresholds', granted: 0, target: 0, reversible: 'Irreversible', blast: 'Regulatory exposure', grantable: true, mutating: true },
    ],
    context: [ctx('Ownership', 'declared', 90, 3), ctx('Dependency topology', 'discovered', 7, 2), ctx('Risk tier', 'declared', 180, 20), ctx('Authority evidence', 'declared', 30, 6)],
    findings: [],
    note: 'Operating at M4 with most actions deliberately held low. Under this model that is a correct position, not an incomplete one.',
  },
]

export const CONTRACT_AREA_COUNT = 11

/* ---------------------------------------------------------- derived state ---- */

export const isStale = (f: ContextFact) => f.ageDays > f.windowDays

export function contextIntegrity(s: OperatedService): number {
  if (!s.context.length) return 0
  return Math.round((s.context.filter((f) => !isStale(f)).length / s.context.length) * 100)
}

export function contractCompleteness(s: OperatedService): number {
  return Math.round((s.contractAreas / CONTRACT_AREA_COUNT) * 100)
}

/** Per §9.5 caps: an R1 service cannot hold above A3 without board exception. */
export const RISK_CAP: Record<RiskTier, number> = { R1: 3, R2: 4, R3: 5, R4: 5 }

/** Only state-changing actions are bound by the tier ceiling — see ActionGrant.mutating. */
export function isCapped(g: ActionGrant): boolean {
  return g.grantable && g.mutating
}

export function grantsAboveCap(s: OperatedService): ActionGrant[] {
  return s.grants.filter((g) => isCapped(g) && g.granted > RISK_CAP[s.risk])
}

/** Stated on screen wherever the ceiling is shown. */
export const CEILING_SCOPE_NOTE =
  'The tier ceiling binds state-changing actions. A non-mutating action with no blast radius is not bound by it — a modelling decision this product makes, because the requirement does not resolve it either way.'

export function estateSummary() {
  const withFindings = estate.filter((s) => s.findings.length > 0)
  const high = estate.flatMap((s) => s.findings).filter((f) => FINDING_META[f.kind].severity === 'high')
  const complete = estate.filter((s) => s.contractAreas === CONTRACT_AREA_COUNT)
  const stale = estate.filter((s) => s.context.some(isStale))
  return {
    services: estate.length,
    domains: new Set(estate.map((s) => s.domain)).size,
    contractsComplete: complete.length,
    servicesWithFindings: withFindings.length,
    highSeverityFindings: high.length,
    servicesWithStaleContext: stale.length,
    grantsAboveCap: estate.flatMap(grantsAboveCap).length,
  }
}
