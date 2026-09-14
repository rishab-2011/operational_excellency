import { ArrowRight } from 'lucide-react'
import { PullQuote, Ref, Reveal, Section, SectionHead } from '@/components/primitives'
import { adoptionIntro, adoptionPractices, authorityWork, humansRemain, workforcePosition } from '@/content/people'

/** Chapter 15 — §17. Answers "what changes for my teams?" before it is asked. */
export function People() {
  return (
    <Section id="people" tone="dark">
      <div className="shell">
        <SectionHead
          n="15"
          kicker="Next · People"
          title={<>What changes for the people already doing this work.</>}
          lede={adoptionIntro.text}
        />

        {/* §17.1 adoption by consent */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Adoption by consent</span>
              <Ref s="§17.1" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {adoptionPractices.map((a, i) => (
                <div key={a.id} className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-2xs tnum text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="text-[0.9rem] font-medium leading-snug text-paper-50">{a.title}</h4>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100/68">{a.body}</p>
                  <div className="mt-2.5"><Ref s={a.ref} /></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* §17.2 workforce — the structural argument */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-t rule-dark pt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">The workforce question, answered structurally</span>
              <Ref s={workforcePosition.ref} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
              <div>
                <p className="text-sm leading-relaxed text-paper-100/62">{workforcePosition.problem}</p>
                <div className="mt-6">
                  <PullQuote cite={workforcePosition.ref}>{workforcePosition.answer}</PullQuote>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-paper-100/68">{workforcePosition.argument}</p>
              </div>

              <div>
                <span className="eyebrow text-paper-100/55">Work the authority model creates</span>
                <ul className="mt-3 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
                  {authorityWork.map((w) => (
                    <li
                      key={w.work}
                      className="grid gap-x-3 gap-y-1 bg-ink-850 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"
                    >
                      <span className="text-[0.84rem] leading-snug text-paper-50">{w.work}</span>
                      <ArrowRight aria-hidden className="hidden h-3 w-3 shrink-0 text-paper-100/55 sm:block" />
                      <span className="text-xs leading-relaxed text-paper-100/62">{w.who}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Humans remain */}
        <Reveal delay={0.08}>
          <div className="mt-14 rounded-xl border border-accent/30 bg-accent-wash p-6 sm:p-8">
            <span className="eyebrow text-accent">Humans remain essential for</span>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {humansRemain.areas.map((a) => (
                <li key={a} className="chip border border-paper-100/25 text-paper-100/80">{a}</li>
              ))}
            </ul>
            <p className="mt-6 border-t border-accent/20 pt-4 font-serif text-[1.15rem] leading-snug text-paper-50 text-balance">
              {humansRemain.commitment}
            </p>
            <div className="mt-2"><Ref s={humansRemain.ref} /></div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
