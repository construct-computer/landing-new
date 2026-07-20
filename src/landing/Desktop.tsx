import { useEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgEnterprise from "@/assets/enterprise.png"
import imgEnterpriseBg from "@/assets/enterprise-bg.png"
import imgGrass from "@/assets/grass.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import imgSearchbar from "@/assets/searchbar.png"
import { PRICING_PLANS, type PricingPlan } from "@/content/pricing"
import {
  AdaptsSection,
  EnterExperienceButton,
  LandingFooter,
  LandingNav,
  PortalVideo,
  PRICING_BUTTON_BOX_SHADOW,
  PRICING_PRICE_TEXT_SHADOW,
  PricingFeatureIcon,
  WhatConstructIsSection,
  WORKFLOW_CHIPS,
  WorkflowChip,
  WorkDemoVideo,
  preventLandingImageDrag,
  usePrefersReducedMotion,
} from "./shared"
import { isLayoutVisible } from "./scroll-utils"
import { BetaAccessTrigger } from "./beta-access/BetaAccessTrigger"
import { FeatureGridSection } from "./FeatureGridSection"
import { LANDING_FAQ } from "@/content/faq"
import { WORKFLOW_DEMOS, type WorkflowDemo } from "./workflow-demos"
import { WorkflowVideoLayer } from "./WorkflowVideoLayer"
import {
  clamp,
  getHeldWorkflowPosition,
  getSoftPinOffset,
  lerp,
  smoothStep,
} from "./workflow-motion"

function getWorkflowDemo(index: number): WorkflowDemo {
  return WORKFLOW_DEMOS[index % WORKFLOW_DEMOS.length] ?? WORKFLOW_DEMOS[0]
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */
function HeroHeadline() {
  return (
    <div className="pointer-events-auto max-w-[560px]">
      <div
        aria-hidden="true"
        className="font-display text-balance text-5xl capitalize italic leading-[1.1] text-[#4e4646] lg:text-[51.8px] lg:leading-[58px]"
      >
        <span>An </span>
        <span className="text-[#01b4c8]">AI Employee </span>
        <span>You Can Actually </span>
        <span className="text-[#01b4c8]">Work With</span>
      </div>
      <p className="font-ui mt-6 max-w-[520px] text-[16px] leading-[22px] text-[#627c86]">
        Assign the outcome. Construct researches, operates tools, creates
        files, and runs recurring work from a persistent workspace you can
        inspect and control.
      </p>
      <EnterExperienceButton className="mt-8" />
    </div>
  )
}

function HeroStage() {
  return (
    <section className="relative mx-auto w-full max-w-[1500px] overflow-hidden px-6 lg:px-16">
      <div
        className="relative isolate mx-auto w-full max-w-[1400px]"
        style={{ height: "clamp(620px, calc(100svh - 56px), 900px)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-3/4 top-1/2 z-0 aspect-square w-[min(120%,1100px,100svh)] -translate-x-1/2 -translate-y-1/2"
        >
          <PortalVideo media="(min-width: 1024px)" />
        </div>

        <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2 lg:left-2">
          <HeroHeadline />
        </div>

        <img
          src={imgReport}
          alt="Generated PDF research report produced by the Construct AI agent"
          className="pointer-events-none absolute left-1/2 top-[1%] z-20 w-[424px] translate-x-[-65%] drop-shadow-[0_20px_40px_rgba(71,156,223,0.15)]"
        />

        <div className="pointer-events-none absolute right-0 top-[10%] z-20 w-[280px]">
          {WORKFLOW_CHIPS.map((chip, i) => (
            <div
              key={chip.label}
              style={{ marginTop: i === 0 ? 0 : 18, marginLeft: chip.offset }}
            >
              <WorkflowChip icon={chip.icon} label={chip.label} />
            </div>
          ))}
        </div>

        <img
          src={imgChat}
          alt="Construct agent chat window handling an inbound email autonomously"
          className="pointer-events-none absolute bottom-[8%] left-[26%] z-20 w-[320px] drop-shadow-[0_16px_40px_rgba(71,156,223,0.18)]"
        />

        <img
          src={imgSearchbar}
          alt="Search inside the Construct AI work desktop"
          className="pointer-events-none absolute bottom-[10%] right-0 z-20 w-[455px] drop-shadow-[0_14px_30px_rgba(71,156,223,0.15)]"
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Clouds transition + Adapts heading                                 */
/* Mirrors the Figma treatment: two overlapping cloud photos at 49%    */
/* opacity, a white→transparent fog overlay near the top of the clouds,*/
/* and a pale-blue (#ddfaff) → white (#fefefe) sky gradient that       */
/* continues down into the Adapts heading.                             */
/* ------------------------------------------------------------------ */
function CloudsTransition() {
  return (
    <section className="relative w-full">
      <div className="relative w-full">
        <img
          src={imgClouds}
          alt=""
          aria-hidden
          className="pointer-events-none relative block w-full select-none opacity-90"
        />
      </div>

      <div className="relative pb-24 pt-2">
        <AdaptsSection className="pb-0 pt-0" />
      </div>
    </section>
  )
}

function WorkflowVideoPanel({
  workflowPosition,
}: {
  workflowPosition: number
}) {
  const dominantIndex = Math.min(
    Math.round(workflowPosition),
    WORKFLOW_DEMOS.length - 1,
  )

  return (
    <div className="relative aspect-964/694 overflow-hidden rounded-[53px] bg-white">
      {WORKFLOW_DEMOS.map((demo, index) => {
        const distance = index - workflowPosition
        const isDominant = index === dominantIndex

        if (distance <= -1.05 || distance >= 1.05) return null

        return (
          <WorkflowVideoLayer
            key={demo.id}
            demo={demo}
            distance={distance}
            isDominant={isDominant}
            media="(min-width: 1024px)"
            travel={12}
          />
        )
      })}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-[#ddfaff]/35"
      />
    </div>
  )
}

function WorkflowScrollCopy({
  workflowPosition,
}: {
  workflowPosition: number
}) {
  return (
    <div className="absolute inset-0 overflow-visible">
      {WORKFLOW_DEMOS.map((demo, index) => (
        <WorkflowTextLayer
          key={demo.id}
          demo={demo}
          distance={index - workflowPosition}
        />
      ))}
    </div>
  )
}

function WorkflowTextLayer({
  demo,
  distance,
}: {
  demo: WorkflowDemo
  distance: number
}) {
  const titleAnchorY = 0
  const exitTitleY = -36
  const upNextAnchorY = 300
  const belowAnchorY = 380

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const preEnter = smoothStep((1.24 - distance) / 0.24)
  const nearby = distance > -1.05 && distance < 1.24

  if (!nearby) return null

  const headlineY = distance < 0
    ? lerp(titleAnchorY, exitTitleY, exiting)
    : distance <= 1
      ? lerp(upNextAnchorY, titleAnchorY, entering)
      : lerp(belowAnchorY, upNextAnchorY, preEnter)
  const headlineOpacity = distance < 0
    ? 1 - exiting
    : distance <= 1
      ? lerp(0.58, 1, entering)
      : lerp(0, 0.58, preEnter)
  const descriptionOpacity = distance < 0
    ? 1 - exiting
    : smoothStep((entering - 0.58) / 0.42)
  const upNextOpacity = distance > 0
    ? distance <= 1
      ? 1 - entering
      : preEnter
    : 0
  const supportAmount = smoothStep(1 - Math.abs(distance) / 0.54)

  return (
    <>
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          zIndex: Math.round(20 - Math.abs(distance) * 10),
        }}
        className="absolute inset-x-0 top-0"
      >
        <p
          style={{ opacity: upNextOpacity }}
          className="font-ui mb-3 w-[86px] text-[16.8px] leading-[22px] text-[#78909a]"
        >
          Up Next
        </p>
        <h3
          style={{
            fontSize: "clamp(24px, 2vw, 31px)",
            lineHeight: 1.15,
          }}
          className="text-[#4e4646]"
        >
          {demo.title}{" "}
          <span className="font-display italic text-[#01b4c8]">{demo.accent}</span>
        </h3>
        <p
          style={{
            opacity: descriptionOpacity,
            fontSize: "clamp(14px, 1.05vw, 16px)",
            lineHeight: 1.32,
            maxWidth: "min(100%, 300px)",
          }}
          className="mt-7 text-[#627c86]"
        >
          {demo.description}
        </p>
      </div>

      <div
        style={{
          opacity: supportAmount,
          transform: `translateY(${12 * (1 - supportAmount)}px)`,
          pointerEvents: supportAmount > 0.85 ? "auto" : "none",
        }}
        className="absolute inset-x-0 bottom-0"
      >
        <BetaAccessTrigger
          source={demo.id === "research" ? "workflow-research" : "workflow-channels"}
          className="font-cta inline-flex min-h-[57px] w-full max-w-[227px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-[30px] py-2.5 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
        >
          <span className="text-balance text-center text-[21px] leading-snug text-white">
            {demo.cta}
          </span>
        </BetaAccessTrigger>

        <p className="mt-4 max-w-[200px] text-[16px] capitalize leading-[20px] text-[#78909a]">
          {demo.mutedAction}
        </p>
      </div>
    </>
  )
}

function WorkflowProgressRail({
  workflowPosition,
}: {
  workflowPosition: number
}) {
  const totalStops = WORKFLOW_DEMOS.length - 1
  const progress = totalStops === 0 ? 0 : clamp(workflowPosition / totalStops)

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 top-0 w-px"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-[#9dddea]/70" />
      <span
        style={{
          top: `${progress * 100}%`,
        }}
        className="absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4cd8ff] shadow-[0_0_16px_rgba(76,216,255,0.65)]"
      />
    </div>
  )
}

function StaticWorkflowDemos() {
  return (
    <section
      aria-labelledby="workflow-demo-heading"
      className="px-6 py-20 lg:px-16"
    >
      <h2 id="workflow-demo-heading" className="sr-only">
        Workflow demos
      </h2>
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-2">
        {WORKFLOW_DEMOS.map(demo => (
          <article
            key={demo.id}
            className="overflow-hidden rounded-[32px] bg-white/70 shadow-sm"
          >
            <img
              src={demo.poster}
              alt={demo.ariaLabel}
              className="aspect-964/694 w-full object-cover"
            />
            <div className="p-8">
              <h3 className="text-[28px] leading-tight text-[#4e4646]">
                {demo.title}{" "}
                <span className="font-display italic text-[#01b4c8]">
                  {demo.accent}
                </span>
              </h3>
              <p className="mt-4 max-w-xl text-[16px] leading-6 text-[#627c86]">
                {demo.description}
              </p>
              <BetaAccessTrigger
                source={
                  demo.id === "research"
                    ? "workflow-research"
                    : "workflow-channels"
                }
                className="font-cta mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#4cd8ff] px-7 text-[18px] text-white"
              >
                {demo.cta}
              </BetaAccessTrigger>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function WorkflowDemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    async function setupScrollTrigger() {
      const section = sectionRef.current
      if (!section || !isLayoutVisible(section)) return

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const pinOffset = 56

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: `top ${pinOffset}px`,
        end: () => `+=${window.innerHeight * 1.2}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          setScrollProgress(self.progress)
          if (contentRef.current) {
            const y = getSoftPinOffset(
              self.progress,
              self.end - self.start,
              pinOffset,
            )
            contentRef.current.style.transform = `translate3d(0, ${y}px, 0)`
          }
        },
      })

      cleanup = () => {
        if (contentRef.current) contentRef.current.style.transform = ""
        trigger.kill()
      }
    }

    void setupScrollTrigger()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reducedMotion])

  if (reducedMotion) return <StaticWorkflowDemos />

  const workflowPosition = getHeldWorkflowPosition(scrollProgress, WORKFLOW_DEMOS.length)
  return (
    <section
      ref={sectionRef}
      aria-labelledby="workflow-demo-heading"
      className="relative flex min-h-svh w-full items-center py-[clamp(20px,6svh,56px)]"
    >
      <h2 id="workflow-demo-heading" className="sr-only">
        Research workflow demo
      </h2>
      <div
        ref={contentRef}
        className="mx-auto w-full max-w-[1500px] px-6 lg:px-10 xl:px-16"
      >
        <div className="grid grid-cols-[minmax(300px,0.95fr)_minmax(0,2.6fr)] items-center gap-6 lg:gap-7 xl:grid-cols-[minmax(320px,1fr)_minmax(0,3fr)] xl:gap-10">
          <aside className="font-ui relative pl-7 lg:pl-8 xl:pl-10">
            <WorkflowProgressRail workflowPosition={workflowPosition} />
            <div
              className="relative h-full overflow-visible pr-2"
              style={{ minHeight: "min(600px, calc(100svh - 96px))" }}
            >
              <WorkflowScrollCopy workflowPosition={workflowPosition} />
            </div>
          </aside>

          <WorkflowVideoPanel workflowPosition={workflowPosition} />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Work video section — Figma nodes 827:13378 / 675:13444 / 839:13091 */
/* ------------------------------------------------------------------ */

function WorkVideoSection() {
  return (
    <section
      aria-labelledby="work-video-heading"
      className="relative z-20 overflow-visible bg-transparent px-6 pb-28 pt-[260px] lg:px-16 lg:pb-36 lg:pt-[320px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[140px] z-0 h-[420px] lg:top-[180px] lg:h-[520px]"
      >
        <img
          src={imgGrass}
          alt=""
          className="absolute inset-x-0 bottom-0 w-full select-none"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1574px]">
        <div className="relative h-[944px] overflow-hidden rounded-[79px] bg-white backdrop-blur-[13.55px]">
          <div className="relative z-10 flex h-full flex-col items-center pt-[108px]">
            <h2
              id="work-video-heading"
              className="w-full max-w-[813px] text-center text-[32.8px] capitalize leading-[46px]"
            >
              <span className="font-ui text-[#4e4646]">
                Your Business Shouldn&rsquo;t Loop Around Dealing With
              </span>{" "}
              <span className="font-display italic text-[#01b4c8]">
                Emails, Files And CRM
              </span>
            </h2>

            <div className="mt-[76px] aspect-1166/653 w-full max-w-[1166px] overflow-hidden rounded-[79px] bg-white">
              <WorkDemoVideo
                media="(min-width: 1024px)"
                className="h-full w-full object-cover"
              />
            </div>

            <p className="mt-[32px] w-full max-w-[857px] text-center text-[32.8px] capitalize leading-[46px]">
              <span className="font-display italic text-[#01b4c8]">
                Let Construct
              </span>{" "}
              <span className="font-ui text-[#4e4646]">Do It For You</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Pricing — pixel-perfect rebuild from Figma node 793:13167          */
/*                                                                    */
/* Card spec:                                                          */
/*   • 445×774, border-2 #35949a, rounded-[26px], white fill           */
/*   • Image inset 5px on top/left/right, 435×299, top corners 21px,   */
/*     mask-fade to transparent in lower half so the cloud/portal      */
/*     dissolves into the white plate                                   */
/*   • Plan name: Georgia 40px white, top:39 left:33                   */
/*   • Price stack: Georgia 80px + Inter 20px "/ month", same line,   */
/*     top:165 left:33, with the layered Figma text-shadow             */
/*   • CTA: 299×64, top:266 centered, dark navy gradient, multi-layer  */
/*     drop shadow + inset top highlight, Inter Medium 22px white      */
/* ------------------------------------------------------------------ */

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className="relative isolate h-[774px] w-full overflow-hidden rounded-[26px] bg-white/10"
    >
      {/*
        Border lives on its own overlay so we can fade it via mask-image —
        a regular CSS `border` doesn't accept a gradient. The overlay is
        non-interactive and sits above content but doesn't affect layout.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[26px] border border-[#35949a]/50"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-[5px] right-[5px] top-[5px] h-[299px] overflow-hidden rounded-tl-[21px] rounded-tr-[21px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          background: "rgba(0,0,0,1)",
        }}
      >
        <img
          src={plan.image}
          alt={plan.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      </div>

      <div className="absolute left-[33px] top-[39px] z-10 text-white">
        <h3
          className="text-[40px] leading-[22px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {plan.name}
        </h3>
        <div
          className="mt-[80px] flex items-end gap-[6px]"
          style={{ textShadow: PRICING_PRICE_TEXT_SHADOW }}
        >
          <span
            className="text-[80px] leading-[0.78]"
            style={{
              fontFamily: "Georgia, serif",
              fontFeatureSettings: "'lnum' 1, 'pnum' 1",
            }}
          >
            {plan.price}
          </span>
          <span className="font-inter mb-[8px] text-[20px] leading-[22px]">
            / month
          </span>
        </div>
      </div>

      <BetaAccessTrigger
        source={`pricing-${plan.name.toLowerCase()}`}
        aria-label={`Try Construct on the ${plan.name} plan`}
        style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
        className="font-inter absolute left-1/2 top-[266px] z-10 inline-flex h-[64px] w-[299px] -translate-x-1/2 items-center justify-center rounded-[32px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] text-[22px] font-medium leading-[22px] text-white transition-transform duration-150 ease-out hover:-translate-x-1/2 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
      >
        Try Construct
      </BetaAccessTrigger>

      <ul className="font-inter absolute left-[33px] right-[33px] top-[383px] z-10 flex flex-col gap-[20px] text-[16px] leading-[22px] text-[#4e4646]">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-[14px]">
            <PricingFeatureIcon
              icon={feature.icon}
              className="h-[22px] w-[22px] shrink-0 text-[#39abdb]"
            />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Enterprise panel — Figma node 843:13238, below pricing cards.      */
/* ------------------------------------------------------------------ */

function EnterprisePanel() {
  return (
    <article
      aria-labelledby="enterprise-heading"
      className="relative mt-[19px] h-[436px] w-full overflow-hidden rounded-[26px] border border-[#b3d6f6] bg-white"
    >
      {/*
        Per Figma node 843:13238: a single 1674×1674 baked ring asset is
        positioned at top:0 with its horizontal center matching the panel's,
        so the rings' shared center sits ~400px below the visible area and
        only the upper arcs sweep into the lower half of the card. Solid
        white bg keeps it visually contained — the global pricing rings do
        NOT bleed through (they're a separate motif behind the cards above).
      */}
      <img
        src={imgEnterpriseBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[1674px] max-w-none -translate-x-1/2 select-none opacity-[0.71]"
      />

      <div className="relative z-10 flex h-full">
        <div className="font-inter flex flex-1 flex-col px-[54px] pt-[45px]">
          <h3
            id="enterprise-heading"
            className="text-[40px] leading-[22px] text-[#656565]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Enterprise
          </h3>

          <p className="mt-[57px] max-w-[825px] text-[24px] leading-[36px] text-[#787878]">
            For Business with{" "}
            <span className="font-display italic text-[#2978b9]">
              Specific MCP
            </span>{" "}
            requirement we offer the{" "}
            <span className="font-display italic text-[#2978b9]">
              Enterprise Plan
            </span>
            . We discuss the custom mcp with your organization and deliver
            construct built to meet your{" "}
            <span className="font-display italic text-[#2978b9]">
              Business Needs.
            </span>
          </p>

          <div className="mt-[61px] flex items-center gap-[27px]">
            <a
              href="https://cal.com/construct/15min"
              target="_blank"
              rel="noopener noreferrer"
              style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
              className="font-inter inline-flex h-[64px] w-[299px] items-center justify-center rounded-[32px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] text-[22px] font-medium leading-[22px] text-white transition-transform duration-150 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
            >
              Book A Call
            </a>
            <a
              href="mailto:enterprise@construct.computer"
              className="font-inter text-[22px] font-medium leading-[22px] text-[#39abdb] transition-colors hover:text-[#2978b9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
            >
              or send us an email
            </a>
          </div>
        </div>

        <p className="font-inter absolute right-[112px] top-[41px] z-20 max-w-[272px] text-[18px] leading-[22px] text-[#484848]">
          *Enterprise Includes everything in{" "}
          <span className="text-[#2978b9]">Pro</span>
          <br />
          <span className="text-[#2978b9]">+ Specific MCP/s</span>
        </p>

        {/*
          Inset 54px from top, right, and bottom of the card (matches left
          column horizontal padding); slot begins at 45% so art stays clear
          of copy. Image is vertically centered in the slot and right-aligned
          with object-contain so it respects the inset frame.
        */}
        <div className="pointer-events-none absolute inset-y-[54px] right-[72px] z-10 flex items-center justify-end">
          <img
            src={imgEnterprise}
            alt="Construct enterprise agent with beams of light"
            className="max-h-full max-w-[472px] object-contain object-right select-none"
          />
        </div>
      </div>
    </article>
  )
}

function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative isolate overflow-hidden bg-white px-6 pb-44 pt-28 lg:px-16 lg:pt-36"
    >
      <div className="relative mx-auto w-full max-w-[1395px]">
        <div className="mx-auto max-w-[671px] text-center">
          <h2
            id="pricing-heading"
            className="text-balance text-[51.8px] capitalize leading-[58px]"
          >
            <span className="font-ui text-[#4e4646]">Perfect Plan </span>
            <span className="font-display italic text-[#01b4c8]">
              For Your Every Need
            </span>
          </h2>
          <p className="font-ui mx-auto mt-[22px] max-w-[495px] text-[16px] leading-[21px] text-[#627c86]">
            Construct is built to adapt to your task, it handles everything and
            can automate most of the workflows without any monitoring.
          </p>
        </div>

        {/*
         * `relative z-10` lifts the cards into their own stacking layer
         * above the positioned EnterprisePanel artwork below them. The cards
         * themselves are static, so the layer keeps lower decorative content
         * from painting over card copy.
         */}
        <div className="relative z-10 mt-[100px] grid grid-cols-3 gap-[28px]">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <EnterprisePanel />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ section - Desktop                                              */
/* Mirrors the Figma split: heading + "Send Us Hello" CTA on the left, */
/* tall stack of pillowy #f8f8f8 cards with a + accordion on the right.*/
/* ------------------------------------------------------------------ */
function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={
        "overflow-hidden rounded-[24px] transition-[background-color] duration-200 " +
        (open ? "bg-[#f3f3f3]" : "bg-[#f8f8f8]")
      }
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-inter flex w-full items-center justify-between gap-6 px-[55px] py-[30px] text-left"
      >
        <span className="text-[26px] font-medium leading-[28px] tracking-[-1px] text-[#565656]">
          {question}
        </span>
        <span
          aria-hidden
          className="grid h-[46px] w-[46px] shrink-0 place-items-center text-[#565656]"
        >
          <svg
            viewBox="0 0 24 24"
            className={
              "h-[28px] w-[28px] transition-transform duration-200 " +
              (open ? "rotate-45" : "rotate-0")
            }
          >
            <path
              fill="currentColor"
              d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"
            />
          </svg>
        </span>
      </button>
      <div
        className={
          "grid transition-[grid-template-rows] duration-200 " +
          (open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <div className="overflow-hidden">
          <p className="font-inter px-[55px] pb-[28px] text-[16px] leading-[22px] text-[#627c86]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function DesktopFaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full px-6 py-24 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1395px] grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-start gap-[170px]">
        <div className="pt-2">
          <h2
            id="faq-heading"
            className="text-balance text-[51.8px] capitalize leading-[58px]"
          >
            <span className="font-ui text-[#4e4646]">Frequently Asked</span>{" "}
            <span className="font-display italic text-[#01b4c8]">Questions</span>
          </h2>
          <p className="font-ui mt-[20px] max-w-[371px] text-[16px] leading-[21px] text-[#627c86]">
            We believe clarity and transparency with our users, thus if you have
            more queries contact us at{" "}
            <a
              href="mailto:hello@construct.computer"
              className="text-[#01b4c8] underline-offset-2 hover:underline"
            >
              hello@construct.computer
            </a>
          </p>

          <a
            href="mailto:hello@construct.computer"
            className="font-cta mt-[40px] inline-flex h-[57px] w-[227px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-[30px] text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
          >
            <span className="text-[21px] capitalize leading-[60px] text-white">
              Send Us Hello
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-[31px]">
          {LANDING_FAQ.map((f) => (
            <FaqAccordionItem
              key={f.question}
              question={f.question}
              answer={f.answer}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
export function DesktopLanding() {
  return (
    <div
      className="landing-page relative min-h-screen w-full overflow-x-clip bg-white text-[#4e4646]"
      onDragStart={preventLandingImageDrag}
    >
      <LandingNav />
      <main id="main" className="pt-12 lg:pt-14">
        <HeroStage />
        <WhatConstructIsSection />
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 4%, #ddfaff 25%, #ddfaff 60%, #fefefe 86%, #ffffff 100%)",
          }}
        >
          <img
            src={imgLightBeams}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 z-0 w-full select-none"
            style={{ top: "6%" }}
          />
          <div className="relative z-10">
            <CloudsTransition />
            <WorkflowDemoSection />
            <FeatureGridSection />
          </div>
        </div>
        <WorkVideoSection />
        <PricingSection />
        <DesktopFaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
