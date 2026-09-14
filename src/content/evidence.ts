import type { EvidenceGrade, MeasurementTier } from '@/types/framework'

/**
 * §11.1 — Measurement Readiness tiers.
 * IMPORTANT: T1 is the STRONGEST tier and T3 the weakest. Rank 1 = strongest.
 */
export const measurementTiers: MeasurementTier[] = [
  {
    id: 'T1', name: 'Measured', rank: 1, ref: '§11.1',
    meaning: 'Instrumented, queryable, trustworthy provenance',
    method: 'Direct query of a system of record',
    canClaim: 'Realised value may be claimed. This is the only tier that supports a claim of value achieved.',
  },
  {
    id: 'T2', name: 'Derived', rank: 2, ref: '§11.1',
    meaning: 'Sampled, proxied or inferred with stated method and error bounds',
    method: 'Time-and-motion sampling, ticket-text classification, structured survey with disclosed n',
    canClaim: 'Estimated value may be claimed, with the method and error bounds stated alongside it.',
  },
  {
    id: 'T3', name: 'Estimated', rank: 3, ref: '§11.1',
    meaning: 'Expert judgement',
    method: 'Facilitated estimation, explicitly labelled',
    canClaim: 'May size an opportunity. May never support a benefit claim.',
  },
]

/** §11.2 — the binding rule. */
export const measurementRule = {
  ref: '§11.2',
  rule: 'Realised value may be claimed only from T1. Estimated value may use T2. T3 may size an opportunity but may never support a benefit claim.',
}

/** §11.3 — the first deliverable of any engagement. */
export const measurementReadinessDeliverable = {
  ref: '§11.3',
  title: 'Measurement Readiness Assessment',
  body: 'Produced in the first two weeks of any engagement, before any value is promised. It states plainly which metrics are T1, which are T2 and by what method, which are T3, and what instrumentation would be required to promote them.',
  why: 'Telling a client honestly what cannot yet be measured is a credibility asset, and it prevents the framework from being judged against numbers it was never able to produce.',
}

/**
 * §12.1 — Evidence grades.
 * IMPORTANT: E1 is the STRONGEST grade and E4 the weakest. Rank 1 = strongest.
 */
export const evidenceGrades: EvidenceGrade[] = [
  { id: 'E1', rank: 1, ref: '§12.1', source: 'Measured in this engagement, or peer-reviewed research with disclosed method', usable: 'Supports any claim, including realised value.' },
  { id: 'E2', rank: 2, ref: '§12.1', source: 'Primary vendor or standards-body documentation', usable: 'Supports a claim. Sufficient to promote a hypothesis.' },
  { id: 'E3', rank: 3, ref: '§12.1', source: 'Credible industry survey with disclosed methodology and sample size', usable: 'Minimum grade permitted in an executive deliverable.' },
  { id: 'E4', rank: 4, ref: '§12.1', source: 'Vendor marketing, conference talk, analyst opinion without method, anecdote', usable: 'May inform a hypothesis. May never support a claim.' },
]

/** §12.2 — the rules. */
export const evidenceRules = [
  { n: 1, text: 'No claim in an executive deliverable may rest below E3.', ref: '§12.2' },
  { n: 2, text: 'E4 may inform a hypothesis and may never support a claim. Marketing material is labelled as such wherever cited.', ref: '§12.2' },
  { n: 3, text: 'Promotion from hypothesis to claim requires E1 or E2.', ref: '§12.2' },
  { n: 4, text: 'Every assertion carries its grade in the claims register, with the source and the date assessed.', ref: '§12.2' },
  { n: 5, text: 'An unsupported claim is not an error to be hidden — it is a hypothesis to be measured in pilot.', ref: '§12.2' },
]

/** §12.3 — the standing example, retained from v0.1 and generalised. */
export const evidenceStandingExample = {
  ref: '§12.3',
  text: 'No utilisation figure may be stated without E1 or E2 evidence, or explicit labelling as a hypothesis to be measured within the engagement.',
  origin: 'Generalised from v0.1\'s prohibition on claims such as "enterprises only use 20% of Datadog".',
}

/** §14.10 — reporting discipline. */
export const valueStates = [
  { id: 'baseline', label: 'Baseline', def: 'What is true today, at a declared measurement tier.' },
  { id: 'target', label: 'Target', def: 'What the improvement is aiming at.' },
  { id: 'estimated', label: 'Estimated value', def: 'Modelled benefit. Requires T2 or better, with method stated.' },
  { id: 'realised', label: 'Realised value', def: 'Benefit observed after the fact. Requires T1. Only this counts as achieved value.' },
]

/** §14.1 — why mean MTTR was removed. */
export const mttrPosition = {
  ref: '§14.1',
  rejected: 'Mean MTTR is rejected as a primary improvement signal.',
  why: 'Incident durations are long-tailed and sample sizes are small, so the mean is dominated by outliers and moves largely at random. Analysis of pooled industry incident data (notably the VOID report) found it a poor basis for inference.',
  cost: 'Experienced SREs know this. Leading with it forfeits practitioner credibility against a quality bar that explicitly demands practitioner respect.',
  replacements: [
    { label: 'Detection', def: 'Time-to-detect, p50 and p90, with n disclosed' },
    { label: 'Duration', def: 'Distributional only — p50/p90, n disclosed, outliers examined individually rather than averaged away' },
    { label: 'Coordination', def: 'Responders engaged per incident, handoff count, time-to-correct-team — often the largest and most improvable share of total duration' },
    { label: 'Recurrence', def: 'Repeat-incident rate against a stable cause taxonomy' },
    { label: 'Customer impact', def: 'Customer-impact minutes, and SLO attainment where an SLO is the right expression of the outcome' },
  ],
}

/** §14 — metric families available for attribution. */
export const metricFamilies = [
  { id: 'reliability', label: 'Reliability', ref: '§14.1', outcome: 'o21' },
  { id: 'signal', label: 'Signal quality', ref: '§14.2', outcome: 'o21' },
  { id: 'context', label: 'Context integrity', ref: '§14.3', outcome: 'o26' },
  { id: 'efficiency', label: 'Operational efficiency', ref: '§14.4', outcome: 'o22' },
  { id: 'change', label: 'Change', ref: '§14.5', outcome: 'o23' },
  { id: 'authority', label: 'Automation authority', ref: '§14.6', outcome: 'o25' },
  { id: 'toolvalue', label: 'Tool value realisation', ref: '§14.7', outcome: 'o24' },
  { id: 'economic', label: 'Economic', ref: '§14.8', outcome: 'o22' },
  { id: 'business', label: 'Business and customer', ref: '§14.9', outcome: 'o21' },
]
