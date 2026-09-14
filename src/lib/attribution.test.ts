import { describe, expect, it } from 'vitest'
import { downstreamOf, pathsFromRoot, upstreamOf } from './attribution'
import { taxonomy } from '@/content/taxonomy'

describe('causal taxonomy integrity', () => {
  it('has exactly four layers populated', () => {
    for (const layer of ['root', 'mechanism', 'symptom', 'outcome'] as const) {
      expect(taxonomy.filter((n) => n.layer === layer).length).toBeGreaterThan(0)
    }
  })

  it('numbers nodes 1..26 without gaps or duplicates', () => {
    const ns = taxonomy.map((n) => n.n).sort((a, b) => a - b)
    expect(ns).toEqual(Array.from({ length: 26 }, (_, i) => i + 1))
  })

  it('only ever points to the next layer down', () => {
    const order = { root: 0, mechanism: 1, symptom: 2, outcome: 3 }
    const byId = new Map(taxonomy.map((n) => [n.id, n]))
    for (const n of taxonomy) {
      for (const d of n.drives) {
        const t = byId.get(d)
        expect(t, `${n.id} -> ${d}`).toBeDefined()
        expect(order[t!.layer]).toBe(order[n.layer] + 1)
      }
    }
  })

  it('terminates at outcomes — value can be claimed nowhere else', () => {
    for (const n of taxonomy.filter((x) => x.layer === 'outcome')) {
      expect(n.drives).toHaveLength(0)
    }
  })

  it('gives every root cause at least one complete attribution path', () => {
    for (const r of taxonomy.filter((n) => n.layer === 'root')) {
      expect(pathsFromRoot(r.id).length, r.id).toBeGreaterThan(0)
    }
  })

  it('builds paths of exactly root -> mechanism -> symptom -> outcome', () => {
    const p = pathsFromRoot('r3')[0]
    expect(p.root.layer).toBe('root')
    expect(p.mechanism.layer).toBe('mechanism')
    expect(p.symptom.layer).toBe('symptom')
    expect(p.outcome.layer).toBe('outcome')
  })

  it('reaches outcomes downstream of every root', () => {
    for (const r of taxonomy.filter((n) => n.layer === 'root')) {
      const d = downstreamOf(r.id)
      expect([...d].some((id) => id.startsWith('o'))).toBe(true)
    }
  })

  it('reaches roots upstream of every outcome', () => {
    for (const o of taxonomy.filter((n) => n.layer === 'outcome')) {
      const u = upstreamOf(o.id)
      expect([...u].some((id) => id.startsWith('r')), o.id).toBe(true)
    }
  })

  it('leaves no orphan mechanisms or symptoms', () => {
    const targeted = new Set(taxonomy.flatMap((n) => n.drives))
    for (const n of taxonomy.filter((x) => x.layer !== 'root')) {
      expect(targeted.has(n.id), `${n.id} is unreachable`).toBe(true)
    }
  })
})
