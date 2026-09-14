import type { ContractArea, ContractInstance } from '@/types/framework'

/** §7.3 — core plus profile. Core applies universally; profile areas vary by service type. */
export const contractAreas: ContractArea[] = [
  { id: 'identity', name: 'Identity', scope: 'core', ref: '§7.3', fields: ['name', 'purpose', 'boundary', 'criticality', 'risk tier'], why: 'What the unit is, and how much is at stake if it fails.' },
  { id: 'accountability', name: 'Accountability', scope: 'core', ref: '§7.3', fields: ['owner', 'support model', 'escalation path', 'authority holder'], why: 'Who may authorise change, and who may grant machine authority.' },
  { id: 'outcomes', name: 'Outcomes', scope: 'profile', ref: '§7.3', fields: ['customer journeys', 'business KPIs', 'service expectations'], why: 'What the service is for. Expressed differently by profile — availability does not fit every shape.' },
  { id: 'health', name: 'Health', scope: 'profile', ref: '§7.3', fields: ['health model', 'telemetry expectations', 'actionable-alert policy', 'signal-quality requirements'], why: 'What "well" means, and what a page is permitted to mean.' },
  { id: 'dependencies', name: 'Dependencies', scope: 'core', ref: '§7.3', fields: ['upstream', 'downstream', 'external', 'failure propagation', 'declared out-of-boundary elements'], why: 'How failure travels — and where our reach stops.' },
  { id: 'change', name: 'Change', scope: 'core', ref: '§7.3', fields: ['risk classification', 'pre- and post-change validation', 'deployment controls', 'rollback expectations'], why: 'How change is admitted and how it is undone.' },
  { id: 'operations', name: 'Operations', scope: 'core', ref: '§7.3', fields: ['runbooks', 'known toil', 'automation coverage'], why: 'What is done by hand today, named honestly.' },
  { id: 'authority', name: 'Authority', scope: 'core', ref: '§7.3', fields: ['per action class: current grant (A0–A5)', 'target grant', 'evidence held', 'abort path', 'blast radius'], why: 'What the machine may do unsupervised, under which conditions, on whose authority, on what evidence. This is the binding the framework claims.' },
  { id: 'recovery', name: 'Recovery', scope: 'profile', ref: '§7.3', fields: ['failure modes', 'resilience patterns', 'RTO/RPO where applicable', 'recovery validation'], why: 'What restoration means for this shape of service.' },
  { id: 'governance', name: 'Governance', scope: 'core', ref: '§7.3', fields: ['required controls', 'evidence', 'maturity position', 'exceptions', 'improvement backlog'], why: 'How the contract is held to account over time.' },
  { id: 'context', name: 'Context integrity', scope: 'core', ref: '§7.3 · §8', fields: ['provenance', 'freshness SLA', 'last-verified date — for every declared fact'], why: 'A contract that has silently gone out of date is a historical record being mistaken for a current one.' },
]

/** §7.1 — prior art, stated plainly. The framework concedes this content. */
export const contractPriorArt = [
  { area: 'Identity, accountability, dependencies', art: 'Backstage-style service catalogs (catalog-info.yaml), CMDB service records, Team Topologies ownership', ref: '§7.1' },
  { area: 'Outcomes, SLIs/SLOs', art: 'Google SRE SLO and error-budget policy; OpenSLO already provides a machine-readable specification', ref: '§7.1' },
  { area: 'Health and telemetry expectations', art: 'Observability vendor service definitions; OpenTelemetry semantic conventions', ref: '§7.1' },
  { area: 'Change and recovery readiness', art: "Google's Production Readiness Review; AWS Well-Architected OPS and REL question sets", ref: '§7.1' },
  { area: 'Governance and controls', art: 'ITIL 4 service design package; ISO/IEC 20000', ref: '§7.1' },
]

/** §7.2 — the narrowed claim. */
export const contractClaim = {
  ref: '§7.2',
  claim: 'No existing construct binds risk tier, blast radius, and per-action-class machine authority into the same governed artefact as ownership, outcomes and recovery expectations.',
  contrast: [
    { what: 'A service catalog', says: 'who owns a service' },
    { what: 'An SLO', says: 'what good looks like' },
    { what: 'A runbook', says: 'what to do' },
    { what: 'The Operational Contract', says: 'what the machine is permitted to do unsupervised, under which conditions, on whose authority, and on what evidence — alongside all of the above, versioned and auditable together' },
  ],
  caveat: 'That binding — not the catalog content — is the intellectual property. The wider claim made in v0.1 was not defensible.',
}

