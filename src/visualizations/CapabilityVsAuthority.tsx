import { useState } from 'react'
import { authorityLevels, riskTiers } from '@/content/authority'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/**
 * The hero distinction, as one picture: what a machine CAN do against what it MAY do.
 * The gap between the two tracks is the framework's subject.
 */
export function CapabilityVsAuthority() {
  const [tier, setTier] = useState<'R1' | 'R2' | 'R3'>('R1')
  const cap = riskTiers.find((t) => t.id === tier)!
  const granted = cap.capIndex

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Risk tier">
        <span className="eyebrow text-paper-100/55">Service risk tier</span>
        {(['R1', 'R2', 'R3'] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tier === t}
            onClick={() => setTier(t)}
            className={`chip border ${
              tier === t ? 'border-accent bg-accent-wash text-accent' : 'border-paper-100/15 text-paper-100/62'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <Track
          label="What the machine can do"
          sub="technical capability"
          upto={authorityLevels.length - 1}
          tone="capable"
        />
        <Track
          label="What the machine may do"
          sub={`granted authority — capped by ${tier}`}
          upto={granted}
          tone="granted"
        />
      </div>

      {/* Level scale */}
      <div
        className="mt-2 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${authorityLevels.length}, minmax(0,1fr))` }}
      >
        {authorityLevels.map((l, i) => (
          <span key={l.id} className="text-center">
            <span className={`block font-mono text-2xs tnum ${i <= granted ? 'text-paper-100/70' : 'text-signal-neg/80'}`}>
              {l.id}
            </span>
            <span className="mt-0.5 hidden text-[0.62rem] leading-tight text-paper-100/55 sm:block">{l.name}</span>
          </span>
        ))}
      </div>

      <p className="mt-5 rounded-lg border border-accent/30 bg-accent-wash px-4 py-3 text-sm leading-relaxed text-paper-100/80">
        <span className="font-medium text-paper-50">The gap is the point.</span> Capability is a property of the
        technology. Authority is a grant — capped by risk, earned with evidence, and withdrawn when the evidence
        expires. <Ref s="§9.4 · §9.5" />
      </p>

      <div className="mt-3">
        <DeeperLink to="authority">Change the conditions and watch permission move</DeeperLink>
      </div>
    </div>
  )
}

function Track({
  label, sub, upto, tone,
}: { label: string; sub: string; upto: number; tone: 'capable' | 'granted' }) {
  const total = authorityLevels.length
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[0.84rem] text-paper-50">{label}</span>
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">{sub}</span>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0,1fr))` }}>
        {authorityLevels.map((l, i) => {
          const filled = i <= upto
          const beyond = tone === 'granted' && !filled
          return (
            <span
              key={l.id}
              aria-hidden
              className={`h-7 rounded-sm border ${
                filled
                  ? tone === 'capable'
                    ? 'border-paper-100/25 bg-paper-100/20'
                    : 'border-accent/60 bg-accent/45'
                  : beyond
                    ? 'border-signal-neg/40'
                    : 'border-paper-100/10'
              }`}
              style={beyond ? { backgroundImage: 'repeating-linear-gradient(45deg, rgba(226,145,132,0.30) 0 1px, transparent 1px 6px)' } : undefined}
            />
          )
        })}
      </div>
      {tone === 'granted' && upto < total - 1 && (
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-2xs uppercase tracking-[0.11em]">
          <span className="flex items-center gap-1.5 text-paper-100/72">
            <span aria-hidden className="h-2.5 w-4 rounded-sm bg-accent/45" /> permitted
          </span>
          <span className="flex items-center gap-1.5 text-signal-neg">
            <span
              aria-hidden
              className="h-2.5 w-4 rounded-sm border border-signal-neg/40"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(226,145,132,0.30) 0 1px, transparent 1px 6px)' }}
            />
            capable, not permitted
          </span>
        </p>
      )}
    </div>
  )
}
