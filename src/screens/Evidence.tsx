import { useState } from 'react'
import { Screen } from '@/app/AppShell'
import { Citations } from '@/components/citations'
import { Badge, Panel } from '@/components/product'
import { Ref, StatusTag } from '@/components/primitives'
import { PriorArtLayers } from '@/visualizations/PriorArtLayers'
import { challenges, doraHazard, noveltyPosition, priorArt } from '@/content/priorArt'
import { dispositionMeta, objections, objectionsPreamble, type Disposition } from '@/content/objections'
import { claims, claimsCaveat, deliverySchedule, project, transferPoint } from '@/content/meta'
import { evidenceGrades, evidenceRules, evidenceStandingExample, measurementRule } from '@/content/evidence'
import { pillars, pillarGateNote } from '@/content/pillars'
import { loopPriorArt, loopDepartures } from '@/content/loop'
import { contractPriorArt } from '@/content/contract'

export const evidenceViews = [
  { id: 'objections', label: 'Objections' },
  { id: 'prior-art', label: 'Prior art' },
  { id: 'claims', label: 'Claim status' },
  { id: 'method', label: 'Method and sources' },
]

const dispTone: Record<Disposition, 'pos' | 'warn' | 'neg'> = {
  answered: 'pos', partial: 'warn', unresolved: 'neg',
}

export function Evidence({ view }: { view: string }) {
  return (
    <Citations>
      <Screen>
        {view === 'objections' && <Objections />}
        {view === 'prior-art' && <PriorArt />}
        {view === 'claims' && <Claims />}
        {view === 'method' && <Method />}
      </Screen>
    </Citations>
  )
}

