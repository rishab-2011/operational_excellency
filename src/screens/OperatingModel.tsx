import { Screen } from '@/app/AppShell'
import { Panel } from '@/components/product'
import { ServiceRegister } from '@/screens/ServiceRegister'
import { MasterArchitecture } from '@/visualizations/MasterArchitecture'
import { QualificationGates } from '@/visualizations/QualificationGates'
import { ContractContext } from '@/visualizations/ContractContext'
import { LoopDiagram } from '@/visualizations/LoopDiagram'
import { ContextDecay } from '@/visualizations/ContextDecay'
import { contractInstances, instantiationFindings } from '@/content/contract'
import { decompositionRule, aggregation, osTests } from '@/content/operatedService'
import { ContractExplorer } from '@/interactions/ContractExplorer'

export const operatingModelViews = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'register', label: 'Service register' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'contract', label: 'Contract' },
  { id: 'context', label: 'Context' },
]

export function OperatingModel({ view }: { view: string }) {
  return (
    <Screen>
      {view === 'architecture' && (
        <div className="space-y-4">
          <Panel title="Model architecture">
            <MasterArchitecture />
          </Panel>
          <Panel title="Control loop detail">
            <LoopDiagram />
          </Panel>
        </div>
      )}

      {view === 'register' && <ServiceRegister />}

      {view === 'qualification' && (
        <div className="space-y-4">
          <Panel title="Qualification — the five tests">
            <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
              A candidate becomes an Operated Service only if all five pass. The same technology can
              qualify in one estate and not another: qualification is about accountability and
              recovery, not about what the thing is.
            </p>
            <QualificationGates />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Test definitions" dense>
              <ul>
                {osTests.map((t) => (
                  <li key={t.id} className="border-b border-paper-100/8 px-4 py-3 last:border-b-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xs text-accent">{t.id}</span>
                      <span className="text-[0.85rem] font-medium text-paper-50">{t.name}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/68">{t.question}</p>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/55">Fails if: {t.failsIf}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <div className="space-y-4">
              <Panel title="Decomposition rule" dense>
                <ol>
                  {decompositionRule.steps.map((s) => (
                    <li key={s.n} className="flex gap-3 border-b border-paper-100/8 px-4 py-3 last:border-b-0">
                      <span className="font-mono text-2xs tnum text-paper-100/55">{String(s.n).padStart(2, '0')}</span>
                      <p className="text-[0.84rem] leading-relaxed text-paper-100/78">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </Panel>
              <Panel title="Aggregation">
                <div className="flex flex-wrap items-center gap-2">
                  {aggregation.ladder.map((l, i) => (
                    <span key={l} className="flex items-center gap-2">
                      <span className="rounded border border-paper-100/15 bg-ink-800 px-2.5 py-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/80">
                        {l}
                      </span>
                      {i < aggregation.ladder.length - 1 && <span aria-hidden className="text-paper-100/55">→</span>}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-paper-100/78">
                  <span className="text-paper-50">{aggregation.rule}</span> {aggregation.why}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-paper-100/68">{aggregation.requirement}</p>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {view === 'contract' && (
        <div className="space-y-4">
          <Panel title="Contract and the context it depends on">
            <ContractContext />
          </Panel>
          <Panel title={`Worked instantiations · ${contractInstances.length}`}>
            <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
              Three service shapes, written by hand. All three broke a single rigid schema, which is
              why the contract separates universal areas from profile-variant ones.
            </p>
            <ContractExplorer />
            <div className="mt-6 border-t rule-dark pt-5">
              <h4 className="font-mono text-2xs uppercase tracking-[0.12em] text-accent">Findings</h4>
              <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                {instantiationFindings.map((f) => (
                  <li key={f.n} className="flex gap-3">
                    <span className="font-mono text-2xs tnum text-paper-100/55">{String(f.n).padStart(2, '0')}</span>
                    <p className="text-[0.84rem] leading-relaxed text-paper-100/78">{f.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Panel>
        </div>
      )}

      {view === 'context' && (
        <div className="space-y-4">
          <Panel title="Context decay simulation">
            <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
              Every context fact has a source, an owner and a shelf life. An expired fact is marked
              stale, never silently trusted — and automation authority falls out first.
            </p>
            <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
              <ContextDecay />
            </div>
          </Panel>
        </div>
      )}
    </Screen>
  )
}
