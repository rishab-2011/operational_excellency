# Enterprise Production Operations Framework — Requirements v0.2

**Status:** Working Requirement — supersedes v0.1 (2026-09-02)
**Revised:** 2026-09-14
**Working title:** Enterprise Production Operations Framework (EPOF)
**Note:** Framework name intentionally not locked. Note the correct English term is *operational excellence*, not "excellency"; the repository name should be corrected before any artefact derives from it.

---

## 0. Changelog — What Changed From v0.1 and Why

v0.1 was a well-governed container with an untested core. It forbade the right things but asserted intellectual property it had not compared against prior art, and it could not be executed because its foundational unit was undefined. v0.2 closes those gaps.

| # | Change | Reason |
|---|---|---|
| 1 | Added §2 **Operated Service** — a testable unit of analysis with a decomposition rule | v0.1 used *service / product / domain / workload* interchangeably. Nothing could be scored, aggregated or compared without this. |
| 2 | **Acknowledged MAPE-K as prior art**; loop restructured into inner/outer and the IP claim narrowed to authority binding | v0.1's loop was IBM autonomic computing (2001–03) renamed. §18.14 of v0.1 obliged us to say so. |
| 3 | **Narrowed the Operational Contract claim** to risk-tier-and-automation-authority bound to outcomes and ownership in one artefact | Identity, ownership, dependency and SLO content already exists in Backstage-style catalogs, OpenSLO and Google's PRR. |
| 4 | Added §10 **three worked contract instantiations**, and the findings from writing them | The construct was untested. Writing it broke it, usefully. |
| 5 | Maturity split into **two axes** — Operational Maturity (M0–M4) × Automation Authority (A0–A5), the latter *granted* not achieved | v0.1's single ladder implied automation equals maturity, contradicting its own caveat and guaranteeing objection from regulated estates. |
| 6 | Added **Measurement Readiness tiers** (T1/T2/T3) and a rule binding value claims to tier | v0.1 demanded measured baselines from estates it described as unable to measure. |
| 7 | Added **Evidence grades** (E1–E4) and a mandatory claims register | v0.1 banned unsupported claims without defining how a hypothesis is promoted to a claim. |
| 8 | Added **Service Context Substrate** as a first-class pillar with provenance, freshness and decay | Context rot is why "enrich alerts with service context" programmes die. This is now our strongest differentiator candidate. |
| 9 | **Consolidated five ladders into three**; merged the two conflicting engagement lifecycles; merged quality bar and readiness gate | 42 named stages across five sequences read as management theatre to practitioners. |
| 10 | Problem taxonomy **restructured causally** with a no-double-counting rule | v0.1's flat list of 25 mixed root causes, mechanisms, symptoms and outcomes, guaranteeing inflated value claims. |
| 11 | Pillars reduced **11 → 6** | Several were the same pillar viewed from different angles. |
| 12 | Added **boundary conditions**, **capability transfer**, **adoption and consent model**, **workforce transition position** | Each was an unanswered objection that a skeptical CIO, an SRE lead, or an L1 manager would raise in the first meeting. |
| 13 | Reliability metrics moved from **mean MTTR to distributional and coordination measures** | Mean MTTR is statistically weak on long-tailed, small-n incident data. Leading with it costs practitioner credibility immediately. |
| 14 | Added **§20 delivery schedule** with a thin vertical slice and version gates | "We will not rush" with no schedule is how v0.1 stays v0.1. |
| 15 | Disambiguated **DORA** throughout | In financial services DORA means the EU Digital Operational Resilience Act. Unqualified use in a bank will confuse the room. |

---

## 1. Executive Intent

Develop a company-agnostic, industry-agnostic, domain-agnostic enterprise production-operations framework, applicable to an existing production estate — legacy, modern, cloud, containerised, batch, API-driven or hybrid — to improve how that estate is operated.

The framework sits above and integrates with existing operational capabilities and tools. It does not assume rip-and-replace.

It defines what good production operations look like, assesses current state, identifies value leakage and operational gaps, prioritises improvements, and provides a credible path toward more reliable, risk-aware, cost-efficient, automated and — where and only where justified — human-governed autonomous operations.

**The framework itself is the core intellectual property.** Client-specific proposals, presentations, implementation plans, accelerators or products may be derived from it later.

### 1.1 North Star

> Every production service should be operated through a defined, measurable, continuously improving operational contract, with decisions driven by customer and business impact, and with machine authority granted by risk and evidence rather than by ambition.

The second clause is new in v0.2 and is the sentence the framework must defend.

---

## 2. The Operated Service — Unit of Analysis

**This section is foundational. Every other section depends on it.** v0.1 had no defined unit; assessment, scoring, aggregation and cross-client comparison were therefore all unexecutable.

### 2.1 Definition

An **Operated Service (OS)** is the atomic unit of production-operational accountability. A candidate is an Operated Service if and only if it passes all five tests:

| Test | Question | Fails if |
|---|---|---|
| **T1 Accountability** | Is there exactly one team that can authorise a change to it? | Ownership is shared, disputed or absent |
| **T2 Independent failure** | Can it fail in a way distinguishable from its neighbours? | Its failure is indistinguishable from a parent's |
| **T3 Observable boundary** | Does at least one signal indicate its health independently? | Health is only inferable from something else |
| **T4 Independent recovery** | Can it be restarted, rolled back, failed over or restored as a unit? | Recovery necessarily acts on a larger unit |
| **T5 Outcome traceability** | Does it support a named customer journey or business capability, directly or through a declared dependency? | No path to any business outcome can be drawn |

### 2.2 Decomposition rule

1. Start from **business capabilities**, not from infrastructure.
2. Descend the technical estate until a candidate passes all five tests.
3. **Stop descending** when a candidate fails T1 or T4. Something you cannot own or cannot recover independently is a *component*, not an Operated Service.
4. Where decomposition disagrees with the organisation chart, **record the mismatch as a finding**. It is a Conway's-law signal and frequently the single most valuable output of discovery. Do not force the decomposition to match the org chart, and do not force the org chart to match the decomposition.

### 2.3 What is not an Operated Service

Infrastructure primitives, libraries, individual pods or containers, network segments, and databases — *unless* independently owned and independently recoverable, in which case they qualify. Shared platforms **do** qualify and carry their own contract with their consumers as declared dependents.

### 2.4 Edge cases — resolved

| Case | Resolution |
|---|---|
| **Vendor SaaS** | Qualifies. You operate the integration, the fallback and the degradation path. The contract covers what you control; internals are declared out-of-boundary. |
| **Batch job chain** | A chain with one owner, one deadline and one recovery procedure is **one** Operated Service. Independently rerunnable stages with separate owners are separate ones. |
| **Shared platform (e.g. a Kubernetes estate)** | Qualifies, with consumers as declared dependents and a consumer-facing contract. |
| **Monolith with several business functions** | One Operated Service until the functions become independently deployable and recoverable. Do not model aspiration. |

