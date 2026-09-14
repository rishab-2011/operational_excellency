import type { Challenge, PriorArt } from '@/types/framework'

/**
 * §18 — how this relates to existing practice.
 * Positions are stated so they can be attacked. Nothing here claims EPOF wins a column.
 */
export const priorArt: PriorArt[] = [
  { id: 'mapek', name: 'MAPE-K', category: 'Control model', ref: '§6.1 · §18',
    solvesWell: 'Defines the canonical autonomic control loop — Monitor, Analyse, Plan, Execute over a shared Knowledge base. Designed for this exact problem, and explicitly for progressive autonomy. Predates this framework by two decades.',
    epofBinds: 'The loop stages are conceded as prior art, not claimed. What is added: an explicit authority boundary at each stage, VALIDATE as an independent verification of business recovery, and an outer loop that modifies the authority grants themselves.' },
  { id: 'sre', name: 'Google SRE', category: 'Practice model', ref: '§18',
    solvesWell: 'A practice model for teams that adopt it, strongest inside engineering-led organisations with homogeneous estates. Error budgets, SLOs and production readiness are mature and well evidenced.',
    epofBinds: 'Assesses and governs a heterogeneous estate the organisation already has, including batch, vendor-operated and legacy services SRE does not address, and works where SRE adoption is partial or refused. EPOF should recommend SRE practices where they fit — it is not a competitor to them.' },
  { id: 'slo', name: 'SLO / error-budget practice', category: 'Measurement', ref: '§7.1 · §18',
    solvesWell: 'Expresses what good looks like for request/response services, and governs release pace against a budget.',
    epofBinds: 'Adopted directly into the contract Outcomes area. The framework notes only that availability-shaped SLOs do not express every service shape — a batch chain\'s outcome is completion by deadline.' },
  { id: 'openslo', name: 'OpenSLO', category: 'Specification', ref: '§7.1',
    solvesWell: 'Already provides a machine-readable specification for service level objectives.',
    epofBinds: 'Conceded as prior art for the machine-readable outcome content of the contract. The framework does not propose rebuilding it.' },
  { id: 'catalog', name: 'Service catalogs / Backstage', category: 'Platform engineering', ref: '§7.1 · §18',
    solvesWell: 'Genuine prior art for identity, ownership and dependency content. Widely adopted and well tooled.',
    epofBinds: 'Should be integrated with, not rebuilt. Catalogs do not carry risk tiers or per-action authority grants; that is the addition.' },
  { id: 'cmdb', name: 'CMDB', category: 'Service management', ref: '§7.1 · §8',
    solvesWell: 'Establishes a system of record for configuration items and service relationships at enterprise scale.',
    epofBinds: 'The framework\'s contribution is not another record but a maintenance discipline: provenance, freshness SLAs and declared-versus-discovered drift, because accuracy degrades from the moment the last audit ends.' },
  { id: 'prr', name: 'Production Readiness Review', category: 'Practice', ref: '§7.1',
    solvesWell: 'Establishes whether a service is fit to run in production, at a point in time.',
    epofBinds: 'Conceded as prior art for the change and recovery readiness content. The contract makes it continuous and versioned rather than a gate event.' },
  { id: 'itil', name: 'ITIL 4', category: 'Service management', ref: '§18',
    solvesWell: 'Governs process: change, incident, problem, service design. Mature, widely adopted, and effective at what it targets.',
    epofBinds: 'Governs machine authority, which ITIL predates and does not model. Where they overlap, defer to ITIL.' },
  { id: 'iso20000', name: 'ISO/IEC 20000', category: 'Standard', ref: '§7.1 · §23.6',
    solvesWell: 'Provides a certifiable service management system, valuable where audit and assurance are required.',
    epofBinds: 'Sits alongside as a governance reference; the contract\'s Governance area is designed to produce evidence such regimes ask for.' },
  { id: 'wellarch', name: 'AWS / Azure / GCP Well-Architected', category: 'Design framework', ref: '§18',
    solvesWell: 'Strong, evidenced design-time question sets for operational excellence and reliability within a cloud provider.',
    epofBinds: 'Cloud-scoped, provider-scoped and design-time-weighted. EPOF is estate-wide, vendor-neutral and run-time-weighted, and adopts their question sets inside pillars 3 and 4.' },
  { id: 'obs', name: 'Observability', category: 'Capability', ref: '§18',
    solvesWell: 'Answers what is happening, at depth, and continues to improve rapidly.',
    epofBinds: 'Serves SENSE. It does not answer who is accountable, what is permitted, or whether recovery was real.' },
  { id: 'aiops', name: 'AIOps', category: 'Capability', ref: '§18',
    solvesWell: 'Correlation, noise reduction and pattern detection across large signal volumes.',
    epofBinds: 'A capability inside UNDERSTAND. It does not define ownership, outcomes, authority or evidence. Most AIOps underperformance is a context problem — the layer above it.' },
  { id: 'platform', name: 'Platform engineering / IDPs', category: 'Discipline', ref: '§18',
    solvesWell: 'Paved roads, developer experience, and a single place where service metadata already lives.',
    epofBinds: 'The natural host for contract content. EPOF adds the risk and authority binding rather than a competing portal.' },
  { id: 'pac', name: 'Policy-as-code', category: 'Capability', ref: '§16 · §23.7',
    solvesWell: 'Encodes and enforces policy deterministically and auditably at execution time.',
    epofBinds: 'The natural enforcement mechanism for authority grants. EPOF supplies what the policy should say and on what evidence it may change — not a new engine.' },
  { id: 'servicenow', name: 'ServiceNow ITOM', category: 'Platform', ref: '§18',
    solvesWell: 'Enterprise-scale service management, discovery, and workflow across a large estate.',
    epofBinds: 'A platform, not an operating model — and one of the platforms the value-realisation track assesses. Assessing a platform cannot be done from inside it.' },
]

