import { Screen } from '@/app/AppShell'
import { Badge, Panel, SampleNotice, Stat } from '@/components/product'
import { CapabilityVsAuthority } from '@/visualizations/CapabilityVsAuthority'
import { GridMini } from '@/visualizations/GridMini'
import { DecayToAuthority } from '@/visualizations/DecayToAuthority'
import { MaturityMatrix } from '@/visualizations/MaturityMatrix'
import { ScenarioEngine } from '@/interactions/ScenarioEngine'
import { authorityLevels, authorityRules, authorityTransitions, gateCriteria, riskTiers } from '@/content/authority'
import { CEILING_SCOPE_NOTE, RISK_CAP, estate, grantsAboveCap, isCapped } from '@/data/estate'

export const authorityViews = [
  { id: 'position', label: 'Estate position' },
  { id: 'model', label: 'Grant model' },
  { id: 'gate', label: 'Gate evaluator' },
  { id: 'states', label: 'State changes' },
]

export function Authority({ view }: { view: string }) {
  return (
    <Screen>
      {view === 'position' && <Position />}

      {view === 'model' && (
        <div className="space-y-4">
          <Panel title="Capability against granted authority">
            <CapabilityVsAuthority />
          </Panel>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Authority levels" dense>
              <ul>
                {authorityLevels.map((l) => (
                  <li key={l.id} className="grid gap-x-3 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
                    <span className="font-mono text-2xs tnum text-accent">{l.id}</span>
                    <span>
                      <span className="block text-[0.85rem] text-paper-50">{l.name}</span>
                      <span className="mt-0.5 block text-xs text-paper-100/68">
                        Machine {l.machine.toLowerCase()} · human {l.human.toLowerCase()}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
            <div className="space-y-4">
              <Panel title="Risk tier ceilings" dense>
                <ul>
                  {riskTiers.map((t) => (
                    <li key={t.id} className="grid gap-x-3 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
                      <span className="font-mono text-2xs text-accent">{t.id}</span>
                      <span>
                        <span className="block text-[0.84rem] leading-snug text-paper-100/85">{t.definition}</span>
                        <span className="mt-1 inline-block rounded bg-paper-100/[0.07] px-2 py-0.5 font-mono text-2xs text-paper-100/72">
                          ceiling {t.cap}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Gate criteria to advance one level" dense>
                <ul>
                  {gateCriteria.map((g) => (
                    <li key={g.id} className="flex gap-2.5 border-b border-paper-100/8 px-4 py-2.5 text-[0.84rem] leading-relaxed text-paper-100/78 last:border-b-0">
                      <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>
                        {g.text}
                        {'hypothesis' in g && g.hypothesis && <Badge tone="warn" className="ml-2">unvalidated threshold</Badge>}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
          <Panel title="Grant rules">
            <ol className="grid gap-4 sm:grid-cols-2">
              {authorityRules.map((r) => (
                <li key={r.n} className="flex gap-3">
                  <span className="font-mono text-2xs tnum text-accent">{String(r.n).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[0.88rem] font-medium leading-snug text-paper-50">{r.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper-100/68">{r.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      )}

      {view === 'gate' && (
        <Panel title="Gate evaluator">
          <p className="mb-5 max-w-measure text-sm leading-relaxed text-paper-100/72">
            Applies the risk ceiling and the gate criteria in order. Change any condition and the
            permitted level moves — this is governance logic, not a simulated agent.
          </p>
          <ScenarioEngine />
        </Panel>
      )}

      {view === 'states' && (
        <div className="space-y-4">
          <Panel title="How a grant changes">
            <DecayToAuthority />
          </Panel>
          <Panel title="Transition triggers" dense>
            <ul>
              {authorityTransitions.map((t) => (
                <li key={t.id} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,14rem)_auto_minmax(0,1fr)] sm:items-center">
                  <span className="text-[0.85rem] text-paper-100/85">{t.trigger}</span>
                  <Badge tone={t.dir > 0 ? 'pos' : t.dir < 0 ? 'neg' : 'neutral'}>{t.effect}</Badge>
                  <span className="text-xs leading-relaxed text-paper-100/68">{t.detail}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </Screen>
  )
}

function Position() {
  const over = estate.flatMap((s) => grantsAboveCap(s).map((g) => ({ svc: s, g })))
  const totalGrants = estate.flatMap((s) => s.grants).filter((g) => g.grantable).length
  const atCeiling = estate.flatMap((s) => s.grants.filter((g) => isCapped(g) && g.granted === RISK_CAP[s.risk])).length

  return (
    <div className="space-y-4">
      <SampleNotice />
      <Panel title="Authority posture across the sample estate" dense>
        <div className="grid grid-cols-2 divide-x divide-y divide-paper-100/8 sm:grid-cols-4 sm:divide-y-0">
          <Stat label="Action grants" value={totalGrants} sub="grantable action classes" />
          <Stat label="At ceiling" value={atCeiling} sub="held at the risk tier limit" />
          <Stat label="Above ceiling" value={over.length} sub="require board exception" tone={over.length ? 'neg' : 'pos'} />
          <Stat label="Not grantable" value={estate.flatMap((s) => s.grants).filter((g) => !g.grantable).length} sub="structurally out of boundary" />
        </div>
        <p className="border-t border-paper-100/10 px-4 py-2.5 text-xs leading-relaxed text-paper-100/62">
          {CEILING_SCOPE_NOTE}
        </p>
      </Panel>

      {over.length > 0 && (
        <Panel title="Grants above the risk ceiling" dense tone="warn">
          <ul>
            {over.map(({ svc, g }, i) => (
              <li key={i} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:items-center">
                <span className="text-[0.85rem] text-paper-50">{svc.name}</span>
                <span className="text-xs text-paper-100/72">{g.action} · blast radius: {g.blast}</span>
                <span className="font-mono text-2xs text-signal-neg">
                  {authorityLevels[g.granted].id} held · {authorityLevels[RISK_CAP[svc.risk]].id} ceiling
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Maturity against authority">
        <GridMini />
      </Panel>

      <Panel title="Full grid">
        <MaturityMatrix />
      </Panel>
    </div>
  )
}
