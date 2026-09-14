import type { OsCandidate, OsTest, OsVerdict } from '@/types/framework'

/** §2.1 — the five tests. A candidate qualifies if and only if all five pass. */
export const osTests: OsTest[] = [
  {
    id: 'T1', name: 'Accountability', ref: '§2.1',
    question: 'Is there exactly one team that can authorise a change to it?',
    failsIf: 'Ownership is shared, disputed or absent',
  },
  {
    id: 'T2', name: 'Independent failure', ref: '§2.1',
    question: 'Can it fail in a way distinguishable from its neighbours?',
    failsIf: "Its failure is indistinguishable from a parent's",
  },
  {
    id: 'T3', name: 'Observable boundary', ref: '§2.1',
    question: 'Does at least one signal indicate its health independently?',
    failsIf: 'Health is only inferable from something else',
  },
  {
    id: 'T4', name: 'Independent recovery', ref: '§2.1',
    question: 'Can it be restarted, rolled back, failed over or restored as a unit?',
    failsIf: 'Recovery necessarily acts on a larger unit',
  },
  {
    id: 'T5', name: 'Outcome traceability', ref: '§2.1',
    question: 'Does it support a named customer journey or business capability, directly or through a declared dependency?',
    failsIf: 'No path to any business outcome can be drawn',
  },
]

export const verdictMeta: Record<OsVerdict, { label: string; tone: 'pos' | 'neutral' | 'warn' | 'info' }> = {
  'operated-service': { label: 'Operated Service', tone: 'pos' },
  component: { label: 'Component', tone: 'neutral' },
  'out-of-boundary': { label: 'Out of boundary', tone: 'warn' },
  'dependent-service': { label: 'Dependent service', tone: 'info' },
}

const p = (reason: string) => ({ pass: true, reason })
const f = (reason: string) => ({ pass: false, reason })

/**
 * Candidates drawn from §2.3 (what is not an Operated Service) and §2.4 (resolved
 * edge cases). Test-by-test reasoning applies the §2.1 definitions to each shape.
 */
