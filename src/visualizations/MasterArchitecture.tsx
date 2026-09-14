import { useState } from 'react'
import { ArrowDefs, Caption, DIAGRAM_COLORS as C, Edge, Figure, NodeBox } from '@/visualizations/kit'
import { Ref } from '@/components/primitives'
import { useMediaQuery } from '@/hooks'

/**
 * The master architecture: the one picture the whole framework hangs on.
 *
 * Operated Service → Operational Contract + Service Context Substrate →
 * SENSE → UNDERSTAND → DECIDE → Authority Gate → ACT → VALIDATE →
 * LEARN → IMPROVE → back into contract, context and authority.
 *
 * Every element here is stated in the requirement; nothing is invented.
 */

type PartId =
  | 'unit' | 'contract' | 'context' | 'sense' | 'understand'
  | 'decide' | 'gate' | 'act' | 'validate' | 'learn' | 'improve' | 'feedback'

const PARTS: { id: PartId; name: string; what: string; ref: string }[] = [
  { id: 'unit', name: 'Operated Service', what: 'The atomic unit of accountability. One owner, distinguishable failure, observable health, independent recovery, traceable to an outcome.', ref: '§2.1' },
  { id: 'contract', name: 'Operational Contract', what: 'Ownership, outcomes, dependencies, recovery — bound together with risk tier, blast radius and per-action machine authority.', ref: '§7.3' },
  { id: 'context', name: 'Service Context Substrate', what: 'The facts the loop reasons over, each carrying provenance, a freshness SLA and measured drift.', ref: '§8.2' },
  { id: 'sense', name: 'Sense', what: 'Collect metrics, logs, traces, events, topology, change and batch signals.', ref: '§6.3' },
  { id: 'understand', name: 'Understand', what: 'Turn observation into meaning using service, dependency, customer and business context.', ref: '§6.3' },
  { id: 'decide', name: 'Decide', what: 'Determine severity and response — and whether authority exists to act without a human.', ref: '§6.3' },
  { id: 'gate', name: 'Authority gate', what: 'The permission check. Risk tier caps it, gate criteria qualify it, stale evidence closes it.', ref: '§9.5 · §9.6' },
  { id: 'act', name: 'Act', what: 'Execute within the declared blast radius, with a tested abort path.', ref: '§6.3' },
  { id: 'validate', name: 'Validate', what: 'Confirm the service, journey and business actually recovered — independently of whoever acted.', ref: '§6.2' },
  { id: 'learn', name: 'Learn', what: 'Capture findings, false alerts, failed automation, human overrides and recurring toil.', ref: '§6.3' },
  { id: 'improve', name: 'Improve', what: 'Revise controls, runbooks, alert policy, the contract — and the authority grants themselves.', ref: '§6.3' },
  { id: 'feedback', name: 'The return path', what: 'Learning updates the contract, the context and what machines are permitted to do. This is what makes it a loop rather than a pipeline.', ref: '§6.2' },
]

