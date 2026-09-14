# The Operating Standard — interactive executive experience

An internal, interactive presentation of the **Enterprise Production Operations Framework (EPOF)**
requirement held in [`README.md`](./README.md).

> `README.md` is the source of truth. Where this application and the requirement differ, the
> requirement wins. Every assertion rendered in the UI carries its `§` section reference.

**Audience:** senior leaders, read unaccompanied.
**Not** a product, a platform, an agent, or a client deliverable.

## The two journeys

The entry screen offers an explicit choice of depth.

| | |
|---|---|
| **Executive view** — ≈ 3 minutes | Six sections: **Why → Model → Authority → Value → Apply → Evidence**. Each shows one headline, one interactive diagram, and two or three supporting lines. The framework is understood by looking; no detail panel need be opened. |
| **Explore full framework** — ≈ 25 minutes | The eighteen chapters, with exact definitions, worked contracts, evidence grades, prior-art concessions and the claim register. |

Every executive section ends with a route into the chapter that backs it —
**See it → Understand it → Explore deeper**.

The **master architecture diagram** in *Model* is the visual anchor:

```
Operated Service
  → Operational Contract + Service Context Substrate
    → Sense → Understand → Decide → [Authority Gate] → Act → Validate
      → Learn → Improve
        ↺ updates contract · context · authority grants
```

It renders as a wide SVG above 900px and as a vertical spine below, so the composition
changes rather than shrinking.

### What is shown graphically

Causal problem model · Operated Service qualification as a gate chain · the master
architecture · Operational Contract with the Service Context Substrate · the full loop
including the authority gate and the refusal path · capability against granted authority ·
Operational Maturity × Automation Authority · context decay withdrawing authority ·
value states gated by measurement tier · prior art mapped to the loop stage it serves ·
the validation path with the pilot and the transfer point.

Diagrams are architecture, causal maps, gate chains, matrices, lifecycle flows and
state-transition visuals. **There are no statistical charts**, because there is no
measured data to plot — and no decorative graphs.

---

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/operational_excellency/` (the base path matches the repository name).

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm test` | Unit tests (framework logic) |
| `npm run test:e2e` | Interaction tests against a running dev server |
| `npm run qa` | Responsive/overflow audit across 8 breakpoints |
| `npm run qa:a11y` | Contrast, focus, semantics and reduced-motion audit |
| `npm run qa:shots` | Section screenshots into `qa/out/` |
| `npm run qa:success` | Verifies the 13 success criteria and guards against invented figures |
| `npm run qa:exec` | Verifies the framework is conveyed by the executive view with no panel opened |

The QA scripts need a server running (`npm run dev`) and use Playwright's Chromium:
`npx playwright install chromium`.

---

## Deployment

GitHub Pages via Actions — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Pushing to `main` lints, typechecks, runs unit tests, builds with
`BASE_PATH=/<repository-name>/`, and publishes `dist/`.

**One-time setup:** repository → *Settings* → *Pages* → *Source: GitHub Actions*.

Hosting elsewhere: `BASE_PATH=/ npm run build` produces a root-relative bundle. The output is
fully static — no backend, database, authentication, analytics, cookies, tracking, or external
AI calls. Nothing the reader does leaves their browser.

---

## Architecture

```
src/
  app/          App shell and chapter manifest (narrative order, nav, progress)
  sections/exec/   The six executive sections and their layout primitives
  visualizations/kit/  Shared diagram primitives (nodes, edges, captions, deeper links)
  content/      Framework content as typed data — the only place requirement text lives
  types/        Content type definitions
  lib/          Pure logic: authority resolution, diagnostic scoring, attribution paths
  components/   Nav, Footer, and shared presentation primitives
  sections/     One module per chapter
  visualizations/  Causal graph, context decay, loop, maturity matrix
  interactions/    Qualification engine, contract explorer, scenario engine, claim builder, diagnostic
  hooks/        Reveal, active section, scroll progress, reduced motion, roving index
  styles/       Design tokens and global styles
```

**Content is separate from presentation.** Requirement text lives in `src/content/*` as typed
data with a `ref` (the README section) and, where relevant, a `status`
(`claim` / `hypothesis` / `synthesis` / `withdrawn` / `illustrative`). Updating the framework
means editing content modules, not JSX.

### Design system

Deep graphite and warm off-white surfaces alternate to give the page rhythm; one restrained
copper accent carries emphasis. Newsreader (editorial), Inter (UI), JetBrains Mono (technical
keys). Tokens live in `tailwind.config.js` and `src/styles/index.css`.

Signal colours are defined twice — a lightened tone for dark surfaces and a darkened `-ink` tone
for light ones — so both clear WCAG AA for normal text.

### Accessibility

Semantic landmarks and one `h1`; keyboard operable throughout with a visible focus ring on every
control; labelled tablists, radiogroups and inputs; state conveyed by shape and text as well as
colour (the maturity grid uses ▲ ■ ▼ alongside its tints); `prefers-reduced-motion` honoured.
Verified by `npm run qa:a11y` — currently **0 contrast failures, 0 of 241 controls without a focus ring**.

### Responsiveness

Audited at 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 320 with **no horizontal overflow at any
width**. Complex visualisations change composition rather than shrinking — below 768px the
maturity matrix becomes two ladders with a position readout.

---

## Assumptions

Recorded where the requirement is silent or where the brief and the requirement disagreed.

1. **Measurement tiers and evidence grades keep the requirement's ordering.** The brief implied
   T3 was stronger than T1 and that E1→E4 was an ascending scale. §11.1 and §12.1 define **T1 and
   E1 as the strongest**. The requirement wins; the UI labels the direction explicitly.
2. **The authority scenario logic is illustrative and labelled as such.** §9.5 states risk caps
   and §9.6 states gate criteria, but no algorithm combining them. `src/lib/authorityEngine.ts`
   applies the stated rules in the order the requirement implies, and every ceiling cites its
   section.
3. **"Confidence" is shown as a derived reading.** The brief's context pipeline includes a
   confidence step; §8.2 defines provenance, freshness and decay only. It is rendered dashed and
   marked *derived reading*.
4. **Context classes beyond the two stated are derived.** §8.2 gives ownership (90d) and
   dependency topology (7d). Those are marked exact; the rest are drawn from §7.3 contract areas
   with volatility-appropriate windows marked *derived*.
5. **Causal edges express the requirement's own reasoning.** §3 lists four layers but not the
   individual links. Node text is verbatim; the `drives` edges make the attribution paths §3.1
   governs navigable, and are covered by tests that enforce strict layer ordering.
6. **The three worked contracts are constructed examples, not field artefacts** — as §10 itself
   states. The UI labels them *illustrative*.
7. **The adoption path uses §22.1's lifecycle**, not the sequence sketched in the brief, because
   the requirement defines one.
8. **The repository name is not shown.** §0 of the requirement notes "operational excellency" is
   incorrect; the UI uses *The Operating Standard* and *Enterprise Production Operations
   Framework* throughout. A test asserts the misspelling never appears.

## Not represented, deliberately

No invented ROI, percentages, utilisation figures, client names, logos, or maturity scores. No
claim is presented as settled that the requirement marks as a hypothesis, and the withdrawn
differentiator (the closed loop, conceded to MAPE-K) is shown as withdrawn rather than removed.
