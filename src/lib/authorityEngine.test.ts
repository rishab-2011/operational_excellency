import { describe, expect, it } from 'vitest'
import { HISTORY_THRESHOLD, RISK_CAPS, authorityOutcome, resolveAuthority, type ScenarioFactors } from './authorityEngine'

const ideal: ScenarioFactors = {
  riskTier: 'R3',
  blastRadiusDeclared: true,
  rollbackTested: true,
  contextFresh: true,
  executionHistory: 40,
  failureModeKnown: true,
  observabilityComplete: true,
  grantedLevel: 4,
}

describe('resolveAuthority', () => {
  it('exercises the full grant when every gate is met and risk allows', () => {
    const r = resolveAuthority(ideal)
    expect(r.effective).toBe(4)
    expect(r.binding).toBeNull()
    expect(r.aboveDiagonal).toBe(false)
  })

  it('caps at the risk tier ceiling (§9.5) — R1 cannot exceed A3', () => {
    const r = resolveAuthority({ ...ideal, riskTier: 'R1', grantedLevel: 5 })
    expect(r.effective).toBe(RISK_CAPS.R1)
    expect(r.binding?.ref).toContain('§9.5')
  })

  it('never returns more than the recorded grant', () => {
    const r = resolveAuthority({ ...ideal, riskTier: 'R4', grantedLevel: 2 })
    expect(r.effective).toBe(2)
  })

  it('drops to A1 when blast radius is not declared (§9.6)', () => {
    const r = resolveAuthority({ ...ideal, blastRadiusDeclared: false })
    expect(r.effective).toBe(1)
    expect(r.aboveDiagonal).toBe(true)
  })

  it('drops to A2 when the abort path is untested (§9.6)', () => {
    const r = resolveAuthority({ ...ideal, rollbackTested: false })
    expect(r.effective).toBe(2)
  })

  it('drops to A2 on stale context — A3+ is unsafe without fresh context (§8.4)', () => {
    const r = resolveAuthority({ ...ideal, contextFresh: false })
    expect(r.effective).toBe(2)
    expect(r.binding?.ref).toContain('§8.4')
  })

  it('drops to A1 on a novel failure mode (§17.2)', () => {
    const r = resolveAuthority({ ...ideal, failureModeKnown: false })
    expect(r.effective).toBe(1)
  })

  it('caps at A3 when recovery cannot be independently validated (§6.3)', () => {
    const r = resolveAuthority({ ...ideal, observabilityComplete: false, grantedLevel: 5, riskTier: 'R3' })
    expect(r.effective).toBe(3)
  })

  it('holds the existing grant when history is below the gate but does not reduce it', () => {
    const r = resolveAuthority({ ...ideal, executionHistory: HISTORY_THRESHOLD - 1, grantedLevel: 3 })
    expect(r.effective).toBe(3)
    expect(r.gates.find((g) => g.id === 'history')?.met).toBe(false)
  })

  it('applies the strictest ceiling when several bind at once', () => {
    const r = resolveAuthority({ ...ideal, blastRadiusDeclared: false, rollbackTested: false, contextFresh: false })
    expect(r.effective).toBe(1)
  })

  it('never returns a negative level', () => {
    const r = resolveAuthority({ ...ideal, grantedLevel: 0, failureModeKnown: false })
    expect(r.effective).toBe(0)
  })

  it('reports every gate with a section reference', () => {
    const r = resolveAuthority(ideal)
    expect(r.gates).toHaveLength(6)
    for (const g of r.gates) expect(g.ref).toMatch(/§/)
  })
})

describe('authorityOutcome', () => {
  it('describes each level distinctly', () => {
    const verdicts = [0, 1, 2, 3, 4, 5].map((l) => authorityOutcome(l).verdict)
    expect(new Set(verdicts).size).toBe(6)
  })
  it('keeps A0 free of machine action', () => {
    expect(authorityOutcome(0).detail).toMatch(/No machine action/)
  })
})
