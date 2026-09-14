import type { ReactNode } from 'react'
import { Eyebrow, type Tone } from '@/components/primitives'

/** A visual subordinate to the section's primary diagram. Header stays to one line. */
export function SubBlock({
  kicker, headline, tone = 'dark', children,
}: { kicker: string; headline: ReactNode; tone?: Tone; children: ReactNode }) {
  const dark = tone === 'dark'
  return (
    <div className={`border-t pt-8 ${dark ? 'rule-dark' : 'rule-light'}`}>
      <Eyebrow tone={tone}>{kicker}</Eyebrow>
      <h3
        className={`mt-2 font-serif text-[1.35rem] leading-snug text-balance sm:text-[1.6rem] ${
          dark ? 'text-paper-50' : 'text-ink-900'
        }`}
      >
        {headline}
      </h3>
      <div className="mt-6">{children}</div>
    </div>
  )
}
