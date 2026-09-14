export interface Chapter { id: string; n: string; title: string; part: string }

/** Narrative order. Nav, progress rail and contents overlay all read from this. */
export const chapters: Chapter[] = [
  { id: 'opening', n: '00', title: 'The Operating Standard', part: 'Opening' },
  { id: 'question', n: '01', title: 'The question', part: 'Opening' },
  { id: 'problem', n: '02', title: 'A causal problem', part: 'Diagnosis' },
  { id: 'unit', n: '03', title: 'The Operated Service', part: 'Foundations' },
  { id: 'contract', n: '04', title: 'The Operational Contract', part: 'Foundations' },
  { id: 'context', n: '05', title: 'Context decays', part: 'Foundations' },
  { id: 'loop', n: '06', title: 'How operations run', part: 'Operation' },
  { id: 'authority', n: '07', title: 'Capability is not authority', part: 'Operation' },
  { id: 'axes', n: '08', title: 'Two axes, not one ladder', part: 'Operation' },
  { id: 'evidence', n: '09', title: 'What may be claimed', part: 'Discipline' },
  { id: 'value', n: '10', title: 'Value, attributed once', part: 'Discipline' },
  { id: 'pillars', n: '11', title: 'Six pillars', part: 'Discipline' },
  { id: 'priorart', n: '12', title: 'Beside existing practice', part: 'Standing' },
  { id: 'challenge', n: '13', title: 'Challenge the model', part: 'Standing' },
  { id: 'diagnostic', n: '14', title: 'Where might you stand?', part: 'Standing' },
  { id: 'people', n: '15', title: 'What changes for your teams', part: 'Next' },
  { id: 'path', n: '16', title: 'A validation path', part: 'Next' },
  { id: 'status', n: '17', title: 'What is and is not proven', part: 'Next' },
]

export const chapterIds = chapters.map((c) => c.id)
