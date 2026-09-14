import { LoopDiagram } from '@/visualizations/LoopDiagram'
import { Note, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { loopDepartures, loopPriorArt } from '@/content/loop'

/** Chapter 06 — §6. MAPE-K acknowledged before anything is claimed. */
export function Loop() {
  return (
    <Section id="loop" tone="light">
      <div className="shell">
        <SectionHead
          n="06"
          kicker="Operation · The loop"
          tone="light"
          title={<>This loop is not new. What governs it is.</>}
          lede="The stages are substantially MAPE-K — IBM's autonomic computing control loop, published in 2001 and architected in 2003, for exactly this problem. The requirement states this plainly rather than claiming the stages as original."
        />

        <Reveal delay={0.08}>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div className="rounded-lg border border-ink-900/12 bg-paper-200/40 p-6">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="eyebrow text-ink-900/62">Prior art, stated plainly</span>
                <Ref s={loopPriorArt.ref} tone="light" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/72 text-pretty">{loopPriorArt.statement}</p>
              <p className="mt-3 border-t rule-light pt-3 text-sm italic leading-relaxed text-ink-900/62">
                {loopPriorArt.consequence}
              </p>
            </div>

            <div className="rounded-lg border border-accent-ink/25 bg-accent-wash p-6">
              <span className="eyebrow text-accent-ink">What is actually ours</span>
              <ol className="mt-3.5 space-y-3.5">
                {loopDepartures.map((d) => (
                  <li key={d.n}>
                    <div className="flex gap-2.5">
                      <span className="mt-0.5 font-mono text-2xs tnum text-accent-ink">
                        {String(d.n).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-[0.84rem] font-medium leading-snug text-ink-900">{d.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-900/65">{d.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Diagram on dark ground inside the light section — the chapter's focal object. */}
        <Reveal delay={0.1}>
          <div className="mt-14 rounded-xl bg-ink-900 p-6 text-paper-100 sm:p-9">
            <div className="mb-8 flex flex-wrap items-baseline gap-3">
              <span className="eyebrow text-accent">Select any stage</span>
              <span className="text-xs text-paper-100/55">
                purpose, input, evidence, responsibility, output
              </span>
            </div>
            <LoopDiagram />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 max-w-3xl">
            <Note tone="light">
              Splitting the loops is itself a correction. v0.1 mixed a real-time control loop with a
              periodic improvement loop, which made both harder to operationalise. <Ref s="§6.3" tone="light" />
            </Note>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
