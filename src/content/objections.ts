/**
 * The five strongest reasons an enterprise would reject this framework.
 *
 * Written adversarially, before the product surface was designed. Each carries an
 * honest disposition: answered, partial, or unresolved. Nothing here is softened,
 * and the two that are genuinely unresolved say so.
 */

export type Disposition = 'answered' | 'partial' | 'unresolved'

export interface Objection {
  id: string
  short: string
  /** The objection stated at full strength, as its strongest advocate would put it. */
  case: string
  disposition: Disposition
  /** What the framework actually answers. Empty where it does not. */
  answer: string
  /** What remains genuinely open. Never empty. */
  open: string
  /** What would have to be true to close it. */
  closes: string
}

export const objections: Objection[] = [
  {
    id: 'source-of-truth',
    short: 'It becomes another source of truth',
    case:
      'We already hold service facts in a CMDB, a developer portal, SLO configuration, an incident tool and a deployment pipeline. Every one of them was going to be the single source of truth. A new artefact called an Operational Contract becomes the sixth, diverges from the other five within two quarters, and we have added reconciliation work rather than removed it.',
    disposition: 'partial',
    answer:
      'The framework requires a schema, not a system, and says so: contract content belongs where service metadata already lives. It also treats divergence as a measurable rather than an accident — declared-versus-discovered drift is an explicit metric, which is more than a catalog or CMDB offers today. A second stale record is stated to be a worse outcome than the first.',
    open:
      'One field-set genuinely has nowhere to live today: the authority grant, its supporting evidence and its demotion triggers. No catalog, CMDB or SLO spec models it. So something new is required, and the framework has not yet demonstrated a federated contract assembled from existing stores rather than a new store.',
    closes:
      'A reference mapping that assembles a contract from an existing catalog, CMDB and policy engine, with only the authority fields newly stored, proven on a real estate.',
  },
  {
    id: 'duplication',
    short: 'It duplicates SRE, ITIL, catalogs and policy',
    case:
      'Each pillar sits on top of a capability someone already owns. Signal quality is the observability team. Reliability is SRE. Change risk is our change function. Automation is platform engineering. Governance is our existing risk framework. This is a coordination layer that re-describes other teams\' work, and coordination layers cost more than they return.',
    disposition: 'partial',
    answer:
      'The framework defers explicitly and by name: to ITIL on process, to SRE practices where they fit, to Well-Architected question sets inside two pillars, to catalogs for identity and to policy-as-code for enforcement. Its stated scope is the operating-model layer, and its own boundary conditions rule it out below roughly fifteen Operated Services, where the overhead exceeds the benefit.',
    open:
      'Deference is currently an assertion. The assessment instrument that would demonstrate it — one that consumes an existing capability\'s answer rather than re-asking the question — does not exist yet. Until it does, the duplication risk is real rather than theoretical.',
    closes:
      'An assessment instrument in which every question names the existing capability it reads from, and is skipped where that capability already answers it.',
  },
  {
    id: 'maintenance',
    short: 'The metadata maintenance never ends',
    case:
      'Freshness SLAs mean somebody curates service context forever. This is precisely what killed our CMDB programme: accuracy decayed the moment the audit ended, and nobody was funded to maintain it. Multiply that by four thousand services and the cost of the framework is the cost of a permanent data-entry function.',
    disposition: 'partial',
    answer:
      'Maintenance cost scales with granted automation authority, not with estate size. A service operating manually needs very little context freshness; only the facts a machine actually acts on need an SLA. Because authority is granted per action class, the curation burden is bounded by how much automation the estate has actually earned — and the framework makes decay measurable rather than assumed, which is what the CMDB model lacked.',
    open:
      'The cost has never been measured. No engagement has established what curation actually consumes per service per month, so the scaling argument above is reasoning, not evidence.',
    closes:
      'Measured curation effort from a pilot, expressed per Operated Service per month at each authority level.',
  },
  {
    id: 'adoption',
    short: 'Nobody is incentivised to do this',
    case:
      'Service owners are measured on delivery. You are asking them to author and maintain a governance artefact whose benefit is diffuse, delayed and largely accrues to someone else — risk, or the operations function. Consent-based adoption is a polite way of saying it will be adopted by whoever has spare capacity, which is nobody.',
    disposition: 'partial',
    answer:
      'There is a direct incentive, and it is structural rather than cultural: the contract is the price of the authority grant. A team that authors it, declares blast radius and tests its abort path earns the right to stop being paged for routine actions. Authority is the reward for the artefact, and it cannot be granted without it. The framework also treats the absence of an executive able to arbitrate ownership disputes as disqualifying rather than as a risk to manage.',
    open:
      'That incentive only bites where a team actually wants automation and is currently carrying the toil. For a stable, low-toil service the trade is worthless, and the framework has no answer for why that owner would participate beyond being asked to.',
    closes:
      'Evidence from a pilot that teams volunteer at a usable rate, and an honest position on what happens to services whose owners decline.',
  },
  {
    id: 'differentiation',
    short: 'Authority binding may not justify a new operating model',
    case:
      'Policy-as-code already expresses what may act on what, under which conditions. IAM already binds principals to permissions. Change management already has risk-tiered approval. Adding evidence and a demotion trigger to a policy is a better policy-authoring convention — it is not a new operating model, and it does not need one.',
    disposition: 'unresolved',
    answer:
      'The distinction the framework would have to defend is narrow and it states it narrowly: policy engines enforce at execution time but hold no record of why the policy is what it is, what evidence justifies it, who owns it, or what causes it to be revoked. IAM binds identity to permission, not evidence to permission.',
    open:
      'Whether that gap justifies an operating model rather than a policy-authoring standard is exactly what has not been tested. This is the load-bearing claim, and the framework marks it unproven pending formal prior-art analysis against MAPE-K, OpenSLO and service catalogs. A previously claimed differentiator — the closed loop — has already been withdrawn under the same test.',
    closes:
      'The prior-art analysis. If the authority binding is also shown to be prior art, the claim is withdrawn and what remains is a practice, not an operating model.',
  },
]

export const dispositionMeta: Record<Disposition, { label: string; note: string }> = {
  answered: { label: 'Answered', note: 'The framework has a defensible response.' },
  partial: { label: 'Partly answered', note: 'A real answer exists; something material remains open.' },
  unresolved: { label: 'Unresolved', note: 'No sufficient answer yet. Stated as a risk, not managed as one.' },
}

export const objectionsPreamble = {
  title: 'Why an enterprise would say no',
  body:
    'These were written against the framework rather than for it, before this product surface was designed. Two of the five are only partly answered and one is unresolved. They are published here because a framework that cannot survive its own strongest objections should not be adopted, and because the objection most likely to be fatal is also the one it has not yet tested.',
}