/** §10 — worked instantiations. Constructed examples, not field artefacts (§10 preamble). */
export const contractInstances: ContractInstance[] = [
  {
    id: 'batch', label: 'Overnight settlement chain', profile: 'Scheduled Workload', riskTier: 'R1', ref: '§10.1', status: 'illustrative',
    values: {
      identity: 'Nightly settlement extract-transform-load chain, 14 stages, single owner, R1.',
      accountability: 'Settlement operations team. Escalation to the finance duty manager outside window.',
      outcomes: 'Not availability. Completion by 05:30 with zero unreconciled records.',
      health: 'Binary and time-boxed: on-track / at-risk-of-deadline / breached. There is no meaningful "99.9% healthy".',
      dependencies: 'Temporal, not request-path. Stage 9 depends on stage 8 having completed, and on a file arriving from an upstream partner by 02:00.',
      change: 'Changes admitted only outside the processing window; post-change validation is a full reconciliation run.',
      operations: 'Rerun-from-checkpoint runbook. Known toil: manual reconciliation of partial-file arrivals.',
      authority: 'Rerun failed stage → A3. Extend the deadline window → A0, permanently: it is a business decision, not an operational one.',
      recovery: 'Rerun-from-checkpoint, with a hard cutoff after which recovery becomes a business-process exercise rather than a technical one.',
      governance: 'Regulatory reporting dependency; exceptions recorded against the settlement control.',
      context: 'Partner file-arrival expectations verified weekly; stage ownership verified quarterly.',
    },
    broke: 'SLI/SLO as availability is meaningless here. Dependency modelling assumed synchronous request paths. Recovery assumed restoration of service rather than completion of work.',
  },
  {
    id: 'api', label: 'Customer-facing quote API', profile: 'Request/Response', riskTier: 'R2', ref: '§10.2', status: 'illustrative',
    values: {
      identity: 'Public quote-retrieval API, R2.',
      accountability: 'Quotes product team; standard on-call rotation.',
      outcomes: 'Standard SLIs — availability, latency p99, error rate — mapped to the "obtain a quote" journey.',
      health: 'Continuous, multi-signal, well served by existing practice.',
      dependencies: 'Request-path, discoverable from tracing.',
      change: 'Canary deployment with automated validation; rollback expected within one deployment cycle.',
      operations: 'Restart, rollback and failover runbooks. Automation coverage is high for restart, low for failover.',
      authority: 'Restart unhealthy instance → A4. Roll back deployment → A3. Regional failover → A1, capped by R2 and by blast radius.',
      recovery: 'Rolling restart, canary rollback, regional failover.',
      governance: 'Standard change control; error budget governs release pace.',
      context: 'Topology discovered from tracing, 7-day freshness; ownership declared, 90-day freshness.',
    },
    broke: 'Nothing significant. This is the shape every existing framework was designed around — which is precisely the point. A contract that only works here adds nothing.',
  },
  {
    id: 'saas', label: 'Identity-verification SaaS', profile: 'Vendor-Operated', riskTier: 'R1', ref: '§10.3', status: 'illustrative',
    values: {
      identity: 'Third-party identity-verification SaaS, R1 by customer impact.',
      accountability: 'Onboarding platform team owns the integration; vendor manager owns the commercial relationship.',
      outcomes: 'Expressed at our integration boundary only — verification success rate, response time as observed by us, fallback activation rate.',
      health: 'Telemetry is limited to the boundary. Vendor internals are declared out-of-boundary, explicitly, as a contract field.',
      dependencies: 'We are a downstream consumer with no topology visibility inside the vendor.',
      change: 'Vendor change calendar is an input we receive, not a control we hold. Our own integration changes follow standard control.',
      operations: 'Fallback activation runbook. Known toil: manual reconciliation of verifications stranded mid-flight.',
      authority: 'Activate fallback provider → A3. Anything inside the vendor → not grantable at any level.',
      recovery: 'Degrade and fall back — we cannot fix. RTO is contractual, not engineered.',
      governance: 'Contractual SLA is the control; evidence is vendor-supplied and graded accordingly.',
      context: 'Vendor status source declared; boundary reviewed at contract renewal.',
    },
    broke: 'The schema assumed we could act on the thing we operate. It had no way to express un-grantable, no way to mark a boundary beyond which telemetry and authority both stop, and no way to express a contractual rather than engineered recovery objective.',
  },
]

/** §10.4 — findings from writing the three by hand. */
export const instantiationFindings = [
  { n: 1, text: 'A single rigid schema does not survive a real estate. Hence core-plus-profile.', ref: '§10.4' },
  { n: 2, text: 'Outcomes, Health and Recovery are the profile-variant fields. Identity, Accountability, Authority and Governance proved universal across all three.', ref: '§10.4' },
  { n: 3, text: '"Un-grantable" is a required authority state, distinct from A0. A0 means we have chosen not to automate; un-grantable means we structurally cannot.', ref: '§10.4' },
  { n: 4, text: 'Blast radius is more portable than SLOs. It was expressible in all three shapes where SLOs were not — which suggests risk, not service level, may be the better spine for a universal contract.', ref: '§10.4' },
]
