import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { intent, northStar, project } from '@/content/meta'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** Chapter 00 — editorial opening. Deliberately not a dashboard. */
export function Opening() {
  const reduced = usePrefersReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section id="opening" className="surface-deep relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-[0.5]" />
      {/* A single soft light source, top-left — depth without decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] -top-[22%] h-[70vh] w-[70vh] rounded-full opacity-[0.22] blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(200,127,67,0.55) 0%, transparent 68%)' }}
      />

      <div className="shell relative flex flex-1 flex-col justify-center pb-16 pt-28 sm:pt-32">
        <motion.div {...rise(0.05)} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="eyebrow text-accent">{project.category}</span>
          <span aria-hidden className="h-px w-8 bg-paper-100/20" />
          <span className="eyebrow text-paper-100/55">
            {project.version} · {project.revised}
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.14)}
          className="mt-7 font-serif text-display text-paper-50 text-balance sm:mt-9"
        >
          The Operating
          <br />
          <span className="italic text-accent">Standard</span>
        </motion.h1>

        <motion.div {...rise(0.26)} className="mt-10 max-w-3xl sm:mt-14">
          <div className="relative">
            <div aria-hidden className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-accent/35" />
            <p className="pl-6 font-serif text-[1.15rem] leading-[1.5] text-paper-100/85 text-pretty sm:text-[1.45rem] sm:leading-[1.48]">
              Every production service should be operated through a defined, measurable,
              continuously improving operational contract, with decisions driven by customer
              and business impact, and{' '}
              <span className="text-paper-50">
                with machine authority granted by risk and evidence rather than by ambition
              </span>
              .
            </p>
          </div>
          <p className="mt-4 pl-6 text-sm text-paper-100/55">
            <Ref s={northStar.ref} /> <span className="ml-2">{northStar.note}</span>
          </p>
        </motion.div>

        <motion.p {...rise(0.38)} className="mt-12 max-w-measure text-[0.95rem] leading-relaxed text-paper-100/55 sm:mt-16">
          {intent.body}
        </motion.p>
      </div>

      <motion.div {...rise(0.5)} className="shell relative flex items-end justify-between gap-6 pb-8">
        <a
          href="#question"
          className="group inline-flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-paper-100/55 transition-colors hover:text-accent"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full border border-paper-100/20 transition-colors group-hover:border-accent/60"
          >
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </span>
          Begin · 5–10 minutes
        </a>
        <p className="max-w-[14rem] text-right font-mono text-2xs uppercase leading-relaxed tracking-[0.12em] text-paper-100/55">
          {project.internalLabel}
        </p>
      </motion.div>
    </section>
  )
}
