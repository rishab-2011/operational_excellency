import type { Boundary, Claim, DiagnosticQuestion, LifecycleStage } from '@/types/framework'

export const project = {
  /** §33 of the brief: the UI must not display the repository's misspelling. */
  title: 'The Operating Standard',
  category: 'Enterprise Production Operations Framework',
  abbrev: 'EPOF',
  version: 'Requirements v0.2',
  revised: '2026-09-14',
  internalLabel: 'Internal working experience · Not a client deliverable',
  sourceUrl: 'https://github.com/rishab-2011/operational_excellency/blob/main/README.md',
  repoUrl: 'https://github.com/rishab-2011/operational_excellency',
}

/** §1.1 — north star. */
export const northStar = {
  ref: '§1.1',
  text: 'Every production service should be operated through a defined, measurable, continuously improving operational contract, with decisions driven by customer and business impact, and with machine authority granted by risk and evidence rather than by ambition.',
  note: 'The second clause is new in v0.2 and is the sentence the framework must defend.',
}

/** §1 — executive intent. */
export const intent = {
  ref: '§1',
  body: 'A company-agnostic, industry-agnostic, domain-agnostic framework applied to an existing production estate — legacy, modern, cloud, containerised, batch, API-driven or hybrid — to improve how that estate is operated. It sits above and integrates with existing capabilities and tools. It does not assume rip-and-replace.',
}

/** §4 — positioning. */
export const positioning = {
  ref: '§4',
  isNot: ['a monitoring product', 'an APM or observability replacement', 'a ServiceNow or Datadog replacement', 'an SRE team replacement', 'an L1-elimination programme', 'an AI-first gimmick', 'a single-company transformation', 'a payments-specific or cloud-only model', 'a one-time cleanup'],
  is: ['a vendor-neutral operating model', 'an enterprise assessment methodology', 'a two-axis maturity model', 'a value-realisation model', 'a transformation method', 'a governance model', 'a reusable consulting asset'],
  layer: 'It operates at the operating-model layer rather than the tooling layer.',
}

/** Opening question — the capability inventory enterprises already hold (§3 framing). */
export const existingCapabilities = [
  'Observability', 'ITSM', 'SRE', 'Cloud', 'CI/CD', 'Automation',
  'Platform engineering', 'Runbooks', 'Service catalogs', 'AIOps', 'AI agents',
]

/** §22.1 — the single engagement lifecycle. v0.1's two conflicting lifecycles were merged. */
export const lifecycle: LifecycleStage[] = [
  { id: 'discover', name: 'Discover', ref: '§22.1', content: 'Decompose the estate into Operated Services. Understand teams, tools, processes, support model.' },
  { id: 'assess', name: 'Assess', ref: '§22.1', content: 'Score maturity and authority; assess context integrity; establish measurement readiness.' },
  { id: 'quantify', name: 'Quantify', ref: '§22.1', content: 'Baselines and opportunity, by measurement tier, with attribution paths.' },
  { id: 'prioritise', name: 'Prioritise', ref: '§22.1', content: 'Value × risk × effort × feasibility. Authority-above-maturity findings jump the queue as safety items.' },
  { id: 'design', name: 'Design', ref: '§22.1', content: 'Target operating model, target authority grants, improvement plan.' },
  { id: 'pilot', name: 'Pilot', ref: '§22.1', content: 'One contained but meaningful domain.' },
  { id: 'prove', name: 'Prove', ref: '§22.1', content: 'Measure against baseline at declared tier.' },
  { id: 'transfer', name: 'Transfer', ref: '§22.2', content: 'The capability transfer point: the client can run the assessment unaided, with the method licensed to them.', isNew: true },
  { id: 'scale', name: 'Scale', ref: '§22.1', content: 'Expand proven patterns under client ownership.' },
  { id: 'govern', name: 'Govern', ref: '§22.1', content: 'Standards, exceptions, evidence, authority review, continuous improvement.' },
]

