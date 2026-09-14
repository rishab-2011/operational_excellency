import { MaturityMatrix } from '@/visualizations/MaturityMatrix'
import { Note, PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { authorityAnalogue, gateCriteria, riskTiers } from '@/content/authority'

/** Chapter 08 — §9. Two axes, deliberately not one ladder. */
export function Axes() {
  return (
    <Section id="axes" tone="light">
      <div className="shell">
        <SectionHead
          n="08"
          kicker="Operation · The grid"
          tone="light"
          title={<>More automation is not more mature.</>}
          lede="A single maturity ladder that ends in autonomy tells a regulated, deliberately-manual service that it has failed. Maturity is earned and should climb. Authority is granted, capped by risk, and correct at whatever level the evidence supports."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 rounded-xl bg-ink-900 p-6 text-paper-100 sm:p-9">
            <div className="mb-7 flex flex-wrap items-baseline gap-3">
              <span className="eyebrow text-accent">Move the position</span>
              <span className="text-xs text-paper-100/55">
                the diagonal is alignment — above it is a safety finding
              </span>
            </div>
            <MaturityMatrix />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="eyebrow text-accent-ink">Risk tier caps authority</span>
                <Ref s="§9.5" tone="light" />
              </div>
              <ul className="mt-4 space-y-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10">
                {riskTiers.map((t) => (
                  <li key={t.id} className="grid gap-x-4 gap-y-1.5 bg-paper-50 px-4 py-3.5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:items-baseline">
                    <span className="font-mono text-sm tnum text-accent-ink">{t.id}</span>
                    <span>
                      <span className="block text-[0.84rem] leading-snug text-ink-900/80">{t.definition}</span>
                      <span className="mt-1.5 inline-block rounded bg-ink-900/[0.06] px-2 py-0.5 font-mono text-2xs text-ink-900/65">
                        cap {t.cap}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="eyebrow text-accent-ink">Gate criteria to advance one level</span>
                <Ref s="§9.6" tone="light" />
              </div>
              <ul className="mt-4 space-y-2">
                {gateCriteria.map((g) => (
                  <li key={g.id} className="flex gap-2.5 text-sm leading-relaxed text-ink-900/72">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-ink/60" />
                    <span>
                      {g.text}
                      {'hypothesis' in g && g.hypothesis && (
                        <span className="ml-1.5 rounded bg-signal-warn-ink/15 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-signal-warn-ink">
                          hypothesis
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs italic leading-relaxed text-ink-900/62">
                All must hold. Advancement is not a schedule; it is a threshold.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <PullQuote cite="§9.4" tone="light">
              A service operating at its authorised level scores full marks. There is no penalty for
              being correctly manual.
            </PullQuote>
            <Note tone="light">
              {authorityAnalogue.note} <Ref s={authorityAnalogue.ref} tone="light" />
            </Note>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