export const osCandidates: OsCandidate[] = [
  {
    id: 'api', label: 'Customer-facing quote API', kind: 'Request/response service', ref: '§2.4 · §10.2',
    results: {
      T1: p('One product team authorises change'),
      T2: p('Fails independently of its neighbours'),
      T3: p('Availability, latency and error rate are observed directly'),
      T4: p('Rolling restart, canary rollback, regional failover'),
      T5: p('Supports the "obtain a quote" journey directly'),
    },
    verdict: 'operated-service',
    verdictNote: 'The shape every existing framework was designed around. A framework that only works here adds nothing.',
  },
  {
    id: 'pod', label: 'A single Kubernetes pod', kind: 'Infrastructure primitive', ref: '§2.3',
    results: {
      T1: f('Not separately authorised — it is scheduled, not owned'),
      T2: f('Its failure is absorbed by the workload above it'),
      T3: p('Pod-level signals exist'),
      T4: f('Recovery acts on the workload, not the pod'),
      T5: f('No independent path to a business outcome'),
    },
    verdict: 'component',
    verdictNote: '§2.3 names individual pods explicitly. Stop descending: something you cannot own or recover independently is a component.',
  },
  {
    id: 'platform', label: 'Shared Kubernetes platform', kind: 'Shared platform', ref: '§2.3 · §2.4',
    results: {
      T1: p('Platform team authorises change'),
      T2: p('Platform failure is distinguishable from tenant failure'),
      T3: p('Control-plane and platform health observed directly'),
      T4: p('Recoverable as a unit, independent of tenants'),
      T5: p('Reaches outcomes through declared dependents'),
    },
    verdict: 'operated-service',
    verdictNote: 'Qualifies, with consumers as declared dependents and a consumer-facing contract.',
  },
  {
    id: 'db', label: 'Database behind one service', kind: 'Data store', ref: '§2.3',
    results: {
      T1: f('Authorised as part of the owning service, not separately'),
      T2: f('Failure presents as failure of the service in front of it'),
      T3: p('Engine-level telemetry exists'),
      T4: f('Recovery is performed as part of the service'),
      T5: f('Reaches outcomes only through its service'),
    },
    verdict: 'component',
    verdictNote: 'Databases qualify only where independently owned and independently recoverable. This one is not.',
  },
  {
    id: 'db-owned', label: 'Managed data platform, separately owned', kind: 'Data store', ref: '§2.3',
    results: {
      T1: p('A data platform team authorises change'),
      T2: p('Fails distinguishably from its consumers'),
      T3: p('Independent health signals'),
      T4: p('Restore, failover and patching run as a unit'),
      T5: p('Reaches outcomes through declared dependents'),
    },
    verdict: 'operated-service',
    verdictNote: 'The same technology, a different operating model. Qualification is about accountability and recovery — not about what the thing is.',
  },
  {
    id: 'saas', label: 'Third-party identity-verification SaaS', kind: 'Vendor-operated', ref: '§2.4 · §10.3',
    results: {
      T1: p('We authorise our integration, fallback and degradation path'),
      T2: p('Its failure is distinguishable at our boundary'),
      T3: p('Observable at the integration boundary only'),
      T4: p('We recover by degrading and falling back — we cannot fix'),
      T5: p('Directly supports a customer journey'),
    },
    verdict: 'operated-service',
    verdictNote: 'Qualifies. The contract covers what we control; vendor internals are declared out-of-boundary, and authority inside the vendor is not grantable at any level.',
  },
  {
    id: 'vendor-internals', label: 'Internals of that vendor SaaS', kind: 'Vendor-operated', ref: '§10.3',
    results: {
      T1: f('We cannot authorise any change'),
      T2: f('Not distinguishable to us'),
      T3: f('No telemetry beyond our boundary'),
      T4: f('We cannot recover it'),
      T5: f('Reaches outcomes only through our integration'),
    },
    verdict: 'out-of-boundary',
    verdictNote: 'Declared out-of-boundary as an explicit contract field. Authority here is not grantable — a distinct state from A0.',
  },
  {
    id: 'batch', label: 'Overnight settlement chain, 14 stages', kind: 'Scheduled workload', ref: '§2.4 · §10.1',
    results: {
      T1: p('Single owner across the chain'),
      T2: p('Chain failure is distinguishable'),
      T3: p('On-track / at-risk / breached against a deadline'),
      T4: p('Rerun from checkpoint, as one procedure'),
      T5: p('Supports settlement as a business capability'),
    },
    verdict: 'operated-service',
    verdictNote: 'One owner, one deadline, one recovery procedure — therefore one Operated Service, not fourteen.',
  },
  {
    id: 'batch-stage', label: 'One independently owned batch stage', kind: 'Scheduled workload', ref: '§2.4',
    results: {
      T1: p('A different team authorises this stage'),
      T2: p('Fails distinguishably from the rest of the chain'),
      T3: p('Stage-level completion and duration observed'),
      T4: p('Independently rerunnable'),
      T5: p('Contributes to settlement through the chain'),
    },
    verdict: 'operated-service',
    verdictNote: 'Independently rerunnable stages with separate owners are separate Operated Services. The split follows ownership and recovery, not technology.',
  },
  {
    id: 'monolith', label: 'Monolith serving several business functions', kind: 'Legacy application', ref: '§2.4',
    results: {
      T1: p('One team authorises change to the deployable'),
      T2: f('Functions cannot fail independently of one another'),
      T3: p('Application-level health is observed'),
      T4: f('Recovery acts on the whole deployable'),
      T5: p('Supports several business capabilities'),
    },
    verdict: 'operated-service',
    verdictNote: 'One Operated Service — not several — until the functions become independently deployable and recoverable. Do not model aspiration.',
  },
]

/** §2.2 — decomposition rule. */
export const decompositionRule = {
  ref: '§2.2',
  steps: [
    { n: 1, text: 'Start from business capabilities, not from infrastructure.' },
    { n: 2, text: 'Descend the technical estate until a candidate passes all five tests.' },
    { n: 3, text: 'Stop descending when a candidate fails T1 or T4. Something you cannot own or cannot recover independently is a component, not an Operated Service.' },
    { n: 4, text: 'Where decomposition disagrees with the organisation chart, record the mismatch as a finding. Do not force the decomposition to match the org chart, and do not force the org chart to match the decomposition.' },
  ],
}

/** §2.5 — aggregation. */
export const aggregation = {
  ref: '§2.5',
  ladder: ['Operated Service', 'Service Group', 'Domain', 'Estate'],
  rule: 'Roll-up is criticality-weighted, never a simple mean.',
  why: 'A simple average hides a failing critical service behind healthy trivial ones, which is the defect that makes most enterprise maturity dashboards useless.',
  requirement: 'Estate-level scores must always be published alongside the worst-performing R1 service.',
}
