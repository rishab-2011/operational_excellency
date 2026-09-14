import { Screen } from '@/app/AppShell'
import { Badge, Panel } from '@/components/product'
import { ClaimBuilder } from '@/interactions/ClaimBuilder'
import { ValueFlow } from '@/visualizations/ValueFlow'
import { ProblemChain } from '@/visualizations/ProblemChain'
import { CausalGraph } from '@/visualizations/CausalGraph'
import { measurementReadinessDeliverable, measurementTiers, metricFamilies, mttrPosition } from '@/content/evidence'
import { taxonomy } from '@/content/taxonomy'

export const valueViews = [
  { id: 'attribution', label: 'Attribution' },
  { id: 'measurement', label: 'Measurement readiness' },
  { id: 'causes', label: 'Cause model' },
  { id: 'metrics', label: 'Metric families' },
]

export function Value({ view }: { view: string }) {
  return (
    <Screen>
      {view === 'attribution' && (
        <div className="space-y-4">
          <Panel title="Claim builder">
            <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
              A benefit must satisfy two constraints: exactly one attribution path from root cause to
              business outcome, and a measurement tier strong enough to support the claim being made.
            </p>
            <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
              <ClaimBuilder />
            </div>
          </Panel>
          <Panel title="Attribution path">
            <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
              <ProblemChain />
            </div>
          </Panel>
        </div>
      )}

      {view === 'measurement' && (
        <div className="space-y-4">
          <Panel title="What each readiness tier permits">
            <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
              <ValueFlow />
            </div>
          </Panel>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Readiness tiers" dense>
              <ul>
                {measurementTiers.map((t) => (
                  <li key={t.id} className="border-b border-paper-100/8 px-4 py-3 last:border-b-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-sm tnum text-accent">{t.id}</span>
                      <span className="text-[0.88rem] text-paper-50">{t.name}</span>
                      {t.rank === 1 && <Badge tone="pos">strongest</Badge>}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/68">{t.meaning}</p>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/72">Obtained by: {t.method}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-accent">{t.canClaim}</p>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title={measurementReadinessDeliverable.title}>
              <p className="text-sm leading-relaxed text-paper-100/78">{measurementReadinessDeliverable.body}</p>
              <p className="mt-3 border-t rule-dark pt-3 text-sm italic leading-relaxed text-paper-100/68">
                {measurementReadinessDeliverable.why}
              </p>
            </Panel>
          </div>
        </div>
      )}

      {view === 'causes' && (
        <Panel title="Causal model">
          <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
            Four layers, {taxonomy.length} items. Value may be claimed only at the outcome layer, and
            must trace through one named mechanism to one named root cause.
          </p>
          <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
            <CausalGraph />
          </div>
        </Panel>
      )}

      {view === 'metrics' && (
        <div className="space-y-4">
          <Panel title="Metric families" dense>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
              {metricFamilies.map((f) => {
                const o = taxonomy.find((n) => n.id === f.outcome)
                return (
                  <li key={f.id} className="border-b border-r border-paper-100/8 px-4 py-3">
                    <span className="text-[0.86rem] text-paper-50">{f.label}</span>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/68">
                      Attributed to <span className="text-accent">{o?.label}</span>
                    </p>
                  </li>
                )
              })}
            </ul>
          </Panel>
          <Panel title="Removed from the metric set" tone="warn">
            <h3 className="font-serif text-lg text-paper-50">{mttrPosition.rejected}</h3>
            <p className="mt-2 max-w-measure text-sm leading-relaxed text-paper-100/72">{mttrPosition.why}</p>
            <p className="mt-2 max-w-measure text-sm leading-relaxed text-paper-100/68">{mttrPosition.cost}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {mttrPosition.replacements.map((r) => (
                <li key={r.label} className="rounded border border-paper-100/10 bg-ink-800/50 px-3 py-2">
                  <span className="text-[0.84rem] text-paper-50">{r.label}</span>
                  <p className="mt-0.5 text-xs leading-relaxed text-paper-100/68">{r.def}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </Screen>
  )
}
