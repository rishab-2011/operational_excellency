import { ArrowRight } from 'lucide-react'
import { Screen } from '@/app/AppShell'
import { Badge, Panel, SampleNotice, Stat, FindingRow } from '@/components/product'
import { MasterArchitecture } from '@/visualizations/MasterArchitecture'
import { FINDING_META, estate, estateSummary } from '@/data/estate'
import { useInView, usePrefersReducedMotion } from '@/hooks'
import { motion } from 'framer-motion'

const CAPABILITIES = [
  {
    area: 'operating-model',
    title: 'Define the unit and what is promised',
    body: 'An Operated Service, its contract, and the context the whole model reasons over.',
  },
  {
    area: 'authority',
    title: 'Govern what machines may do',
    body: 'Authority granted per action against risk and evidence — and withdrawn when the evidence expires.',
  },
  {
    area: 'value',
    title: 'Claim only what can be measured',
    body: 'One attribution path per benefit, and a measurement tier that decides how strongly it may be stated.',
  },
]

export function Overview({ navigate }: { navigate: (a: string, v?: string | null) => void }) {
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
              Machine authority granted by risk and evidence — not by ambition.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-paper-100/75">
              An operating capability for production estates that already have observability, ITSM, SRE,
              automation and increasingly agents that can act. It governs the one thing none of them
              owns: what a machine is permitted to do without a human, and on what evidence that
              permission rests.
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
        <div className="grid gap-4 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <button
              key={c.area}
              type="button"
              onClick={() => navigate(c.area)}
              className="group rounded-lg border border-paper-100/12 bg-ink-850 p-5 text-left transition-colors hover:border-accent/50"
            >
              <h2 className="text-[0.95rem] font-medium leading-snug text-paper-50">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-paper-100/68">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-accent">
                Open
                <ArrowRight aria-hidden className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        {/* Estate posture — artefact state, not system telemetry. */}
        <div className="mt-10">
          <SampleNotice />
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel title="Sample estate posture" dense
              actions={<Badge tone="muted">{s.services} services · {s.domains} domains</Badge>}>
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
        </div>

        {/* The model, once, at a glance. */}
        <div className="mt-10">
          <Panel title="Operating model at a glance">
            <MasterArchitecture compact />
          </Panel>
        </div>
      </Screen>
    </>
  )
}
