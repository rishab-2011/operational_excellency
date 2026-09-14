# The Operating Standard — internal product preview

An early product surface for the **Enterprise Production Operations Framework (EPOF)**,
whose requirement is held in [`README.md`](./README.md).

> `README.md` is the source of truth. Where this application and the requirement differ,
> the requirement wins.

**Not** a production platform, an agent, a monitoring tool, or a client deliverable. It has
no live integrations and no customer, vendor or production data. The estate it shows is a
labelled sample.

---

## Information architecture

Six working areas, addressable by URL (`#/area/view`).

| Area | What it is for |
|---|---|
| **Overview** | What the capability governs, and the posture of a sample estate. |
| **Operating Model** | Architecture · Service register · Qualification · Contract · Context. |
| **Authority** | Estate position · Grant model · Gate evaluator · State changes. |
| **Value** | Attribution · Measurement readiness · Cause model · Metric families. |
| **Assess** | A four-step workflow: applicability → position → result → pilot. |
| **Evidence** | Objections · Prior art · Claim status · Method and sources. |

**Research apparatus is confined to Evidence.** Section citations, claim-status badges,
version numbers and methodology do not appear in the working areas — a reader in the
service register should not be reading section numbers. `src/components/citations.tsx`
enforces this with a context; a test asserts no citation leaks out of Evidence.

## Intellectual honesty

The product leads with the case against itself. **Evidence → Objections** publishes the
five strongest reasons an enterprise would reject the framework, written adversarially
before this surface was designed:

1. It becomes another source of truth — *partly answered*
2. It duplicates SRE, ITIL, catalogs and policy — *partly answered*
3. The metadata maintenance never ends — *partly answered*
4. Nobody is incentivised to do this — *partly answered*
5. Authority binding may not justify a new operating model — **unresolved**

Each carries the case at full strength, what the framework actually answers, what remains
open, and what would close it. Nothing is softened.

Elsewhere: MAPE-K is conceded before the loop is explained; a previously claimed
differentiator is shown as withdrawn; hypotheses are labelled; and no ROI figure,
percentage, utilisation claim or fake integration appears anywhere — guarded by test.

## Sample data

`src/data/estate.ts` holds ten Operated Services across six domains. Values are properties
of the **artefacts** — whether a contract area is present, whether a declared fact is
within its stated review window, what authority level is recorded. Nothing is a measurement
of a running system, because nothing is measured. Every screen that renders it says so.

One modelling decision is surfaced rather than hidden: the framework caps authority by risk
tier but does not say whether a non-mutating action with no blast radius is bound by that
ceiling. This product treats it as not bound, and states that on screen.

---

## Run it

```bash
npm install
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck, then production build |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm test` | Unit tests (framework logic) |
| `npm run test:e2e` | 42 product interaction tests |
| `npm run qa` | Responsive audit — 19 screens × 8 breakpoints |
| `npm run qa:a11y` | Contrast, focus, semantics, reduced motion |
| `npm run qa:comprehension` | Concept coverage, banned-claim guard, citation containment |
| `npm run qa:shots` | Screenshots of every screen |

QA scripts need a running server and Playwright Chromium (`npx playwright install chromium`).

## Deployment

GitHub Pages via Actions. Push to `main` lints, typechecks, tests, builds and publishes.
One-time setup: **Settings → Pages → Source: GitHub Actions**. Host elsewhere with
`BASE_PATH=/ npm run build`.

## Architecture

```
src/
  app/          Shell, routes, hash routing
  screens/      One module per area
  data/         Illustrative sample estate
  content/      Framework content as typed data, including the objections
  lib/          Pure logic: authority resolution, diagnostic scoring, attribution
  components/   Console primitives, citations context, shared primitives
  visualizations/  Architecture, causal map, gates, grid, decay, value flow
  interactions/    Gate evaluator, contract explorer, claim builder, qualification
```

Framework content stays separate from presentation: updating the requirement means
editing `src/content`, not JSX.

## Verified

31 unit tests · 42 interaction tests · 0 contrast failures across 19 screens · 144 focus
stops all with a visible ring · no horizontal overflow at 1920/1440/1280/1024/768/430/390/320
· no console errors · `prefers-reduced-motion` honoured.

## Known limitation

The prior-art analysis that would resolve objection 5 has not been run. If the authority
binding proves to be prior art, the first claim is withdrawn and what remains is a practice
rather than an operating model. That is stated in the product, not only here.
