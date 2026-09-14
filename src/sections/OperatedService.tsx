import { Layers } from 'lucide-react'
import { QualificationEngine } from '@/interactions/QualificationEngine'
import { Note, PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { aggregation, decompositionRule, osTests } from '@/content/operatedService'

/** Chapter 03 — §2. The unit everything else depends on. */
export function OperatedService() {
  return (
    <Section id="unit" tone="dark">
      <div className="shell">
        <SectionHead
          n="03"
          kicker="Foundations · The atomic unit"
          title={<>Before anything can be measured, decide what a <span className="italic text-accent">service</span> is.</>}
          lede="Service, product, domain, workload, business service — used interchangeably, none defined. Nothing can be scored, aggregated or compared until one unit is fixed. An Operated Service is the atomic unit of production-operational accountability."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {osTests.map((t) => (
              <div key={t.id} className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xs tracking-[0.1em] text-accent">{t.id}</span>
                  <span className="text-[0.82rem] font-medium text-paper-50">{t.name}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-paper-100/60">{t.question}</p>
                <p className="mt-2 border-t rule-dark pt-2 text-[0.7rem] leading-relaxed text-paper-100/55">
                  Fails if: {t.failsIf}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-sm text-paper-100/55">
            A candidate qualifies <span className="text-paper-50">if and only if all five pass</span>. <Ref s="§2.1" />
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-14 border-t rule-dark pt-12">
            <h3 className="font-serif text-2xl text-paper-50">Test it against real shapes</h3>
            <p className="mt-2 max-w-measure text-sm leading-relaxed text-paper-100/60">
              The same technology can qualify in one estate and not another. Qualification is about
              accountability and recovery — not about what the thing is.
            </p>
            <div className="mt-8">
              <QualificationEngine />
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="eyebrow text-accent">Decomposition rule</span>
                <Ref s={decompositionRule.ref} />
              </div>
              <ol className="mt-4 space-y-3">
                {decompositionRule.steps.map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-2xs tnum text-paper-100/55">{String(s.n).padStart(2, '0')}</span>
                    <p className="text-sm leading-relaxed text-paper-100/72">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="eyebrow text-accent">Aggregation</span>
                <Ref s={aggregation.ref} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {aggregation.ladder.map((l, i) => (
                  <span key={l} className="flex items-center gap-2">
                    <span className="rounded border border-paper-100/15 bg-ink-850 px-2.5 py-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/75">
                      {l}
                    </span>
                    {i < aggregation.ladder.length - 1 && (
                      <span aria-hidden className="font-mono text-2xs text-paper-100/55">→</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Note icon={<Layers className="h-4 w-4" />}>
                  <span className="text-paper-50">{aggregation.rule}</span>{' '}
                  {aggregation.why}
                  <span className="mt-2 block text-paper-100/80">{aggregation.requirement}</span>
                </Note>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 max-w-3xl">
            <PullQuote cite="§2.2">
              Where decomposition disagrees with the organisation chart, record the mismatch as a
              finding. It is frequently the single most valuable output of discovery.
            </PullQuote>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