### 2.5 Aggregation

**Operated Service → Service Group → Domain → Estate.**

Roll-up is **criticality-weighted, never a simple mean.** A simple average hides a failing critical service behind healthy trivial ones, which is the defect that makes most enterprise maturity dashboards useless. Estate-level scores must always be published alongside the worst-performing R1 service.

---

## 3. The Problem — Causal Taxonomy

v0.1 listed 25 problems at four different levels of abstraction as if they were peers. That guarantees double-counting in the value model. v0.2 structures them causally.

### Layer 1 — Root causes (structural)
1. Ownership ambiguity
2. Tool fragmentation and duplicated capability
3. Absent or decaying service context
4. Absent or inconsistent operational standards
5. Skills and incentive misalignment
6. Integration and data-quality debt

### Layer 2 — Mechanisms (how root causes bite)
7. Signal noise and false positives
8. Weak or inconsistent health definitions
9. Dependency blindness
10. Manual change validation
11. Tribal-knowledge dependency
12. Excessive human handoffs
13. Weak reversibility and rollback readiness
14. Weak post-incident learning loop

### Layer 3 — Symptoms (observable in operations)
15. Slow incident triage
16. Reactive operating posture
17. Repeat incidents
18. High escalation rate
19. High manual toil
20. Unrealised tool capability

### Layer 4 — Business outcomes (what the executive feels)
21. Customer-impact minutes
22. Linear support-cost growth as the estate scales
23. Change-failure cost
24. Unrealised platform investment
25. Constrained ability to scale operations
26. Unquantified operational risk exposure

### 3.1 The no-double-counting rule

> **Value may be claimed only at Layer 4, and must be attributed through a named Layer 2 mechanism to a named Layer 1 root cause.**

A remediation that addresses one mechanism may not claim benefit against every symptom that mechanism touches. Each claimed benefit carries exactly one attribution path. This single rule is what separates a defensible value model from a consulting addition exercise, and it is the reason the taxonomy is structured rather than listed.

---

## 4. Positioning

The framework is **not**: a monitoring product, an APM or observability replacement, a ServiceNow or Datadog replacement, an SRE team replacement, an L1-elimination programme, an AI-first gimmick, a single-company transformation, a payments-specific or cloud-only model, or a one-time cleanup.

The framework **is**: a vendor-neutral operating model, an enterprise assessment methodology, a two-axis maturity model, a value-realisation model, a transformation method, a governance model, and a reusable consulting asset that operates at the operating-model layer rather than the tooling layer.

---

## 5. Value Dimensions

### 5.1 Reliability
Faster detection of meaningful failure; faster fault isolation; faster recovery; fewer avoidable incidents; better change confidence; reduced repeat incidents; stronger operational readiness.

### 5.2 Risk
Clearer operational risk; risk-based change handling; standardised validation; reduced tribal-knowledge dependency; declared blast radius; **machine authority granted against evidence**; auditable operational decisions; human oversight where blast radius demands it.

### 5.3 Cost and economic value
Reduced toil; better utilisation of existing tooling; reduced duplication; fewer unnecessary escalations; lower cost per Operated Service; reduced manual validation effort; improved engineering productivity; **sublinear support cost as the estate grows**.

**Framing rule (retained from v0.1, strengthened):** cost value is expressed as capacity release, toil elimination, productivity, scale and value realisation. Headcount reduction is never the stated objective, and §17 defines what the released capacity is redeployed to, so that this is a structural position rather than a vocabulary preference.

---

## 6. The Operational Loop — With Attribution

### 6.1 Prior art, stated plainly

The v0.1 loop (DEFINE → SENSE → UNDERSTAND → DECIDE → ACT → VALIDATE → LEARN → IMPROVE) is substantially **MAPE-K** — IBM's autonomic computing control loop (Monitor, Analyse, Plan, Execute over a shared Knowledge base, manifesto 2001, architectural blueprint 2003), which was designed for this exact problem and explicitly for progressive autonomy. It is also OODA with a learning tail, and Deming's PDCA at the outer edge.

Per the self-invalidation rule, we state this rather than claim the stages as novel.

### 6.2 What is actually ours

Three departures from MAPE-K, and these — not the stage names — constitute the claim:

1. **Joint execution with an explicit authority boundary at every stage.** MAPE-K assumes the loop is executed by an autonomic manager. EPOF's loop is executed jointly by humans and machines, and the contract declares *per action class* where the boundary sits.
2. **VALIDATE is an independent stage, not part of Execute.** MAPE-K has no first-class verification that the business outcome recovered, only that the action completed.
3. **The outer loop modifies the authority grants themselves.** Learning does not only update the knowledge base; it promotes or demotes machine authority against accumulated evidence.

### 6.3 Structure

**DEFINE is not a loop stage.** It is the Operational Contract — the governed equivalent of MAPE-K's K — and it is the substrate the loop runs on.

**Inner loop (operates at incident and event time):**

**SENSE → UNDERSTAND → DECIDE → ACT → VALIDATE**

| Stage | Content | Maps to |
|---|---|---|
| SENSE | Metrics, logs, traces, events, topology, deployment and change signals, batch signals, business indicators | Monitor |
| UNDERSTAND | Service, dependency, customer, business and risk context; change correlation; likely cause | Analyse |
| DECIDE | Severity, priority, escalation, response selection, **and whether authority exists to act without a human** | Plan |
| ACT | Remediation, routing, runbook, rollback, restart, failover, containment | Execute |
| VALIDATE | Technical recovery, service recovery, journey recovery, business recovery, side-effect check | *(no MAPE-K equivalent)* |

**Outer loop (operates at review cadence):**

**LEARN → IMPROVE**

LEARN captures incident findings, false alerts, failed automation, change outcomes, human overrides and recurring toil. IMPROVE feeds these into controls, runbooks, alert policy, service design, the contract itself, the maturity position, **and the automation authority grants**.

Separating the loops is itself a correction: v0.1 mixed a real-time control loop with a periodic improvement loop, which made both harder to operationalise.

---

## 7. The Operational Contract

### 7.1 Prior art, stated plainly

Most of the v0.1 contract already exists in the industry:

| Contract area | Existing prior art |
|---|---|
| Identity, accountability, dependencies | Backstage-style service catalogs (`catalog-info.yaml`), CMDB service records, Team Topologies ownership |
| Outcomes, SLIs/SLOs | Google SRE SLO and error-budget policy; **OpenSLO** already provides a machine-readable specification |
| Health and telemetry expectations | Observability vendor service definitions; OpenTelemetry semantic conventions |
| Change and recovery readiness | Google's Production Readiness Review; AWS Well-Architected OPS and REL question sets |
| Governance and controls | ITIL 4 service design package; ISO/IEC 20000 |

