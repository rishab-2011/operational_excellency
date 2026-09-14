import { describe, expect, it } from 'vitest'
import { scoreDiagnostic } from './diagnostic'
import { diagnosticQuestions } from '@/content/meta'

describe('scoreDiagnostic', () => {
  it('returns null with no answers rather than implying a score', () => {
    expect(scoreDiagnostic({})).toBeNull()
  })

  it('scores only answered questions, so partial completion is not penalised', () => {
    const r = scoreDiagnostic({ [diagnosticQuestions[0].id]: 3 })!
    expect(r.raw).toBe(3)
    expect(r.max).toBe(3)
    expect(r.ratio).toBe(1)
    expect(r.answered).toBe(1)
    expect(r.total).toBe(diagnosticQuestions.length)
  })

  it('places an all-zero response in Emerging', () => {
    const answers = Object.fromEntries(diagnosticQuestions.map((q) => [q.id, 0]))
    expect(scoreDiagnostic(answers)!.band.label).toBe('Emerging')
  })

  it('places an all-maximum response in Advanced', () => {
    const answers = Object.fromEntries(diagnosticQuestions.map((q) => [q.id, 3]))
    const r = scoreDiagnostic(answers)!
    expect(r.band.label).toBe('Advanced')
    expect(r.ratio).toBe(1)
  })

  it('assigns a band for every possible ratio', () => {
    for (let i = 0; i <= 45; i++) {
      const answers: Record<string, number> = {}
      let left = i
      for (const q of diagnosticQuestions) {
        const v = Math.min(3, left)
        answers[q.id] = v
        left -= v
      }
      expect(scoreDiagnostic(answers)!.band).toBeDefined()
    }
  })

  it('surfaces weakest themes first so the result is actionable', () => {
    const answers: Record<string, number> = {}
    diagnosticQuestions.forEach((q, i) => { answers[q.id] = i === 0 ? 0 : 3 })
    const r = scoreDiagnostic(answers)!
    expect(r.byTheme[0].theme).toBe(diagnosticQuestions[0].theme)
    expect(r.byTheme[0].ratio).toBe(0)
  })

  it('offers four options per question, scored 0-3', () => {
    for (const q of diagnosticQuestions) {
      expect(q.options).toHaveLength(4)
      expect(q.options.map((o) => o.score)).toEqual([0, 1, 2, 3])
    }
  })

  it('stays within the 10-15 question bound set by the brief', () => {
    expect(diagnosticQuestions.length).toBeGreaterThanOrEqual(10)
    expect(diagnosticQuestions.length).toBeLessThanOrEqual(15)
  })
})
