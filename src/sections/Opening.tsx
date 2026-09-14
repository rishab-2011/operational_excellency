import { motion } from 'framer-motion'
import { intent, positioning, project } from '@/content/meta'
import { Ref } from '@/components/primitives'
import { useInView, usePrefersReducedMotion } from '@/hooks'

/**
 * Chapter 00 — the gateway into the full framework.
 * The proposition itself is made on the entry screen; this marks the shift in depth.
 */
export function Opening() {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id="opening" className="surface-deep relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-[0.4]" />
      <div className="shell relative">
        <motion.div
          ref={ref}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xs tnum text-paper-100/55">00</span>
            <span className="eyebrow text-accent">The full framework</span>
            <span aria-hidden className="ml-1 hidden h-px flex-1 bg-paper-100/12 sm:block" />
          </div>

          <div className="mt-5 grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <h2 className="font-serif text-display-sm text-paper-50 text-balance lg:col-span-7">
              Everything above, with the <span className="italic text-accent">exact</span> definitions.
            </h2>
            <div className="lg:col-span-5 lg:self-end lg:pb-1">
              <p className="text-lede text-pretty text-paper-100/72">
                Eighteen chapters. Every assertion carries its section reference, every unproven claim
                is labelled, and the prior art is conceded before anything is claimed.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-measure text-[0.95rem] leading-relaxed text-paper-100/62">
            {intent.body} <Ref s={intent.ref} />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-1 text-paper-100/55">It is not</span>
            {positioning.isNot.slice(0, 5).map((x) => (
              <span key={x} className="chip border border-paper-100/15 text-paper-100/55 line-through decoration-paper-100/25">
                {x}
              </span>
            ))}
            <span className="font-mono text-2xs text-paper-100/55">+{positioning.isNot.length - 5} more</span>
            <Ref s={positioning.ref} />
          </div>

          <p className="mt-10 font-mono text-2xs uppercase tracking-[0.13em] text-paper-100/55">
            {project.internalLabel}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
