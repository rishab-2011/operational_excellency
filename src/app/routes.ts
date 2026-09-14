export interface Area {
  id: string
  label: string
  /** One line, used in the area header. */
  summary: string
}

/**
 * Product information architecture. Six working areas, not chapters.
 * Research metadata — citations, claim status, versioning — lives only in Evidence.
 */
export const areas: Area[] = [
  { id: 'overview', label: 'Overview', summary: 'What this operating capability does, and the state of a sample estate.' },
  { id: 'operating-model', label: 'Operating Model', summary: 'The unit of accountability, its contract, and the context it depends on.' },
  { id: 'authority', label: 'Authority', summary: 'What machines are permitted to do, on whose grant, against what evidence.' },
  { id: 'value', label: 'Value', summary: 'What may be claimed, how it is attributed, and what the estate can measure.' },
  { id: 'assess', label: 'Assess', summary: 'Establish position, readiness and priorities for a contained pilot.' },
  { id: 'evidence', label: 'Evidence', summary: 'Prior art, objections, claim status, method and sources.' },
]

export const DEFAULT_AREA = 'overview'
export const areaIds = areas.map((a) => a.id)
