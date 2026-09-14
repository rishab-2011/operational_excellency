import { claims, claimsCaveat, positioning, project } from '@/content/meta'
import { Ref, Reveal, Section, SectionHead, StatusTag } from '@/components/primitives'

/** Chapter 16 — §26. What is and is not proven, stated before anyone asks. */
export function Status() {
  return (
    <Section id="status" tone="light">
      <div className="shell">
        <SectionHead
          n="16"
          kicker="Next · Intellectual position"
          tone="light"
          title={<>What is claimed, what is conceded, what was withdrawn.</>}
          lede="Three claims survive from six in the previous version. None is proven. Each must survive formal prior-art analysis before it appears in anything client-facing — and one candidate has already been withdrawn under exactly that test."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {claims.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border p-6 ${
                  c.status === 'withdrawn'
                    ? 'border-signal-neg/30 bg-signal-neg/[0.05]'
                    : c.status === 'claim'
                      ? 'border-accent-ink/30 bg-accent-wash'
                      : 'border-ink-900/12 bg-paper-50'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusTag status={c.status} />
                  <Ref s={c.ref} tone="light" />
                </div>
                <h3
                  className={`mt-3 font-serif text-xl leading-snug ${
                    c.status === 'withdrawn' ? 'text-ink-900/62 line-through decoration-ink-900/25' : 'text-ink-900'
                  }`}
                >
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/70">{c.body}</p>
                <p className="mt-3 border-t border-ink-900/10 pt-3 text-xs leading-relaxed text-ink-900/62">
                  {c.statusNote}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 max-w-measure text-sm leading-relaxed text-ink-900/62">
            {claimsCaveat.text} <Ref s={claimsCaveat.ref} tone="light" />
          </p>
        </Reveal>

        {/* Positioning — what it is and is not */}
        <Reveal delay={0.1}>
          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-ink-900/12 bg-ink-900/10 lg:grid-cols-2">
            <div className="bg-paper-50 p-6">
              <div className="flex items-baseline gap-2">
                <span className="eyebrow text-ink-900/62">This is not</span>
                <Ref s={positioning.ref} tone="light" />
              </div>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {positioning.isNot.map((x) => (
                  <li key={x} className="chip border border-ink-900/15 text-ink-900/62 line-through decoration-ink-900/25">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-accent-wash p-6">
              <span className="eyebrow text-accent-ink">This is</span>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {positioning.is.map((x) => (
                  <li key={x} className="chip border border-accent-ink/35 text-accent-ink">{x}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-ink-900/70">{positioning.layer}</p>
            </div>
          </div>
        </Reveal>

        {/* Close */}
        <Reveal delay={0.08}>
          <div className="mt-20 border-t rule-light pt-12">
            <p className="font-serif text-[1.5rem] leading-[1.4] text-ink-900 text-balance sm:text-[2rem] max-w-4xl">
              “We are not here to replace your technology or tell your teams how to do their jobs. We
              provide a structured way to determine how effectively your production estate is being
              operated, where reliability, risk, cost and investment value are being lost, and how to
              improve those areas incrementally using the capabilities you already have — adding new
              capabilities only where the business case justifies them.{' '}
              <span className="text-accent-ink">
                We will show you where machines are acting with more authority than your evidence
                supports, and we will hand you the method so you can run it yourselves.
              </span>
              ”
            </p>
            <p className="mt-5 text-sm text-ink-900/62">
              <Ref s="§28" tone="light" />{' '}
              <span className="ml-2">
                The final clause distinguishes this from a dependency engagement.
              </span>
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="chip border border-ink-900/25 text-ink-900/70 transition-colors hover:border-accent-ink hover:text-accent-ink"
              >
                Read the full requirement ↗
              </a>
              <span className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-900/62">
                {project.version} · {project.revised}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