/** §22.2 — capability transfer point. */
export const transferPoint = {
  ref: '§22.2',
  intro: 'A disclaimer does not defend against a dependency objection. Only a structural commitment does.',
  commitments: [
    'The client can run the assessment unaided, with their own trained assessors.',
    'Contract templates, scoring instruments and the method are licensed to the client, not withheld as leverage.',
    'At least two client-side assessors are certified and have independently scored services.',
    'Engagement success criteria include transfer having occurred.',
  ],
  after: 'Beyond that point, continued engagement must be justified by new value — new domains, new capability, new risk — never by retained knowledge.',
}

/** §20 — delivery schedule and version gates. */
export const deliverySchedule = [
  { version: 'v0.2', weeks: '—', contents: 'Unit of analysis; prior art acknowledged; claims narrowed; three instantiations; two-axis maturity; measurement and evidence standards.', gate: 'Complete', done: true, ref: '§20' },
  { version: 'v0.3', weeks: '6', contents: 'MAPE-K and OpenSLO/Backstage formal gap analysis; claims register populated; authority gate thresholds challenged; assessment instrument for pillar 1 only.', gate: 'Instrument produces a repeatable score on 5 Operated Services, scored twice by different assessors, variance < 1 level.', done: false, ref: '§20' },
  { version: 'v0.4', weeks: '14', contents: 'Remaining five pillar instruments; measurement readiness method; context integrity measurement; value model with attribution paths.', gate: 'Full assessment runs end-to-end on a 15–20 service estate inside 4 weeks.', done: false, ref: '§20' },
  { version: 'v0.5', weeks: '24', contents: 'Pilot on one real estate. One domain, one volunteer team, measured baseline.', gate: 'T1-measured movement on at least three Layer 4 outcomes.', done: false, ref: '§20' },
  { version: 'v1.0', weeks: '—', contents: 'Framework, assessment method, value model, transformation method, reference architecture, governance, executive narrative, research appendix.', gate: 'Readiness gate passed with E1/E2 evidence.', done: false, ref: '§20' },
]

export const thinSlice = {
  ref: '§20',
  text: 'The thin vertical slice is v0.3: one pillar, one axis, one instrument, tested against five real services. Everything else waits. A framework that can assess one thing repeatably is worth more than one that describes eleven things elegantly.',
}

/** §19 — boundary conditions. */
export const boundaries: Boundary[] = [
  { ref: '§19', condition: 'Estates below ~15 Operated Services', position: 'Overhead exceeds benefit. Recommend SRE practices directly. Do not sell an assessment.' },
  { ref: '§19', condition: 'Active M&A or mid-replatform', position: 'The estate is not stable enough to baseline. Defer, or scope to the stable remainder only.' },
  { ref: '§19', condition: 'Safety-critical, air-gapped or externally regulated automation', position: 'The maturity axis applies fully. The authority axis is capped externally by the regulator and is not ours to advance. Say so before the client does.' },
  { ref: '§19', condition: 'No executive sponsor able to arbitrate ownership disputes', position: 'The framework will stall at accountability. This is a disqualifying condition, not a risk to manage.' },
  { ref: '§19', condition: 'Pure greenfield', position: 'Use as design input for contracts and authority; there is no current state to assess.' },
  { ref: '§19', condition: 'Client wants a one-off score', position: 'Decline or reframe. A maturity number without an improvement system is consulting score theatre.' },
]

/** §26 — current IP position. Narrowed from six candidates in v0.1 to three. */
export const claims: Claim[] = [
  { id: 'c1', ref: '§26', status: 'claim', title: 'Authority-bound Operational Contract',
    body: 'Risk tier, blast radius and per-action-class machine authority bound into the same governed, versioned artefact as ownership, outcomes and recovery expectations.',
    statusNote: 'Narrowed from v0.1; catalog and SLO content conceded to prior art. Survives initial comparison.' },
  { id: 'c2', ref: '§26', status: 'hypothesis', title: 'Context as an operated asset',
    body: 'Provenance, freshness SLAs and declared-versus-discovered decay monitoring, with stale-context incident rate as the reliability-linked measure.',
    statusNote: 'Strongest remaining candidate; no direct prior art identified. Requires formal search before assertion.' },
  { id: 'c3', ref: '§26', status: 'hypothesis', title: 'The two-axis grid and the above-diagonal safety finding',
    body: 'Authority exceeding maturity as a detectable, reportable operational danger.',
    statusNote: 'No existing maturity model surfaces this. Requires validation in pilot.' },
  { id: 'c4', ref: '§26', status: 'withdrawn', title: 'A unified closed operational loop',
    body: 'Claimed in v0.1 as differentiated IP.',
    statusNote: 'Withdrawn. It is MAPE-K. The authority binding at each stage survives; the stages do not.' },
]

