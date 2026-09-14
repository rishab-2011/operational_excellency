import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'
import { northStar, project } from '@/content/meta'
import { Ref } from '@/components/primitives'
import { usePrefersReducedMotion } from '@/hooks'

/** The entry: one proposition, then an explicit choice of depth. */
export function Start() {
  const reduced = usePrefersReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section id="start" className="surface-deep relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-[0.5]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -top-[20%] h-[65vh] w-[65vh] rounded-full opacity-[0.20] blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(200,127,67,0.55) 0%, transparent 68%)' }}
      />

      <div className="shell relative flex flex-1 flex-col justify-center pb-12 pt-28 sm:pt-32">
        <motion.div {...rise(0.05)} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="eyebrow text-accent">{project.category}</span>
          <span aria-hidden className="h-px w-8 bg-paper-100/20" />
          <span className="eyebrow text-paper-100/55">{project.version} · {project.revised}</span>
        </motion.div>

        <motion.h1 {...rise(0.14)} className="mt-6 font-serif text-display text-paper-50 text-balance sm:mt-8">
          The Operating
          <br />
          <span className="italic text-accent">Standard</span>
        </motion.h1>

        <motion.div {...rise(0.26)} className="mt-9 max-w-3xl">
          <div className="relative">
            <div aria-hidden className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-accent/35" />
            <p className="pl-6 font-serif text-[1.1rem] leading-[1.5] text-paper-100/85 text-pretty sm:text-[1.35rem]">
              Every production service should be operated through a defined, measurable, continuously
              improving operational contract, with decisions driven by customer and business impact, and{' '}
              <span className="text-paper-50">
                with machine authority granted by risk and evidence rather than by ambition
              </span>
              .
            </p>
          </div>
          <p className="mt-3 pl-6"><Ref s={northStar.ref} /></p>
        </motion.div>

        {/* The choice */}
        <motion.div {...rise(0.4)} className="mt-12 grid gap-3 sm:grid-cols-2 lg:max-w-4xl">
          <a
            href="#exec-why"
            className="group rounded-xl border border-accent/45 bg-accent-wash p-6 transition-colors hover:border-accent sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-accent">Start here</span>
              <ArrowRight aria-hidden className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <h2 className="mt-3 font-serif text-2xl text-paper-50 sm:text-[1.75rem]">Executive view</h2>
            <p className="mt-2 text-sm leading-relaxed text-paper-100/78">
              Six sections, understood by looking. The problem, the model, the authority question, how
              value is counted, and what a pilot looks like.
            </p>
            <p className="mt-4 font-mono text-2xs uppercase tracking-[0.13em] text-accent">
              ≈ 3 minutes · no reading required
            </p>
          </a>

          <a
            href="#opening"
            className="group rounded-xl border border-paper-100/15 bg-ink-900/60 p-6 transition-colors hover:border-paper-100/35 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-paper-100/55">For the detail</span>
              <Layers aria-hidden className="h-4 w-4 text-paper-100/55" />
            </div>
            <h2 className="mt-3 font-serif text-2xl text-paper-50 sm:text-[1.75rem]">Explore full framework</h2>
            <p className="mt-2 text-sm leading-relaxed text-paper-100/72">
              Eighteen chapters with the exact definitions, worked contracts, evidence grades,
              prior-art concessions and the claim register.
            </p>
            <p className="mt-4 font-mono text-2xs uppercase tracking-[0.13em] text-paper-100/55">
              ≈ 25 minutes · every assertion cited
            </p>
          </a>
        </motion.div>
      </div>

      <motion.div {...rise(0.55)} className="shell relative pb-7">
        <p className="font-mono text-2xs uppercase tracking-[0.13em] text-paper-100/55">
          {project.internalLabel}
        </p>
      </motion.div>
    </section>
  )
}
