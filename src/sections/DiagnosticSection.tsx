import { Diagnostic } from '@/interactions/Diagnostic'
import { Reveal, Section, SectionHead } from '@/components/primitives'

/** Chapter 14 — §21. Bands, not fake precision. */
export function DiagnosticSection() {
  return (
    <Section id="diagnostic" tone="light">
      <div className="shell">
        <SectionHead
          n="14"
          kicker="Standing · Exploratory diagnostic"
          tone="light"
          title={<>Where might your estate stand?</>}
          lede="Fifteen questions drawn from the framework's own requirements. It produces a band and a transparent score, never a maturity number — a real assessment requires evidence, and this collects none."
        />
        <Reveal delay={0.08}>
          <div className="mt-12">
            <Diagnostic />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
