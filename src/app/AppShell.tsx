import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { areas } from '@/app/routes'
import type { Route } from '@/hooks/useRoute'

/**
 * Persistent product chrome. A working application has a fixed frame and screens
 * inside it — not a scroll position inside a document.
 */
export function AppShell({
  route, navigate, children,
}: { route: Route; navigate: (a: string, v?: string | null) => void; children: ReactNode }) {
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { setMenu(false) }, [route.area])

  return (
    <div className="flex min-h-[100svh] flex-col bg-ink-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-2xs focus:uppercase focus:text-ink-950"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-paper-100/10 bg-ink-950/92 backdrop-blur-xl">
        <div className="shell flex h-14 items-center gap-6">
          <button
            type="button"
            onClick={() => navigate('overview')}
            className="flex shrink-0 items-center gap-2.5 py-1"
            aria-label="The Operating Standard — Overview"
          >
            <Mark />
            <span className="hidden font-serif text-[0.98rem] tracking-tight text-paper-50 sm:inline">
              The Operating Standard
            </span>
          </button>

          <nav aria-label="Primary" className="hidden flex-1 items-center gap-0.5 lg:flex">
            {areas.map((a) => {
              const on = route.area === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-current={on ? 'page' : undefined}
                  onClick={() => navigate(a.id)}
                  className={`relative rounded px-3 py-1.5 text-[0.82rem] transition-colors ${
                    on ? 'text-paper-50' : 'text-paper-100/62 hover:text-paper-100/90'
                  }`}
                >
                  {a.label}
                  {on && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-px bg-accent" />}
                </button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55 md:inline">
              Internal preview
            </span>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              className="rounded border border-paper-100/20 p-1.5 text-paper-100/72 transition-colors hover:border-accent/60 hover:text-accent lg:hidden"
            >
              {menu ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menu && (
          <nav aria-label="Primary mobile" className="border-t border-paper-100/10 bg-ink-950 lg:hidden">
            <div className="shell grid grid-cols-2 gap-1 py-3">
              {areas.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-current={route.area === a.id ? 'page' : undefined}
                  onClick={() => navigate(a.id)}
                  className={`rounded border px-3 py-2.5 text-left text-[0.84rem] ${
                    route.area === a.id
                      ? 'border-accent/55 bg-accent-wash text-paper-50'
                      : 'border-paper-100/12 text-paper-100/72'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      <footer className="border-t border-paper-100/10 bg-ink-950 py-7">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">
            Internal working preview · Not a client deliverable
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('evidence', 'method')}
              className="py-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55 transition-colors hover:text-accent"
            >
              Method and sources
            </button>
            <span className="font-mono text-2xs uppercase tracking-[0.12em] text-paper-100/55">
              No analytics · Nothing transmitted
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

/** Product mark: the gate, drawn as a narrowing aperture. */
function Mark() {
  return (
    <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded border border-accent/50 bg-accent-wash">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M2 3.2h12M2 12.8h12" stroke="#C87F43" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M4.6 6.2h6.8M6.4 9.4h3.2" stroke="#C87F43" strokeWidth="1.3" strokeLinecap="round" opacity="0.62" />
      </svg>
    </span>
  )
}

/** Screen header: area name, one line of purpose, optional view tabs. */
export function AreaHeader({
  title, summary, views, active, onSelect, aside,
}: {
  title: string
  summary: string
  views?: { id: string; label: string }[]
  active?: string | null
  onSelect?: (id: string) => void
  aside?: ReactNode
}) {
  return (
    <div className="border-b border-paper-100/10 bg-ink-900">
      <div className="shell pt-8 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-[clamp(1.6rem,3vw,2.15rem)] leading-tight tracking-[-0.02em] text-paper-50">
              {title}
            </h1>
            <p className="mt-1.5 max-w-measure text-[0.92rem] leading-relaxed text-paper-100/68">{summary}</p>
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>

        {views && views.length > 1 && (
          <div role="tablist" aria-label={`${title} views`} className="mt-6 flex gap-0.5 overflow-x-auto no-scrollbar">
            {views.map((v) => {
              const on = (active ?? views[0].id) === v.id
              return (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => onSelect?.(v.id)}
                  className={`relative shrink-0 px-3.5 py-2.5 text-[0.84rem] transition-colors ${
                    on ? 'text-paper-50' : 'text-paper-100/62 hover:text-paper-100/90'
                  }`}
                >
                  {v.label}
                  {on && <span aria-hidden className="absolute inset-x-2 bottom-0 h-[2px] rounded-t bg-accent" />}
                </button>
              )
            })}
          </div>
        )}
        {(!views || views.length <= 1) && <div className="h-6" />}
      </div>
    </div>
  )
}

/** Standard content wrapper for a screen body. */
export function Screen({ children }: { children: ReactNode }) {
  return <div className="shell py-8 sm:py-10">{children}</div>
}
