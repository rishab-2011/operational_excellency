import { useState } from 'react'
import { motion } from 'framer-motion'
import { authorityLevels, gridReadings, maturityLevels, riskTiers } from '@/content/authority'
import { Ref } from '@/components/primitives'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks'

type Zone = 'above' | 'diagonal' | 'below'

/**
 * §9.7 — the grid. Maturity (earned) against Authority (granted).
 * The diagonal is the alignment line; above it is the safety finding.
 */
function zoneOf(m: number, a: number): Zone {
  // Authority scale has six levels against maturity's five; normalise before comparing.
  const norm = (a / (authorityLevels.length - 1)) * (maturityLevels.length - 1)
  if (norm > m + 0.5) return 'above'
  if (norm < m - 0.5) return 'below'
  return 'diagonal'
}

const zoneStyle: Record<Zone, { cell: string; dot: string; label: string; glyph: string; hatch: boolean }> = {
  above: {
    cell: 'bg-signal-neg/[0.30] hover:bg-signal-neg/[0.42] border-signal-neg/30',
    dot: 'bg-signal-neg', label: 'Authority exceeds maturity', glyph: '▲', hatch: true,
  },
  diagonal: {
    cell: 'bg-paper-100/[0.10] hover:bg-paper-100/[0.16] border-paper-100/15',
    dot: 'bg-paper-100/60', label: 'Aligned', glyph: '■', hatch: false,
  },
  below: {
    cell: 'bg-signal-warn/[0.20] hover:bg-signal-warn/[0.30] border-signal-warn/25',
    dot: 'bg-signal-warn', label: 'Maturity exceeds authority', glyph: '▼', hatch: false,
  },
}

/** Diagonal hatch marks the danger zone without relying on colour alone. */
const HATCH =
  'repeating-linear-gradient(45deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 6px)'