### 7.2 The narrowed claim

> **No existing construct binds risk tier, blast radius, and per-action-class machine authority into the same governed artefact as ownership, outcomes and recovery expectations.**

That binding — not the catalog content — is the intellectual property. A catalog says who owns a service. An SLO says what good looks like. A runbook says what to do. The Operational Contract states **what the machine is permitted to do unsupervised, under which conditions, on whose authority, and on what evidence** — alongside all of the above, versioned and auditable together.

This is a defensible claim. The wider claim in v0.1 was not.

### 7.3 Structure — core plus profile

Writing the three instantiations in §10 broke the single rigid schema of v0.1. The resulting structure is:

**Core (universal — every Operated Service):**
- **Identity** — name, purpose, boundary, criticality, risk tier
- **Accountability** — owner, support model, escalation path, authority holder
- **Outcomes** — customer journeys, business KPIs, service expectations *(expressed per profile — see below)*
- **Health** — health model, telemetry expectations, actionable-alert policy, signal-quality requirements
- **Dependencies** — upstream, downstream, external, failure propagation, declared out-of-boundary elements
- **Change** — risk classification, pre- and post-change validation, deployment controls, rollback expectations
- **Operations** — runbooks, known toil, automation coverage
- **Authority** — per action class: current grant (A0–A5), target grant, evidence held, abort path, blast radius
- **Recovery** — failure modes, resilience patterns, RTO/RPO where applicable, recovery validation
- **Governance** — required controls, evidence, maturity position, exceptions, improvement backlog
- **Context integrity** — provenance, freshness SLA and last-verified date for every declared fact (see §8)

**Profiles (service-type-specific overlays):** Request/Response, Scheduled Workload, Event/Stream, Vendor-Operated, Shared Platform. Each profile redefines how *Outcomes*, *Health* and *Recovery* are expressed. §10 shows why this is necessary.

### 7.4 Form

The contract should be **conceptual first, machine-readable second**. A contract that cannot be reasoned about by its owning team is theatre; a contract that cannot be read by a machine cannot govern automation. The v0.3 target is a human-authored document with a machine-readable authority and health section. No software is built in this phase — but the contract is *instantiated* by hand, which v0.1 wrongly conflated with implementation.

---

## 8. Service Context Substrate — Candidate Primary Differentiator

v0.1 required service context in UNDERSTAND, required "machine-usable knowledge" for AI, and named its third maturity level *Context-Aware* — without ever stating where context lives, who maintains it, or how it is kept true.

This is not an oversight to patch quietly. **Context decay is the reason service-context programmes fail.** CMDB accuracy degrades measurably from the moment the last audit ends. Every framework in this space — SRE, ITIL, Well-Architected, the AIOps vendors — leaves context maintenance as an exercise for the reader. That gap is available.

### 8.1 Position

> Service context is an **operated asset with its own contract**, not a one-time data-collection exercise. Context that is not maintained is not context; it is a historical record being mistaken for a current one.

### 8.2 Three engineered properties

| Property | Requirement |
|---|---|
| **Provenance** | Every context fact carries its source class — **declared** (asserted by the owning team), **discovered** (observed from the running estate), or **inferred** (derived, with method stated) — and a named owner. |
| **Freshness** | Every fact carries a maximum age appropriate to its volatility. Ownership may be valid for 90 days; dependency topology for 7. An expired fact is rendered **stale**, never silently trusted. |
| **Decay monitoring** | Drift between *declared* and *discovered* context is measured continuously. Drift rate is itself a maturity indicator and frequently the earliest signal that an operating model is degrading. |

### 8.3 Measurable

- **Context integrity**: percentage of declared facts within their freshness SLA
- **Declared-versus-discovered drift rate**: percentage of facts where assertion and observation disagree
- **Context coverage**: percentage of Operated Services with a complete core contract
- **Stale-context incident rate**: incidents where response was delayed or misrouted by out-of-date context

The fourth is the one that converts this from a hygiene argument into a reliability argument, and it is directly measurable from incident review.

### 8.4 Why this matters to the framework's own claims

M3 (Context-Aware) is unreachable without it. A3+ automation authority is unsafe without it — automated action on stale dependency data enlarges blast radius rather than containing it. And every AI use case in §16 degrades in proportion to context staleness. Context integrity is therefore a **gate**, not a pillar among equals.

---

## 9. Maturity — Two Axes

### 9.1 Why v0.1's single ladder was wrong

v0.1's L0–L6 conflated capability quality (L0–L4) with degree of automation (L5–L6). Under that model a payments settlement service that is beautifully instrumented, fully context-aware, risk-aware, and *deliberately never automated* for regulatory and blast-radius reasons scores L4 and appears immature. v0.1 noticed the problem in a caveat and left the structure contradicting it.

### 9.2 Axis 1 — Operational Maturity (M0–M4)

*Earned. Higher is better. Every Operated Service should aim to climb.*

| Level | Name | Defining condition |
|---|---|---|
| **M0** | Reactive | Human-dependent, fragmented, inconsistent. Failure is learned about from users. |
| **M1** | Visible | Ownership, basic monitoring and operational awareness exist. Health is asserted. |
| **M2** | Standardised | A common operating baseline and repeatable practices exist and are followed. |
| **M3** | Context-Aware | Signals are enriched with service, dependency, customer and business context, and that context meets its integrity thresholds (§8). |
| **M4** | Risk-Adaptive | Operational decisions use risk, anomaly, change and impact intelligence; the operating model adapts from measured outcomes. |

### 9.3 Axis 2 — Automation Authority (A0–A5)

*Granted, not achieved. Higher is not better. The correct level is the authorised level.*

| Level | Name | Machine does | Human does |
|---|---|---|---|
| **A0** | Manual | Nothing | Everything |
| **A1** | Assisted | Recommends | Decides and performs |
| **A2** | Supervised | Performs | Approves each execution |
| **A3** | Guardrailed | Performs within declared bounds | Is notified, can abort |
| **A4** | Delegated | Performs and validates | Reviews after the fact |
| **A5** | Conditional Autonomy | Operates within a policy envelope | Governs the envelope, not the actions |

This ladder is deliberately shaped to mirror **SAE J3016** driving-automation levels, which gives an executive audience an immediately legible analogue and gives us external precedent instead of a seventh invented scale.

### 9.4 The four rules that make this work

1. **Authority is granted per action class per Operated Service — never per service wholesale.** On the same service, *restart a stateless worker* may sit at A4 while *fail over the region* remains at A1. This is the single most important rule on the page. v0.1's per-service ladder could not express it.
2. **Target authority is set by risk tier and evidence, not ambition.** Risk tier caps the maximum grantable level (§9.5).
3. **Scoring is against target, not against A5.** A service operating at its authorised level scores full marks. There is no penalty for being correctly manual.
4. **Advancement requires evidence, and demotion is automatic on evidence loss.** Authority is not a status; it is a revocable grant.

