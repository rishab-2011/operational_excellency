import { ClaimBuilder } from '@/interactions/ClaimBuilder'
import { PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { metricFamilies } from '@/content/evidence'
import { taxonomy } from '@/content/taxonomy'

/** Chapter 10 — §14 and §3.1. No invented ROI, no percentages. */
export function Value() {
  return (
    <Section id="value" tone="light">
      <div className="shell">
        <SectionHead
          n="10"
          kicker="Discipline · Value"
          tone="light"
          title={<>Two constraints, and a benefit must satisfy both.</>}
          lede="A claim must trace exactly one path from root cause through one named mechanism to one business outcome — and it may only be stated as strongly as the estate's measurement supports. Nothing on this page invents a figure."
        />

        <Reveal delay={0.08}>
          <div className="mt-12">
            <ClaimBuilder />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent-ink">Metric families available for attribution</span>
              <Ref s="§14" tone="light" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {metricFamilies.map((f) => {
                const o = taxonomy.find((n) => n.id === f.outcome)
                return (
                  <div key={f.id} className="rounded-lg border border-ink-900/12 bg-paper-50 px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[0.84rem] font-medium text-ink-900">{f.label}</span>
                      <Ref s={f.ref} tone="light" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-900/62">
                      Typically attributed to <span className="text-accent-ink">{o?.label}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-14 max-w-3xl">
            <PullQuote cite="§14.10" tone="light">
              Every metric is reported as baseline, observed, target, estimated value and realised
              value — each carrying its measurement tier and evidence grade. Unsupported ROI claims
              are prohibited.
            </PullQuote>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
