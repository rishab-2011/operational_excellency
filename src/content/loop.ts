import type { LoopStage } from '@/types/framework'

/** §6.1 — prior art, stated plainly. */
export const loopPriorArt = {
  ref: '§6.1',
  statement:
    "The v0.1 loop was substantially MAPE-K — IBM's autonomic computing control loop (Monitor, Analyse, Plan, Execute over a shared Knowledge base, manifesto 2001, architectural blueprint 2003), which was designed for this exact problem and explicitly for progressive autonomy. It is also OODA with a learning tail, and Deming's PDCA at the outer edge.",
  consequence: 'Per the self-invalidation rule, we state this rather than claim the stages as novel.',
}

/** §6.2 — the three departures that constitute the actual claim. */
export const loopDepartures = [
  { n: 1, title: 'Joint execution with an explicit authority boundary at every stage', body: 'MAPE-K assumes the loop is executed by an autonomic manager. The loop here is executed jointly by humans and machines, and the contract declares per action class where the boundary sits.', ref: '§6.2' },
  { n: 2, title: 'VALIDATE is an independent stage, not part of Execute', body: 'MAPE-K has no first-class verification that the business outcome recovered, only that the action completed.', ref: '§6.2' },
  { n: 3, title: 'The outer loop modifies the authority grants themselves', body: 'Learning does not only update the knowledge base; it promotes or demotes machine authority against accumulated evidence.', ref: '§6.2' },
]

/** §6.3 — DEFINE is not a stage. It is the contract: the governed equivalent of MAPE-K's K. */
export const loopSubstrate = {
  ref: '§6.3',
  title: 'The Operational Contract',
  body: 'DEFINE is not a loop stage. It is the Operational Contract — the governed equivalent of MAPE-K\'s K — and it is the substrate the loop runs on.',
}

export const loopStages: LoopStage[] = [
  {
    id: 'sense', name: 'Sense', loop: 'inner', mapek: 'Monitor', ref: '§6.3',
    purpose: 'Collect the signals that indicate something is happening.',
    input: 'Metrics, logs, traces, events, topology, deployment and change signals, batch signals, business indicators.',
    evidence: 'Raw telemetry. Quality here is governed by the contract\'s signal-quality requirements.',
    responsibility: 'Platform and observability capability.',
    humanMachine: 'Predominantly machine. Humans set what is worth sensing, in the contract.',
    output: 'A stream of observations, with provenance.',
    capabilities: ['Observability platforms', 'OpenTelemetry', 'Event pipelines', 'Batch schedulers'],
  },
  {
    id: 'understand', name: 'Understand', loop: 'inner', mapek: 'Analyse', ref: '§6.3',
    purpose: 'Convert observation into meaning.',
    input: 'Observations from Sense, plus the Service Context Substrate.',
    evidence: 'Service, dependency, customer, business and risk context; change correlation; likely cause.',
    responsibility: 'Shared. Machine correlates; humans hold the judgement on novel conditions.',
    humanMachine: 'Machine-assisted. Degrades in direct proportion to context staleness.',
    output: 'A situation: what is affected, how far it reaches, what probably caused it.',
    capabilities: ['Correlation and AIOps', 'Topology and service maps', 'Change intelligence'],
  },
  {
    id: 'decide', name: 'Decide', loop: 'inner', mapek: 'Plan', ref: '§6.3',
    purpose: 'Determine the response — and who is permitted to make it.',
    input: 'The situation, the risk tier, and the authority grants held in the contract.',
    evidence: 'Severity, priority, escalation path, response options, and the evidence supporting each authority grant.',
    responsibility: 'Governed. The contract states whether authority exists to act without a human.',
    humanMachine: 'This is where capability and authority separate. A machine may be able to act and still not be permitted to.',
    output: 'A selected response, and a determination of who executes it.',
    capabilities: ['Policy engines', 'Incident management', 'Authority grants (contract)'],
  },
  {
    id: 'act', name: 'Act', loop: 'inner', mapek: 'Execute', ref: '§6.3',
    purpose: 'Execute the selected response.',
    input: 'The response, within its declared blast radius and abort path.',
    evidence: 'Execution record — what ran, under which grant, with what result.',
    responsibility: 'Whoever the authority grant names: human, machine, or machine-with-approval.',
    humanMachine: 'Varies by action class and granted level, never by service as a whole.',
    output: 'A completed action. Completion is not recovery.',
    capabilities: ['Runbook automation', 'Orchestration', 'Deployment and rollback tooling'],
  },
  {
    id: 'validate', name: 'Validate', loop: 'inner', mapek: null, ref: '§6.2 · §6.3',
    purpose: 'Confirm that recovery actually occurred — technically, and in the business.',
    input: 'Post-action state across technical, service, journey and business signals.',
    evidence: 'Technical recovery, service recovery, journey recovery, business recovery, side-effect check.',
    responsibility: 'Independent of whoever acted. This separation is the point.',
    humanMachine: 'Machine-verifiable where outcome signals exist; human where they do not yet.',
    output: 'A verdict: recovered, partially recovered, or not recovered — plus any side effects.',
    capabilities: ['Synthetic journeys', 'Business telemetry', 'Reconciliation checks'],
  },
  {
    id: 'learn', name: 'Learn', loop: 'outer', mapek: 'Knowledge (extended)', ref: '§6.3',
    purpose: 'Capture what the loop revealed.',
    input: 'Incident findings, false alerts, failed automation, change outcomes, human overrides, recurring toil.',
    evidence: 'The record of what actually happened, including where automation was overridden and why.',
    responsibility: 'Operations governance, at review cadence rather than incident time.',
    humanMachine: 'Human-led synthesis over machine-collected record.',
    output: 'Findings with attribution.',
    capabilities: ['Post-incident review', 'Override analysis', 'Toil accounting'],
  },
  {
    id: 'improve', name: 'Improve', loop: 'outer', mapek: 'Knowledge (extended)', ref: '§6.2 · §6.3',
    purpose: 'Change the system — including what machines are permitted to do.',
    input: 'Findings from Learn.',
    evidence: 'Accumulated execution history against the §9.6 gate criteria.',
    responsibility: 'Authority holder named in the contract.',
    humanMachine: 'Human decision, machine-evidenced.',
    output: 'Updated controls, runbooks, alert policy, service design, the contract itself, the maturity position, and the automation authority grants.',
    capabilities: ['Contract revision', 'Authority gate review', 'Improvement backlog'],
  },
]

/** §6.3 — what Improve is permitted to change. */
export const improveTargets = [
  'Controls', 'Runbooks', 'Alert policy', 'Service design',
  'The contract itself', 'The maturity position', 'Automation authority grants',
]

/** The distinction Validate exists to enforce. */
export const validateDistinction = {
  ref: '§6.2',
  completion: 'The action completed. The command returned. The instance restarted.',
  recovery: 'The service recovered, the customer journey completed, and the business outcome resumed — with no unintended side effects.',
  point: 'MAPE-K verifies the first. VALIDATE exists to verify the second, independently of whoever acted.',
}