### 9.5 Risk tiers and authority caps

| Tier | Definition | Default authority cap |
|---|---|---|
| **R1** | Customer-facing revenue, safety or regulatory impact; wide blast radius | **A3** — exceptions require governance board approval |
| **R2** | Significant business impact; contained blast radius | A4 |
| **R3** | Moderate impact; recoverable; limited propagation | A5 |
| **R4** | Low impact; internal; trivially reversible | A5 |

### 9.6 Authority gate criteria

To advance an action class one level, all of the following must hold:

- Blast radius is **declared and bounded**
- A rollback or abort path exists and has been **tested**, not merely documented
- Context facts the action depends on are **within their freshness SLA** (§8)
- A minimum execution history at the current level: **≥ 20 executions with ≥ 95% success and zero unrecovered side effects** *(these thresholds are a hypothesis — see the claims register; they must be validated in pilot, not asserted)*
- A named accountable authority holder has approved the grant
- Demotion triggers are declared in advance

### 9.7 The grid

Plotting M against A produces the assessment's central artefact. Two readings matter:

- **Below the diagonal** — maturity exceeds granted authority. Usually safe, often wasteful: the estate has earned automation it has not been permitted. This is where capacity release lives.
- **Above the diagonal** — authority exceeds maturity. This is **operational danger**: machines are acting with more freedom than the context and evidence justify. Flagging this is one of the framework's most defensible safety contributions, and no existing maturity model surfaces it.

---

## 10. Worked Instantiations — and What They Broke

v0.1 forbade implementation and, in doing so, also prevented the cheapest possible test of its own core IP. Writing a contract by hand is a document exercise, not software. Three were written against maximally different service shapes. All three broke the v0.1 schema. That is the most useful result in this revision.

### 10.1 Instantiation A — Overnight batch settlement chain *(Scheduled Workload profile)*

| Field | Value |
|---|---|
| Identity | Nightly settlement extract-transform-load chain, 14 stages, single owner, R1 |
| Outcomes | **Not availability.** *Completion by 05:30 with zero unreconciled records.* |
| Health | Binary and time-boxed: on-track / at-risk-of-deadline / breached. There is no meaningful "99.9% healthy". |
| Dependencies | **Temporal, not request-path.** Stage 9 depends on stage 8 having completed, and on a file arriving from an upstream partner by 02:00. |
| Recovery | Rerun-from-checkpoint, with a hard cutoff after which recovery becomes a business-process exercise rather than a technical one. |
| Authority | *Rerun failed stage* → A3. *Extend the deadline window* → A0, permanently: it is a business decision, not an operational one. |

**What broke:** SLI/SLO as availability is meaningless here. Dependency modelling assumed synchronous request paths. Recovery assumed restoration of service rather than completion of work.

### 10.2 Instantiation B — Customer-facing cloud API *(Request/Response profile)*

| Field | Value |
|---|---|
| Identity | Public quote-retrieval API, R2 |
| Outcomes | Standard SLIs — availability, latency p99, error rate — mapped to the "obtain a quote" journey |
| Health | Continuous, multi-signal, well served by existing practice |
| Dependencies | Request-path, discoverable from tracing |
| Recovery | Rolling restart, canary rollback, regional failover |
| Authority | *Restart unhealthy instance* → A4. *Roll back deployment* → A3. *Regional failover* → A1, capped by R2 and by blast radius. |

**What broke:** nothing significant. This is the shape every existing framework was designed around — which is precisely the point. A contract that only works here adds nothing.

### 10.3 Instantiation C — Vendor-operated SaaS dependency *(Vendor-Operated profile)*

| Field | Value |
|---|---|
| Identity | Third-party identity-verification SaaS, R1 by customer impact |
| Outcomes | Expressed at **our integration boundary only** — verification success rate, response time as observed by us, fallback activation rate |
| Health | Telemetry is limited to the boundary. Vendor internals are **declared out-of-boundary**, explicitly, as a contract field. |
| Dependencies | We are a downstream consumer with no topology visibility inside the vendor |
| Recovery | **Degrade and fall back — we cannot fix.** RTO is contractual, not engineered. |
| Authority | *Activate fallback provider* → A3. *Anything inside the vendor* → **not grantable at any level**, a distinct state from A0. |

**What broke:** the schema assumed we could act on the thing we operate. It had no way to express *un-grantable*, no way to mark a boundary beyond which telemetry and authority both stop, and no way to express a contractual rather than engineered recovery objective.

### 10.4 Findings

1. **A single rigid schema does not survive a real estate.** Hence core-plus-profile (§7.3). This is a genuine structural finding from doing the work, and it strengthens the IP claim rather than weakening it.
2. **Outcomes, Health and Recovery are the profile-variant fields.** Identity, Accountability, Authority and Governance proved universal across all three.
3. **"Un-grantable" is a required authority state**, distinct from A0. A0 means *we have chosen not to automate*; un-grantable means *we structurally cannot*. Conflating them misrepresents risk.
4. **Blast radius is more portable than SLOs.** It was expressible in all three shapes where SLOs were not — which suggests risk, not service level, is the better spine for a universal contract.

Finding 4 has consequences for §7.2 and should be tested further before v0.3.

---

## 11. Measurement Readiness

v0.1 demanded measured baselines from estates it had itself described as fragmented, noisy and tribal. If toil hours, actionable-alert ratios and cost per service cannot be measured today, establishing the baseline *is* a project that the framework must own and cost — not assume away. This is the standard week-three engagement stall.

### 11.1 Tiers

| Tier | Meaning | Method |
|---|---|---|
| **T1 Measured** | Instrumented, queryable, trustworthy provenance | Direct query of a system of record |
| **T2 Derived** | Sampled, proxied or inferred with stated method and error bounds | Time-and-motion sampling, ticket-text classification, structured survey with disclosed n |
| **T3 Estimated** | Expert judgement | Facilitated estimation, explicitly labelled |

### 11.2 The binding rule

> **Realised value may be claimed only from T1. Estimated value may use T2. T3 may size an opportunity but may never support a benefit claim.**

### 11.3 Required first deliverable

A **Measurement Readiness Assessment** is produced in the first two weeks of any engagement, before any value is promised. It states plainly which metrics are T1, which are T2 and by what method, which are T3, and what instrumentation would be required to promote them. Telling a client honestly what cannot yet be measured is a credibility asset, and it prevents the framework from being judged against numbers it was never able to produce.

---

## 12. Evidence Standard

v0.1 banned unsupported claims without defining how a hypothesis becomes a claim.

