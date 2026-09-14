import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { pillarGateNote, pillars } from '@/content/pillars'
import { Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

const foundation = pillars[0]
const upper = pillars.slice(1)

/** Chapter 11 — §13. Architecture, not six identical cards: pillar 1 gates 3, 5 and 6. */
export function Pillars() {
  // Foundation pre-selected: it also reveals the gating relationship immediately.
  const [sel, setSel] = useState<string | null>(foundation.id)
  const reduced = usePrefersReducedMotion()

  const gatedBySelection = sel === foundation.id ? foundation.gates : []
  const active = pillars.find((p) => p.id === sel) ?? null
  const isGated = (id: string) => foundation.gates.includes(id)

  return (
    <Section id="pillars" tone="dark">
      <div className="shell">
        <SectionHead
          n="11"
          kicker="Discipline · Capability model"
          title={<>Six pillars, and one of them holds up three others.</>}
          lede="Eleven pillars in the previous version contained several views of the same thing. Six survive — and they are not peers. Service definition and context gate the pillars that reason over them, because none of those can be assessed meaningfully against decayed context."
        />

        <Reveal delay={0.08}>
          <div className="mt-12">
            {/* Upper pillars */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {upper.map((p) => {
                const gated = isGated(p.id)
                const dim = sel !== null && sel !== p.id && !(sel === foundation.id && gated)
                const lit = sel === foundation.id && gated
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    aria-pressed={sel === p.id}
                    onClick={() => setSel(sel === p.id ? null : p.id)}
                    animate={{ opacity: dim ? 0.35 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                    className={`rounded-lg border p-4 text-left transition-colors duration-200 ${
                      sel === p.id || lit
                        ? 'border-accent bg-accent-wash'
                        : 'border-paper-100/12 bg-ink-850/70 hover:border-paper-100/30'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-2xs tnum text-accent">
                        {String(p.n).padStart(2, '0')}
                      </span>
                      {gated && (
                        <span
                          title="Gated by pillar 01"
                          className={`flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.08em] ${
                            lit ? 'text-accent' : 'text-paper-100/55'
                          }`}
                        >
                          <Lock aria-hidden className="h-2.5 w-2.5" /> gated
                        </span>
                      )}
                    </div>
                    <span className="mt-2 block font-serif text-[1.05rem] leading-tight text-paper-50">
                      {p.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Gate indicator */}
            <div aria-hidden className="relative my-3 flex h-6 items-center justify-center">
              <span className="h-px w-full bg-paper-100/10" />
              <span
                className={`absolute rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] transition-colors ${
                  gatedBySelection.length
                    ? 'border-accent/60 bg-ink-900 text-accent'
                    : 'border-paper-100/15 bg-ink-900 text-paper-100/55'
                }`}
              >
                gates 03 · 05 · 06
              </span>
            </div>

            {/* Foundation */}
            <motion.button
              type="button"
              aria-pressed={sel === foundation.id}
              onClick={() => setSel(sel === foundation.id ? null : foundation.id)}
              animate={{ opacity: sel !== null && sel !== foundation.id ? 0.45 : 1 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className={`w-full rounded-lg border p-5 text-left transition-colors duration-200 ${
                sel === foundation.id
                  ? 'border-accent bg-accent-wash'
                  : 'border-accent/30 bg-ink-850 hover:border-accent/55'
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-2xs tnum text-accent">01</span>
                <span className="font-serif text-xl text-paper-50">{foundation.name}</span>
                <span className="chip border-accent/50 text-accent">Foundation</span>
              </div>
              <p className="mt-2 max-w-measure text-sm leading-relaxed text-paper-100/65">{foundation.role}</p>
            </motion.button>
          </div>
        </Reveal>

        {/* Detail */}
        <Reveal delay={0.06}>
          <div className="mt-6 min-h-[7rem]">
            {active ? (
              <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-px overflow-hidden rounded-lg border border-paper-100/12 bg-paper-100/10 sm:grid-cols-2"
              >
                <div className="bg-ink-850 p-5">
                  <span className="eyebrow text-accent">Role</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100/78">{active.role}</p>
                </div>
                <div className="bg-ink-850 p-5">
                  <span className="eyebrow text-paper-100/55">Consolidated from</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100/65">{active.absorbs}</p>
                  <div className="mt-2"><Ref s={active.ref} /></div>
                </div>
              </motion.div>
            ) : (
              <p className="pt-2 font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
                Select any pillar
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-measure text-sm leading-relaxed text-paper-100/60">
            {pillarGateNote.text} <Ref s={pillarGateNote.ref} />
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
