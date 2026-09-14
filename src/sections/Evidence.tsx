import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import {
  evidenceGrades, evidenceRules, evidenceStandingExample,
  measurementReadinessDeliverable, measurementRule, measurementTiers, mttrPosition,
} from '@/content/evidence'
import { usePrefersReducedMotion } from '@/hooks'

/** Chapter 09 — §11 and §12. T1 is strongest; E1 is strongest. Ordering is load-bearing. */
export function Evidence() {
  const [tier, setTier] = useState(0)
  const reduced = usePrefersReducedMotion()
  const active = measurementTiers[tier]

  return (
    <Section id="evidence" tone="dark">
      <div className="shell">
        <SectionHead
          n="09"
          kicker="Discipline · What may be claimed"
          title={<>A transformation cannot claim precision the estate cannot measure.</>}
          lede="Most operating models demand measured baselines from estates they have just described as fragmented and tribal. If toil hours and alert quality cannot be measured today, establishing the baseline is itself a project — one the framework must own and cost rather than assume away."
        />

        {/* Measurement readiness */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Measurement readiness</span>
              <Ref s="§11.1" />
              <span className="ml-1 text-xs text-paper-100/55">T1 is the strongest tier</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Measurement tiers">
              {measurementTiers.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === tier}
                  onClick={() => setTier(i)}
                  className={`flex-1 min-w-[10rem] rounded-md border px-4 py-3 text-left transition-all duration-200 ${
                    i === tier ? 'border-accent bg-accent-wash' : 'border-paper-100/12 hover:border-paper-100/30'
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className={`font-mono text-sm tnum ${i === tier ? 'text-accent' : 'text-paper-100/55'}`}>
                      {t.id}
                    </span>
                    <span className={`font-serif text-lg ${i === tier ? 'text-paper-50' : 'text-paper-100/75'}`}>
                      {t.name}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-paper-100/55">{t.meaning}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 grid gap-px overflow-hidden rounded-lg border border-paper-100/12 bg-paper-100/10 sm:grid-cols-2"
            >
              <div className="bg-ink-850 p-5">
                <span className="eyebrow text-paper-100/55">How it is obtained</span>
                <p className="mt-2 text-sm leading-relaxed text-paper-100/75">{active.method}</p>
              </div>
              <div className="bg-ink-850 p-5">
                <span className="eyebrow text-accent">What may be claimed from it</span>
                <p className="mt-2 text-sm leading-relaxed text-paper-100/85">{active.canClaim}</p>
              </div>
            </motion.div>

            <div className="mt-4 rounded-lg border border-accent/30 bg-accent-wash p-5">
              <span className="eyebrow text-accent">The binding rule</span>
              <p className="mt-2 font-serif text-[1.05rem] leading-relaxed text-paper-50 text-pretty">
                {measurementRule.rule}
              </p>
              <div className="mt-2"><Ref s={measurementRule.ref} /></div>
            </div>
          </div>
        </Reveal>

        {/* Evidence grades */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-t rule-dark pt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Evidence grades</span>
              <Ref s="§12.1" />
              <span className="ml-1 text-xs text-paper-100/55">E1 is the strongest grade</span>
            </div>

            <ol className="mt-5 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
              {evidenceGrades.map((g) => (
                <li key={g.id} className="grid gap-x-5 gap-y-1.5 bg-ink-850 px-4 py-3.5 sm:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1fr)] sm:items-baseline">
                  <span className={`font-mono text-sm tnum ${g.rank === 1 ? 'text-accent' : 'text-paper-100/55'}`}>
                    {g.id}
                  </span>
                  <span className="text-[0.84rem] leading-relaxed text-paper-100/80">{g.source}</span>
                  <span className={`text-xs leading-relaxed ${g.rank === 4 ? 'text-signal-neg' : 'text-paper-100/55'}`}>
                    {g.usable}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                <span className="eyebrow text-paper-100/55">The rules</span>
                <ol className="mt-3 space-y-2.5">
                  {evidenceRules.map((r) => (
                    <li key={r.n} className="flex gap-2.5 text-sm leading-relaxed text-paper-100/72">
                      <span className="mt-0.5 font-mono text-2xs tnum text-paper-100/55">
                        {String(r.n).padStart(2, '0')}
                      </span>
                      <span>{r.text} <Ref s={r.ref} /></span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                  <span className="eyebrow text-accent">{measurementReadinessDeliverable.title}</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100/72">{measurementReadinessDeliverable.body}</p>
                  <p className="mt-2.5 border-t rule-dark pt-2.5 text-sm italic leading-relaxed text-paper-100/60">
                    {measurementReadinessDeliverable.why}
                  </p>
                  <div className="mt-2"><Ref s={measurementReadinessDeliverable.ref} /></div>
                </div>
                <div className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                  <span className="eyebrow text-paper-100/55">Standing prohibition</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100/78">{evidenceStandingExample.text}</p>
                  <p className="mt-2 text-xs leading-relaxed text-paper-100/55">{evidenceStandingExample.origin}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* MTTR correction — a practitioner-credibility item. */}
        <Reveal delay={0.08}>
          <div className="mt-16 border-t rule-dark pt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-signal-neg">Removed from the metric set</span>
              <Ref s={mttrPosition.ref} />
            </div>
            <h3 className="mt-3 font-serif text-2xl text-paper-50 text-balance">{mttrPosition.rejected}</h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div>
                <p className="text-sm leading-relaxed text-paper-100/70">{mttrPosition.why}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper-100/60">{mttrPosition.cost}</p>
              </div>
              <ul className="space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
                {mttrPosition.replacements.map((r) => (
                  <li key={r.label} className="bg-ink-850 px-4 py-3">
                    <span className="text-[0.82rem] font-medium text-paper-50">{r.label}</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-paper-100/58">{r.def}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