### 12.1 Grades

| Grade | Source |
|---|---|
| **E1** | Measured in this engagement, or peer-reviewed research with disclosed method |
| **E2** | Primary vendor or standards-body documentation |
| **E3** | Credible industry survey with disclosed methodology and sample size |
| **E4** | Vendor marketing, conference talk, analyst opinion without method, anecdote |

### 12.2 Rules

1. No claim in an executive deliverable may rest below **E3**.
2. **E4 may inform a hypothesis and may never support a claim.** Marketing material is labelled as such wherever cited.
3. Promotion from hypothesis to claim requires **E1 or E2**.
4. Every assertion in the framework carries its grade in the **claims register** (§19), with the source and the date assessed.
5. An unsupported claim is not an error to be hidden — it is a **hypothesis to be measured in pilot**. Framing it that way is what makes the standard survivable in practice.

### 12.3 Standing example

The v0.1 prohibition on claims such as *"enterprises only use 20% of Datadog"* is retained and generalised: **no utilisation figure may be stated without E1 or E2 evidence, or explicit labelling as a hypothesis to be measured within the engagement.** This remains one of the strongest positions in the document.

---

## 13. Capability Pillars — Consolidated 11 → 6

v0.1's eleven pillars contained several views of the same thing. Six survive, and no further merge is obviously available.

| # | Pillar | Absorbs (v0.1) |
|---|---|---|
| **1** | **Service Definition & Context Substrate** | Operational Baseline & Readiness; Service/Dependency/Business Context; **plus §8** |
| **2** | **Signal & Health Quality** | Observability & Signal Quality |
| **3** | **Reliability & Recovery** | Reliability Engineering; Incident & Recovery Intelligence |
| **4** | **Change & Operational Risk** | Change & Operational Risk |
| **5** | **Automation Authority & Toil** | Automation & Toil Elimination; AI Readiness & Governed Autonomy |
| **6** | **Value Realisation & Governance** | Tool and Platform Value Realisation; Cost/Capacity/Productivity Economics; Continuous Learning & Governance |

Pillar 1 is a **gate** for pillars 3, 5 and 6 — they cannot be assessed meaningfully against decayed context.

---

## 14. Value Measurement

### 14.1 Reliability — corrected

v0.1 led with MTTD/MTTA/MTTR. **Mean MTTR is rejected as a primary improvement signal.** Incident durations are long-tailed and sample sizes are small, so the mean is dominated by outliers and moves largely at random; analysis of pooled industry incident data (notably the VOID report) found it a poor basis for inference. Experienced SREs know this, and leading with it forfeits practitioner credibility in the first meeting — against a quality bar that explicitly demands practitioner respect.

Replaced with:

- **Detection**: time-to-detect, p50 and p90, with n disclosed
- **Duration**: distributional only — p50/p90, n disclosed, outliers examined individually rather than averaged away
- **Coordination**: responders engaged per incident, handoff count, time-to-correct-team *(often the largest and most improvable share of total duration)*
- **Recurrence**: repeat-incident rate against a stable cause taxonomy
- **Customer-impact minutes**, and SLO attainment where an SLO is the right expression of the outcome (§10.1 shows where it is not)

### 14.2 Signal quality
Alert volume; actionable-alert ratio; false-positive rate; duplicate-alert rate; human pages per incident.

### 14.3 Context integrity
Context coverage; freshness compliance; declared-versus-discovered drift rate; stale-context incident rate. *(New in v0.2 — see §8.3.)*

### 14.4 Operational efficiency
Manual validations; toil hours; repetitive interventions; ticket volume; escalation rate; human handoffs; SME dependency concentration.

### 14.5 Change
Change-failure rate; rollback rate; post-change incident rate; automated validation coverage; validation duration; failed-deployment recovery time. *(These align with DORA metrics — DevOps Research & Assessment; see §18.1 on the naming hazard.)*

### 14.6 Automation authority
Actions at target authority versus below; **actions above authorised level** (a safety finding, per §9.7); authority advancement rate; automation abort and rollback rate; toil eliminated per authority grant.

### 14.7 Tool value realisation
Licensed versus implemented capability; feature utilisation where measurable; duplicate capability spend; telemetry coverage; unused automation capability; consolidation opportunity.

### 14.8 Economic
Cost per Operated Service; support cost per transaction or workload where meaningful; engineering hours recovered; avoided incremental hiring; incident cost avoidance; platform contract value realisation.

### 14.9 Business and customer
Impacted customers; impacted transactions; failed journeys; revenue exposure; business-service availability.

### 14.10 Reporting discipline
Every metric is reported as **baseline / observed / target / estimated value / realised value**, each carrying its measurement tier (§11) and evidence grade (§12). Unsupported ROI claims are prohibited.

---

## 15. Tool Value Realisation — Scoped

v0.1 proposed eight research questions across fourteen platform categories — roughly 112 primary-source threads — with no scope limit and no acknowledgement that vendor capability sets decay quarterly while the framework is sold into multi-year engagements.

### 15.1 Scope

- **Depth (three platforms only for v1.0):** one observability platform, one ITSM/ITOM platform, one workload-automation or orchestration platform. Selected for market coverage across target industries.
- **Method (all other categories):** publish the *reproducible assessment method* rather than pre-researched findings, so that any category can be assessed inside an engagement without us having pre-solved it.
- **Refresh cadence:** platform-specific findings carry an assessed-on date and a **12-month expiry**. Expired findings are marked stale in the claims register, exactly as context is (§8).

### 15.2 The questions (retained from v0.1, unchanged — they were correct)

What was the platform designed to enable; what does it provide today; what is commonly adopted; what is commonly underused; why (complexity, silos, licensing, skills, telemetry gaps, process maturity, governance, integration debt, data quality, change resistance, unclear ownership, weak business case); what measurable value remains unrealised; can the framework unlock it without replacing the platform; and is the gap tooling, process, people, architecture, operating model, governance or context?

### 15.3 Positioning guard

This track measures **realised operational capability against licensed capability, tied to reliability and risk outcomes.** It is not spend optimisation, not licence harvesting, and not a procurement exercise. Without that distinction it will be mistaken for Software Asset Management (ISO 19770) or FinOps and will be commoditised accordingly.

---

## 16. AI Position

AI is not the foundation of the framework. Required sequencing, retained from v0.1 and still correct:

> **Standardise first. Contextualise second. Automate safely. Add autonomy only where trust and evidence justify it.**

The framework must first create standardised service context, trusted telemetry, operational contracts, clear ownership, process consistency, risk controls, machine-usable knowledge and validated workflows. AI may then assist with correlation, summarisation, anomaly detection, likely-cause assistance, recommendation, knowledge retrieval, impact analysis, prioritisation, and agentic execution **within the authority grants of §9** — which is the mechanism that makes "within guardrails" concrete rather than aspirational.