export function MaturityMatrix() {
  const [m, setM] = useState(3)
  const [a, setA] = useState(4)
  const isNarrow = useMediaQuery('(max-width: 767px)')
  const reduced = usePrefersReducedMotion()

  const zone = zoneOf(m, a)
  const reading = gridReadings.find((r) => r.id === zone)
  const capTier = riskTiers.find((t) => t.capIndex < a)

  const Readout = (
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-paper-100/12 bg-ink-850 p-5">
        <span className="eyebrow text-paper-100/55">Position</span>
        <p className="mt-2 font-serif text-xl text-paper-50">
          {maturityLevels[m].id} {maturityLevels[m].name}
          <span className="text-paper-100/55"> × </span>
          {authorityLevels[a].id} {authorityLevels[a].name}
        </p>
        <dl className="mt-3 space-y-2 border-t rule-dark pt-3 text-sm">
          <div>
            <dt className="font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">Maturity — earned</dt>
            <dd className="mt-0.5 leading-relaxed text-paper-100/72">{maturityLevels[m].condition}</dd>
          </div>
          <div>
            <dt className="font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">Authority — granted</dt>
            <dd className="mt-0.5 leading-relaxed text-paper-100/72">
              Machine {authorityLevels[a].machine.toLowerCase()}. Human {authorityLevels[a].human.toLowerCase()}.
            </dd>
          </div>
        </dl>
      </div>

      <motion.div
        layout={!reduced}
        className={`rounded-lg border p-5 ${
          zone === 'above'
            ? 'border-signal-neg/40 bg-signal-neg/[0.08]'
            : zone === 'below'
              ? 'border-signal-warn/40 bg-signal-warn/[0.07]'
              : 'border-paper-100/12 bg-ink-850'
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <span
            className={`eyebrow ${
              zone === 'above' ? 'text-signal-neg' : zone === 'below' ? 'text-signal-warn' : 'text-paper-100/55'
            }`}
          >
            {reading ? reading.title : 'On the diagonal'}
          </span>
          <Ref s="§9.7" />
        </div>
        <p className="mt-1.5 text-[0.85rem] font-medium text-paper-100/85">
          {reading ? reading.subtitle : 'Granted authority matches earned maturity'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-paper-100/68">
          {reading
            ? reading.body
            : 'The estate is operating machines at roughly the level its context, evidence and practice support.'}
        </p>
        {capTier && (
          <p className="mt-3 border-t border-paper-100/10 pt-3 text-xs leading-relaxed text-paper-100/55">
            Note: {capTier.id} services cap at {capTier.cap.split('—')[0].trim()}, so this level would not
            be grantable on a {capTier.id} service. <Ref s="§9.5" />
          </p>
        )}
      </motion.div>
    </div>
  )

  /* Mobile: the grid becomes two ladders. Composition changes rather than shrinking. */
  if (isNarrow) {
    return (
      <div>
        <div className="space-y-5">
          <Ladder
            legend="Operational Maturity — earned"
            items={maturityLevels.map((l) => ({ id: l.id, name: l.name }))}
            value={m}
            onChange={setM}
          />
          <Ladder
            legend="Automation Authority — granted"
            items={authorityLevels.map((l) => ({ id: l.id, name: l.name }))}
            value={a}
            onChange={setA}
          />
        </div>
        {Readout}
      </div>
    )
  }

  /* Desktop: the full grid. */
  return (
    <div>
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="flex flex-col-reverse justify-between pb-8">
          {authorityLevels.map((lvl) => (
            <span key={lvl.id} className="flex h-[3.25rem] items-center gap-2 pr-1">
              <span className="font-mono text-2xs tnum text-paper-100/55">{lvl.id}</span>
              <span className="hidden w-[7.5rem] text-xs leading-tight text-paper-100/55 lg:block">{lvl.name}</span>
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${maturityLevels.length}, minmax(0, 1fr))` }}
            role="group"
            aria-label="Maturity by authority grid"
          >
            {[...authorityLevels].reverse().map((lvl) =>
              maturityLevels.map((mat, mi) => {
                const ai = authorityLevels.indexOf(lvl)
                const z = zoneOf(mi, ai)
                const selected = mi === m && ai === a
                return (
                  <button
                    key={`${lvl.id}-${mat.id}`}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${mat.id} ${mat.name} by ${lvl.id} ${lvl.name}. ${zoneStyle[z].label}.`}
                    onClick={() => { setM(mi); setA(ai) }}
                    style={zoneStyle[z].hatch ? { backgroundImage: HATCH } : undefined}
                    className={`group relative h-[3.25rem] rounded-sm border transition-all duration-200 ${
                      selected ? '!border-accent ring-2 ring-accent/45' : ''
                    } ${zoneStyle[z].cell}`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-1.5 top-1 font-mono text-[0.6rem] leading-none transition-opacity ${
                        z === 'above' ? 'text-signal-neg' : z === 'below' ? 'text-signal-warn' : 'text-paper-100/55'
                      } ${selected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'}`}
                    >
                      {zoneStyle[z].glyph}
                    </span>
                    {selected && (
                      <motion.span
                        layoutId={reduced ? undefined : 'matrix-marker'}
                        className="absolute inset-0 rounded-sm border border-accent"
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </button>
                )
              }),
            )}
          </div>

          {/* X axis */}
          <div
            className="mt-2 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${maturityLevels.length}, minmax(0, 1fr))` }}
          >
            {maturityLevels.map((mat) => (
              <span key={mat.id} className="text-center">
                <span className="block font-mono text-2xs tnum text-paper-100/55">{mat.id}</span>
                <span className="mt-0.5 block text-[0.68rem] leading-tight text-paper-100/55">{mat.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {(['above', 'diagonal', 'below'] as Zone[]).map((z) => (
          <span key={z} className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
            <span
              aria-hidden
              className={`flex h-4 w-4 items-center justify-center rounded-sm border text-[0.6rem] ${zoneStyle[z].cell} ${
                z === 'above' ? 'text-signal-neg' : z === 'below' ? 'text-signal-warn' : 'text-paper-100/60'
              }`}
              style={zoneStyle[z].hatch ? { backgroundImage: HATCH } : undefined}
            >
              {zoneStyle[z].glyph}
            </span>
            {zoneStyle[z].label}
          </span>
        ))}
      </div>

      {Readout}
    </div>
  )
}

function Ladder({
  legend, items, value, onChange,
}: { legend: string; items: { id: string; name: string }[]; value: number; onChange: (i: number) => void }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-2.5 text-paper-100/55">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            aria-pressed={i === value}
            onClick={() => onChange(i)}
            className={`chip border ${
              i === value
                ? 'border-accent bg-accent-wash text-accent'
                : 'border-paper-100/15 text-paper-100/60'
            }`}
          >
            {it.id} <span className="normal-case tracking-normal">{it.name}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
