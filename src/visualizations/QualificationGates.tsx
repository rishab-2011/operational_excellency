import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { osCandidates, osTests, verdictMeta } from '@/content/operatedService'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

const FEATURED = ['api', 'pod', 'saas', 'batch', 'monolith']

/** §2.1 — the five tests as a gate chain. A candidate stops at the first gate it fails. */
export function QualificationGates() {
  const [id, setId] = useState('pod')
  const c = osCandidates.find((x) => x.id === id)!
  const firstFail = osTests.findIndex((t) => !c.results[t.id].pass)
  const v = verdictMeta[c.verdict]

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Candidates">
        {FEATURED.map((f) => {
          const cand = osCandidates.find((x) => x.id === f)!
          return (
            <button
              key={f}
              type="button"
              aria-pressed={id === f}
              onClick={() => setId(f)}
              className={`chip border ${
                id === f
                  ? 'border-accent bg-accent-wash text-accent'
                  : 'border-paper-100/15 text-paper-100/62 hover:border-paper-100/35'
              }`}
            >
              {cand.label}
            </button>
          )
        })}
      </div>

      {/* Gate chain */}
      <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {osTests.map((t, i) => {
          const r = c.results[t.id]
          const stopped = firstFail !== -1 && i > firstFail
          return (
            <div key={t.id} className="flex flex-1 items-stretch gap-2">
              <div
                className={`flex-1 rounded-lg border px-3.5 py-3 transition-opacity ${
                  stopped
                    ? 'border-paper-100/8 bg-ink-850/40 opacity-40'
                    : r.pass
                      ? 'border-signal-pos/40 bg-signal-pos/[0.08]'
                      : 'border-signal-neg/50 bg-signal-neg/[0.10]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                      stopped ? 'border-paper-100/20 text-paper-100/55'
                        : r.pass ? 'border-signal-pos/60 text-signal-pos'
                        : 'border-signal-neg/60 text-signal-neg'
                    }`}
                  >
                    {stopped ? '·' : r.pass ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <X className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">{t.id}</span>
                  <span className="text-[0.8rem] text-paper-100/85">{t.name}</span>
                  <span className="sr-only">{stopped ? 'not reached' : r.pass ? 'passes' : 'fails'}</span>
                </div>
                {!stopped && !r.pass && (
                  <p className="mt-1.5 text-xs leading-snug text-signal-neg">{r.reason}</p>
                )}
              </div>
              {i < osTests.length - 1 && (
                <span aria-hidden className="hidden items-center text-paper-100/55 lg:flex">→</span>
              )}
            </div>
          )
        })}
      </div>

      <div
        className={`mt-3 flex flex-wrap items-center gap-2.5 rounded-lg border px-4 py-3 ${
          c.verdict === 'operated-service'
            ? 'border-signal-pos/40 bg-signal-pos/[0.08]'
            : 'border-paper-100/12 bg-ink-850'
        }`}
      >
        <span className="eyebrow text-paper-100/55">Verdict</span>
        <span
          className={`chip border ${
            c.verdict === 'operated-service' ? 'border-signal-pos/50 text-signal-pos' : 'border-paper-100/25 text-paper-100/75'
          }`}
        >
          {v.label}
        </span>
        <Ref s={c.ref} />
        <span className="w-full text-sm leading-relaxed text-paper-100/72 sm:w-auto sm:flex-1">
          {firstFail === -1 ? 'All five gates pass.' : `Stops at ${osTests[firstFail].id}. Everything after is moot.`}
        </span>
      </div>

      <div className="mt-3">
        <DeeperLink to="unit">All ten shapes, test by test</DeeperLink>
      </div>
    </div>
  )
}
