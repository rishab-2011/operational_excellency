import { diagnosticBands, diagnosticQuestions } from '@/content/meta'

export interface DiagnosticResult {
  answered: number
  total: number
  raw: number
  max: number
  ratio: number
  band: (typeof diagnosticBands)[number]
  /** Per-theme ratios so the result shows where the position is uneven. */
  byTheme: { theme: string; ratio: number; score: number; max: number }[]
}

/**
 * Transparent scoring: each question scores 0–3, the result is the simple ratio of
 * points scored to points available on ANSWERED questions only. Unanswered questions
 * do not count against the reader — §21 forbids implying precision the input cannot carry.
 */
export function scoreDiagnostic(answers: Record<string, number>): DiagnosticResult | null {
  const entries = Object.entries(answers)
  if (entries.length === 0) return null

  let raw = 0
  let max = 0
  const themeMap = new Map<string, { score: number; max: number }>()

  for (const q of diagnosticQuestions) {
    const a = answers[q.id]
    if (a === undefined) continue
    raw += a
    max += 3
    const t = themeMap.get(q.theme) ?? { score: 0, max: 0 }
    t.score += a
    t.max += 3
    themeMap.set(q.theme, t)
  }

  const ratio = max === 0 ? 0 : raw / max
  const band = diagnosticBands.find((b) => ratio >= b.min && ratio < b.max) ?? diagnosticBands[0]

  return {
    answered: entries.length,
    total: diagnosticQuestions.length,
    raw,
    max,
    ratio,
    band,
    byTheme: [...themeMap.entries()]
      .map(([theme, v]) => ({ theme, ratio: v.max ? v.score / v.max : 0, score: v.score, max: v.max }))
      .sort((a, b) => a.ratio - b.ratio),
  }
}
