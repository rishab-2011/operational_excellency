import { ExecSection } from './ExecSection'
import { SubBlock } from './SubBlock'
import { ProblemChain } from '@/visualizations/ProblemChain'
import { MasterArchitecture } from '@/visualizations/MasterArchitecture'
import { QualificationGates } from '@/visualizations/QualificationGates'
import { ContractContext } from '@/visualizations/ContractContext'
import { CapabilityVsAuthority } from '@/visualizations/CapabilityVsAuthority'
import { GridMini } from '@/visualizations/GridMini'
import { DecayToAuthority } from '@/visualizations/DecayToAuthority'
import { ValueFlow } from '@/visualizations/ValueFlow'
import { PilotPath } from '@/visualizations/PilotPath'
import { PriorArtLayers } from '@/visualizations/PriorArtLayers'
import { claims } from '@/content/meta'
import { Ref, StatusTag } from '@/components/primitives'
import { DeeperLink } from '@/visualizations/kit'

/**
 * The default journey: six sections, roughly three minutes, understood by looking.
 * Precise definitions, evidence grades, measurement detail, prior-art caveats,
 * contract fields and methodology all sit behind the deeper links.
 */
export function ExecutiveView() {
  return (
    <>
      {/* ------------------------------------------------------------ WHY */}
      <ExecSection
        id="exec-why"
        n="01"
        kicker="Why"
        tone="light"
        headline={<>Enterprises own the tools. Operations still fragments.</>}
        lede={
          <>
            Because problems get listed, not traced. Root causes, mechanisms, symptoms and business
            outcomes are treated as peers — so the same benefit is counted several times over.
          </>
        }
      >
        <ProblemChain />
      </ExecSection>

      {/* ---------------------------------------------------------- MODEL */}
      <ExecSection
        id="exec-model"
        n="02"
        kicker="The model"
        headline={<>One service. One contract. One loop — with a permission check in the middle.</>}
        lede={
          <>
            This is the whole framework in a single picture. Everything else in this page is a
            detail of it.
          </>
        }
      >
        <MasterArchitecture compact />

        <div className="mt-14 space-y-12">
          <SubBlock
            kicker="The unit"
            headline={<>A service qualifies only if it passes five gates.</>}
          >
            <QualificationGates />
          </SubBlock>

          <SubBlock
            kicker="The substrate"
            headline={<>What is promised, and what is currently known.</>}
          >
            <ContractContext />
          </SubBlock>
        </div>
      </ExecSection>

      {/* ------------------------------------------------------- AUTHORITY */}
      <ExecSection
        id="exec-authority"
        n="03"
        kicker="Authority"
        className="!bg-ink-950"
        headline={<>A machine being able to act says nothing about being permitted to.</>}
        lede={
          <>
            Capability belongs to the technology. Authority is a grant — capped by risk, earned with
            evidence, and withdrawn when the evidence expires.
          </>
        }
      >
        <CapabilityVsAuthority />

        <div className="mt-14 space-y-12">
          <SubBlock
            kicker="Two axes, not one ladder"
            headline={<>More automation is not more mature. The danger is authority above evidence.</>}
          >
            <GridMini />
          </SubBlock>

          <SubBlock
            kicker="Authority is revocable"
            headline={<>Nothing changed but the age of what is known — and permission fell.</>}
          >
            <DecayToAuthority />
          </SubBlock>
        </div>
      </ExecSection>

      {/* ---------------------------------------------------------- VALUE */}
      <ExecSection
        id="exec-value"
        n="04"
        kicker="Value"
        tone="light"
        headline={<>You may only claim what the estate can actually measure.</>}
        lede={
          <>
            Two constraints, both mandatory: one traceable attribution path per benefit, and a
            measurement tier that decides how strongly it may be stated.
          </>
        }
      >
        <ValueFlow />
      </ExecSection>

      {/* ---------------------------------------------------------- APPLY */}
      <ExecSection
        id="exec-apply"
        n="05"
        kicker="Apply"
        headline={<>The next step is a test, not a purchase.</>}
        lede={
          <>
            A contained pilot on a handful of Operated Services, using the tools you already own,
            with a baseline measured before anything is promised.
          </>
        }
      >
        <PilotPath />
      </ExecSection>

      {/* -------------------------------------------------------- EVIDENCE */}
      <ExecSection
        id="exec-evidence"
        n="06"
        kicker="Evidence"
        tone="light"
        headline={<>Most of this already exists. One row does not.</>}
        lede={
          <>
            Every discipline below is mapped to the loop stage it already serves well. The loop
            itself is MAPE-K, stated plainly rather than renamed.
          </>
        }
      >
        <PriorArtLayers />

        <div className="mt-14">
          <SubBlock
            kicker="What is claimed, and what is not"
            tone="light"
            headline={<>Three claims survive from six. None is proven.</>}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {claims.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border p-4 ${
                    c.status === 'withdrawn'
                      ? 'border-signal-neg-ink/30 bg-signal-neg/[0.06]'
                      : c.status === 'claim'
                        ? 'border-accent-ink/35 bg-accent-wash'
                        : 'border-ink-900/12 bg-paper-50'
                  }`}
                >
                  <StatusTag status={c.status} />
                  <h4
                    className={`mt-2.5 font-serif text-[1.02rem] leading-snug ${
                      c.status === 'withdrawn' ? 'text-ink-900/62 line-through decoration-ink-900/25' : 'text-ink-900'
                    }`}
                  >
                    {c.title}
                  </h4>
                  <div className="mt-2"><Ref s={c.ref} tone="light" /></div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-900/70">
              A claimed differentiator has already been withdrawn under this test. That is the standard
              working, not a failure.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <DeeperLink to="status">Full claim status</DeeperLink>
              <DeeperLink to="evidence">Evidence grades and measurement readiness</DeeperLink>
            </div>
          </SubBlock>
        </div>
      </ExecSection>
    </>
  )
}
