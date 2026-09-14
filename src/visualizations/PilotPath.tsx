import { lifecycle, thinSlice, transferPoint } from '@/content/meta'
import { Ref } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

const SLICE = new Set(['discover', 'assess', 'quantify', 'prioritise', 'design', 'pilot', 'prove'])

/** §22.1 — the lifecycle, with the thin slice and the transfer point marked. */
export function PilotPath() {
  return (
    <div>
      <ol className="flex flex-wrap gap-1.5">
        {lifecycle.map((s, i) => {
          const inSlice = SLICE.has(s.id)
          return (
            <li key={s.id} className="flex items-center gap-1.5">
              <span
                className={`flex flex-col rounded-md border px-3 py-2 ${
                  s.isNew
                    ? 'border-accent bg-accent-wash'
                    : inSlice
                      ? 'border-paper-100/25 bg-ink-850'
                      : 'border-dashed border-paper-100/15 bg-ink-850/40'
                }`}
              >
                <span className="font-mono text-2xs tnum text-paper-100/55">{String(i + 1).padStart(2, '0')}</span>
                <span className={`text-[0.82rem] ${s.isNew ? 'text-accent' : inSlice ? 'text-paper-50' : 'text-paper-100/62'}`}>
                  {s.name}
                </span>
              </span>
              {i < lifecycle.length - 1 && <span aria-hidden className="text-paper-100/55">→</span>}
            </li>
          )
        })}
      </ol>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-paper-100/25 bg-ink-850 p-4">
          <span className="eyebrow text-paper-100/55">Solid — the pilot</span>
          <p className="mt-2 text-sm leading-relaxed text-paper-100/78">
            One contained domain, existing tools, a measured baseline established before anything is promised.
          </p>
          <p className="mt-2 text-sm italic leading-relaxed text-paper-100/62">{thinSlice.text}</p>
          <div className="mt-2"><Ref s={thinSlice.ref} /></div>
        </div>
        <div className="rounded-lg border border-accent/35 bg-accent-wash p-4">
          <span className="eyebrow text-accent">Stage 08 — capability transfer</span>
          <p className="mt-2 text-sm leading-relaxed text-paper-100/80">
            The point at which you can run the assessment unaided, with the method licensed to you and your own
            assessors certified. Beyond it, more work must be justified by new value — never by retained knowledge.
          </p>
          <div className="mt-2"><Ref s={transferPoint.ref} /></div>
        </div>
      </div>

      <div className="mt-3">
        <DeeperLink to="path">Stage detail, version gates, and where this does not apply</DeeperLink>
      </div>
    </div>
  )
}
