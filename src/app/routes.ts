export interface Area {
  id: string
  label: string
  /** One line, used in the area header. */
  summary: string
}

/**
 * Product information architecture. Six working areas, not chapters.
 *
 * Each summary states the question its area answers, so the narrative runs:
 * how services should be operated → what must be known → what machines may do →
 * whether it is working → where the estate stands → why any of it should be believed.
 *
 * Research metadata — citations, claim status, versioning — lives only in Evidence.
 */
export const areas: Area[] = [
  { id: 'overview', label: 'Overview', summary: 'How should production services be operated consistently?' },
  { id: 'operating-model', label: 'Operating Model', summary: 'What must be defined, and continuously known, about each service?' },
  { id: 'authority', label: 'Authority', summary: 'What may machines do without a human — on whose grant, against what evidence?' },
  { id: 'value', label: 'Value', summary: 'Is the operating model producing measurable improvement?' },
  { id: 'assess', label: 'Assess', summary: 'Where is the estate today?' },
  { id: 'evidence', label: 'Evidence', summary: 'Why should anyone believe the model?' },
]

export const DEFAULT_AREA = 'overview'
export const areaIds = areas.map((a) => a.id)
