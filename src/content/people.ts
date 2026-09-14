/** §17 — People: adoption, consent and workforce. */

export const adoptionIntro = {
  ref: '§17',
  text: 'A framework promises not to replace strong teams, then imposes a standard on them. ITIL-shaped programmes fail on politics, not content — so consent is designed in rather than assumed.',
}

/** §17.1 — adoption by consent. */
export const adoptionPractices = [
  { id: 'volunteer', title: 'Volunteer first', body: 'The standard is demonstrated on a volunteer Operated Service before being asked of anyone.', ref: '§17.1' },
  { id: 'authored', title: 'Contracts are authored by the owning team', body: 'Facilitated — never written for them and handed over. An imposed contract is a document; an authored one is a commitment.', ref: '§17.1' },
  { id: 'arbiter', title: 'A named executive arbiter', body: 'Where accountability cannot be satisfied, the dispute escalates to a pre-agreed arbiter within a fixed window. Unresolved ownership is the most common cause of stall.', ref: '§17.1' },
  { id: 'resistance', title: 'A resistance register', body: 'Objections are recorded, attributed and answered in writing. Unanswerable objections are findings about the framework, not about the objector.', ref: '§17.1' },
  { id: 'conway', title: "Conway's-law mismatches are findings", body: 'Where the service decomposition disagrees with the org chart, the mismatch is recorded — never resolved by quietly redrawing the map to match the chart.', ref: '§17.1 · §2.2' },
]

/** §17.2 — the structural workforce position, not a vocabulary preference. */
export const workforcePosition = {
  ref: '§17.2',
  problem: 'Regulating the language around cost value leaves the authority progression reading, correctly, as a task-elimination roadmap to the people whose cooperation the framework most requires.',
  answer: 'Advancing automation authority creates human work that did not previously exist, and cannot proceed without it.',
  argument: 'An authority grant requires validated executions reviewed by a human. An estate cannot reach delegated authority at scale without people doing that validation. That is a structural argument; "we prefer the term capacity release" is not.',
}

export const authorityWork = [
  { work: 'Contract authorship and maintenance', who: 'Service operators — the people with the operational knowledge' },
  { work: 'Context curation, provenance and freshness', who: 'Operations staff, continuously' },
  { work: 'Automation validation and evidence gathering', who: 'Operators, as the precondition for every grant' },
  { work: 'Exception and novel-failure handling', who: 'Experienced operators, by definition' },
  { work: 'Authority gate review and demotion decisions', who: 'Operations governance' },
]

export const humansRemain = {
  ref: '§17.2',
  areas: ['ambiguity', 'novel failure modes', 'high-blast-radius decisions', 'business judgement', 'exception handling', 'governance', 'system improvement'],
  commitment: 'The framework does not promise elimination of L1 support and must never be presented as doing so.',
}
