import type { Pillar } from '@/types/framework'

/** §13 — consolidated from eleven pillars in v0.1 to six. */
export const pillars: Pillar[] = [
  {
    id: 'p1', n: 1, name: 'Service Definition & Context Substrate', ref: '§13',
    absorbs: 'Operational Baseline & Readiness; Service/Dependency/Business Context; plus §8',
    role: 'Establishes the Operated Service, its contract, and the context the rest of the framework reasons over.',
    gates: ['p3', 'p5', 'p6'],
  },
  {
    id: 'p2', n: 2, name: 'Signal & Health Quality', ref: '§13',
    absorbs: 'Observability & Signal Quality',
    role: 'Governs what is sensed and what a page is permitted to mean.',
    gates: [],
  },
  {
    id: 'p3', n: 3, name: 'Reliability & Recovery', ref: '§13',
    absorbs: 'Reliability Engineering; Incident & Recovery Intelligence',
    role: 'Covers how failure is detected, isolated, recovered and independently validated.',
    gates: [],
  },
  {
    id: 'p4', n: 4, name: 'Change & Operational Risk', ref: '§13',
    absorbs: 'Change & Operational Risk',
    role: 'Governs how change is admitted, validated and reversed, and how risk tier is assigned.',
    gates: [],
  },
  {
    id: 'p5', n: 5, name: 'Automation Authority & Toil', ref: '§13',
    absorbs: 'Automation & Toil Elimination; AI Readiness & Governed Autonomy',
    role: 'Holds the authority model: grants, gates, evidence, promotion and demotion.',
    gates: [],
  },
  {
    id: 'p6', n: 6, name: 'Value Realisation & Governance', ref: '§13',
    absorbs: 'Tool and Platform Value Realisation; Cost/Capacity/Productivity Economics; Continuous Learning & Governance',
    role: 'Converts operational improvement into attributed, measured value under governance.',
    gates: [],
  },
]

export const pillarGateNote = {
  ref: '§13',
  text: 'Pillar 1 is a gate for pillars 3, 5 and 6 — they cannot be assessed meaningfully against decayed context.',
}
