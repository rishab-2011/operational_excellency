import { CausalGraph } from '@/visualizations/CausalGraph'
import { Reveal, Section, SectionHead } from '@/components/primitives'

/** Chapter 02 — §3 causal taxonomy. v0.1's flat list of 25 is deliberately not reproduced. */
export function Problem() {
  return (
    <Section id="problem" tone="light">
      <div className="shell">
        <SectionHead
          n="02"
          kicker="Diagnosis"
          tone="light"
          title={<>The problem is not a list. It is a chain.</>}
          lede="Most operational problem statements mix root causes, mechanisms, symptoms and business outcomes as if they were peers. That guarantees the same benefit is counted several times over. Structuring them causally is what makes a value model defensible."
        />

        <Reveal delay={0.08}>
          <div className="mt-12">
            <CausalGraph />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
