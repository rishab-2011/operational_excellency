import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Eyebrow, Section, type Tone } from '@/components/primitives'
import { useInView, usePrefersReducedMotion } from '@/hooks'

/**
 * "See it → Understand it → Explore deeper".
 *
 * One headline, one visual, at most three supporting lines. Everything precise —
 * definitions, evidence grades, methodology, caveats — lives behind the deeper links
 * in the full chapters below.
 */
export function ExecSection({
  id, n, kicker, headline, lede, tone = 'dark', children, aside, className = '',
}: {
  id: string
  n: string
  kicker: string
  headline: ReactNode
  /** Two or three lines maximum. */
  lede: ReactNode
  tone?: Tone
  children: ReactNode
  aside?: ReactNode
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()
  const dark = tone === 'dark'

  return (
    <Section id={id} tone={tone} className={`!py-16 sm:!py-20 lg:!py-24 ${className}`}>
      <div className="shell">
        <motion.div
          ref={ref}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-baseline gap-3">
            <span className={`font-mono text-2xs tnum ${dark ? 'text-paper-100/55' : 'text-ink-900/62'}`}>{n}</span>
            <Eyebrow tone={tone}>{kicker}</Eyebrow>
            <span aria-hidden className={`ml-1 hidden h-px flex-1 sm:block ${dark ? 'bg-paper-100/12' : 'bg-ink-900/12'}`} />
          </div>

          <div className="mt-4 grid gap-x-12 gap-y-4 lg:grid-cols-12">
            <h2
              className={`font-serif text-balance lg:col-span-7 ${
                dark ? 'text-paper-50' : 'text-ink-900'
              } text-[clamp(1.75rem,3.4vw,2.9rem)] leading-[1.08] tracking-[-0.025em]`}
            >
              {headline}
            </h2>
            <div className={`lg:col-span-5 lg:self-end lg:pb-1 ${dark ? 'text-paper-100/72' : 'text-ink-900/72'}`}>
              <p className="text-[1.02rem] leading-relaxed text-pretty">{lede}</p>
              {aside}
            </div>
          </div>
        </motion.div>

        {/* The visual carries the meaning. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          {children}
        </motion.div>
      </div>
    </Section>
  )
}