function Objections() {
  const [open, setOpen] = useState<string | null>(objections[0].id)
  const counts = {
    unresolved: objections.filter((o) => o.disposition === 'unresolved').length,
    partial: objections.filter((o) => o.disposition === 'partial').length,
  }
  return (
    // Long-form argument reads badly at full console width; hold it to a column.
    <div className="max-w-5xl space-y-4">
      <Panel title={objectionsPreamble.title} tone="warn">
        <p className="max-w-measure text-sm leading-relaxed text-paper-100/80">{objectionsPreamble.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="neg">{counts.unresolved} unresolved</Badge>
          <Badge tone="warn">{counts.partial} partly answered</Badge>
        </div>
      </Panel>

      <div className="space-y-3">
        {objections.map((o) => {
          const isOpen = open === o.id
          return (
            <Panel key={o.id} dense>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : o.id)}
                className={`flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors ${
                  isOpen ? 'bg-paper-100/[0.04]' : 'hover:bg-paper-100/[0.03]'
                }`}
              >
                <span className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[0.95rem] text-paper-50">{o.short}</span>
                  <Badge tone={dispTone[o.disposition]}>{dispositionMeta[o.disposition].label}</Badge>
                </span>
                <span aria-hidden className="font-mono text-2xs text-paper-100/55">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-paper-100/10">
                  <Block label="The case against" tone="neg">{o.case}</Block>
                  {o.answer && <Block label="What the framework answers">{o.answer}</Block>}
                  <Block label="What remains open" tone="warn">{o.open}</Block>
                  <Block label="What would close it" tone="accent">{o.closes}</Block>
                </div>
              )}
            </Panel>
          )
        })}
      </div>

      <Panel title="Shorter objections" dense>
        <ul>
          {challenges.map((c) => (
            <li key={c.id} className="border-b border-paper-100/8 px-4 py-3 last:border-b-0">
              <p className="text-[0.86rem] text-paper-50">{c.objection}</p>
              <p className="mt-1.5 text-[0.84rem] leading-relaxed text-paper-100/72">{c.answer}</p>
              <div className="mt-1.5"><Ref s={c.ref} /></div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

function Block({
  label, children, tone = 'default',
}: { label: string; children: React.ReactNode; tone?: 'default' | 'neg' | 'warn' | 'accent' }) {
  const color =
    tone === 'neg' ? 'text-signal-neg' : tone === 'warn' ? 'text-signal-warn' : tone === 'accent' ? 'text-accent' : 'text-paper-100/62'
  return (
    <div className="border-b border-paper-100/8 px-4 py-3.5 last:border-b-0">
      <span className={`font-mono text-2xs uppercase tracking-[0.12em] ${color}`}>{label}</span>
      <p className="mt-2 max-w-measure text-[0.88rem] leading-relaxed text-paper-100/82">{children}</p>
    </div>
  )
}

function PriorArt() {
  return (
    <div className="space-y-4">
      <Panel title="Where existing practice already sits">
        <div className="rounded-lg bg-paper-100 p-5 text-ink-900">
          <PriorArtLayers />
        </div>
      </Panel>

      <Panel title="The loop is MAPE-K" tone="warn">
        <p className="max-w-measure text-sm leading-relaxed text-paper-100/80">{loopPriorArt.statement}</p>
        <p className="mt-2.5 text-sm italic leading-relaxed text-paper-100/68">{loopPriorArt.consequence}</p>
        <div className="mt-2"><Ref s={loopPriorArt.ref} /></div>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {loopDepartures.map((d) => (
            <li key={d.n} className="rounded border border-paper-100/10 bg-ink-800/50 p-3">
              <span className="font-mono text-2xs tnum text-accent">{String(d.n).padStart(2, '0')}</span>
              <p className="mt-1 text-[0.84rem] font-medium leading-snug text-paper-50">{d.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-paper-100/68">{d.body}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Contract content conceded to prior art" dense>
        <ul>
          {contractPriorArt.map((p) => (
            <li key={p.area} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
              <span className="text-[0.84rem] text-paper-50">{p.area}</span>
              <span className="text-[0.82rem] leading-relaxed text-paper-100/72">{p.art} <Ref s={p.ref} /></span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={`Related disciplines · ${priorArt.length}`} dense>
        <ul>
          {priorArt.map((p) => (
            <li key={p.id} className="border-b border-paper-100/8 px-4 py-3 last:border-b-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[0.88rem] text-paper-50">{p.name}</span>
                <Badge tone="muted">{p.category}</Badge>
                <Ref s={p.ref} />
              </div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <p className="text-xs leading-relaxed text-paper-100/72">
                  <span className="text-signal-pos">Solves well — </span>{p.solvesWell}
                </p>
                <p className="text-xs leading-relaxed text-paper-100/72">
                  <span className="text-accent">Binds or extends — </span>{p.epofBinds}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Naming hazard" tone="warn">
        <p className="max-w-measure text-sm leading-relaxed text-paper-100/80">{doraHazard.text} <Ref s={doraHazard.ref} /></p>
      </Panel>
    </div>
  )
}

function Claims() {
  return (
    <div className="space-y-4">
      <Panel title="Claim register">
        <p className="max-w-measure text-sm leading-relaxed text-paper-100/78">{claimsCaveat.text} <Ref s={claimsCaveat.ref} /></p>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {claims.map((c) => (
            <div
              key={c.id}
              className={`rounded-lg border p-4 ${
                c.status === 'withdrawn' ? 'border-signal-neg/30 bg-signal-neg/[0.05]'
                  : c.status === 'claim' ? 'border-accent/35 bg-accent-wash'
                  : 'border-paper-100/12 bg-ink-800/50'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusTag status={c.status} />
                <Ref s={c.ref} />
              </div>
              <h3 className={`mt-2.5 font-serif text-lg leading-snug ${c.status === 'withdrawn' ? 'text-paper-100/62 line-through decoration-paper-100/25' : 'text-paper-50'}`}>
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-paper-100/75">{c.body}</p>
              <p className="mt-2.5 border-t border-paper-100/10 pt-2.5 text-xs leading-relaxed text-paper-100/68">{c.statusNote}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Stated as new">
          <ul className="space-y-2.5">
            {noveltyPosition.new.map((n) => (
              <li key={n} className="flex gap-2.5 text-sm leading-relaxed text-paper-100/78">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />{n}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Stated as synthesis">
          <p className="text-sm leading-relaxed text-paper-100/75">{noveltyPosition.synthesis}</p>
        </Panel>
      </div>

      <Panel title="Capability model" dense>
        <ul>
          {pillars.map((p) => (
            <li key={p.id} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-2xs tnum text-accent">{String(p.n).padStart(2, '0')}</span>
                <span className="text-[0.85rem] text-paper-50">{p.name}</span>
              </span>
              <span className="text-[0.82rem] leading-relaxed text-paper-100/72">{p.role}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-paper-100/10 px-4 py-3 text-xs leading-relaxed text-paper-100/68">
          {pillarGateNote.text} <Ref s={pillarGateNote.ref} />
        </p>
      </Panel>
    </div>
  )
}

function Method() {
  return (
    <div className="space-y-4">
      <Panel title="Evidence grades" dense>
        <ul>
          {evidenceGrades.map((g) => (
            <li key={g.id} className="grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)]">
              <span className={`font-mono text-sm tnum ${g.rank === 1 ? 'text-accent' : 'text-paper-100/62'}`}>{g.id}</span>
              <span className="text-[0.84rem] leading-relaxed text-paper-100/85">{g.source}</span>
              <span className={`text-xs leading-relaxed ${g.rank === 4 ? 'text-signal-neg' : 'text-paper-100/68'}`}>{g.usable}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Evidence rules" dense>
          <ol>
            {evidenceRules.map((r) => (
              <li key={r.n} className="flex gap-3 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0">
                <span className="font-mono text-2xs tnum text-paper-100/55">{String(r.n).padStart(2, '0')}</span>
                <span className="text-[0.84rem] leading-relaxed text-paper-100/78">{r.text} <Ref s={r.ref} /></span>
              </li>
            ))}
          </ol>
        </Panel>
        <div className="space-y-4">
          <Panel title="Binding rule on value">
            <p className="text-sm leading-relaxed text-paper-100/82">{measurementRule.rule}</p>
            <div className="mt-2"><Ref s={measurementRule.ref} /></div>
          </Panel>
          <Panel title="Standing prohibition">
            <p className="text-sm leading-relaxed text-paper-100/82">{evidenceStandingExample.text}</p>
            <p className="mt-2 text-xs leading-relaxed text-paper-100/62">{evidenceStandingExample.origin}</p>
          </Panel>
        </div>
      </div>

      <Panel title="Maturity of this capability" dense>
        <ul>
          {deliverySchedule.map((v) => (
            <li key={v.version} className={`grid gap-x-4 gap-y-1 border-b border-paper-100/8 px-4 py-3 last:border-b-0 sm:grid-cols-[4rem_5rem_minmax(0,1.3fr)_minmax(0,1fr)] ${v.done ? 'bg-accent-wash/40' : ''}`}>
              <span className={`font-mono text-sm tnum ${v.done ? 'text-accent' : 'text-paper-100/72'}`}>{v.version}</span>
              <span className="font-mono text-2xs tnum text-paper-100/55">{v.weeks === '—' ? '—' : `${v.weeks} wks`}</span>
              <span className="text-[0.82rem] leading-relaxed text-paper-100/78">{v.contents}</span>
              <span className={`text-xs leading-relaxed ${v.done ? 'text-accent' : 'text-paper-100/62'}`}>
                {v.done ? '✓ ' : 'Gate: '}{v.gate}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Capability transfer">
        <p className="max-w-measure text-sm italic leading-relaxed text-paper-100/68">{transferPoint.intro}</p>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {transferPoint.commitments.map((c) => (
            <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-paper-100/80">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />{c}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t rule-dark pt-3 text-sm leading-relaxed text-paper-50">{transferPoint.after}</p>
        <div className="mt-2"><Ref s={transferPoint.ref} /></div>
      </Panel>

      <Panel title="Source">
        <dl className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          <Row k="Requirement">{project.version}, revised {project.revised}</Row>
          <Row k="Working title">{project.category} ({project.abbrev})</Row>
          <Row k="Status">Internal working preview. Not a client deliverable.</Row>
          <Row k="Data">No live integrations. Sample estate only.</Row>
        </dl>
        <p className="mt-4 max-w-measure text-sm leading-relaxed text-paper-100/72">
          The requirement document is the source of truth. Where this application and the requirement
          differ, the requirement wins. Section references throughout this area point back to it.
        </p>
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-paper-100/20 px-3.5 py-2 text-[0.84rem] text-paper-100/80 transition-colors hover:border-accent hover:text-accent"
        >
          Open the requirement ↗
        </a>
      </Panel>
    </div>
  )
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-paper-100/8 pb-2">
      <dt className="font-mono text-2xs uppercase tracking-[0.11em] text-paper-100/55">{k}</dt>
      <dd className="mt-1 text-[0.84rem] text-paper-100/85">{children}</dd>
    </div>
  )
}
