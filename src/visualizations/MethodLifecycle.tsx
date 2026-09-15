import { RotateCcw } from 'lucide-react'
import { method, methodReturn } from '@/content/home'

/**
 * The improvement method as a lifecycle.
 *
 * All seven steps are stated inline: a first-time reader should not have to click
 * anything to learn what the framework does to an organisation.
 */
export function MethodLifecycle() {
  return (
    <div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {method.map((s, i) => (
          <li
            key={s.id}
            className={`relative rounded-md border border-paper-100/12 bg-ink-800/60 p-4 ${
              i === method.length - 1 ? 'border-accent/35 bg-accent-wash' : ''
            }`}
          >
            <div className="flex items-baseline gap-2">
              <span className={`font-mono text-2xs tnum ${i === method.length - 1 ? 'text-accent' : 'text-paper-100/55'}`}>
                {String(s.n).padStart(2, '0')}
              </span>
              <h3 className="text-[0.9rem] font-medium leading-snug text-paper-50">{s.label}</h3>
            </div>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-paper-100/72">{s.body}</p>
            {/* Connector only between cards on the same row of the 4-up grid. */}
            {i < method.length - 1 && (i + 1) % 4 !== 0 && (
              <span
                aria-hidden
                className="absolute -right-[11px] top-1/2 hidden -translate-y-1/2 font-mono text-2xs text-paper-100/55 lg:block"
              >
                →
              </span>
            )}
          </li>
        ))}

        <li className="flex items-center gap-2.5 rounded-md border border-dashed border-accent/35 bg-accent-wash/40 p-4">
          <RotateCcw aria-hidden className="h-4 w-4 shrink-0 text-accent" />
          <p className="text-[0.82rem] leading-relaxed text-paper-100/78">{methodReturn}</p>
        </li>
      </ol>
    </div>
  )
}