/** §18.1 — standing naming instruction. */
export const doraHazard = {
  ref: '§18.1',
  text: 'In financial services, insurance and any EU-regulated entity, DORA means the Digital Operational Resilience Act, in force January 2025, which regulates precisely this subject area. Always write "DORA metrics (DevOps Research & Assessment)" on first use in any client-facing artefact.',
}

/** §18 — what is genuinely new, what is synthesis. */
export const noveltyPosition = {
  ref: '§18',
  new: [
    'Risk tier and per-action-class machine authority bound into the same governed artefact as ownership and outcomes.',
    'Context as an operated asset with provenance, freshness and decay.',
    'The two-axis grid that makes authority exceeding maturity visible as a safety finding.',
  ],
  synthesis: 'The loop (MAPE-K), most contract content, the engagement lifecycle, the maturity M-axis, the metric families, and the A-axis shape (an SAE J3016 analogue, deliberately).',
}

/** §22 — challenge responses, drawn only from defensible README material. */
export const challenges: Challenge[] = [
  { id: 'sre', ref: '§18', objection: "Isn't this just SRE?",
    answer: 'SRE is a practice model for teams that adopt it. This assesses and governs a heterogeneous estate you already have — including batch, vendor-operated and legacy services SRE does not address — and works where SRE adoption is partial or refused. Where SRE practices fit, the framework recommends them. It is not a competitor.' },
  { id: 'mapek', ref: '§6.1', objection: "Isn't this MAPE-K?",
    answer: 'The loop largely is, and the requirement says so. MAPE-K is IBM autonomic computing, 2001–03, designed for this problem. What is claimed is narrower: an explicit authority boundary at each stage, VALIDATE as independent verification that the business recovered, and an outer loop that changes the authority grants themselves. If the formal gap analysis shows the binding is also prior art, that claim is withdrawn too.' },
  { id: 'cmdb', ref: '§7.1 · §8', objection: "Isn't this a CMDB or service catalog?",
    answer: 'Identity, ownership and dependency content is conceded to catalogs and CMDB — Backstage-style tooling should be integrated with, not rebuilt. The addition is a maintenance discipline those records lack: provenance, freshness SLAs and drift between what is declared and what is observed.' },
  { id: 'itil', ref: '§18', objection: "Isn't this ITIL?",
    answer: 'ITIL governs process and does it well. This governs machine authority, which ITIL predates and does not model. Where they overlap, defer to ITIL.' },
  { id: 'servicenow', ref: '§18', objection: 'Can ServiceNow already do this?',
    answer: 'ServiceNow is a platform, not an operating model — and one of the platforms the value-realisation track assesses. Much of the contract could be held inside it. Assessing how much of a platform\'s licensed capability is actually realised cannot be done from inside that platform.' },
  { id: 'pac', ref: '§16', objection: "Isn't this policy-as-code?",
    answer: 'Policy-as-code is the natural enforcement mechanism for authority grants. The framework supplies what the policy should say, which evidence justifies it, and what causes it to be revoked. It does not propose another engine.' },
  { id: 'agents', ref: '§16 · §9', objection: 'Why not simply use AI agents?',
    answer: 'Because capability is not authority. An agent may be able to act and still not be permitted to. The sequencing is standardise, contextualise, automate safely, add autonomy only where trust and evidence justify it — and every AI capability degrades in proportion to context staleness, so AI readiness is measured as context integrity rather than model capability.' },
  { id: 'governance', ref: '§9.4 · §19', objection: 'Is this too much governance?',
    answer: 'Authority is granted per action class, not per service, so low-risk reversible actions can sit at high authority immediately while only wide-blast-radius actions carry weight. The framework also names where it should not be used at all — below roughly fifteen Operated Services the overhead exceeds the benefit.' },
  { id: 'roi', ref: '§11.2 · §3.1', objection: 'How is ROI measured?',
    answer: 'Under two constraints. Realised value may be claimed only from T1 measured data; estimates require T2 with stated method; expert judgement may size an opportunity but never support a benefit claim. And every claim must trace one path from a root cause through one named mechanism to one business outcome — no benefit may be counted twice.' },
  { id: 'maturesre', ref: '§18', objection: 'What if we already have mature SRE?',
    answer: 'Then the value is in the estate outside SRE\'s remit, in cross-domain comparability, and in the authority model — which is the part strong SRE organisations most consistently lack a formal answer to.' },
  { id: 'metadata', ref: '§8.1 · §7.1', objection: "Won't this create another metadata system?",
    answer: 'It should not. Contract content belongs where service metadata already lives — a catalog, an IDP, a CMDB. What is added is the discipline applied to it: provenance, freshness and decay. A second stale record would be a worse outcome than the first.' },
  { id: 'maintain', ref: '§8.2 · §17.2', objection: 'Who maintains the context?',
    answer: 'The owning team, as named operational work. Context curation is one of the activities the authority model creates demand for: an estate cannot reach delegated authority at scale without people validating evidence and keeping the facts that automation depends on current.' },
  { id: 'stale', ref: '§8.4 · §9.6', objection: 'What happens when evidence becomes stale?',
    answer: 'Authority falls. Context facts within their freshness SLA are a gate criterion, so an expired fact means the grant no longer qualifies. Demotion triggers are declared in advance, and the grant returns to a supervised level pending fresh evidence.' },
]