**New in v0.2:** every AI capability degrades in direct proportion to context staleness (§8.4). AI readiness is therefore measured as context integrity, not as model capability or tooling spend. Governance of AI-initiated action follows the same authority grants, gate criteria and demotion triggers as any other machine action — there is no separate AI regime, deliberately. Where the estate is subject to the **EU AI Act** or assessed against the **NIST AI Risk Management Framework**, authority grants are the artefact that evidences control.

---

## 17. People — Adoption, Consent and Workforce

v0.1 promised not to replace strong teams but imposed a standard on them, with no model for winning consent and no answer to what L1 staff actually move to. ITIL-shaped programmes fail on politics, not content.

### 17.1 Adoption by consent

- **Volunteer first.** The standard is demonstrated on a volunteer Operated Service before being asked of anyone.
- **Contracts are authored by the owning team, facilitated — never written for them and handed over.** An imposed contract is a document; an authored one is a commitment.
- **Named executive arbiter** for contested ownership. Where T1 (accountability) cannot be satisfied, the dispute escalates to a pre-agreed arbiter within a fixed window. Unresolved ownership is the most common cause of stall.
- **Resistance register.** Objections are recorded, attributed and answered in writing. Unanswerable objections are findings about the framework, not about the objector.
- **Conway's-law mismatches are recorded as findings** (§2.2), never resolved by quietly redrawing the service map to match the org chart.

### 17.2 Workforce transition — a structural position, not vocabulary

v0.1 regulated the *language* around cost value but left the §12 progression reading, correctly, as a task-elimination roadmap to the people whose cooperation the framework most requires.

The structural answer: **advancing automation authority creates human work that did not previously exist, and cannot proceed without it.**

| Authority work | Who does it |
|---|---|
| Contract authorship and maintenance | Service operators — the people with the operational knowledge |
| Context curation, provenance and freshness (§8) | Operations staff, continuously |
| Automation validation and evidence gathering (§9.6) | Operators, as the precondition for every grant |
| Exception and novel-failure handling | Experienced operators, by definition |
| Authority gate review and demotion decisions | Operations governance |

A9.6 grant requires twenty validated executions reviewed by a human. An estate cannot reach A3+ at scale without people doing that validation. This is a structural argument that survives scrutiny; "we prefer the term capacity release" is not.

Humans remain essential for ambiguity, novel failure modes, high-blast-radius decisions, business judgement, exception handling, governance and system improvement. **The framework does not promise elimination of L1 support and must never be presented as doing so.**

---

## 18. Differentiation — Answered, Not Asked

v0.1 posed fourteen excellent questions and answered none. Positions below are stated so they can be attacked; each carries its evidence grade and is contestable.

| Challenge | Position |
|---|---|
| **Why not Google SRE?** | SRE is a practice model for teams that adopt it, strongest inside engineering-led organisations with homogeneous estates. EPOF assesses and governs a heterogeneous estate the organisation already has, including batch, vendor-operated and legacy services SRE does not address, and works where SRE adoption is partial or refused. EPOF should recommend SRE practices where they fit — it is not a competitor to them. |
| **Why not DORA metrics?** | DORA (DevOps Research & Assessment) measures delivery throughput and stability. It is an input to pillar 4, adopted wholesale, not replaced. It says nothing about context, authority, vendor dependencies or tool realisation. |
| **Why not ITIL 4?** | ITIL governs process. EPOF governs **machine authority**, which ITIL predates and does not model. Where they overlap, defer to ITIL. |
| **Why not COBIT / IT4IT?** | Governance and reference-architecture models at the enterprise-IT layer; neither reaches the per-action-class operational decisions EPOF governs. |
| **Why not Well-Architected (AWS/Azure/GCP)?** | Cloud-scoped, provider-scoped, design-time-weighted. EPOF is estate-wide, vendor-neutral and run-time-weighted. Adopt their question sets inside pillars 3 and 4. |
| **Why not ServiceNow ITOM?** | A platform, not an operating model — and one of the platforms the value-realisation track assesses. Assessing a platform cannot be done from inside it. |
| **Why not AIOps?** | AIOps is a capability inside UNDERSTAND. It does not define ownership, outcomes, authority or evidence. Most AIOps underperformance is a context problem (§8), which is the layer above it. |
| **Why not observability?** | Observability serves SENSE. It answers *what is happening*, not *who is accountable, what is permitted, and whether recovery was real*. |
| **Why not platform engineering / IDPs?** | Backstage-style catalogs are genuine prior art for part of the contract (§7.1) and should be integrated with, not rebuilt. They do not carry risk tiers or authority grants. |
| **Why buy this with mature tooling already?** | Because mature tooling is the precondition, not the outcome. The framework measures realised versus licensed capability and closes the gap without replacement. |
| **Why would a strong SRE org use it?** | For the estate outside SRE's remit, for cross-domain comparability, and for the authority model — which is the part strong SRE organisations most consistently lack a formal answer to. |
| **What is genuinely new?** | Three things, narrowly: **(a)** risk tier and per-action-class machine authority bound into the same governed artefact as ownership and outcomes (§7.2); **(b)** context as an operated asset with provenance, freshness and decay (§8); **(c)** the two-axis grid that makes *authority exceeding maturity* visible as a safety finding (§9.7). |
| **What is synthesis?** | The loop (MAPE-K, §6.1), most contract content (§7.1), the engagement lifecycle, the maturity M-axis, the metric families. Stated openly. |
| **Where are we renaming?** | v0.1's loop was MAPE-K renamed. Corrected in §6. This test is re-run at every version gate. |

### 18.1 Naming hazard — standing instruction

In financial services, insurance and any EU-regulated entity, **DORA means the Digital Operational Resilience Act** (in force January 2025), which regulates precisely this subject area. Always write **"DORA metrics (DevOps Research & Assessment)"** on first use in any client-facing artefact. Using it unqualified in a bank will confuse the room and cost credibility in the opening minutes.

---

## 19. Boundary Conditions — Where This Does Not Apply

A framework that claims universal fit reads as sales material. Naming limits buys credibility cheaply.

| Condition | Position |
|---|---|
| **Estates below ~15 Operated Services** | Overhead exceeds benefit. Recommend SRE practices directly. Do not sell an assessment. |
| **Active M&A or mid-replatform** | The estate is not stable enough to baseline. Defer, or scope to the stable remainder only. |
| **Safety-critical, air-gapped or externally regulated automation** | The M-axis applies fully. The A-axis is **capped externally by the regulator** and is not ours to advance. Say so before the client does. |
| **No executive sponsor able to arbitrate ownership disputes** | The framework will stall at T1 accountability (§2.1). This is a disqualifying condition, not a risk to manage. |
| **Pure greenfield** | Use as design input for contracts and authority; there is no current state to assess. |
| **Client wants a one-off score** | Decline or reframe. A maturity number without an improvement system is the "consulting score theatre" the quality bar prohibits. |

