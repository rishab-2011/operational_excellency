import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { ScenarioEngine } from '@/interactions/ScenarioEngine'
import { Note, PullQuote, Ref, Reveal, Section, SectionHead, StatusTag } from '@/components/primitives'
import { actionClasses, authorityLevels, authorityRules, authorityTransitions, gateThresholdNote } from '@/content/authority'

/** Chapter 07 — the hero concept. §9.4, §9.6. */
export function Authority() {
  return (
    <Section id="authority" tone="dark">
      <div className="shell">
        <SectionHead
          n="07"
          kicker="Operation · The hero concept"
          title={<>A machine being <span className="italic">able</span> to act says nothing about being <span className="italic text-accent">permitted</span> to.</>}
          lede="This is the distinction the framework exists to govern. Capability is a property of the technology. Authority is a grant — made against risk and evidence, held in the contract, and revocable."
        />

        {/* Action-specificity — rule 1, the most important one. */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Authority is action-specific</span>
              <Ref s="§9.4" />
              <StatusTag status="illustrative" className="ml-1" />
            </div>
            <p className="mt-2.5 max-w-measure text-sm leading-relaxed text-paper-100/62">
              One Operated Service. Five different actions. Five different permitted levels — because
              blast radius and reversibility differ, not because the service is more or less mature.
            </p>

            <ul className="mt-6 space-y-px overflow-hidden rounded-lg border border-paper-100/10 bg-paper-100/10">
              {actionClasses.map((a) => (
                <li key={a.id} className="grid gap-x-5 gap-y-2 bg-ink-850 px-4 py-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto] lg:items-center">
                  <div>
                    <span className="block text-[0.85rem] font-medium text-paper-50">{a.label}</span>
                    <span className="mt-0.5 block text-xs text-paper-100/55">
                      {a.reversibility} · blast radius: {a.blastRadius}
                    </span>
                  </div>

                  {/* Level bar, readable without colour via the printed level id. */}
                  <div className="flex items-center gap-1" aria-hidden>
                    {authorityLevels.map((lvl, i) => (
                      <span
                        key={lvl.id}
                        className={`h-1.5 flex-1 rounded-full ${
                          i <= a.current ? 'bg-accent' : 'bg-paper-100/12'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="chip border-accent/50 bg-accent-wash text-accent">
                      {authorityLevels[a.current].id} · {authorityLevels[a.current].name}
                    </span>
                    {a.target !== a.current && (
                      <span className="chip border-paper-100/20 text-paper-100/55">
                        target {authorityLevels[a.target].id}
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-paper-100/55 lg:col-span-3">{a.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Scenario engine */}
        <Reveal delay={0.1}>
          <div className="mt-16 rounded-xl border border-paper-100/10 bg-ink-950 p-6 sm:p-9">
            <div className="mb-7">
              <span className="eyebrow text-accent">Governance, not a fake agent</span>
              <h3 className="mt-2.5 font-serif text-2xl text-paper-50 sm:text-3xl text-balance">
                Change the conditions. Watch the permission change.
              </h3>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-paper-100/60">
                Nothing here simulates intelligence. It applies the stated risk caps and gate
                criteria in order, so the separation between what a machine could do and what it may
                do becomes visible.
              </p>
            </div>
            <ScenarioEngine />
          </div>
        </Reveal>

        {/* Rules */}
        <Reveal delay={0.08}>
          <div className="mt-16">
            <span className="eyebrow text-accent">The four rules</span>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {authorityRules.map((r) => (
                <div key={r.n} className="rounded-lg border border-paper-100/10 bg-ink-850/60 p-5">
                  <div className="flex gap-3">
                    <span className="mt-0.5 font-mono text-2xs tnum text-accent">
                      {String(r.n).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[0.88rem] font-medium leading-snug text-paper-50">{r.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-paper-100/62">{r.body}</p>
                      <div className="mt-2"><Ref s={r.ref} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Authority moves */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-t rule-dark pt-12">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="eyebrow text-accent">Authority is not permanently earned</span>
              <Ref s="§9.4 · §9.6" />
            </div>
            <h3 className="mt-3 font-serif text-2xl text-paper-50 text-balance">
              A grant that no longer has evidence behind it is withdrawn.
            </h3>

            <ul className="mt-7 space-y-2">
              {authorityTransitions.map((t) => {
                const Icon = t.dir > 0 ? ArrowUp : t.dir < 0 ? ArrowDown : Minus
                const tone =
                  t.dir > 0 ? 'text-signal-pos border-signal-pos/40 bg-signal-pos/[0.07]'
                    : t.dir < 0 ? 'text-signal-neg border-signal-neg/40 bg-signal-neg/[0.07]'
                    : 'text-signal-info border-signal-info/40 bg-signal-info/[0.07]'
                return (
                  <li key={t.id} className="grid gap-x-4 gap-y-1.5 rounded-lg border border-paper-100/10 bg-ink-850/60 px-4 py-3.5 sm:grid-cols-[minmax(0,15rem)_auto_minmax(0,1fr)] sm:items-center">
                    <span className="text-[0.85rem] text-paper-100/85">{t.trigger}</span>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.1em] ${tone}`}>
                      <Icon aria-hidden className="h-3 w-3" />
                      {t.effect}
                    </span>
                    <span className="text-xs leading-relaxed text-paper-100/55">
                      {t.detail} <Ref s={t.ref} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <PullQuote cite="§9.4">
              Authority is not a status; it is a revocable grant.
            </PullQuote>
            <Note>
              {gateThresholdNote.text} <Ref s={gateThresholdNote.ref} />
            </Note>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
