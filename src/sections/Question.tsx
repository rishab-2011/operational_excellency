import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, Section, SectionHead } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * Chapter 01 — the opening question.
 * Each capability states what it genuinely does well and what it does not answer.
 * The pairs seed the prior-art section rather than diminishing any of them.
 */
const capabilities = [
  { id: 'obs', label: 'Observability', solves: 'Answers what is happening, at depth.', gap: 'Not who is accountable, what is permitted, or whether recovery was real.' },
  { id: 'itsm', label: 'ITSM', solves: 'Governs process: change, incident, problem.', gap: 'Does not model what a machine may do without a human.' },
  { id: 'sre', label: 'SRE', solves: 'A strong practice model where it is adopted.', gap: 'Silent on batch, vendor-operated and legacy estate.' },
  { id: 'cloud', label: 'Cloud', solves: 'Elastic platform and provider-native reliability patterns.', gap: 'Provider-scoped, and design-time weighted.' },
  { id: 'cicd', label: 'CI/CD', solves: 'Gets change to production safely and repeatably.', gap: 'Stops at deployment, not at business recovery.' },
  { id: 'auto', label: 'Automation', solves: 'Executes procedures faster than people can.', gap: 'Capability to act is not authority to act.' },
  { id: 'platform', label: 'Platform engineering', solves: 'Paved roads, and a place service metadata already lives.', gap: 'Catalogs carry no risk tier and no authority grant.' },
  { id: 'runbook', label: 'Runbooks', solves: 'Captures the response a service needs.', gap: 'Decays silently against a system that has moved.' },
  { id: 'catalog', label: 'Service catalogs', solves: 'Records what exists and who owns it.', gap: 'A record with no freshness is a historical document.' },
  { id: 'aiops', label: 'AIOps', solves: 'Correlation and noise reduction at signal scale.', gap: 'Underperforms in proportion to context staleness.' },
  { id: 'agents', label: 'AI agents', solves: 'Can increasingly perform the operational action itself.', gap: 'Being able to act says nothing about being permitted to.' },
]

export function Question() {
  // Pre-selected so the pattern is legible immediately and no dead space appears.
  const [sel, setSel] = useState('agents')
  const reduced = usePrefersReducedMotion()
  const active = capabilities.find((c) => c.id === sel)!

  return (
    <Section id="question" tone="dark">
      <div className="shell">
        <SectionHead
          n="01"
          kicker="The question"
          title={<>Enterprises already own nearly all of this.</>}
          lede="Observability, ITSM, SRE, cloud, CI/CD, automation, platform engineering, runbooks, service catalogs, AIOps — and increasingly, agents that can act. Each is good at what it was built for."
        />

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Existing capabilities">
            {capabilities.map((c) => {
              const on = sel === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSel(c.id)}
                  className={`chip border py-2 ${
                    on
                      ? 'border-accent bg-accent-wash text-accent'
                      : 'border-paper-100/15 text-paper-100/60 hover:border-paper-100/35 hover:text-paper-100/90'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-6">
          <motion.div
            key={active.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-px overflow-hidden rounded-lg border border-paper-100/12 bg-paper-100/12 sm:grid-cols-2"
          >
            <div className="bg-ink-850 p-5 sm:p-6">
              <span className="eyebrow text-signal-pos">What it solves well</span>
              <p className="mt-2.5 text-sm leading-relaxed text-paper-100/80">{active.solves}</p>
            </div>
            <div className="bg-ink-850 p-5 sm:p-6">
              <span className="eyebrow text-accent">What it does not answer</span>
              <p className="mt-2.5 text-sm leading-relaxed text-paper-100/80">{active.gap}</p>
            </div>
          </motion.div>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 border-t rule-dark pt-10 sm:mt-20">
            <p className="font-serif text-[1.6rem] leading-[1.35] text-paper-50 text-balance sm:text-[2.2rem] measure">
              So why does production operations still fragment?
            </p>
            <p className="mt-5 max-w-measure text-[0.95rem] leading-relaxed text-paper-100/60">
              Not because any of these are poor. Because nothing above them states, for a given
              service, who is accountable, what good means, how far failure travels, what a machine
              is permitted to do without a human — and on what evidence that permission rests.
              The gap is not tooling. It is the operating model that should govern the tooling.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
