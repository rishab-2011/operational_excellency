import { ContractExplorer } from '@/interactions/ContractExplorer'
import { Disclosure, PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { contractClaim, contractPriorArt, instantiationFindings } from '@/content/contract'

/** Chapter 04 — §7 and §10. */
export function Contract() {
  return (
    <Section id="contract" tone="light">
      <div className="shell">
        <SectionHead
          n="04"
          kicker="Foundations · The governed artefact"
          tone="light"
          title={<>An operating constitution for one service.</>}
          lede="Most of what a contract holds already exists somewhere — in a catalog, an SLO, a runbook, a readiness review. What does not exist anywhere is the binding of those to risk, blast radius and machine authority in one governed, versioned artefact."
        />

        {/* The intellectual distinction, stated as a progression. */}
        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {contractClaim.contrast.map((c, i) => {
              const last = i === contractClaim.contrast.length - 1
              return (
                <div key={c.what} className={`p-5 ${last ? 'bg-accent-wash' : 'bg-paper-50'}`}>
                  <span className={`eyebrow ${last ? 'text-accent-ink' : 'text-ink-900/62'}`}>
                    {last ? 'The addition' : `Exists already`}
                  </span>
                  <h4 className={`mt-2 font-serif text-lg ${last ? 'text-ink-900' : 'text-ink-900/85'}`}>{c.what}</h4>
                  <p className={`mt-1.5 text-sm leading-relaxed ${last ? 'text-ink-900/80' : 'text-ink-900/62'}`}>
                    says {c.says}.
                  </p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 max-w-3xl">
            <PullQuote cite={contractClaim.ref} tone="light">
              {contractClaim.claim}
            </PullQuote>
            <p className="mt-4 pl-6 text-sm leading-relaxed text-ink-900/62">{contractClaim.caveat}</p>
          </div>
        </Reveal>

        {/* Prior art, elegantly but unmistakably acknowledged. */}
        <Reveal delay={0.12}>
          <div className="mt-12 rounded-lg border border-ink-900/12 bg-paper-200/40 p-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-ink-900/62">Conceded to prior art</span>
              <Ref s="§7.1" tone="light" />
            </div>
            <p className="mt-2 max-w-measure text-sm leading-relaxed text-ink-900/65">
              Most of the contract's content is not new, and the requirement says so rather than
              implying otherwise.
            </p>
            <div className="mt-4">
              {contractPriorArt.map((p) => (
                <Disclosure key={p.area} tone="light" summary={p.area}>
                  {p.art}
                </Disclosure>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Worked instantiations — rendered dark for contrast inside a light section. */}
        <Reveal delay={0.08}>
          <div className="mt-16 rounded-xl bg-ink-900 p-6 text-paper-100 sm:p-9">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="eyebrow text-accent">Three worked instantiations</span>
              <Ref s="§10" />
            </div>
            <h3 className="mt-3 font-serif text-2xl text-paper-50 sm:text-3xl text-balance">
              Writing them by hand broke the schema. That was the point.
            </h3>
            <p className="mt-3 max-w-measure text-sm leading-relaxed text-paper-100/62">
              A single rigid schema does not survive a real estate. Switch profile and watch the
              three highlighted areas change — Outcomes, Health and Recovery. Everything else held.
            </p>
            <div className="mt-8">
              <ContractExplorer />
            </div>

            <div className="mt-10 border-t rule-dark pt-8">
              <span className="eyebrow text-accent">Findings</span>
              <ol className="mt-4 grid gap-4 sm:grid-cols-2">
                {instantiationFindings.map((f) => (
                  <li key={f.n} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-2xs tnum text-paper-100/55">
                      {String(f.n).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-paper-100/72">{f.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
