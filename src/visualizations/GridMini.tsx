import { useState } from 'react'
import { authorityLevels, gridReadings, maturityLevels } from '@/content/authority'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

const HATCH = 'repeating-linear-gradient(45deg, rgba(226,145,132,0.30) 0 1px, transparent 1px 6px)'

function zone(m: number, a: number): 'above' | 'diagonal' | 'below' {
  const norm = (a / (authorityLevels.length - 1)) * (maturityLevels.length - 1)
  if (norm > m + 0.5) return 'above'
  if (norm < m - 0.5) return 'below'
  return 'diagonal'
}

/** Two presets that teach the grid's whole point in one click each. */
const PRESETS = [
  { id: 'danger', label: 'Over-permitted', m: 1, a: 5, why: 'Machines act with more freedom than the context and evidence justify. This is the finding no existing maturity model surfaces.' },
  { id: 'aligned', label: 'Aligned', m: 3, a: 4, why: 'Granted authority matches earned maturity. The estate is operating machines at roughly the level its evidence supports.' },
  { id: 'capacity', label: 'Under-automated', m: 4, a: 0, why: 'The estate has earned automation it has not been permitted. Usually safe, often wasteful — this is where capacity release lives.' },
] as const

export function GridMini() {
  const [p, setP] = useState(0)
  const preset = PRESETS[p]
  const z = zone(preset.m, preset.a)
  const reading = gridReadings.find((r) => r.id === z)

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Example positions">
        {PRESETS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={p === i}
            onClick={() => setP(i)}
            className={`chip border ${
              p === i ? 'border-accent bg-accent-wash text-accent' : 'border-paper-100/15 text-paper-100/62 hover:border-paper-100/35'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <div className="flex flex-col-reverse justify-between pb-6">
          {authorityLevels.map((l) => (
            <span key={l.id} className="flex h-9 items-center font-mono text-2xs tnum text-paper-100/55">{l.id}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="eyebrow text-paper-100/55">Automation Authority</span>
            <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">granted</span>
          </div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${maturityLevels.length}, minmax(0,1fr))` }}
            role="img"
            aria-label={`Grid showing ${maturityLevels[preset.m].id} maturity against ${authorityLevels[preset.a].id} authority, in the ${z === 'above' ? 'authority exceeds maturity' : z === 'below' ? 'maturity exceeds authority' : 'aligned'} zone.`}
          >
            {[...authorityLevels].reverse().map((lvl) =>
              maturityLevels.map((mat, mi) => {
                const ai = authorityLevels.indexOf(lvl)
                const zz = zone(mi, ai)
                const here = mi === preset.m && ai === preset.a
                return (
                  <span
                    key={`${lvl.id}-${mat.id}`}
                    aria-hidden
                    style={zz === 'above' ? { backgroundImage: HATCH } : undefined}
                    className={`relative h-9 rounded-sm border transition-all duration-300 ${
                      here ? '!border-accent ring-2 ring-accent/50' : ''
                    } ${
                      zz === 'above' ? 'border-signal-neg/30 bg-signal-neg/[0.30]'
                        : zz === 'below' ? 'border-signal-warn/25 bg-signal-warn/[0.20]'
                        : 'border-paper-100/15 bg-paper-100/[0.10]'
                    }`}
                  >
                    <span className={`absolute left-1 top-0.5 font-mono text-[0.55rem] ${
                      zz === 'above' ? 'text-signal-neg' : zz === 'below' ? 'text-signal-warn' : 'text-paper-100/55'
                    }`}>
                      {zz === 'above' ? '▲' : zz === 'below' ? '▼' : '■'}
                    </span>
                  </span>
                )
              }),
            )}
          </div>
          <div className="mt-1.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${maturityLevels.length}, minmax(0,1fr))` }}>
            {maturityLevels.map((m) => (
              <span key={m.id} className="text-center font-mono text-2xs tnum text-paper-100/55">{m.id}</span>
            ))}
          </div>
          <div className="mt-1.5 flex items-baseline justify-center gap-2">
            <span aria-hidden className="text-paper-100/55">→</span>
            <span className="eyebrow text-paper-100/55">Operational Maturity</span>
            <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">earned</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {([
          ['above', '▲', 'Authority exceeds maturity', 'text-signal-neg'],
          ['diagonal', '■', 'Aligned', 'text-paper-100/72'],
          ['below', '▼', 'Maturity exceeds authority', 'text-signal-warn'],
        ] as const).map(([k, glyph, label, cls]) => (
          <span key={k} className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/62">
            <span aria-hidden className={`text-[0.7rem] ${cls}`}>{glyph}</span>
            {label}
          </span>
        ))}
      </div>

      <div
        className={`mt-3 rounded-lg border p-4 ${
          z === 'above' ? 'border-signal-neg/40 bg-signal-neg/[0.08]'
            : z === 'below' ? 'border-signal-warn/40 bg-signal-warn/[0.07]'
            : 'border-paper-100/12 bg-ink-850'
        }`}
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <span className={`eyebrow ${z === 'above' ? 'text-signal-neg' : z === 'below' ? 'text-signal-warn' : 'text-paper-100/55'}`}>
            {reading ? reading.title : 'On the diagonal'}
          </span>
          <span className="font-mono text-2xs text-paper-100/55">
            {maturityLevels[preset.m].id} × {authorityLevels[preset.a].id}
          </span>
          <Ref s="§9.7" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-paper-100/78">{preset.why}</p>
      </div>

      <div className="mt-3">
        <DeeperLink to="axes">Move any position on the full grid</DeeperLink>
      </div>
    </div>
  )
}
