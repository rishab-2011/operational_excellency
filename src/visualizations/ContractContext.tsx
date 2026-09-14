import { contractAreas } from '@/content/contract'
import { contextClasses } from '@/content/context'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/** §7.3 + §8 — the governed artefact and the living facts underneath it. */
export function ContractContext() {
  const core = contractAreas.filter((a) => a.scope === 'core')
  const profile = contractAreas.filter((a) => a.scope === 'profile')

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-2">
      {/* Contract */}
      <div className="min-w-0 rounded-lg border border-accent/30 bg-accent-wash p-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="font-serif text-lg text-paper-50">Operational Contract</h4>
          <Ref s="§7.3" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-paper-100/72">
          One governed, versioned artefact per Operated Service.
        </p>

        <span className="eyebrow mt-4 block text-paper-100/55">Universal</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {core.map((a) => (
            <span
              key={a.id}
              className={`chip border ${
                a.id === 'authority'
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-paper-100/20 text-paper-100/72'
              }`}
            >
              {a.name}
            </span>
          ))}
        </div>

        <span className="eyebrow mt-4 block text-paper-100/55">Varies by service shape</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {profile.map((a) => (
            <span key={a.id} className="chip border border-dashed border-paper-100/28 text-paper-100/72">
              {a.name}
            </span>
          ))}
        </div>

        <p className="mt-4 border-t border-accent/20 pt-3 text-sm leading-relaxed text-paper-100/78">
          Catalogs hold identity. SLOs hold expectations. Runbooks hold procedure. Only here are they bound to{' '}
          <span className="text-accent">risk tier, blast radius and per-action machine authority</span>.
        </p>
      </div>

      {/* Context */}
      <div className="min-w-0 rounded-lg border border-paper-100/12 bg-ink-850 p-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="font-serif text-lg text-paper-50">Service Context Substrate</h4>
          <Ref s="§8.2" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-paper-100/72">
          The facts the loop reasons over. Each one has a source, an owner and a shelf life.
        </p>

        <ul className="mt-4 space-y-1.5">
          {contextClasses.slice(0, 5).map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded border border-paper-100/10 bg-ink-800/50 px-3 py-2">
              <span className="min-w-0 flex-1 text-[0.82rem] text-paper-100/85">{c.label}</span>
              <span className="font-mono text-2xs uppercase tracking-[0.09em] text-paper-100/55">{c.provenance}</span>
              <span className="w-14 text-right font-mono text-2xs text-accent">{c.freshnessDays}d</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 border-t rule-dark pt-3 text-sm leading-relaxed text-paper-100/78">
          An expired fact is marked <span className="text-signal-neg">stale</span>, never silently trusted — because
          everything above it, including automation authority, is only as good as its age.
        </p>
      </div>

      <div className="flex min-w-0 flex-wrap gap-4 lg:col-span-2">
        <DeeperLink to="contract">Three worked contracts, and what each shape broke</DeeperLink>
        <DeeperLink to="context">Watch context decay</DeeperLink>
      </div>
    </div>
  )
}
