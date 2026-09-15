import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import { Screen } from '@/app/AppShell'
import { Badge, FindingRow, Panel, SampleNotice, Stat } from '@/components/product'
import { MasterArchitecture } from '@/visualizations/MasterArchitecture'
import { MethodLifecycle } from '@/visualizations/MethodLifecycle'
import { IncidentWalkthrough } from '@/visualizations/IncidentWalkthrough'
import { concepts, nonReplacement, problem } from '@/content/home'
import { FINDING_META, estate, estateSummary } from '@/data/estate'
import { useInView, usePrefersReducedMotion } from '@/hooks'

type Nav = (a: string, v?: string | null) => void

/**
 * The operating hierarchy, stated in plain language. The architecture diagram below
 * renders the same chain using the framework's defined terms.
 */
const HIERARCHY = [
  { label: 'Operated Service', note: 'the unit' },
  { label: 'Operational Contract + trusted context', note: 'what is promised and known', substrate: true },
  { label: 'Operate', note: 'sense · understand · decide' },
  { label: 'Govern', note: 'authority gate' },
  { label: 'Validate', note: 'did it recover' },
  { label: 'Improve', note: 'revise the contract' },
]

const AREAS = [
  { area: 'operating-model', title: 'Operating Model', body: 'The unit, its contract, the context it depends on, and the service register.' },
  { area: 'authority', title: 'Authority', body: 'What automation may do without human approval, and the estate’s current position.' },
  { area: 'value', title: 'Value', body: 'How improvement is attributed, and what the estate can credibly measure.' },
]

/**
 * Home reads pain → cause → method → example → framework → proof.
 *
 * A first-time reader should be able to say what problem this addresses, what it does
 * to an organisation, how it helps during a real operational problem, that it is not
 * limited to incident reduction, and that it replaces none of their existing tooling —
 * without opening another area.
 */
