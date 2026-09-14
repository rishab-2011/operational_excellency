import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { boundaries, deliverySchedule, lifecycle, thinSlice, transferPoint } from '@/content/meta'
import { Note, PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** Chapter 15 — §22.1 lifecycle, §22.2 transfer, §20 schedule, §19 boundaries. */
export function Path() {
  const [sel, setSel] = useState('discover')
  const reduced = usePrefersReducedMotion()
  const stage = lifecycle.find((s) => s.id === sel)!

  return (
    <Section id="path" tone="dark">
      <div className="shell">
        <SectionHead
          n="15"
          kicker="Next · Validation"
          title={<>The next step is not a purchase. It is a test.</>}
          lede="The framework is a requirement at v0.2, not a finished asset. The credible next move is a thin vertical slice against a small, real set of Operated Services — using tools you already own, with a measured baseline established before anything is promised."
        />

        {/* Lifecycle */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Engagement lifecycle</span>
              <Ref s="§22.1" />
            </div>
            <div
              role="tablist"
              aria-label="Lifecycle stages"
              className="mt-4 flex flex-wrap gap-1.5"
            >
              {lifecycle.map((s, i) => {
                const on = sel === s.id
                return (
                  <span key={s.id} className="flex items-center gap-1.5">
                    <button
                      role="tab"
                      aria-selected={on}
                      onClick={() => setSel(s.id)}
                      className={`chip border ${
                        on
                          ? 'border-accent bg-accent-wash text-accent'
                          : s.isNew
                            ? 'border-accent/35 text-paper-100/70 hover:border-accent/60'
                            : 'border-paper-100/15 text-paper-100/60 hover:border-paper-100/35'
                      }`}
                    >
                      <span className="tnum text-paper-100/55">{String(i + 1).padStart(2, '0')}</span>
                      {s.name}
                    </button>
                    {i < lifecycle.length - 1 && (
                      <span aria-hidden className="font-mono text-2xs text-paper-100/55">→</span>
                    )}
                  </span>
                )
              })}
            </div>

            <motion.div
              key={stage.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 rounded-lg border border-paper-100/12 bg-ink-850 p-5"
            >
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h4 className="font-serif text-xl text-paper-50">{stage.name}</h4>
                {stage.isNew && <span className="chip border-accent/50 text-accent">new in v0.2</span>}
                <Ref s={stage.ref} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-paper-100/75">{stage.content}</p>
            </motion.div>
          </div>
        </Reveal>

        {/* Transfer point */}
        <Reveal delay={0.08}>
          <div className="mt-14 rounded-xl border border-accent/30 bg-accent-wash p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Capability transfer point</span>
              <Ref s={transferPoint.ref} />
            </div>
            <p className="mt-3 max-w-measure text-sm italic leading-relaxed text-paper-100/65">
              {transferPoint.intro}
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {transferPoint.commitments.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                  <span className="text-sm leading-relaxed text-paper-100/80">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-accent/20 pt-4 font-serif text-[1.05rem] leading-snug text-paper-50">
              {transferPoint.after}
            </p>
          </div>
        </Reveal>

        {/* Schedule */}
        <Reveal delay={0.08}>
          <div className="mt-14">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Version gates</span>
              <Ref s="§20" />
            </div>
            <ol className="mt-4 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
              {deliverySchedule.map((v) => (
                <li
                  key={v.version}
                  className={`grid gap-x-5 gap-y-1.5 px-4 py-4 sm:grid-cols-[auto_auto_minmax(0,1.3fr)_minmax(0,1fr)] ${
                    v.done ? 'bg-accent-wash/40' : 'bg-ink-850'
                  }`}
                >
                  <span className={`font-mono text-sm tnum ${v.done ? 'text-accent' : 'text-paper-100/70'}`}>
                    {v.version}
                  </span>
                  <span className="font-mono text-2xs tnum text-paper-100/55 sm:w-16">
                    {v.weeks === '—' ? '—' : `${v.weeks} wks`}
                  </span>
                  <span className="text-[0.82rem] leading-relaxed text-paper-100/75">{v.contents}</span>
                  <span className={`text-xs leading-relaxed ${v.done ? 'text-accent' : 'text-paper-100/55'}`}>
                    {v.done ? '✓ ' : 'Gate: '}
                    {v.gate}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 max-w-3xl">
            <PullQuote cite={thinSlice.ref}>{thinSlice.text}</PullQuote>
          </div>
        </Reveal>

        {/* Boundaries */}
        <Reveal delay={0.08}>
          <div className="mt-16 border-t rule-dark pt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Where this does not apply</span>
              <Ref s="§19" />
            </div>
            <p className="mt-2.5 max-w-measure text-sm leading-relaxed text-paper-100/60">
              A framework that claims universal fit reads as sales material. Naming its limits costs
              little and buys a great deal.
            </p>
            <ul className="mt-6 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
              {boundaries.map((b) => (
                <li key={b.condition} className="grid gap-x-5 gap-y-1 bg-ink-850 px-4 py-3.5 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
                  <span className="text-[0.84rem] font-medium text-paper-50">{b.condition}</span>
                  <span className="text-[0.82rem] leading-relaxed text-paper-100/65">{b.position}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Note>
                The framework is designed to be run by the organisation that owns the estate. If it
                cannot be handed over, it has not worked.
              </Note>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