export const claimsCaveat = {
  ref: '§26',
  text: 'No claim is proven. Each must survive formal prior-art analysis before appearing in any client-facing artefact.',
}

/** §21 — exploratory diagnostic. Themes derive from framework requirements. */
export const diagnosticQuestions: DiagnosticQuestion[] = [
  { id: 'q1', ref: '§2.1', theme: 'Operated Service clarity', question: 'Can you produce a list of your production services where each one has exactly one team that can authorise a change to it?', options: [ { label: 'No such list exists', score: 0 }, { label: 'Exists for some domains', score: 1 }, { label: 'Exists estate-wide, with known gaps', score: 2 }, { label: 'Exists, maintained, and disputes are arbitrated', score: 3 } ] },
  { id: 'q2', ref: '§2.1', theme: 'Ownership', question: 'When an incident starts, how often does time go into finding who owns the affected service?', options: [ { label: 'Routinely, on most significant incidents', score: 0 }, { label: 'Often, for older or shared services', score: 1 }, { label: 'Occasionally, at domain boundaries', score: 2 }, { label: 'Rarely — ownership resolves immediately', score: 3 } ] },
  { id: 'q3', ref: '§2.1', theme: 'Observable health', question: 'For a given service, is there a signal that indicates its health independently of the things around it?', options: [ { label: 'Health is inferred from infrastructure', score: 0 }, { label: 'For key services only', score: 1 }, { label: 'For most services, with varying quality', score: 2 }, { label: 'Yes, against a declared health model', score: 3 } ] },
  { id: 'q4', ref: '§2.1', theme: 'Outcome traceability', question: 'Can you trace a technical failure to the customer journey or business capability it affects, during the incident?', options: [ { label: 'Only afterwards, by hand', score: 0 }, { label: 'For a few flagship journeys', score: 1 }, { label: 'For most customer-facing services', score: 2 }, { label: 'Yes, routinely and during the incident', score: 3 } ] },
  { id: 'q5', ref: '§8.2', theme: 'Context freshness', question: 'Do your service records carry a last-verified date and an expiry appropriate to how fast each fact changes?', options: [ { label: 'No — records have no age at all', score: 0 }, { label: 'Some have timestamps, none expire', score: 1 }, { label: 'Key facts have review cycles', score: 2 }, { label: 'Facts carry freshness SLAs and are marked stale on expiry', score: 3 } ] },
  { id: 'q6', ref: '§8.2', theme: 'Context drift', question: 'Do you measure the gap between what teams declare about dependencies and what is actually observed?', options: [ { label: 'Never compared', score: 0 }, { label: 'Compared during major incidents', score: 1 }, { label: 'Compared periodically in some domains', score: 2 }, { label: 'Drift is measured continuously and treated as a signal', score: 3 } ] },
  { id: 'q7', ref: '§7.3', theme: 'Contract completeness', question: 'Is there one artefact per service holding ownership, outcomes, dependencies, recovery expectations and change controls together?', options: [ { label: 'Scattered across tools and documents', score: 0 }, { label: 'Partly consolidated in a catalog', score: 1 }, { label: 'Consolidated for critical services', score: 2 }, { label: 'Consolidated, versioned and governed estate-wide', score: 3 } ] },
  { id: 'q8', ref: '§7.3', theme: 'Recovery readiness', question: 'For your critical services, has the rollback or abort path been tested rather than documented?', options: [ { label: 'Documented, rarely or never exercised', score: 0 }, { label: 'Exercised during major programmes', score: 1 }, { label: 'Exercised on a schedule for critical services', score: 2 }, { label: 'Tested, evidenced, and a precondition for automation', score: 3 } ] },
  { id: 'q9', ref: '§14.5', theme: 'Change validation', question: 'After a production change, how is it confirmed that the business outcome still works?', options: [ { label: 'Absence of alerts is treated as success', score: 0 }, { label: 'Manual checks by the deploying team', score: 1 }, { label: 'Automated technical validation', score: 2 }, { label: 'Automated validation of the customer journey itself', score: 3 } ] },
  { id: 'q10', ref: '§9.4', theme: 'Authority governance', question: 'Is it written down, per action, what automation is permitted to do without a human?', options: [ { label: 'No — it is whatever the automation was built to do', score: 0 }, { label: 'Implied by tooling permissions', score: 1 }, { label: 'Documented for high-risk actions', score: 2 }, { label: 'Granted per action class, with a named approver', score: 3 } ] },
  { id: 'q11', ref: '§9.6', theme: 'Authority evidence', question: 'What evidence is required before automation is allowed to act unsupervised?', options: [ { label: 'None — it ships when it works', score: 0 }, { label: 'Testing in a lower environment', score: 1 }, { label: 'A period of supervised running', score: 2 }, { label: 'Declared blast radius, tested abort path, and execution history', score: 3 } ] },
  { id: 'q12', ref: '§6.3', theme: 'Independent validation', question: 'After automated remediation, is recovery verified independently of the system that acted?', options: [ { label: 'Action completion is treated as recovery', score: 0 }, { label: 'A human spot-checks', score: 1 }, { label: 'Technical state is re-verified', score: 2 }, { label: 'Service, journey and business recovery are verified separately', score: 3 } ] },
  { id: 'q13', ref: '§6.3', theme: 'Learning loop', question: 'When a human overrides automation, is that captured and used to revise what the automation is permitted to do?', options: [ { label: 'Overrides are not recorded', score: 0 }, { label: 'Recorded in incident notes', score: 1 }, { label: 'Reviewed periodically', score: 2 }, { label: 'Feeds a formal review of the authority grant', score: 3 } ] },
  { id: 'q14', ref: '§11.1', theme: 'Measurement readiness', question: 'Could you measure manual toil hours across your estate today, from a system of record?', options: [ { label: 'No — it would be expert estimation', score: 0 }, { label: 'Partial proxies exist in ticket data', score: 1 }, { label: 'Sampling with a stated method is possible', score: 2 }, { label: 'Yes — instrumented and queryable', score: 3 } ] },
  { id: 'q15', ref: '§3.1', theme: 'Value attribution', question: 'When an operational improvement is claimed to have saved money, can you trace the single path from cause to business outcome?', options: [ { label: 'Benefits are estimated at programme level', score: 0 }, { label: 'Attributed to a theme, not a mechanism', score: 1 }, { label: 'Attributed, with some overlap between claims', score: 2 }, { label: 'One traceable path per claim, no double counting', score: 3 } ] },
]

/** Bands avoid implying enterprise-assessment precision (§21). */
export const diagnosticBands = [
  { id: 'emerging', label: 'Emerging', min: 0, max: 0.3, blurb: 'The foundational unit is not yet stable. Ownership, health and outcome traceability are the first things to establish — most other work depends on them.' },
  { id: 'developing', label: 'Developing', min: 0.3, max: 0.55, blurb: 'Practices exist but vary by domain. Consolidating what a service is, and what is known about it, tends to unlock the rest.' },
  { id: 'established', label: 'Established', min: 0.55, max: 0.8, blurb: 'A workable baseline exists. The available gains are usually in context freshness and in making automation authority explicit rather than implicit.' },
  { id: 'advanced', label: 'Advanced', min: 0.8, max: 1.01, blurb: 'Strong position. The framework\'s value here is comparability across domains and formalising authority — the part mature organisations most often lack.' },
]

export const diagnosticDisclaimer = 'This is an exploratory diagnostic, not an enterprise assessment. It runs entirely in your browser; nothing is transmitted or stored.'
