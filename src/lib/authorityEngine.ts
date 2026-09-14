/**
 * Illustrative authority resolution.
 *
 * This is NOT a decision engine the framework defines. README v0.2 defines the risk-tier
 * caps (§9.5) and the gate criteria (§9.6); it does not define an algorithm that combines
 * them. The logic below applies those stated rules in the order the requirement implies,
 * so that a reader can see how capability and authority separate.
 *
 * Every ceiling returned cites the section it derives from, and the UI labels the whole
 * interaction as illustrative.
 */

export interface ScenarioFactors {
  /** Risk tier of the Operated Service, R1..R4. */
  riskTier: 'R1' | 'R2' | 'R3' | 'R4'
  /** Blast radius has been declared and bounded (§9.6). */
  blastRadiusDeclared: boolean
  /** Rollback/abort path exists AND has been tested, not merely documented (§9.6). */
  rollbackTested: boolean
  /** Context facts the action depends on are within freshness SLA (§9.6, §8.4). */
  contextFresh: boolean
  /** Successful supervised executions accumulated at the current level (§9.6). */
  executionHistory: number
  /** Whether the current failure mode has been seen before (§17.2 — humans hold novel modes). */
  failureModeKnown: boolean
  /** Health/observability at the action's boundary is complete enough to validate (§6.3). */
  observabilityComplete: boolean
  /** The grant currently recorded in the contract for this action class. */
  grantedLevel: number
}

export interface Ceiling {
  level: number
  reason: string
  ref: string
}

export interface AuthorityResolution {
  /** The level that may actually be exercised right now. */
  effective: number
  /** The grant recorded in the contract. */
  granted: number
  /** Ceilings that bound the outcome, strongest (lowest) first. */
  ceilings: Ceiling[]
  /** The single binding constraint, or null when the grant is exercisable in full. */
  binding: Ceiling | null
  /** True when the recorded grant exceeds what conditions currently support (§9.7 above-diagonal). */
  aboveDiagonal: boolean
  /** Gate criteria met/unmet, for display against §9.6. */
  gates: { id: string; met: boolean; label: string; ref: string }[]
}

export const RISK_CAPS: Record<ScenarioFactors['riskTier'], number> = {
  R1: 3, R2: 4, R3: 5, R4: 5,
}

/** §9.6 hypothesis thresholds. Explicitly unproven in the requirement. */
export const HISTORY_THRESHOLD = 20

export function resolveAuthority(f: ScenarioFactors): AuthorityResolution {
  const ceilings: Ceiling[] = []

  // §9.5 — risk tier caps the maximum grantable level.
  ceilings.push({
    level: RISK_CAPS[f.riskTier],
    reason: `Risk tier ${f.riskTier} caps grantable authority`,
    ref: '§9.5',
  })

  // §9.6 — blast radius must be declared and bounded for any unsupervised action.
  if (!f.blastRadiusDeclared) {
    ceilings.push({ level: 1, reason: 'Blast radius is not declared and bounded', ref: '§9.6' })
  }

  // §9.6 — a tested abort path is required before the machine performs unattended.
  if (!f.rollbackTested) {
    ceilings.push({ level: 2, reason: 'Rollback or abort path is not tested, only documented', ref: '§9.6' })
  }

  // §8.4 — A3+ is unsafe on stale context; automated action would enlarge blast radius.
  if (!f.contextFresh) {
    ceilings.push({ level: 2, reason: 'Context facts are outside their freshness SLA', ref: '§8.4 · §9.6' })
  }

  // §6.3 — Validate must be able to confirm recovery, not just completion.
  if (!f.observabilityComplete) {
    ceilings.push({ level: 3, reason: 'Recovery cannot be independently validated at this boundary', ref: '§6.3' })
  }

  // §17.2 — novel failure modes remain with humans by definition.
  if (!f.failureModeKnown) {
    ceilings.push({ level: 1, reason: 'Failure mode is novel — humans hold ambiguity and novel modes', ref: '§17.2' })
  }

  // §9.6 — execution history gates ADVANCEMENT beyond the current grant, not the grant itself.
  if (f.executionHistory < HISTORY_THRESHOLD) {
    ceilings.push({
      level: f.grantedLevel,
      reason: `Execution history (${f.executionHistory}) is below the ${HISTORY_THRESHOLD}-execution gate, so the grant cannot advance`,
      ref: '§9.6',
    })
  }

  const lowest = ceilings.reduce((a, c) => (c.level < a.level ? c : a), ceilings[0])
  const effective = Math.max(0, Math.min(f.grantedLevel, lowest.level))
  const binding = effective < f.grantedLevel ? lowest : null

  return {
    effective,
    granted: f.grantedLevel,
    ceilings: [...ceilings].sort((a, b) => a.level - b.level),
    binding,
    aboveDiagonal: effective < f.grantedLevel,
    gates: [
      { id: 'blast', met: f.blastRadiusDeclared, label: 'Blast radius declared and bounded', ref: '§9.6' },
      { id: 'rollback', met: f.rollbackTested, label: 'Abort path tested, not merely documented', ref: '§9.6' },
      { id: 'context', met: f.contextFresh, label: 'Context within freshness SLA', ref: '§9.6' },
      { id: 'history', met: f.executionHistory >= HISTORY_THRESHOLD, label: `Execution history ≥ ${HISTORY_THRESHOLD}`, ref: '§9.6' },
      { id: 'observability', met: f.observabilityComplete, label: 'Recovery independently validatable', ref: '§6.3' },
      { id: 'novel', met: f.failureModeKnown, label: 'Failure mode is known', ref: '§17.2' },
    ],
  }
}

/** Plain-language outcome for the resolved level. */
export function authorityOutcome(level: number): { verdict: string; detail: string } {
  switch (level) {
    case 0: return { verdict: 'Human performs', detail: 'No machine action. The recommendation may be shown but not executed.' }
    case 1: return { verdict: 'Machine recommends', detail: 'The agent may propose the restart. A human decides and performs it.' }
    case 2: return { verdict: 'Machine performs, human approves each execution', detail: 'The action may run only on explicit per-execution approval.' }
    case 3: return { verdict: 'Machine performs within declared bounds', detail: 'Guardrailed. The human is notified and can abort.' }
    case 4: return { verdict: 'Machine performs and validates', detail: 'Delegated. The human reviews after the fact.' }
    default: return { verdict: 'Machine operates within a policy envelope', detail: 'Conditional autonomy. The human governs the envelope, not the actions.' }
  }
}
