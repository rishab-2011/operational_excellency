import { walkthrough, walkthroughCaveat } from '@/content/home'

/**
 * One operational sequence, end to end.
 *
 * Each step is written in plain operational language; the tag beside it names the
 * part of the model that answers it. Vocabulary is introduced by example rather
 * than defined up front.
 */
export function IncidentWalkthrough() {
  return (
    <div>
      <ol className="relative pl-6">
        <span aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-paper-100/12" />
        {walkthrough.map((w) => (
          <li key={w.n} className="relative">
            <span
              aria-hidden
              className={`absolute -left-6 top-[13px] h-2 w-2 rounded-full border ${
                w.emphasis ? 'border-accent bg-accent' : 'border-paper-100/35 bg-ink-850'
              }`}
            />
            <div
              className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-paper-100/8 py-2.5 ${
                w.emphasis ? 'text-paper-50' : ''
              }`}
            >
              <span className="flex min-w-0 items-baseline gap-2.5">
                <span className="font-mono text-2xs tnum text-paper-100/55">{String(w.n).padStart(2, '0')}</span>
                <span className={`text-[0.88rem] leading-snug ${w.emphasis ? 'text-paper-50' : 'text-paper-100/85'}`}>
                  {w.step}
                </span>
              </span>
              <span
                className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] ${
                  w.emphasis ? 'border-accent/55 bg-accent-wash text-accent' : 'border-paper-100/15 text-paper-100/62'
                }`}
              >
                {w.answeredBy}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 max-w-measure text-[0.88rem] leading-relaxed text-paper-100/72">{walkthroughCaveat}</p>
    </div>
  )
}
