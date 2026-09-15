/**
 * Home narrative content.
 *
 * Teaching material only. Every definition it points at lives in the authoritative
 * content modules; nothing here restates or alters a framework definition, and no
 * outcome is promised numerically.
 *
 * Order is deliberate: pain → cause → method → example → framework → proof.
 */

/* ── 1. Why this exists ─────────────────────────────────────────────────── */

export const problem = {
  cause:
    'The information, standards and decisions needed to operate a production service are spread across different tools, teams and processes. Ownership sits in one place, health definitions in another, dependencies somewhere else again, and the rules for what automation may do are often implicit in whoever built it.',
  consequenceIntro: 'Operations become inconsistent from service to service, which contributes to:',
  /** Consequences, not claims of causation. */
  consequences: [
    'Preventable incidents',
    'Noisy or non-actionable alerts',
    'Slow triage',
    'Repeated failures',
    'Excessive handoffs',
    'Manual recovery',
    'Operational toil',
    'Change risk',
    'Underused platform capability',
  ],
  alreadyHave: ['Observability', 'ITSM', 'SRE', 'Platform engineering', 'CI/CD', 'Automation', 'AI capabilities'],
}

/* ── 2. What the framework actually does ────────────────────────────────── */

export interface MethodStep { id: string; n: number; label: string; body: string }

export const method: MethodStep[] = [
  { id: 'assess', n: 1, label: 'Assess', body: 'Understand how production services are operated today.' },
  { id: 'gaps', n: 2, label: 'Find gaps', body: 'Identify weaknesses across ownership, health, monitoring, context, dependencies, recovery, change, automation, toil and governance.' },
  { id: 'define', n: 3, label: 'Define the operating standard', body: 'Establish how each important service should be owned, observed, changed, recovered, governed and improved.' },
  { id: 'prioritise', n: 4, label: 'Prioritise', body: 'Focus improvement on the gaps creating the greatest customer, reliability, operational-risk or toil impact.' },
  { id: 'improve', n: 5, label: 'Improve', body: "Implement improvements through the enterprise's existing tools, teams and processes." },
  { id: 'measure', n: 6, label: 'Measure', body: 'Determine whether reliability, customer impact, alert quality, recovery, toil, change risk or other agreed outcomes actually improved.' },
  { id: 'learn', n: 7, label: 'Learn', body: 'Feed incidents, false alerts, failed automation, human overrides and operational outcomes back into the operating model.' },
]

export const methodReturn = 'Learning returns to assessment. The operating standard is maintained, not delivered once.'

/* ── 3. One practical example ───────────────────────────────────────────── */

export interface WalkStep {
  n: number
  /** Plain operational language. No framework vocabulary in the step itself. */
  step: string
  /** The part of the model that answers it — vocabulary introduced by example. */
  answeredBy: string
  emphasis?: boolean
}

export const walkthrough: WalkStep[] = [
  { n: 1, step: 'A production signal appears', answeredBy: 'Signal & Health Quality' },
  { n: 2, step: 'Which production service does it belong to?', answeredBy: 'Operated Service' },
  { n: 3, step: 'Is the service or the customer actually impacted?', answeredBy: 'Operational Contract' },
  { n: 4, step: 'Who owns it?', answeredBy: 'Operational Contract' },
  { n: 5, step: 'What dependencies are involved?', answeredBy: 'Trusted Service Context' },
  { n: 6, step: 'Did something change recently?', answeredBy: 'Change & Operational Risk' },
  { n: 7, step: 'What response is appropriate?', answeredBy: 'Reliability & Recovery' },
  { n: 8, step: 'Is automation authorised to perform that action, or is human approval required?', answeredBy: 'Automation Authority', emphasis: true },
  { n: 9, step: 'Execute the recovery action', answeredBy: 'Reliability & Recovery' },
  { n: 10, step: 'Validate that the service and customer outcome actually recovered', answeredBy: 'Reliability & Recovery' },
  { n: 11, step: 'Capture what was learned', answeredBy: 'Evidence & Value' },
  { n: 12, step: 'Improve the alert, runbook, context, service design, change control or automation policy so it is less likely to recur', answeredBy: 'The improvement loop' },
]

export const walkthroughCaveat =
  'This is one example. The same operating model applies across monitoring, logging, service ownership, change management, recovery, automation, toil reduction and operational governance. Incident response is a useful way to see the model working — it is not the boundary of it.'

/* ── 4. Framework vocabulary, introduced as answers to questions ────────── */

export interface Concept { term: string; question: string; area: string; view?: string }

export const concepts: Concept[] = [
  { term: 'Operated Service', question: 'What exactly are we operating?', area: 'operating-model', view: 'qualification' },
  { term: 'Operational Contract', question: 'How should this service be operated?', area: 'operating-model', view: 'contract' },
  { term: 'Trusted Service Context', question: 'What is true about this service now, where did that information come from, and is it still trustworthy?', area: 'operating-model', view: 'context' },
  { term: 'Signal & Health Quality', question: 'What does healthy mean, and which signals actually deserve action?', area: 'operating-model', view: 'contract' },
  { term: 'Reliability & Recovery', question: 'How should failure be detected, isolated, recovered and validated?', area: 'operating-model', view: 'architecture' },
  { term: 'Change & Operational Risk', question: 'How should production change be assessed, controlled, validated and reversed?', area: 'authority', view: 'model' },
  { term: 'Automation Authority', question: 'What may automation perform without human approval, under what conditions and against what evidence?', area: 'authority', view: 'model' },
  { term: 'Evidence & Value', question: 'Can we demonstrate that operations actually improved?', area: 'value', view: 'attribution' },
]

/* ── 5. What this does not replace ──────────────────────────────────────── */

export const nonReplacement = {
  statement:
    'This does not replace your observability, ITSM, SRE, platform, CI/CD, service-management or automation capabilities. It defines how those capabilities should work together around each production service.',
  premises: [
    'No rip-and-replace premise',
    'No workforce-elimination premise',
    'No L1-elimination claim',
    'No “AI runs production” premise',
  ],
  wasteIntro:
    'It may help an organisation reduce avoidable operational waste, including:',
  waste: [
    'Duplicate or non-actionable alerts',
    'Unnecessary handoffs',
    'Repeated manual checks',
    'Stale operational knowledge',
    'Avoidable toil',
    'Preventable incidents',
    'Redundant activity',
  ],
  caveat:
    'These are potential improvements, not guaranteed outcomes. Whether any of them occur is a matter for measurement, under the evidence rules this framework sets for itself.',
}
