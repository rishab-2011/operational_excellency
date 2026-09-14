import type { ReactNode } from 'react'

/**
 * Shared diagram primitives.
 *
 * Diagrams carry the framework's structure, so they must be readable without colour
 * and must never imply data that does not exist. Nothing here draws a statistical
 * chart; these are architecture, flow, gate and state visuals.
 */

export const DIAGRAM_COLORS = {
  accent: '#C87F43',
  accentBright: '#D89355',
  line: 'rgba(245,243,238,0.22)',
  lineStrong: 'rgba(245,243,238,0.38)',
  surface: '#171B20',
  surfaceDeep: '#0C0E11',
  text: '#F5F3EE',
  muted: 'rgba(245,243,238,0.55)',
  pos: '#93C4A0',
  warn: '#E0B76B',
  neg: '#E29184',
} as const

/** Wraps an SVG with an accessible name and description. */
export function Figure({
  label, description, children, className = '', viewBox,
}: {
  label: string
  description: string
  children: ReactNode
  className?: string
  viewBox: string
}) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={label}
      className={`block h-auto w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{label}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  )
}

/** Arrowhead marker set — defined once per diagram that needs them. */
export function ArrowDefs({ id = 'ah' }: { id?: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill={DIAGRAM_COLORS.lineStrong} />
      </marker>
      <marker id={`${id}-accent`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill={DIAGRAM_COLORS.accent} />
      </marker>
      <pattern id={`${id}-hatch`} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(226,145,132,0.45)" strokeWidth="1.4" />
      </pattern>
    </defs>
  )
}

/** A labelled box in a flow diagram. */
export function NodeBox({
  x, y, w, h, title, sub, tone = 'default', dim = false, rx = 6,
}: {
  x: number; y: number; w: number; h: number
  title: string; sub?: string
  tone?: 'default' | 'accent' | 'gate' | 'substrate'
  dim?: boolean; rx?: number
}) {
  const stroke =
    tone === 'accent' || tone === 'gate' ? DIAGRAM_COLORS.accent
    : tone === 'substrate' ? 'rgba(200,127,67,0.5)'
    : DIAGRAM_COLORS.line
  const fill =
    tone === 'gate' ? 'rgba(200,127,67,0.14)'
    : tone === 'accent' ? 'rgba(200,127,67,0.10)'
    : tone === 'substrate' ? 'rgba(200,127,67,0.06)'
    : 'rgba(245,243,238,0.035)'
  return (
    <g opacity={dim ? 0.32 : 1} style={{ transition: 'opacity 220ms' }}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={tone === 'gate' ? 1.6 : 1} />
      <text
        x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 5}
        textAnchor="middle"
        fill={tone === 'default' ? DIAGRAM_COLORS.text : DIAGRAM_COLORS.accentBright}
        fontSize="15" fontWeight="500"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2} y={y + h / 2 + 15}
          textAnchor="middle" fill={DIAGRAM_COLORS.muted} fontSize="11"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '0.08em' }}
        >
          {sub.toUpperCase()}
        </text>
      )}
    </g>
  )
}

/** Straight connector between two points. */
export function Edge({
  d, accent = false, dashed = false, markerId = 'ah', dim = false,
}: { d: string; accent?: boolean; dashed?: boolean; markerId?: string; dim?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? DIAGRAM_COLORS.accent : DIAGRAM_COLORS.lineStrong}
      strokeWidth={accent ? 1.6 : 1.2}
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={`url(#${accent ? `${markerId}-accent` : markerId})`}
      opacity={dim ? 0.3 : 1}
      style={{ transition: 'opacity 220ms' }}
    />
  )
}

/** Small-caps label used inside diagrams. */
export function Caption({
  x, y, children, anchor = 'start', tone = 'muted',
}: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end'; tone?: 'muted' | 'accent' }) {
  return (
    <text
      x={x} y={y} textAnchor={anchor}
      fill={tone === 'accent' ? DIAGRAM_COLORS.accent : DIAGRAM_COLORS.muted}
      fontSize="10.5"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '0.13em' }}
    >
      {children.toUpperCase()}
    </text>
  )
}

/** "See it → Understand it → Explore deeper" — the third step. */
export function DeeperLink({
  to, children, tone = 'dark',
}: { to: string; children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <a
      href={`#${to}`}
      className={`group inline-flex max-w-full items-center gap-2 border-b py-1 text-left font-mono text-2xs uppercase leading-relaxed tracking-[0.14em] transition-colors ${
        tone === 'dark'
          ? 'border-paper-100/25 text-paper-100/72 hover:border-accent hover:text-accent'
          : 'border-ink-900/25 text-ink-900/72 hover:border-accent-ink hover:text-accent-ink'
      }`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </a>
  )
}