export function MasterArchitecture({ compact = false }: { compact?: boolean }) {
  const [sel, setSel] = useState<PartId | null>(null)
  const narrow = useMediaQuery('(max-width: 900px)')
  const active = PARTS.find((p) => p.id === sel) ?? null
  const dimmed = (id: PartId) => sel !== null && sel !== id

  return (
    <div>
      {narrow ? <VerticalFlow sel={sel} onSelect={setSel} /> : <WideDiagram sel={sel} dimmed={dimmed} />}

      {/* Controls live in HTML so the diagram is fully keyboard operable. */}
      <div className="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Architecture parts">
        {PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={sel === p.id}
            onClick={() => setSel(sel === p.id ? null : p.id)}
            className={`chip border ${
              sel === p.id
                ? 'border-accent bg-accent-wash text-accent'
                : 'border-paper-100/15 text-paper-100/62 hover:border-paper-100/35 hover:text-paper-100/90'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[4.5rem] rounded-lg border border-paper-100/10 bg-ink-850/60 px-4 py-3.5" aria-live="polite">
        {active ? (
          <>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[0.86rem] font-medium text-paper-50">{active.name}</span>
              <Ref s={active.ref} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-paper-100/72">{active.what}</p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-paper-100/55">
            {compact
              ? 'One service. One contract. One loop — with a permission check before anything acts, and a return path that revises the permission.'
              : 'Select any part to read what it does. The diagram shows the whole framework in one picture.'}
          </p>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ wide */

function WideDiagram({ sel, dimmed }: { sel: PartId | null; dimmed: (id: PartId) => boolean }) {
  const A = (id: PartId) => sel === id
  return (
    <Figure
      viewBox="0 0 1180 486"
      label="Master architecture of the framework"
      description="An Operated Service is described by an Operational Contract and a Service Context Substrate. Those govern a loop: Sense, Understand, Decide, then an Authority Gate that decides whether a machine may act, then Act and Validate. Validate feeds Learn and Improve, which update the contract, the context and the authority grants."
    >
      <ArrowDefs />

      {/* Unit */}
      <NodeBox x={30} y={12} w={250} h={54} title="Operated Service" sub="the unit" tone="accent" dim={dimmed('unit')} />
      <Edge d="M 155 66 L 155 92" dim={dimmed('unit')} />

      {/* Substrate band */}
      <rect x={30} y={96} width={1120} height={110} rx={8} fill="rgba(200,127,67,0.05)" stroke="rgba(200,127,67,0.28)" strokeDasharray="5 4" />
      <Caption x={46} y={116} tone="accent">governed substrate — what the loop reasons over</Caption>
      <NodeBox x={60} y={126} w={500} h={58} title="Operational Contract" sub="risk · authority · outcomes" tone="substrate" dim={dimmed('contract')} />
      <NodeBox x={590} y={126} w={530} h={58} title="Service Context Substrate" sub="provenance · freshness · drift" tone="substrate" dim={dimmed('context')} />

      {/* Substrate governs the loop */}
      <Edge d="M 110 206 L 110 232" dashed />
      <Edge d="M 494 206 L 494 232" dashed />
      <Edge d="M 686 206 L 686 232" dashed accent />

      {/* Inner loop */}
      <Caption x={1150} y={226} anchor="end">inner loop — incident and event time</Caption>
      <NodeBox x={30} y={236} w={160} h={62} title="Sense" sub="monitor" dim={dimmed('sense')} />
      <NodeBox x={222} y={236} w={160} h={62} title="Understand" sub="analyse" dim={dimmed('understand')} />
      <NodeBox x={414} y={236} w={160} h={62} title="Decide" sub="plan" dim={dimmed('decide')} />
      <NodeBox x={606} y={236} w={160} h={62} title="Authority gate" sub="may it act?" tone="gate" dim={dimmed('gate')} />
      <NodeBox x={798} y={236} w={160} h={62} title="Act" sub="execute" dim={dimmed('act')} />
      <NodeBox x={990} y={236} w={160} h={62} title="Validate" sub="no mape-k equivalent" dim={dimmed('validate')} />

      <Edge d="M 190 267 L 218 267" dim={dimmed('sense')} />
      <Edge d="M 382 267 L 410 267" dim={dimmed('understand')} />
      <Edge d="M 574 267 L 602 267" accent dim={dimmed('decide')} />
      <Edge d="M 766 267 L 794 267" accent dim={dimmed('gate')} />
      <Edge d="M 958 267 L 986 267" dim={dimmed('act')} />

      {/* Gate can refuse */}
      <path d="M 686 298 L 686 313" stroke={C.neg} strokeWidth="1.3" strokeDasharray="3 3" fill="none" opacity={A('gate') ? 1 : 0.55} />
      <text x={694} y={319} fill={C.neg} fontSize="10.5" style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.1em' }}>
        REFUSED → HUMAN ACTS
      </text>

      {/* Validate → Learn */}
      <Edge d="M 1070 298 L 1070 341 L 580 341 L 580 357" dim={dimmed('validate')} />

      {/* Outer loop */}
      <Caption x={30} y={352}>outer loop — review cadence</Caption>
      <NodeBox x={500} y={361} w={160} h={58} title="Learn" dim={dimmed('learn')} />
      <NodeBox x={692} y={361} w={160} h={58} title="Improve" dim={dimmed('improve')} />
      <Edge d="M 660 390 L 688 390" dim={dimmed('learn')} />

      {/* Return path — the reason it is a loop */}
      <Edge d="M 772 419 L 772 452 L 14 452 L 14 151 L 26 151" accent dim={dimmed('feedback')} />
      <text x={792} y={456} fill={C.accent} fontSize="10.5" style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.13em' }}>
        UPDATES CONTRACT · CONTEXT · AUTHORITY GRANTS
      </text>
    </Figure>
  )
}

/* ---------------------------------------------------------------- narrow */

const STACK: { id: PartId; label: string; kind: 'unit' | 'substrate' | 'inner' | 'gate' | 'outer' }[] = [
  { id: 'unit', label: 'Operated Service', kind: 'unit' },
  { id: 'contract', label: 'Operational Contract', kind: 'substrate' },
  { id: 'context', label: 'Service Context Substrate', kind: 'substrate' },
  { id: 'sense', label: 'Sense', kind: 'inner' },
  { id: 'understand', label: 'Understand', kind: 'inner' },
  { id: 'decide', label: 'Decide', kind: 'inner' },
  { id: 'gate', label: 'Authority gate', kind: 'gate' },
  { id: 'act', label: 'Act', kind: 'inner' },
  { id: 'validate', label: 'Validate', kind: 'inner' },
  { id: 'learn', label: 'Learn', kind: 'outer' },
  { id: 'improve', label: 'Improve', kind: 'outer' },
]

/** Mobile changes composition: the same architecture as a vertical spine. */
function VerticalFlow({ sel, onSelect }: { sel: PartId | null; onSelect: (id: PartId) => void }) {
  return (
    <ol className="relative space-y-1.5 pl-5">
      <span aria-hidden className="absolute left-[7px] top-2 bottom-8 w-px bg-paper-100/15" />
      {STACK.map((s) => {
        const on = sel === s.id
        return (
          <li key={s.id} className="relative">
            <span
              aria-hidden
              className={`absolute -left-5 top-3.5 h-2 w-2 rounded-full border ${
                s.kind === 'gate' ? 'border-accent bg-accent' : on ? 'border-accent bg-accent' : 'border-paper-100/35 bg-ink-900'
              }`}
            />
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(s.id)}
              className={`w-full rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                s.kind === 'gate'
                  ? 'border-accent/55 bg-accent-wash'
                  : s.kind === 'substrate'
                    ? 'border-accent/25 bg-accent-wash/40'
                    : 'border-paper-100/12 bg-ink-850'
              } ${on ? '!border-accent' : ''}`}
            >
              <span className={`text-[0.86rem] ${s.kind === 'gate' ? 'text-accent' : 'text-paper-50'}`}>{s.label}</span>
              {s.kind === 'gate' && (
                <span className="mt-0.5 block font-mono text-2xs uppercase tracking-[0.1em] text-accent/80">
                  may it act?
                </span>
              )}
            </button>
          </li>
        )
      })}
      <li className="relative pt-1">
        <span aria-hidden className="absolute -left-5 top-4 h-2 w-2 rounded-full border border-accent bg-accent" />
        <div className="rounded-md border border-accent/40 bg-accent-wash px-3.5 py-2.5">
          <span className="font-mono text-2xs uppercase tracking-[0.12em] text-accent">
            ↺ updates contract · context · authority
          </span>
        </div>
      </li>
    </ol>
  )
}