---

## 20. Delivery — Thin Vertical Slice and Version Gates

v0.1 said "we will not rush" and gave no schedule, no phasing and no definition of a minimum viable framework. Six research blocks, a sixteen-question gate and 112 research threads is comfortably a year, during which the agentic-operations landscape moves underneath us.

| Version | Weeks | Contents | Gate to exit |
|---|---|---|---|
| **v0.2** | — | *This document.* Unit of analysis; prior art acknowledged; claims narrowed; three instantiations; two-axis maturity; measurement and evidence standards | ✅ Complete |
| **v0.3** | 6 | MAPE-K and OpenSLO/Backstage formal gap analysis; claims register populated; authority gate thresholds from §9.6 challenged; assessment instrument for **pillar 1 only** | Instrument produces a repeatable score on 5 Operated Services, scored twice by different assessors, variance < 1 level |
| **v0.4** | 14 | Remaining five pillar instruments; measurement readiness method; context integrity measurement; value model with attribution paths | Full assessment runs end-to-end on a 15–20 service estate inside 4 weeks |
| **v0.5** | 24 | **Pilot on one real estate.** One domain, one volunteer team, measured baseline | T1-measured movement on at least three Layer 4 outcomes |
| **v1.0** | — | Framework, assessment method, value model, transformation method, reference architecture, governance, executive narrative, research appendix | §21 readiness gate passed with E1/E2 evidence |

**The thin vertical slice is v0.3**: one pillar, one axis, one instrument, tested against five real services. Everything else waits. A framework that can assess one thing repeatably is worth more than one that describes eleven things elegantly.

---

## 21. Readiness Gate — Quality Bar and Gate Merged

v0.1's §21 and §22 were near-duplicates. Merged. The framework is **A-grade / consulting-grade** only when every line below is answerable with evidence at the stated grade.

| # | Criterion | Evidenced by | Min grade |
|---|---|---|---|
| 1 | **Evidence-backed** — every claim graded, hypotheses labelled | Claims register | E1/E2 |
| 2 | **Differentiated** — §18 positions survive expert challenge | Gap analysis vs MAPE-K, SRE, ITIL, OpenSLO, Backstage | E2 |
| 3 | **Executable** — an enterprise can decompose its estate and score itself | v0.4 gate: end-to-end run | E1 |
| 4 | **Repeatable** — two assessors reach the same score | v0.3 gate: inter-assessor variance < 1 level | E1 |
| 5 | **Measurable** — benefits measured, tier declared | Measurement readiness method | E1 |
| 6 | **Vendor-neutral** | No platform dependency in core | E2 |
| 7 | **Domain-neutral** | Instantiations across ≥ 3 industries | E1 |
| 8 | **Scalable** — service to estate, criticality-weighted | Aggregation rule tested | E1 |
| 9 | **Realistic** — no universal-autonomy claims; boundaries named | §19 | — |
| 10 | **Commercially credible** — value measured, transfer defined | §22, pilot result | E1 |
| 11 | **Executive-ready** — problem, value, risk, investment, path, reason to act | Narrative tested on a real executive | E3 |
| 12 | **Practitioner-respectful** — SREs and operators do not read it as theatre | Reviewed by ≥ 5 practising SREs outside the authoring team | E1 |

### 21.1 Standing questions

The framework is not ready until these are answerable without hedging: why must this exist; what specific problem does it solve; what measurable value does it create; why can existing frameworks not solve it alone; what is genuinely proprietary; how does an enterprise assess itself; how does it prioritise; how does adoption work incrementally; how is big-bang avoided; how is risk controlled; how is value measured; how does it work alongside strong teams; how does it improve utilisation of existing investment; how does it evolve toward autonomy; **what would a skeptical CIO challenge, and can each challenge be answered with evidence.**

### 21.2 Self-invalidation clause — retained and strengthened

> If research shows any component of this framework is an existing concept with a new name, that must be stated and the component changed or dropped. **This test is re-run at every version gate, not once.** §6.1 is the first application, and it cost us a claimed differentiator. That is the standard working correctly, not a failure.

---

## 22. Commercial Model and Capability Transfer

### 22.1 Single engagement lifecycle

v0.1 contained two conflicting ten-stage lifecycles (§15 and §23). This is the only one.

**DISCOVER → ASSESS → QUANTIFY → PRIORITISE → DESIGN → PILOT → PROVE → TRANSFER → SCALE → GOVERN**

| Stage | Content |
|---|---|
| DISCOVER | Decompose the estate into Operated Services (§2). Understand teams, tools, processes, support model. |
| ASSESS | Score maturity and authority (§9); assess context integrity (§8); measurement readiness (§11). |
| QUANTIFY | Baselines and opportunity, by measurement tier, with attribution paths (§3.1). |
| PRIORITISE | Value × risk × effort × feasibility. Authority-above-maturity findings (§9.7) jump the queue as safety items. |
| DESIGN | Target operating model, target authority grants, improvement plan. |
| PILOT | One contained but meaningful domain. |
| PROVE | Measure against baseline at declared tier. |
| **TRANSFER** | **Capability transfer point — see §22.2. New in v0.2.** |
| SCALE | Expand proven patterns under client ownership. |
| GOVERN | Standards, exceptions, evidence, authority review, continuous improvement. |

### 22.2 Capability transfer point — the dependency answer

v0.1 stated "this is not an instruction to artificially create dependency" and then described a ten-stage lifecycle ending in managed services. A disclaimer does not defend that; only a structural commitment does.

Every engagement defines a **Capability Transfer Point** at which:

- The client can run the assessment **unaided**, with their own trained assessors
- Contract templates, scoring instruments and the method are **licensed to the client**, not withheld as leverage
- At least two client-side assessors are certified and have independently scored services
- Engagement success criteria **include** transfer having occurred

Beyond that point, continued engagement must be justified by **new value — new domains, new capability, new risk** — never by retained knowledge. Where a client chooses managed improvement services, that is a commercial choice made from a position of self-sufficiency, which is the only position from which it is a defensible choice.

This is the answer to §21.1's skeptical CIO. It should be offered before the question is asked.

### 22.3 Genuine ongoing value

The framework creates real recurring value because estates, tools, priorities, risk and maturity genuinely evolve — and because **authority grants require periodic re-evidencing** (§9.6), which is ongoing operational work by design rather than a manufactured retainer.

### 22.4 Commercial opportunities
Assessment engagements; transformation programmes; automation programmes; operational maturity uplift; tool value-realisation programmes; governance; reusable accelerators. Usable at pilot scale and at multi-year enterprise scale.

---

