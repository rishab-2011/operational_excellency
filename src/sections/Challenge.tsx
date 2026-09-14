import { useState } from 'react'
import { motion } from 'framer-motion'
import { challenges } from '@/content/priorArt'
import { Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** Chapter 13 — §22 of the brief. Answers drawn only from defensible requirement material. */
export function Challenge() {
  const [sel, setSel] = useState(challenges[0].id)
  const reduced = usePrefersReducedMotion()
  const active = challenges.find((c) => c.id === sel)!

  return (
    <Section id="challenge" tone="dark">
      <div className="shell">
        <SectionHead
          n="13"
          kicker="Standing · Objections"
          title={<>Challenge the model.</>}
          lede="Every answer below comes from the requirement itself. Where the honest answer is a concession, it is a concession — and one claimed differentiator has already been withdrawn on exactly this basis."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <Reveal className="min-w-0">
            <div
              role="tablist"
              aria-label="Objections"
              aria-orientation="vertical"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 no-scrollbar"
            >
              {challenges.map((c) => {
                const on = sel === c.id
                return (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setSel(c.id)}
                    className={`shrink-0 rounded-md border px-3.5 py-2.5 text-left text-[0.84rem] leading-snug transition-all duration-200 lg:shrink lg:w-full ${
                      on
                        ? 'border-accent bg-accent-wash text-paper-50'
                        : 'border-paper-100/10 text-paper-100/65 hover:border-paper-100/28 hover:text-paper-100/90'
                    }`}
                  >
                    {c.objection}
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
                          <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                role="tabpanel"
                data-testid="challenge-panel"
                className="rounded-lg border border-paper-100/12 bg-ink-850 p-6 sm:p-8"
              >
                <h3 className="font-serif text-2xl leading-snug text-paper-50 text-balance sm:text-3xl">
                  {active.objection}
                </h3>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-paper-100/78 text-pretty measure">
                  {active.answer}
                </p>
                <div className="mt-6 border-t rule-dark pt-4">
                  <Ref s={active.ref} />
                </div>
              </motion.div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
