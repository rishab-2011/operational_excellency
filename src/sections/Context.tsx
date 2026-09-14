import { ContextDecay } from '@/visualizations/ContextDecay'
import { PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { contextGates, contextMeasures, contextPipeline, contextPosition, contextProperties } from '@/content/context'

/** Chapter 05 — §8. Treated as first-class; the strongest unclaimed differentiator. */
export function Context() {
  return (
    <Section id="context" tone="dark">
      <div className="shell">
        <SectionHead
          n="05"
          kicker="Foundations · The substrate"
          title={<>Having context is not the same as <span className="italic text-accent">trusting</span> it.</>}
          lede={contextPosition.why}
        />

        <Reveal delay={0.08}>
          <div className="mt-10 max-w-3xl">
            <PullQuote cite={contextPosition.ref}>{contextPosition.statement}</PullQuote>
          </div>
        </Reveal>

        {/* Pipeline */}
        <Reveal delay={0.1}>
          <div className="mt-14">
            <span className="eyebrow text-paper-100/55">From source to operational use</span>
            <ol className="mt-4 flex flex-wrap items-stretch gap-2">
              {contextPipeline.map((p, i) => (
                <li key={p.id} className="flex items-center gap-2">
                  <div
                    className={`rounded-md border px-3.5 py-2.5 ${
                      p.exact ? 'border-paper-100/15 bg-ink-850' : 'border-dashed border-paper-100/20 bg-ink-850/50'
                    }`}
                  >
                    <span className="block font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/80">
                      {p.label}
                    </span>
                    {!p.exact && (
                      <span className="mt-0.5 block font-mono text-[0.6rem] text-paper-100/55">derived reading</span>
                    )}
                  </div>
                  {i < contextPipeline.length - 1 && (
                    <span aria-hidden className="font-mono text-2xs text-paper-100/55">→</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-paper-100/55">
              Provenance, freshness and decay are stated in the requirement. <span className="text-paper-100/60">Confidence</span> is
              not a requirement term — it is shown as a derived reading of provenance × freshness.
            </p>
          </div>
        </Reveal>

        {/* Three engineered properties */}
        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {contextProperties.map((p, i) => (
              <div key={p.id} className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xs tnum text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="font-serif text-lg text-paper-50">{p.name}</h4>
                  <Ref s={p.ref} />
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-paper-100/68">{p.requirement}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Decay simulation, on light ground for legibility of the bars */}
        <Reveal delay={0.1}>
          <div className="mt-14 rounded-xl bg-paper-100 p-6 text-ink-900 sm:p-9">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="eyebrow text-accent-ink">Watch it decay</span>
              <Ref s="§8.2 · §8.4" tone="light" />
            </div>
            <h3 className="mt-3 font-serif text-2xl text-ink-900 sm:text-3xl text-balance">
              Every fact has a shelf life. Move time forward.
            </h3>
            <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-900/65">
              An expired fact is rendered stale, never silently trusted. Watch what stops being
              permitted as the estate's knowledge ages — automation authority falls out first.
            </p>
            <div className="mt-8">
              <ContextDecay />
            </div>
          </div>
        </Reveal>

        {/* Measures + gate */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <Reveal>
            <div>
              <span className="eyebrow text-accent">What gets measured</span>
              <ul className="mt-4 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
                {contextMeasures.map((m) => (
                  <li key={m.id} className="bg-ink-850 px-4 py-3.5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[0.84rem] font-medium text-paper-50">{m.label}</span>
                      <Ref s={m.ref} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-paper-100/60">{m.def}</p>
                    {'note' in m && m.note && (
                      <p className="mt-1.5 text-xs leading-relaxed text-accent">{m.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border border-accent/30 bg-accent-wash p-5">
              <div className="flex items-baseline gap-2">
                <span className="eyebrow text-accent">A gate, not a pillar</span>
                <Ref s={contextGates.ref} />
              </div>
              <ul className="mt-3 space-y-2.5">
                {contextGates.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-paper-100/78">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-accent/20 pt-3 font-serif text-[1.05rem] leading-snug text-paper-50">
                {contextGates.conclusion}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
