import { useState } from 'react'
import { motion } from 'framer-motion'
import { noveltyPosition, priorArt } from '@/content/priorArt'
import { doraHazard } from '@/content/priorArt'
import { Note, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** Chapter 12 — §18. Never a comparison table where one column wins everything. */
export function PriorArt() {
  const [open, setOpen] = useState<string | null>('mapek')
  const reduced = usePrefersReducedMotion()

  return (
    <Section id="priorart" tone="light">
      <div className="shell">
        <SectionHead
          n="12"
          kicker="Standing · Relation to existing practice"
          tone="light"
          title={<>Beside these, not against them.</>}
          lede="Each of these solves something genuinely well, and several are direct prior art for parts of this framework. Where that is true, the requirement concedes it rather than renaming the idea. The credibility of the whole project depends on that."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-lg border border-ink-900/12">
            {priorArt.map((p, i) => {
              const isOpen = open === p.id
              return (
                <div key={p.id} className={i > 0 ? 'border-t border-ink-900/10' : ''}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    className={`flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
                      isOpen ? 'bg-accent-wash' : 'bg-paper-50 hover:bg-paper-200/50'
                    }`}
                  >
                    <span className="flex flex-wrap items-baseline gap-2.5">
                      <span className={`font-serif text-lg ${isOpen ? 'text-ink-900' : 'text-ink-900/85'}`}>
                        {p.name}
                      </span>
                      <span className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-900/62">
                        {p.category}
                      </span>
                    </span>
                    <span className="font-mono text-2xs text-ink-900/62">{isOpen ? '−' : '+'}</span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-px bg-ink-900/10 sm:grid-cols-2">
                      <div className="bg-paper-50 p-5">
                        <span className="eyebrow text-signal-pos-ink">What it already solves well</span>
                        <p className="mt-2 text-sm leading-relaxed text-ink-900/72">{p.solvesWell}</p>
                      </div>
                      <div className="bg-paper-50 p-5">
                        <span className="eyebrow text-accent-ink">What this framework binds or extends</span>
                        <p className="mt-2 text-sm leading-relaxed text-ink-900/72">{p.epofBinds}</p>
                        <div className="mt-2"><Ref s={p.ref} tone="light" /></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-lg border border-accent-ink/25 bg-accent-wash p-6">
              <div className="flex items-baseline gap-2">
                <span className="eyebrow text-accent-ink">What is genuinely new</span>
                <Ref s={noveltyPosition.ref} tone="light" />
              </div>
              <ul className="mt-3.5 space-y-2.5">
                {noveltyPosition.new.map((n) => (
                  <li key={n} className="flex gap-2.5 text-sm leading-relaxed text-ink-900/78">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-ink" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-lg border border-ink-900/12 bg-paper-200/40 p-6">
              <span className="eyebrow text-ink-900/62">What is synthesis</span>
              <p className="mt-3.5 text-sm leading-relaxed text-ink-900/70">{noveltyPosition.synthesis}</p>
              <p className="mt-4 border-t rule-light pt-3.5 text-sm italic leading-relaxed text-ink-900/62">
                Stated openly. Where research shows a component is an existing concept with a new
                name, the requirement obliges it to be changed or dropped — and that test is re-run
                at every version gate.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className="mt-8 max-w-3xl">
            <Note tone="light">
              <span className="font-medium text-ink-900">Naming hazard.</span> {doraHazard.text}{' '}
              <Ref s={doraHazard.ref} tone="light" />
            </Note>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
