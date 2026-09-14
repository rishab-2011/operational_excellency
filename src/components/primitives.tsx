import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInView, usePrefersReducedMotion } from '@/hooks'
import type { ClaimStatus } from '@/types/framework'

export type Tone = 'dark' | 'light'

/* ---------------------------------------------------------------- Section */

export function Section({
  id, tone = 'dark', children, className = '', bleed = false,
}: { id: string; tone?: Tone; children: ReactNode; className?: string; bleed?: boolean }) {
  return (
    <section
      id={id}
      className={`${tone === 'dark' ? 'surface-dark' : 'surface-light'} relative ${
        bleed ? '' : 'py-20 sm:py-28 lg:py-36'
      } ${className}`}
    >
      {children}
    </section>
  )
}

/** Small-caps technical key used on every section and concept. */
export function Eyebrow({
  children, tone = 'dark', className = '',
}: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`eyebrow ${tone === 'dark' ? 'text-accent' : 'text-accent-ink'} ${className}`}>
      {children}
    </span>
  )
}

/** Section header: number, title, optional lede. */
export function SectionHead({
  n, kicker, title, lede, tone = 'dark', align = 'left', split = true,
}: {
  n?: string; kicker: string; title: ReactNode; lede?: ReactNode
  tone?: Tone; align?: 'left' | 'center'
  /** At lg+, set the lede beside the title as a second column for editorial density. */
  split?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()
  const centered = align === 'center'
  const useSplit = split && !centered && Boolean(lede)

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={centered ? 'mx-auto max-w-mid text-center' : ''}
    >
      <div className={`flex items-baseline gap-3 ${centered ? 'justify-center' : ''}`}>
        {n && (
          <span className={`font-mono text-2xs tnum ${tone === 'dark' ? 'text-paper-100/55' : 'text-ink-900/62'}`}>
            {n}
          </span>
        )}
        <Eyebrow tone={tone}>{kicker}</Eyebrow>
        {!centered && (
          <span
            aria-hidden
            className={`ml-1 hidden h-px flex-1 sm:block ${
              tone === 'dark' ? 'bg-paper-100/12' : 'bg-ink-900/12'
            }`}
          />
        )}
      </div>

      <div className={useSplit ? 'mt-4 grid gap-x-12 gap-y-5 lg:grid-cols-12' : 'mt-4'}>
        <h2
          className={`font-serif text-display-sm text-balance ${useSplit ? 'lg:col-span-7' : ''} ${
            tone === 'dark' ? 'text-paper-50' : 'text-ink-900'
          }`}
        >
          {title}
        </h2>
        {lede && (
          <p
            className={`text-lede text-pretty ${
              useSplit ? 'lg:col-span-5 lg:self-end lg:pb-1' : `measure mt-5 ${centered ? 'mx-auto' : ''}`
            } ${tone === 'dark' ? 'text-paper-100/70' : 'text-ink-900/70'}`}
          >
            {lede}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------ Attribution */

/** Section reference back to README v0.2 — every assertion on the page carries one. */
export function Ref({ s, tone = 'dark' }: { s: string; tone?: Tone }) {
  return (
    <span
      className={`font-mono text-2xs tabular-nums align-baseline ${
        tone === 'dark' ? 'text-paper-100/55' : 'text-ink-900/62'
      }`}
      title={`README v0.2 ${s}`}
    >
      {s}
    </span>
  )
}

const statusStyle: Record<ClaimStatus, { label: string; cls: string }> = {
  claim: { label: 'Claim', cls: 'border-accent/45 text-accent bg-accent-wash' },
  hypothesis: { label: 'Hypothesis', cls: 'border-signal-warn/45 text-signal-warn bg-signal-warn/10' },
  synthesis: { label: 'Synthesis', cls: 'border-current/25 text-current/60 bg-current/5' },
  withdrawn: { label: 'Withdrawn', cls: 'border-signal-neg/45 text-signal-neg bg-signal-neg/10' },
  illustrative: { label: 'Illustrative', cls: 'border-signal-info/45 text-signal-info bg-signal-info/10' },
}

/** Marks unproven material so nothing reads as settled that is not. */
export function StatusTag({ status, className = '' }: { status: ClaimStatus; className?: string }) {
  const s = statusStyle[status]
  return (
    <span className={`chip border ${s.cls} ${className}`}>
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
      {s.label}
    </span>
  )
}

/* ------------------------------------------------------------- Disclosure */

/** Progressive disclosure: simple at a glance, deep on interaction. */
export function Disclosure({
  summary, children, tone = 'dark', defaultOpen = false,
}: { summary: ReactNode; children: ReactNode; tone?: Tone; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const dark = tone === 'dark'
  return (
    <div className={`border-t ${dark ? 'rule-dark' : 'rule-light'}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors ${
          dark ? 'hover:text-accent' : 'hover:text-accent-ink'
        }`}
      >
        <span className="text-sm font-medium">{summary}</span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''} ${
            dark ? 'text-paper-100/55' : 'text-ink-900/62'
          }`}
        />
      </button>
      <motion.div
        id={id}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className={`pb-5 text-sm leading-relaxed measure ${dark ? 'text-paper-100/65' : 'text-ink-900/70'}`}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ Quote */

export function PullQuote({
  children, cite, tone = 'dark',
}: { children: ReactNode; cite?: string; tone?: Tone }) {
  const dark = tone === 'dark'
  return (
    <figure className="relative">
      <div aria-hidden className={`absolute left-0 top-1 h-full w-px ${dark ? 'bg-accent/40' : 'bg-accent-ink/35'}`} />
      <blockquote
        className={`pl-6 font-serif text-[1.35rem] leading-[1.45] sm:text-[1.6rem] text-balance ${
          dark ? 'text-paper-50' : 'text-ink-900'
        }`}
      >
        {children}
      </blockquote>
      {cite && (
        <figcaption className={`mt-3 pl-6 ${dark ? 'text-paper-100/55' : 'text-ink-900/62'}`}>
          <Ref s={cite} tone={tone} />
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children, delay = 0, className = '',
}: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------- Note */

export function Note({
  children, tone = 'dark', icon,
}: { children: ReactNode; tone?: Tone; icon?: ReactNode }) {
  const dark = tone === 'dark'
  return (
    <div
      className={`flex gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed ${
        dark ? 'border-paper-100/12 bg-ink-850/60 text-paper-100/65' : 'border-ink-900/12 bg-paper-200/50 text-ink-900/70'
      }`}
    >
      {icon && <span className="mt-0.5 shrink-0 opacity-60">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
