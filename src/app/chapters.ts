export interface Chapter { id: string; n: string; title: string; part: string }

/** Narrative order. Nav, progress rail and contents overlay all read from this. */
export const chapters: Chapter[] = [
  { id: 'start', n: '—', title: 'The Operating Standard', part: 'Start' },
  { id: 'exec-why', n: '01', title: 'Why', part: 'Executive view' },
  { id: 'exec-model', n: '02', title: 'The model', part: 'Executive view' },
  { id: 'exec-authority', n: '03', title: 'Authority', part: 'Executive view' },
  { id: 'exec-value', n: '04', title: 'Value', part: 'Executive view' },
  { id: 'exec-apply', n: '05', title: 'Apply', part: 'Executive view' },
  { id: 'exec-evidence', n: '06', title: 'Evidence', part: 'Executive view' },
  { id: 'opening', n: '00', title: 'The full framework', part: 'Full framework' },
  { id: 'question', n: '01', title: 'The question', part: 'Full framework' },
  { id: 'problem', n: '02', title: 'A causal problem', part: 'Full framework' },
  { id: 'unit', n: '03', title: 'The Operated Service', part: 'Full framework' },
  { id: 'contract', n: '04', title: 'The Operational Contract', part: 'Full framework' },
  { id: 'context', n: '05', title: 'Context decays', part: 'Full framework' },
  { id: 'loop', n: '06', title: 'How operations run', part: 'Full framework' },
  { id: 'authority', n: '07', title: 'Capability is not authority', part: 'Full framework' },
  { id: 'axes', n: '08', title: 'Two axes, not one ladder', part: 'Full framework' },
  { id: 'evidence', n: '09', title: 'What may be claimed', part: 'Full framework' },
  { id: 'value', n: '10', title: 'Value, attributed once', part: 'Full framework' },
  { id: 'pillars', n: '11', title: 'Six pillars', part: 'Full framework' },
  { id: 'priorart', n: '12', title: 'Beside existing practice', part: 'Full framework' },
  { id: 'challenge', n: '13', title: 'Challenge the model', part: 'Full framework' },
  { id: 'diagnostic', n: '14', title: 'Where might you stand?', part: 'Full framework' },
  { id: 'people', n: '15', title: 'What changes for your teams', part: 'Full framework' },
  { id: 'path', n: '16', title: 'A validation path', part: 'Full framework' },
  { id: 'status', n: '17', title: 'What is and is not proven', part: 'Full framework' },
]

export const chapterIds = chapters.map((c) => c.id)
