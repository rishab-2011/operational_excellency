import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Badge, Field, FindingRow, Meter, Panel, SampleNotice } from '@/components/product'
import { authorityLevels } from '@/content/authority'
import { contractAreas } from '@/content/contract'
import {
  CEILING_SCOPE_NOTE, CONTRACT_AREA_COUNT, FINDING_META, RISK_CAP, contextIntegrity,
  contractCompleteness, estate, isCapped, isStale, type OperatedService,
} from '@/data/estate'

/** The register: every Operated Service, its contract state and its authority position. */
export function ServiceRegister() {
  const [id, setId] = useState(estate[0].id)
  const svc = estate.find((s) => s.id === id)!

  return (
    <div>
      <SampleNotice className="mb-4" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
        {/* List */}
        <Panel title={`Operated Services · ${estate.length}`} dense>
          <ul role="listbox" aria-label="Operated Services" className="max-h-[32rem] overflow-y-auto">
            {estate.map((s) => {
              const on = s.id === id
              const high = s.findings.some((f) => FINDING_META[f.kind].severity === 'high')
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => setId(s.id)}
                    className={`flex w-full items-center gap-3 border-b border-paper-100/8 px-4 py-3 text-left transition-colors ${
                      on ? 'bg-accent-wash' : 'hover:bg-paper-100/[0.035]'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[0.86rem] ${on ? 'text-paper-50' : 'text-paper-100/85'}`}>
                        {s.name}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
                        {s.domain} · {s.risk}
                      </span>
                    </span>
                    {high && <span aria-label="Has high-severity finding" className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-neg" />}
                    <ChevronRight aria-hidden className={`h-3.5 w-3.5 shrink-0 ${on ? 'text-accent' : 'text-paper-100/55'}`} />
                  </button>
                </li>
              )
            })}
          </ul>
        </Panel>

        {/* Detail */}
        <div className="min-w-0 space-y-4" data-testid="service-detail">
          <ServiceHeader svc={svc} />

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Operational contract" dense
              actions={<Badge tone={svc.contractAreas === CONTRACT_AREA_COUNT ? 'pos' : 'warn'}>
                {svc.contractAreas}/{CONTRACT_AREA_COUNT} areas
              </Badge>}>
              <div className="px-4 pb-1 pt-3"><Meter value={contractCompleteness(svc)} tone={svc.contractAreas === CONTRACT_AREA_COUNT ? 'pos' : 'warn'} /></div>
              <ul className="flex flex-wrap gap-1.5 px-4 py-3">
                {contractAreas.map((a, i) => {
                  const present = i < svc.contractAreas
                  return (
                    <li key={a.id}>
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.09em] ${
                          present ? 'border-paper-100/25 text-paper-100/80' : 'border-dashed border-paper-100/15 text-paper-100/55'
                        }`}
                      >
                        {a.name}{!present && ' · absent'}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Panel>

            <Panel title="Service context" dense
              actions={<Badge tone={contextIntegrity(svc) === 100 ? 'pos' : 'warn'}>{contextIntegrity(svc)}% within window</Badge>}>
              <ul>
                {svc.context.map((f) => {
                  const stale = isStale(f)
                  return (
                    <li key={f.label} className="grid gap-x-3 gap-y-1 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                      <span className="text-[0.84rem] text-paper-100/85">{f.label}</span>
                      <span className="font-mono text-2xs uppercase tracking-[0.09em] text-paper-100/55">{f.source}</span>
                      <span className={`font-mono text-2xs tnum ${stale ? 'text-signal-neg' : 'text-paper-100/72'}`}>
                        {f.ageDays}d / {f.windowDays}d
                        <span className="sr-only">{stale ? ' — past review window' : ' — within window'}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>

          <AuthorityTable svc={svc} />

          {svc.findings.length > 0 && (
            <Panel title="Findings" dense tone="warn">
              {svc.findings.map((f, i) => (
                <FindingRow key={i} label={FINDING_META[f.kind].label} detail={f.detail} severity={FINDING_META[f.kind].severity} />
              ))}
            </Panel>
          )}

          {svc.note && (
            <Panel title="Note">
              <p className="text-sm leading-relaxed text-paper-100/78">{svc.note}</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceHeader({ svc }: { svc: OperatedService }) {
  return (
    <Panel dense>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper-100/10 px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="font-serif text-xl text-paper-50">{svc.name}</h2>
          <p className="mt-0.5 font-mono text-2xs uppercase tracking-[0.11em] text-paper-100/55">
            {svc.domain} · {svc.profile}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={svc.risk === 'R1' ? 'neg' : svc.risk === 'R2' ? 'warn' : 'muted'}>{svc.risk}</Badge>
          <Badge tone="accent">M{svc.maturity}</Badge>
        </div>
      </div>
      <dl>
        <Field label="Accountable owner">
          {svc.owner === 'Disputed'
            ? <span className="text-signal-neg">Disputed — pending arbitration</span>
            : svc.owner}
        </Field>
        <Field label="Authority ceiling" mono>
          {authorityLevels[RISK_CAP[svc.risk]].id} · {authorityLevels[RISK_CAP[svc.risk]].name}
          <span className="ml-2 text-paper-100/55">set by {svc.risk}</span>
        </Field>
      </dl>
    </Panel>
  )
}

function AuthorityTable({ svc }: { svc: OperatedService }) {
  const cap = RISK_CAP[svc.risk]
  return (
    <Panel title="Authority by action class" dense
      actions={<Badge tone="muted">ceiling {authorityLevels[cap].id}</Badge>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-paper-100/10">
              {['Action', 'Reversibility', 'Blast radius', 'Granted', 'Supported'].map((h) => (
                <th key={h} scope="col" className="px-4 py-2 font-mono text-2xs uppercase tracking-[0.11em] text-paper-100/55">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {svc.grants.map((g) => {
              const capped = isCapped(g)
              const over = capped && g.granted > cap
              return (
                <tr key={g.action} className="border-b border-paper-100/8 last:border-b-0">
                  <td className="px-4 py-2.5 text-[0.84rem] text-paper-100/85">{g.action}</td>
                  <td className="px-4 py-2.5 text-xs text-paper-100/62">{g.reversible}</td>
                  <td className="px-4 py-2.5 text-xs text-paper-100/62">{g.blast}</td>
                  <td className="px-4 py-2.5">
                    {g.grantable
                      ? <Badge tone={over ? 'neg' : 'accent'}>{authorityLevels[g.granted].id}</Badge>
                      : <Badge tone="muted">not grantable</Badge>}
                  </td>
                  <td className="px-4 py-2.5">
                    {!g.grantable
                      ? <span className="font-mono text-2xs text-paper-100/55">out of boundary</span>
                      : !capped
                        ? <span className="font-mono text-2xs text-paper-100/62">not capped — no state change</span>
                        : <span className={`font-mono text-2xs ${over ? 'text-signal-neg' : 'text-paper-100/62'}`}>
                            {authorityLevels[Math.min(g.target, cap)].id}
                            {over && ' — above ceiling'}
                          </span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-paper-100/10 px-4 py-2.5 text-xs leading-relaxed text-paper-100/62">
        {CEILING_SCOPE_NOTE}
      </p>
    </Panel>
  )
}
