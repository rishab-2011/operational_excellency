import type { ReactNode } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

/**
 * Console primitives. Denser and flatter than the landing surface: panels with
 * headers, tabular rows, small status affordances. Deliberately not editorial.
 */

export function Panel({
  title, actions, children, className = '', tone = 'default', dense = false,
}: {
  title?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' | 'warn'
  dense?: boolean
}) {
  return (
    <section
      className={`overflow-hidden rounded-lg border ${
        tone === 'accent' ? 'border-accent/35 bg-accent-wash'
          : tone === 'warn' ? 'border-signal-neg/35 bg-signal-neg/[0.06]'
          : 'border-paper-100/12 bg-ink-850'
      } ${className}`}
    >
      {title && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-100/10 bg-ink-800/60 px-4 py-2.5">
          <h3 className="font-mono text-2xs uppercase tracking-[0.13em] text-paper-100/72">{title}</h3>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={dense ? '' : 'p-4'}>{children}</div>
    </section>
  )
}

/** Key/value row used throughout detail views. */
export function Field({ label, children, mono = false }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="grid gap-x-4 gap-y-0.5 border-b border-paper-100/8 px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
      <dt className="font-mono text-2xs uppercase tracking-[0.11em] text-paper-100/55">{label}</dt>
      <dd className={`text-[0.84rem] leading-relaxed text-paper-100/85 ${mono ? 'font-mono' : ''}`}>{children}</dd>
    </div>
  )
}

export type BadgeTone = 'neutral' | 'accent' | 'pos' | 'warn' | 'neg' | 'muted'

export function Badge({
  children, tone = 'neutral', className = '',
}: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  const map: Record<BadgeTone, string> = {
    neutral: 'border-paper-100/25 text-paper-100/80',
    accent: 'border-accent/55 bg-accent-wash text-accent',
    pos: 'border-signal-pos/45 bg-signal-pos/10 text-signal-pos',
    warn: 'border-signal-warn/45 bg-signal-warn/10 text-signal-warn',
    neg: 'border-signal-neg/45 bg-signal-neg/10 text-signal-neg',
    muted: 'border-paper-100/15 text-paper-100/55',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] ${map[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/** A single figure with a label. Never a measurement of a running system. */
export function Stat({
  label, value, sub, tone = 'neutral',
}: { label: string; value: ReactNode; sub?: string; tone?: BadgeTone }) {
  const color =
    tone === 'neg' ? 'text-signal-neg' : tone === 'warn' ? 'text-signal-warn'
      : tone === 'pos' ? 'text-signal-pos' : tone === 'accent' ? 'text-accent' : 'text-paper-50'
  return (
    <div className="min-w-0 px-4 py-3">
      <span className="block font-mono text-2xs uppercase tracking-[0.11em] text-paper-100/55">{label}</span>
      <span className={`mt-1 block font-serif text-[1.75rem] leading-none tnum ${color}`}>{value}</span>
      {sub && <span className="mt-1.5 block text-xs leading-snug text-paper-100/62">{sub}</span>}
    </div>
  )
}

/** Horizontal meter. Represents completeness of an artefact, never system performance. */
export function Meter({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'pos' | 'warn' | 'neg' }) {
  const bar = tone === 'pos' ? 'bg-signal-pos' : tone === 'warn' ? 'bg-signal-warn' : tone === 'neg' ? 'bg-signal-neg' : 'bg-accent'
  return (
    <span aria-hidden className="flex h-1.5 w-full overflow-hidden rounded-full bg-paper-100/12">
      <span className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  )
}

/** Persistent, unmissable statement that the records on screen are not real. */
export function SampleNotice({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-md border border-signal-info/30 bg-signal-info/[0.07] px-3 py-2 ${className}`}
    >
      <Info aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-info" />
      <p className="text-xs leading-relaxed text-paper-100/78">
        <span className="font-medium text-paper-50">Illustrative sample estate.</span>{' '}
        {compact
          ? 'Not connected to any system.'
          : 'These records are not connected to any system and contain no customer, vendor or production data. They show the shape of the artefacts the framework produces, at a realistic scale.'}
      </p>
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-mono text-2xs uppercase tracking-[0.13em] text-paper-100/55">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-paper-100/62">{body}</p>
    </div>
  )
}

export function FindingRow({
  label, detail, severity,
}: { label: string; detail: string; severity: 'high' | 'medium' | 'low' }) {
  return (
    <div className="flex items-start gap-3 border-b border-paper-100/8 px-4 py-3 last:border-b-0">
      <AlertTriangle
        aria-hidden
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${severity === 'high' ? 'text-signal-neg' : 'text-signal-warn'}`}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.84rem] font-medium text-paper-50">{label}</span>
          <Badge tone={severity === 'high' ? 'neg' : 'warn'}>{severity}</Badge>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-paper-100/72">{detail}</p>
      </div>
    </div>
  )
}