## 23. Research Programme

### 23.1 Priority 1 — Prior-art gap analysis *(blocking v0.3)*

Run against **MAPE-K first** — it is the fastest route to discovering whether any remaining loop claim survives. Then OpenSLO, Backstage service catalogs, Google's Production Readiness Review and Team Topologies against the contract (§7).

### 23.2 Foundational models
Google SRE; DORA metrics (DevOps Research & Assessment); ITIL 4; COBIT; IT4IT; DevOps/CALMS; incident command.

**Resilience engineering — named properly (new in v0.2):** Hollnagel (Safety-I vs Safety-II, ETTO principle); Woods; Cook, *How Complex Systems Fail*; **STAMP/STPA** (Leveson) for hazard analysis and blast radius. §5.2 and §9 are doing safety science informally; there is a rigorous literature and using it is a credibility multiplier with practitioners.

### 23.3 Autonomic and control models *(new in v0.2 — the Priority 1 omission)*
**MAPE-K / IBM autonomic computing**; OODA; PDCA; **SAE J3016** automation levels as the external analogue for §9.3; autonomic maturity models.

### 23.4 Cloud and architecture
AWS Well-Architected (Operational Excellence, Reliability); Azure Well-Architected; Google Cloud Architecture Framework; CNCF practices; OpenTelemetry semantic conventions; **OpenSLO**; **Backstage**.

### 23.5 Enterprise operations market
ServiceNow; Datadog; Splunk; Dynatrace; New Relic; Grafana; PagerDuty; AIOps and incident-intelligence platforms; workload automation; platform engineering and IDP trends. **Scoped per §15.1 — three deep, method published for the rest.**

### 23.6 Economics and governance *(expanded in v0.2)*
Cost of downtime; cost of toil; change-failure economics; tool-sprawl economics; observability cost; IT operations spend; capacity release. **FinOps Foundation framework** — closest structural analogue to value realisation, and its Crawl/Walk/Run model is instructive for what a *usable* maturity model looks like. **Technology Business Management (TBM)**; **ISO 19770 (SAM)**; **ISO/IEC 20000**; **ISO 22301**; **EU DORA** for regulated estates.

### 23.7 Future state
Agentic operations; autonomous remediation; AI for observability and IT operations; policy-as-code; operations-as-code; service topology and digital twins; **NIST AI RMF**; **EU AI Act**; human-in-the-loop automation.

### 23.8 Measurement method
**The VOID report** and the Accelerate research methodology, for how to make defensible operational measurement claims (§14.1).

### 23.9 Source standard
Primary vendor documentation, standards bodies, peer-reviewed or respected industry research, surveys with disclosed methodology, case studies with disclosed method, academic research. Marketing claims are graded **E4** and labelled as such.

---

## 24. Executive Selling Principles

**Do say:** maximise value from existing investments; reduce operational friction; improve reliability; reduce risk; release engineering capacity; standardise without forcing uniform technology; make customer and business impact visible; reduce manual toil; create measurable maturity; **grant automation authority against evidence**; scale strong teams; **make it visible where machines are acting beyond what the evidence supports**.

**Avoid saying:** replace your teams; eliminate L1; replace Datadog/ServiceNow/etc.; AI will run production; reduce incidents by X% without baseline evidence; save millions without an evidence-based model; "Google and Netflix do it, therefore you should"; "everything will be standardised" where variation is justified; **"we will get you to full autonomy"** — §9.3 makes clear that the correct authority level is the authorised one, not the highest one.

---

## 25. Client-Agnostic Principle

The core framework contains no dependency on any named company. Examples illustrate; they never constitute the framework. It must apply equally to banks, insurers, retailers, healthcare, airlines, technology companies, manufacturing, telecom, government and any other enterprise operating production systems. §21 criterion 7 requires instantiations across at least three industries before v1.0.

---

## 26. Differentiated IP — Current Position

Narrowed from v0.1's six candidates to three defensible claims plus stated synthesis.

### Claims — narrow, contestable, testable

1. **Authority-bound Operational Contract.** Risk tier, blast radius and per-action-class machine authority bound into the same governed, versioned artefact as ownership, outcomes and recovery expectations. *Status: narrowed from v0.1; catalog and SLO content conceded to prior art (§7.1). Survives initial comparison.*
2. **Context as an operated asset.** Provenance, freshness SLAs and declared-versus-discovered decay monitoring, with stale-context incident rate as the reliability-linked measure. *Status: strongest remaining candidate; no direct prior art identified. Requires formal search before assertion.*
3. **The two-axis grid, and specifically the above-diagonal safety finding.** Authority exceeding maturity as a detectable, reportable operational danger. *Status: no existing maturity model surfaces this. Requires validation in pilot.*

### Conceded as synthesis

The operational loop (MAPE-K, §6.1); contract identity/ownership/dependency/SLO content (§7.1); the maturity M-axis (CMMI-descended); the engagement lifecycle; the metric families; the A-axis shape (SAE J3016 analogue, deliberately).

### Withdrawn from v0.1

*"A unified closed operational loop"* as a differentiator — it is MAPE-K. The authority binding at each stage survives; the stages do not.

**No claim on this page is proven.** Each must survive §23.1 before appearing in any client-facing artefact.

---

## 27. Working Style

**Research → Challenge → Synthesise → Define → Validate → Refine.**

For every major concept: establish the problem; research existing solutions; test whether the problem is universal; determine what is already solved; identify the actual gap; define our contribution; attach measurable value; test against executive and practitioner objection.

**Added in v0.2:** the third and fourth steps are the ones v0.1 skipped, and skipping them is what produced a renamed MAPE-K presented as intellectual property. Prior-art search precedes claim, always.

---

## 28. Success Definition

The project succeeds when a consulting organisation can say the following to a major enterprise, and the enterprise can objectively verify it:

> We are not here to replace your technology or tell your teams how to do their jobs. We provide a structured way to determine how effectively your production estate is being operated, where reliability, risk, cost and investment value are being lost, and how to improve those areas incrementally using the capabilities you already have — adding new capabilities only where the business case justifies them. We will show you where machines are acting with more authority than your evidence supports, and we will hand you the method so you can run it yourselves.

The final clause is new in v0.2 and is the sentence that distinguishes this from a dependency engagement.

---

## 29. Requirement Authority

Until intentionally revised, this document is the **working source of truth**. Any research, component, proposal, presentation, terminology, implementation suggestion or AI-generated recommendation is checked against it.

**If a future idea conflicts with these requirements, the conflict is called out rather than silently changing direction.** This rule survived from v0.1 unchanged and is the most valuable sentence either version contains.

---

**End of Requirements v0.2** — supersedes v0.1 (2026-09-02). Next gate: **v0.3**, 6 weeks, blocked on §23.1 prior-art analysis.