export function Overview({ navigate }: { navigate: Nav }) {
  const s = estateSummary()
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()

  const topFindings = estate
    .flatMap((svc) => svc.findings.map((f) => ({ ...f, svc: svc.name })))
    .sort((a, b) => (FINDING_META[a.kind].severity === 'high' ? -1 : 1) - (FINDING_META[b.kind].severity === 'high' ? -1 : 1))
    .slice(0, 4)

  return (
    <>
      {/* Landing band — the one place that stays deliberately composed. */}
      <section className="surface-deep relative overflow-hidden border-b border-paper-100/10">
        <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-[0.45]" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[8%] -top-[40%] h-[60vh] w-[60vh] rounded-full opacity-[0.18] blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(200,127,67,0.55) 0%, transparent 68%)' }}
        />
        <div className="shell relative py-16 sm:py-20 lg:py-24">
          <motion.div
            ref={ref}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <Badge tone="accent">Enterprise production operations</Badge>
            <h1 className="mt-5 font-serif text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.04] tracking-[-0.03em] text-paper-50 text-balance">
              A consistent operating standard for production services.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-paper-100/75">
              Enterprises already have observability, ITSM, SRE, platform engineering, CI/CD,
              automation and increasingly AI capabilities. What is usually missing is a consistent
              way of running each production service — so this defines how those capabilities work
              together around the service itself, and how that improves over time.
            </p>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-paper-100/62">
              Including clear boundaries for what automation may do without human approval.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('operating-model')}
                className="group inline-flex items-center gap-2 rounded-md border border-accent bg-accent-wash px-4 py-2.5 text-[0.88rem] text-paper-50 transition-colors hover:bg-accent/20"
              >
                Open the operating model
                <ArrowRight aria-hidden className="h-3.5 w-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('evidence', 'objections')}
                className="rounded-md border border-paper-100/20 px-4 py-2.5 text-[0.88rem] text-paper-100/80 transition-colors hover:border-paper-100/40"
              >
                Why an enterprise would say no
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Screen>
        {/* 1 ─ Why this exists */}
        <Movement n="01" title="Why this exists">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
            <Panel title="The capabilities are already there">
              <div className="flex flex-wrap gap-1.5">
                {problem.alreadyHave.map((c) => (
                  <Badge key={c} tone="neutral">{c}</Badge>
                ))}
              </div>
              <p className="mt-5 max-w-measure text-[0.92rem] leading-relaxed text-paper-100/78">
                {problem.cause}
              </p>
            </Panel>

            <Panel title="What that contributes to" dense>
              <p className="px-4 pt-3.5 text-[0.88rem] leading-relaxed text-paper-100/72">
                {problem.consequenceIntro}
              </p>
              <ul className="flex flex-wrap gap-1.5 px-4 pb-4 pt-3">
                {problem.consequences.map((c) => (
                  <li key={c}>
                    <span className="inline-flex rounded border border-signal-neg/30 bg-signal-neg/[0.07] px-2 py-0.5 text-[0.76rem] text-paper-100/82">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </Movement>

        {/* 2 ─ What the framework does */}
        <Movement
          n="02"
          title="What the framework actually does"
          lede="It is an improvement method applied to how production services are operated. Seven steps, run continuously rather than delivered once."
        >
          <Panel title="Method">
            <MethodLifecycle />
          </Panel>
        </Movement>

        {/* 3 ─ One practical example */}
        <Movement
          n="03"
          title="What that looks like in practice"
          lede="One operational sequence, end to end. The tag beside each step names the part of the model that answers it."
        >
          <Panel title="Example — a production signal arrives">
            <IncidentWalkthrough />
          </Panel>
        </Movement>

        {/* 4 ─ How the framework is structured */}
        <Movement
          n="04"
          title="How the framework is structured"
          lede="Each part exists to answer a question the sequence above raises."
        >
          <div className="space-y-4">
            <Panel title="The parts, as questions" dense>
              <ul>
                {concepts.map((c) => (
                  <li key={c.term}>
                    <button
                      type="button"
                      onClick={() => navigate(c.area, c.view ?? null)}
                      className="group grid w-full gap-x-5 gap-y-1 border-b border-paper-100/8 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-100/[0.035] sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <span className="text-[0.88rem] text-paper-50">{c.term}</span>
                      <span className="text-[0.86rem] leading-snug text-paper-100/72">{c.question}</span>
                      <ArrowRight
                        aria-hidden
                        className="hidden h-3.5 w-3.5 text-paper-100/30 transition-colors group-hover:text-accent sm:block"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="How a service is operated">
              <ol className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2">
                {HIERARCHY.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-2">
                    <span
                      className={`rounded-md border px-3 py-2 ${
                        step.substrate ? 'border-accent/40 bg-accent-wash' : 'border-paper-100/15 bg-ink-800/60'
                      }`}
                    >
                      <span className={`block text-[0.84rem] ${step.substrate ? 'text-accent' : 'text-paper-50'}`}>
                        {step.label}
                      </span>
                      <span className="mt-0.5 block font-mono text-2xs uppercase tracking-[0.1em] text-paper-100/62">
                        {step.note}
                      </span>
                    </span>
                    {i < HIERARCHY.length - 1 && (
                      <span aria-hidden className="font-mono text-2xs text-paper-100/55">→</span>
                    )}
                  </li>
                ))}
              </ol>
              <MasterArchitecture compact />
            </Panel>
          </div>
        </Movement>

        {/* 5 ─ What this does not replace */}
        <Movement n="05" title="What this does not replace">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            <Panel title="Position" tone="accent">
              <p className="max-w-measure text-[0.95rem] leading-relaxed text-paper-100/85">
                {nonReplacement.statement}
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {nonReplacement.premises.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[0.85rem] leading-relaxed text-paper-100/80">
                    <X aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-neg" strokeWidth={2.5} />
                    {p}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="What it may help reduce" dense>
              <p className="px-4 pt-3.5 text-[0.88rem] leading-relaxed text-paper-100/72">
                {nonReplacement.wasteIntro}
              </p>
              <ul className="grid gap-1.5 px-4 pb-3.5 pt-3">
                {nonReplacement.waste.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-[0.84rem] leading-relaxed text-paper-100/82">
                    <Check aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-pos" strokeWidth={2.5} />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="border-t border-paper-100/10 px-4 py-3 text-[0.82rem] leading-relaxed text-paper-100/68">
                {nonReplacement.caveat}
              </p>
            </Panel>
          </div>
        </Movement>

        {/* 6 ─ The product itself */}
        <Movement
          n="06"
          title="Working with it"
          lede="The areas below hold the model, the estate and the evidence. The estate shown throughout is a labelled sample."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {AREAS.map((a) => (
              <button
                key={a.area}
                type="button"
                onClick={() => navigate(a.area)}
                className="group rounded-lg border border-paper-100/12 bg-ink-850 p-5 text-left transition-colors hover:border-accent/50"
              >
                <h3 className="text-[0.95rem] font-medium leading-snug text-paper-50">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-100/68">{a.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-accent">
                  Open
                  <ArrowRight aria-hidden className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <SampleNotice />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel
              title="Sample estate posture"
              dense
              actions={<Badge tone="muted">{s.services} services · {s.domains} domains</Badge>}
            >
              <div className="grid grid-cols-2 divide-x divide-y divide-paper-100/8 sm:grid-cols-4 sm:divide-y-0">
                <Stat label="Contracts complete" value={`${s.contractsComplete}/${s.services}`} sub="all eleven areas present" />
                <Stat label="Context past window" value={s.servicesWithStaleContext} sub="services with a stale fact" tone={s.servicesWithStaleContext ? 'warn' : 'pos'} />
                <Stat label="Grants above cap" value={s.grantsAboveCap} sub="exceed the risk tier ceiling" tone={s.grantsAboveCap ? 'neg' : 'pos'} />
                <Stat label="Open findings" value={s.highSeverityFindings} sub="high severity" tone={s.highSeverityFindings ? 'neg' : 'pos'} />
              </div>
              <div className="border-t border-paper-100/10 px-4 py-3">
                <button
                  type="button"
                  onClick={() => navigate('operating-model', 'register')}
                  className="-my-1 inline-flex items-center gap-1.5 py-2 font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/72 transition-colors hover:text-accent"
                >
                  Open service register <ArrowRight aria-hidden className="h-3 w-3" />
                </button>
              </div>
            </Panel>

            <Panel title="Findings requiring a decision" dense>
              {topFindings.map((f, i) => (
                <FindingRow
                  key={i}
                  label={`${f.svc} — ${FINDING_META[f.kind].label}`}
                  detail={f.detail}
                  severity={FINDING_META[f.kind].severity}
                />
              ))}
            </Panel>
          </div>
        </Movement>
      </Screen>
    </>
  )
}

/** A numbered movement in the Home narrative. Uses the existing type scale. */
function Movement({
  n, title, lede, children,
}: { n: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-2xs tnum text-paper-100/55">{n}</span>
        <h2 className="font-serif text-[1.4rem] leading-tight tracking-[-0.015em] text-paper-50 sm:text-[1.6rem]">
          {title}
        </h2>
        <span aria-hidden className="hidden h-px flex-1 bg-paper-100/10 sm:block" />
      </div>
      {lede && <p className="mb-5 max-w-measure text-[0.92rem] leading-relaxed text-paper-100/72">{lede}</p>}
      {children}
    </section>
  )
}
