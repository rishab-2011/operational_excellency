import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { chapterIds, chapters } from '@/app/chapters'
import { project } from '@/content/meta'
import { useActiveSection, usePrefersReducedMotion, useScrollProgress } from '@/hooks'

export function Nav() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(chapterIds)
  const progress = useScrollProgress()
  const reduced = usePrefersReducedMotion()
  const current = chapters.find((c) => c.id === active) ?? chapters[0]
  const scrolled = progress > 0.004

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const parts = [...new Set(chapters.map((c) => c.part))]

  return (
    <>
      <a
        href="#opening"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-2xs focus:uppercase focus:text-ink-950"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-ink-950/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{ height: 'var(--nav-h)' }}
      >
        {/* Reading progress — the only persistent chrome besides the bar itself. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-paper-100/10">
          <motion.div
            className="h-full origin-left bg-accent"
            style={{ scaleX: progress }}
            transition={{ duration: 0 }}
          />
        </div>

        <div className="shell flex h-full items-center justify-between gap-4">
          <a href="#opening" className="group flex min-w-0 items-baseline gap-3 py-1.5">
            <span className="font-serif text-[0.95rem] tracking-tight text-paper-50 whitespace-nowrap">
              {project.title}
            </span>
            <span className="hidden sm:inline font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
              {project.abbrev} · {project.version}
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <span
              aria-live="polite"
              className="hidden md:flex items-baseline gap-2 font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55"
            >
              <span className="tnum text-accent">{current.n}</span>
              <span className="max-w-[18ch] truncate">{current.title}</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="chip border-paper-100/20 text-paper-100/75 hover:border-accent/60 hover:text-accent"
              aria-haspopup="dialog"
            >
              <Menu aria-hidden className="h-3.5 w-3.5" />
              Contents
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contents"
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-ink-950/97 backdrop-blur-2xl"
          >
            <div className="shell flex min-h-full flex-col py-5">
              <div className="flex items-center justify-between" style={{ minHeight: 'calc(var(--nav-h) - 20px)' }}>
                <span className="eyebrow text-paper-100/55">Contents</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="chip border-paper-100/20 text-paper-100/75 hover:border-accent/60 hover:text-accent"
                  autoFocus
                >
                  <X aria-hidden className="h-3.5 w-3.5" /> Close
                </button>
              </div>

              <nav className="mt-8 flex-1 sm:mt-12">
                {parts.map((part, pi) => (
                  <div key={part} className="mb-8 sm:mb-10">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="eyebrow text-accent">{part}</span>
                      <span aria-hidden className="h-px flex-1 bg-paper-100/10" />
                    </div>
                    <ul>
                      {chapters.filter((c) => c.part === part).map((c, i) => (
                        <motion.li
                          key={c.id}
                          initial={reduced ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: reduced ? 0 : pi * 0.05 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <a
                            href={`#${c.id}`}
                            onClick={() => setOpen(false)}
                            className={`group flex items-baseline gap-4 border-b border-paper-100/8 py-3 transition-colors sm:py-4 ${
                              active === c.id ? 'text-accent' : 'text-paper-100/80 hover:text-paper-50'
                            }`}
                          >
                            <span className="font-mono text-2xs tnum text-paper-100/55 group-hover:text-accent/70">
                              {c.n}
                            </span>
                            <span className="font-serif text-xl tracking-tight sm:text-2xl">{c.title}</span>
                            <span aria-hidden className="ml-auto opacity-0 transition-opacity group-hover:opacity-60">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <p className="mt-auto pt-6 font-mono text-2xs uppercase tracking-[0.14em] text-paper-100/55">
                {project.internalLabel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
