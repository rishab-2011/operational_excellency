import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/**
 * §18 — where existing practice already sits, mapped onto the loop it serves.
 * The honest observation is not that anything is missing, but that one row has no owner.
 */
const ROWS = [
  { stage: 'Sense', serves: ['Observability', 'OpenTelemetry', 'Batch schedulers'], gap: null },
  { stage: 'Understand', serves: ['AIOps', 'Service maps', 'Change intelligence'], gap: null },
  { stage: 'Decide', serves: ['Incident management', 'ITIL process'], gap: null },
  { stage: 'Authority gate', serves: [], gap: 'No existing discipline owns this row.' },
  { stage: 'Act', serves: ['Runbook automation', 'Policy-as-code', 'Orchestration'], gap: null },
  { stage: 'Validate', serves: ['Synthetic journeys', 'Reconciliation'], gap: null },
  { stage: 'Learn / Improve', serves: ['Post-incident review', 'DORA metrics'], gap: null },
] as const

const SUBSTRATE = ['Service catalogs · Backstage', 'CMDB', 'OpenSLO', 'Production Readiness Review', 'ISO/IEC 20000']

export function PriorArtLayers() {
  return (
    <div>
      <ul className="space-y-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10">
        {ROWS.map((r) => (
          <li
            key={r.stage}
            className={`grid gap-x-4 gap-y-1.5 px-4 py-3 sm:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] sm:items-center ${
              r.gap ? 'bg-accent-wash' : 'bg-paper-50'
            }`}
          >
            <span className={`font-mono text-2xs uppercase tracking-[0.11em] ${r.gap ? 'text-accent-ink' : 'text-ink-900/62'}`}>
              {r.stage}
            </span>
            {r.gap ? (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[0.86rem] font-medium text-ink-900">{r.gap}</span>
                <span className="chip border border-accent-ink/40 text-accent-ink">what this framework adds</span>
              </span>
            ) : (
              <span className="flex flex-wrap gap-1.5">
                {r.serves.map((s) => (
                  <span key={s} className="chip border border-ink-900/15 text-ink-900/70">{s}</span>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-ink-900/12 bg-paper-200/40 px-4 py-3">
        <span className="eyebrow text-ink-900/62">And the substrate is already well served</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUBSTRATE.map((s) => (
            <span key={s} className="chip border border-ink-900/15 text-ink-900/70">{s}</span>
          ))}
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-900/70">
          Identity, ownership, SLOs and readiness content are conceded to these, not rebuilt. The loop itself is
          MAPE-K, stated plainly. <Ref s="§6.1 · §7.1" tone="light" />
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <DeeperLink tone="light" to="priorart">Fifteen disciplines, what each solves well</DeeperLink>
        <DeeperLink tone="light" to="challenge">Challenge the model</DeeperLink>
      </div>
    </div>
  )
}
