import { project } from '@/content/meta'
import { chapters } from '@/app/chapters'

export function Footer() {
  return (
    <footer className="surface-deep border-t border-paper-100/10 py-14">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div>
            <p className="font-serif text-2xl text-paper-50">{project.title}</p>
            <p className="mt-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
              {project.category} · {project.abbrev}
            </p>
            <p className="mt-5 max-w-measure text-sm leading-relaxed text-paper-100/55">
              This experience presents {project.version} of the framework requirement. The requirement
              is the source of truth; where this page and the requirement differ, the requirement
              wins. Every assertion here carries its section reference.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="chip border border-paper-100/20 text-paper-100/70 transition-colors hover:border-accent hover:text-accent"
              >
                Requirement README ↗
              </a>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="chip border border-paper-100/20 text-paper-100/70 transition-colors hover:border-accent hover:text-accent"
              >
                Repository ↗
              </a>
            </div>
          </div>

          <nav aria-label="Footer contents">
            <span className="eyebrow text-paper-100/55">Contents</span>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
              {chapters.slice(1).map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="flex items-baseline gap-2 py-1.5 text-xs text-paper-100/55 transition-colors hover:text-accent"
                  >
                    <span className="font-mono tnum text-paper-100/55">{c.n}</span>
                    <span className="truncate">{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper-100/8 pt-6">
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
            {project.internalLabel}
          </p>
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
            No analytics · No cookies · Nothing transmitted
          </p>
        </div>
      </div>
    </footer>
  )
}
