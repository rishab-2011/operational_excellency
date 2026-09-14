import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { contractAreas, contractInstances } from '@/content/contract'
import { Ref, StatusTag } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * §7.3 + §10 — the contract rendered as a governed document rather than a form.
 * Switching profile animates the three profile-variant areas, which is the §10.4 finding.
 */
export function ContractExplorer() {
  const [idx, setIdx] = useState(0)
  const reduced = usePrefersReducedMotion()
  const inst = contractInstances[idx]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Worked instantiations">
        {contractInstances.map((c, i) => {
          const on = i === idx
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={on}
              onClick={() => setIdx(i)}
              className={`rounded-md border px-3.5 py-2 text-left transition-all duration-200 ${
                on ? 'border-accent/55 bg-accent-wash' : 'border-paper-100/12 hover:border-paper-100/30'
              }`}
            >
              <span className={`block text-[0.82rem] ${on ? 'text-paper-50' : 'text-paper-100/72'}`}>{c.label}</span>
              <span className="mt-0.5 block font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/55">
                {c.profile} · {c.riskTier}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StatusTag status="illustrative" />
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">
          Constructed example, not a field artefact
        </span>
        <Ref s={inst.ref} />
      </div>

      {/* The contract itself */}
      <div className="mt-5 overflow-hidden rounded-lg border border-paper-100/12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-paper-100/10 bg-ink-800/70 px-5 py-3.5">
          <h4 className="font-serif text-lg text-paper-50">{inst.label}</h4>
          <span className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">
            Operational Contract · {inst.profile} profile
          </span>
        </div>

        <dl className="divide-y divide-paper-100/8">
          {contractAreas.map((area, i) => {
            const isProfile = area.scope === 'profile'
            return (
              <div
                key={area.id}
                className={`grid gap-x-5 gap-y-1.5 px-5 py-3.5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] ${
                  isProfile ? 'bg-accent-wash/40' : 'bg-ink-850/50'
                }`}
              >
                <dt className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[0.82rem] font-medium text-paper-50">{area.name}</span>
                  <span
                    className={`font-mono text-[0.6rem] uppercase tracking-[0.1em] ${
                      isProfile ? 'text-accent' : 'text-paper-100/55'
                    }`}
                    title={isProfile ? 'Varies by service profile' : 'Universal across every Operated Service'}
                  >
                    {isProfile ? 'profile' : 'core'}
                  </span>
                </dt>
                                  <motion.dd
                    key={`${inst.id}-${area.id}`}
                    initial={reduced ? false : { opacity: 0, x: isProfile ? 8 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: isProfile ? 0.42 : 0.28,
                      delay: reduced ? 0 : (isProfile ? 0.06 : 0) + i * 0.012,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[0.84rem] leading-relaxed text-paper-100/78"
                  >
                    {inst.values[area.id]}
                  </motion.dd>
              </div>
            )
          })}
        </dl>
      </div>

              <motion.div
          key={inst.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex gap-3 rounded-lg border border-signal-warn/30 bg-signal-warn/[0.07] p-5"
        >
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-signal-warn" />
          <div>
            <span className="eyebrow text-signal-warn">What this shape broke</span>
            <p className="mt-2 text-sm leading-relaxed text-paper-100/78 text-pretty">{inst.broke}</p>
          </div>
        </motion.div>
    </div>
  )
}
