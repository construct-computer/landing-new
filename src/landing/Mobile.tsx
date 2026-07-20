import { useEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgEnterprise from "@/assets/enterprise.png"
import imgEnterpriseBg from "@/assets/enterprise-bg.png"
import imgGrass from "@/assets/grass.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import { LANDING_FAQ } from "@/content/faq"
import { PRICING_PLANS, type PricingPlan } from "@/content/pricing"
import {
  AdaptsSection,
  EnterExperienceButton,
  LandingFooter,
  LandingNav,
  NAV_HEIGHT_PX,
  PortalVideo,
  PRICING_BUTTON_BOX_SHADOW,
  PRICING_PRICE_TEXT_SHADOW,
  PricingFeatureIcon,
  WorkDemoVideo,
  WhatConstructIsSection,
  preventLandingImageDrag,
  usePrefersReducedMotion,
} from "./shared"
import { isLayoutVisible } from "./scroll-utils"
import { BetaAccessTrigger } from "./beta-access/BetaAccessTrigger"
import { MobileFeatureGridSection } from "./FeatureGridSection"
import { WORKFLOW_DEMOS, type WorkflowDemo } from "./workflow-demos"
import { WorkflowVideoLayer } from "./WorkflowVideoLayer"
import {
  clamp,
  getHeldWorkflowPosition,
  lerp,
  smoothStep,
} from "./workflow-motion"

type MobileWorkflowViewportMode = "normal" | "compact" | "short"

function getMobileWorkflowViewportMode(): MobileWorkflowViewportMode {
  if (typeof window === "undefined") return "normal"
  if (window.innerHeight <= 640) return "short"
  if (window.innerHeight <= 740) return "compact"
  return "normal"
}

function useMobileWorkflowViewportMode() {
  const [mode, setMode] = useState<MobileWorkflowViewportMode>("normal")

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setMode(getMobileWorkflowViewportMode())
    }
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("resize", schedule)
    window.addEventListener("orientationchange", schedule)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("orientationchange", schedule)
    }
  }, [])

  return mode
}

/* ------------------------------------------------------------------ */
/* Shared sizing tokens                                               */
/* ------------------------------------------------------------------ */
/**
 * Portal width. `min()` capping in three dimensions so the portal:
 *   1. can extend past the viewport width on narrow phones (`120vw`) - the
 *      sides of the video sit outside the visible area so the visible arc
 *      at the bottom reads as a wider semicircle.
 *   2. never gets taller than ~80% of the dynamic viewport (landscape)
 *   3. never balloons past 720px on small tablets
 */
const PORTAL_WIDTH = "min(150vw, 100dvh, 900px)"

/**
 * Spacer revealed on scroll below the hero. Smaller than `PORTAL_HALF` on
 * purpose: the portal video has lots of faded/empty pixels around its bottom
 * edge, so we can tighten this without visibly clipping the animation.
 */
const PORTAL_REVEAL = "min(42vw, 28dvh, 240px)"

/* ------------------------------------------------------------------ */
/* Hero text                                                          */
/* ------------------------------------------------------------------ */
function HeroHeadline() {
  return (
    <div className="mx-auto max-w-[420px] text-center">
      <div
        aria-hidden="true"
        className="font-display text-balance text-[38px] capitalize italic leading-[1.1] text-[#4e4646]"
      >
        <span>An </span>
        <span className="text-[#01b4c8]">AI Employee </span>
        <span>You Can Actually </span>
        <span className="text-[#01b4c8]">Work With</span>
      </div>
      <p className="font-ui mx-auto mt-5 max-w-[360px] text-[15px] leading-[21px] text-[#627c86]">
        Assign the outcome. Construct researches, operates tools, creates
        files, and runs recurring work from a workspace you control.
      </p>
      <EnterExperienceButton className="mt-7" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero section + straddling portal                                   */
/* ------------------------------------------------------------------ */
/**
 * The hero fills exactly one viewport (minus the nav). The portal is the
 * full square video, anchored so its CENTER sits on the hero's bottom edge
 * - so the top half peeks above the fold, the bottom half is revealed by
 * scrolling. The video is rendered at its full size; nothing is clipped.
 */
function HeroWithStraddlingPortal() {
  return (
    <>
      <section
        className="relative isolate flex flex-col items-center justify-center px-5 pb-18"
        style={{ height: `calc(100dvh - ${NAV_HEIGHT_PX}px)` }}
      >
        {/* Portal: first in DOM + negative z-index inside an isolated stacking
           context guarantees it always renders behind the headline and CTA. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square -translate-x-1/2 translate-y-1/2"
          style={{ width: PORTAL_WIDTH }}
        >
          <PortalVideo media="(max-width: 1023px)" />
        </div>

        <HeroHeadline />
      </section>

      {/* Spacer revealed on scroll so the portal's lower half can breathe before
         the next section starts. Sized slightly smaller than `PORTAL_HALF` to
         keep the showcase visually close to the portal without clipping any of
         its meaningful pixels. */}
      <div aria-hidden className="w-full" style={{ height: PORTAL_REVEAL }} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Showcase - the UI capabilities stacked vertically                  */
/* ------------------------------------------------------------------ */
function ShowcaseStrip() {
  return (
    <section
      aria-label="Capabilities"
      className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-12 px-5 pb-16 pt-16"
    >
      <img
        src={imgReport}
        alt="Generated PDF research report produced by the Construct AI agent"
        className="w-full max-w-[380px] drop-shadow-[0_16px_30px_rgba(71,156,223,0.15)]"
      />
      <img
        src={imgChat}
        alt="Construct agent chat window handling an inbound email autonomously"
        className="w-full max-w-[360px] drop-shadow-[0_16px_30px_rgba(71,156,223,0.15)]"
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Clouds transition                                                  */
/* Mirrors the desktop treatment: full-width cloud photo at 90%        */
/* opacity sitting inside the shared sky gradient, with the light-ray  */
/* overlay positioned above the clouds.                                */
/* ------------------------------------------------------------------ */
function MobileCloudsTransition() {
  return (
    <section className="relative w-full">
      <img
        src={imgClouds}
        alt=""
        aria-hidden
        className="pointer-events-none relative block w-full select-none opacity-90"
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile workflow showcase                                           */
/* ------------------------------------------------------------------ */
function MobileWorkflowVideoPanel({
  workflowPosition,
  viewportMode,
}: {
  workflowPosition: number
  viewportMode: MobileWorkflowViewportMode
}) {
  const dominantIndex = Math.min(
    Math.round(workflowPosition),
    WORKFLOW_DEMOS.length - 1,
  )

  return (
    <div
      className="relative mx-auto aspect-964/694 w-full overflow-hidden rounded-[32px] bg-white"
      style={{
        maxWidth:
          viewportMode === "short"
            ? "min(320px, 40dvh)"
            : viewportMode === "compact"
              ? "min(380px, 48dvh)"
              : "min(440px, 60dvh)",
      }}
    >
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
            media="(max-width: 1023px)"
            travel={8}
          />
        )
      })}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-[#ddfaff]/30"
      />
    </div>
  )
}

function MobileWorkflowText({
  workflowPosition,
  viewportMode,
}: {
  workflowPosition: number
  viewportMode: MobileWorkflowViewportMode
}) {
  const stageClass =
    viewportMode === "short"
      ? "relative mx-auto mt-3 min-h-[230px] w-full max-w-[420px] overflow-visible text-left"
      : viewportMode === "compact"
        ? "relative mx-auto mt-4 min-h-[280px] w-full max-w-[420px] overflow-visible text-left"
        : "relative mx-auto mt-5 min-h-[360px] w-full max-w-[420px] overflow-visible text-left"

  return (
    <div className={stageClass}>
      {WORKFLOW_DEMOS.map((demo, index) => (
        <MobileWorkflowTextLayer
          key={demo.id}
          demo={demo}
          distance={index - workflowPosition}
          viewportMode={viewportMode}
        />
      ))}
    </div>
  )
}

function MobileWorkflowTextLayer({
  demo,
  distance,
  viewportMode,
}: {
  demo: WorkflowDemo
  distance: number
  viewportMode: MobileWorkflowViewportMode
}) {
  const showPreview = viewportMode === "normal"
  const showMutedAction = viewportMode !== "short"
  const titleAnchorY = 0
  const exitTitleY = viewportMode === "short" ? -16 : -24
  const upNextAnchorY = viewportMode === "normal" ? 205 : 0
  const belowAnchorY = viewportMode === "normal" ? 260 : 0

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const preEnter = smoothStep((1.22 - distance) / 0.22)
  const nearby = distance > -1.05 && distance < (showPreview ? 1.22 : 1.05)

  if (!nearby) return null

  const enteringTextBaseOpacity = showPreview ? 0.58 : 0.18
  const enteringDescriptionOpacity = showPreview
    ? smoothStep((entering - 0.68) / 0.32)
    : smoothStep((entering - 0.16) / 0.68)

  const headlineY = distance < 0
    ? lerp(titleAnchorY, exitTitleY, exiting)
    : distance <= 1
      ? lerp(upNextAnchorY, titleAnchorY, entering)
      : lerp(belowAnchorY, upNextAnchorY, preEnter)
  const headlineOpacity = distance < 0
    ? 1 - exiting
    : distance <= 1
      ? lerp(enteringTextBaseOpacity, 1, entering)
      : lerp(0, showPreview ? 0.58 : 0, preEnter)
  const descriptionOpacity = distance < 0 ? 1 - exiting : enteringDescriptionOpacity
  const upNextOpacity = showPreview && distance > 0
    ? distance <= 1
      ? 1 - entering
      : preEnter
    : 0
  const supportAmount = smoothStep(1 - Math.abs(distance) / (viewportMode === "short" ? 0.3 : 0.42))

  const headlineClass =
    viewportMode === "short"
      ? "max-w-[350px] text-[22px] leading-[28px] text-[#4e4646]"
      : viewportMode === "compact"
        ? "max-w-[350px] text-[24px] leading-[30px] text-[#4e4646]"
        : "max-w-[350px] text-[26px] leading-[32px] text-[#4e4646]"
  const descriptionClass =
    viewportMode === "short"
      ? "mt-3 max-w-[340px] text-[14px] leading-[19px] text-[#627c86]"
      : "mt-4 max-w-[340px] text-[15px] leading-[21px] text-[#627c86]"
  const ctaClass =
    viewportMode === "short"
      ? "font-cta inline-flex min-h-10 min-w-[178px] max-w-[min(100%,240px)] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-5 py-1.5 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
      : "font-cta inline-flex min-h-11 min-w-[190px] max-w-[min(100%,260px)] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-5 py-2 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"

  return (
    <>
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          zIndex: Math.round(20 - Math.abs(distance) * 10),
        }}
        className="absolute inset-x-0 top-0 max-w-[360px]"
      >
        <p
          style={{ opacity: upNextOpacity }}
          className={
            "font-ui mb-2 w-[82px] text-[14px] leading-[20px] text-[#78909a] " +
            (showPreview ? "" : "hidden")
          }
        >
          Up Next
        </p>
        <h3 className={headlineClass}>
          {demo.title}{" "}
          <span className="font-display italic text-[#01b4c8]">{demo.accent}</span>
        </h3>
        <p
          style={{ opacity: descriptionOpacity }}
          className={descriptionClass}
        >
          {demo.description}
        </p>
      </div>

      <div
        style={{
          opacity: supportAmount,
          transform: `translateY(${10 * (1 - supportAmount)}px)`,
          pointerEvents: supportAmount > 0.85 ? "auto" : "none",
        }}
        className="absolute inset-x-0 bottom-0"
      >
        <BetaAccessTrigger
          source={demo.id === "research" ? "workflow-research" : "workflow-channels"}
          className={ctaClass}
        >
          <span className="text-balance text-[17px] leading-snug text-white">
            {demo.cta}
          </span>
        </BetaAccessTrigger>
        {showMutedAction ? (
          <p className="mt-3 whitespace-nowrap text-[13px] capitalize leading-[20px] text-[#78909a]">
            {demo.mutedAction}
          </p>
        ) : null}
      </div>
    </>
  )
}

function MobileWorkflowProgress({
  workflowPosition,
}: {
  workflowPosition: number
}) {
  const totalStops = WORKFLOW_DEMOS.length - 1
  const progress = totalStops === 0 ? 0 : clamp(workflowPosition / totalStops)

  return (
    <div
      aria-hidden
      className="relative mx-auto mt-4 h-6 w-full max-w-[260px]"
    >
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#9dddea]/70" />
      {WORKFLOW_DEMOS.map((demo, index) => {
        const stopProgress = totalStops === 0 ? 0 : index / totalStops
        return (
          <span
            key={demo.id}
            style={{ left: `${stopProgress * 100}%` }}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#86c6d8]/70"
          />
        )
      })}
      <span
        style={{ left: `${progress * 100}%` }}
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4cd8ff] shadow-[0_0_14px_rgba(76,216,255,0.6)]"
      />
    </div>
  )
}

function StaticMobileWorkflowDemos() {
  return (
    <section aria-labelledby="mobile-workflow-heading" className="px-5 py-14">
      <h2 id="mobile-workflow-heading" className="sr-only">
        Workflow demos
      </h2>
      <div className="mx-auto grid w-full max-w-[460px] gap-7">
        {WORKFLOW_DEMOS.map(demo => (
          <article
            key={demo.id}
            className="overflow-hidden rounded-[28px] bg-white/75 shadow-sm"
          >
            <img
              src={demo.poster}
              alt={demo.ariaLabel}
              className="aspect-964/694 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-[25px] leading-8 text-[#4e4646]">
                {demo.title}{" "}
                <span className="font-display italic text-[#01b4c8]">
                  {demo.accent}
                </span>
              </h3>
              <p className="mt-3 text-[15px] leading-[21px] text-[#627c86]">
                {demo.description}
              </p>
              <BetaAccessTrigger
                source={
                  demo.id === "research"
                    ? "workflow-research"
                    : "workflow-channels"
                }
                className="font-cta mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#4cd8ff] px-6 text-[17px] text-white"
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

function MobileWorkflowShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const viewportMode = useMobileWorkflowViewportMode()
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

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.1}`,
        pin: true,
        scrub: 0.12,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      })

      cleanup = () => {
        trigger.kill()
      }
    }

    void setupScrollTrigger()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    let cancelled = false
    async function refreshScrollTrigger() {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (!cancelled) ScrollTrigger.refresh()
    }
    void refreshScrollTrigger()
    return () => {
      cancelled = true
    }
  }, [reducedMotion, viewportMode])

  if (reducedMotion) return <StaticMobileWorkflowDemos />

  const workflowPosition = getHeldWorkflowPosition(scrollProgress, WORKFLOW_DEMOS.length)
  const sectionClass =
    viewportMode === "normal"
      ? "relative flex min-h-svh w-full items-center px-5 pb-8"
      : "relative flex min-h-svh w-full items-start px-5 pb-5"
  const sectionStyle = {
    paddingTop:
      viewportMode === "normal" ? NAV_HEIGHT_PX + 24 : NAV_HEIGHT_PX + 12,
    scrollMarginTop: NAV_HEIGHT_PX,
  }
  const contentClass = "mx-auto flex w-full max-w-[460px] flex-col items-center"

  return (
    <section
      ref={sectionRef}
      aria-labelledby="mobile-workflow-heading"
      className={sectionClass}
      style={sectionStyle}
    >
      <h2 id="mobile-workflow-heading" className="sr-only">
        Workflow demos
      </h2>
      <div className={contentClass}>
        <div className="w-full">
          <MobileWorkflowVideoPanel
            workflowPosition={workflowPosition}
            viewportMode={viewportMode}
          />
        </div>
        <MobileWorkflowProgress workflowPosition={workflowPosition} />
        <MobileWorkflowText
          workflowPosition={workflowPosition}
          viewportMode={viewportMode}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile work video section                                          */
/* ------------------------------------------------------------------ */
function MobileWorkVideoSection() {
  return (
    <section
      aria-labelledby="mobile-work-video-heading"
      className="relative z-20 overflow-visible bg-transparent px-5 pb-16 pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-92px] z-0 h-[390px]"
      >
        <img
          src={imgGrass}
          alt=""
          className="absolute bottom-0 left-1/2 w-[205%] max-w-none -translate-x-1/2 select-none opacity-85"
        />
        <div className="absolute inset-x-0 -bottom-px h-28 bg-linear-to-b from-transparent to-white" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[430px]">
        <div className="relative overflow-hidden rounded-[36px] bg-white px-4 pb-8 pt-9 backdrop-blur-[13.55px]">
          <h2
            id="mobile-work-video-heading"
            className="mx-auto max-w-[360px] text-center text-[31px] capitalize leading-[38px]"
          >
            <span className="font-ui text-[#4e4646]">
              Your Business Shouldn&rsquo;t Loop Around Dealing With
            </span>{" "}
            <span className="font-display italic text-[#01b4c8]">
              Emails, Files And CRM
            </span>
          </h2>

          <div className="mt-8 aspect-1166/653 w-full overflow-hidden rounded-[28px] bg-white">
            <WorkDemoVideo
              media="(max-width: 1023px)"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mx-auto mt-6 max-w-[330px] text-center text-[31px] capitalize leading-[38px]">
            <span className="font-display italic text-[#01b4c8]">
              Let Construct
            </span>{" "}
            <span className="font-ui text-[#4e4646]">Do It For You</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile pricing                                                     */
/* ------------------------------------------------------------------ */
function MobilePricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article className="relative isolate min-h-[228px] w-full overflow-hidden rounded-[26px] bg-white shadow-[0_18px_48px_rgba(57,148,154,0.08)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[26px] border border-[#35949a]/45"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 42%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 42%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 100%)",
        }}
      >
        <img
          src={plan.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 grid min-h-[228px] grid-cols-[minmax(128px,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex min-w-0 flex-col justify-between px-4 py-5 text-white">
          <div>
            <h3
              className="text-[27px] leading-[24px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {plan.name}
            </h3>
            <div
              className="mt-8 flex flex-wrap items-end gap-x-[5px] gap-y-1"
              style={{ textShadow: PRICING_PRICE_TEXT_SHADOW }}
            >
              <span
                className="text-[45px] leading-[0.8]"
                style={{
                  fontFamily: "Georgia, serif",
                  fontFeatureSettings: "'lnum' 1, 'pnum' 1",
                }}
              >
                {plan.price}
              </span>
              <span className="font-inter mb-0.5 text-[12px] leading-[15px]">
                / month
              </span>
            </div>
          </div>

          <BetaAccessTrigger
            source={`pricing-${plan.name.toLowerCase()}`}
            aria-label={`Try Construct on the ${plan.name} plan`}
            style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
            className="font-inter inline-flex h-[38px] w-full max-w-[132px] items-center justify-center rounded-[20px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-3 text-[12px] font-medium leading-[16px] text-white active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            Try Construct
          </BetaAccessTrigger>
        </div>

        <div className="flex min-w-0 flex-col justify-center py-5 pl-2 pr-4">
          <p className="font-inter mb-3 text-[11px] font-medium uppercase leading-[14px] tracking-[0.18em] text-[#86c6d8]">
            Benefits
          </p>
          <ul className="font-inter flex min-w-0 flex-col gap-[7px] text-[12.5px] leading-[15px] text-[#4e4646]">
            {plan.features.map((feature, index) => (
              <li
                key={feature.label}
                className={
                  "flex min-w-0 items-center gap-2 " +
                  (index >= 4 ? "text-[#627c86]" : "text-[#4e4646]")
                }
              >
                <PricingFeatureIcon
                  icon={feature.icon}
                  className="h-[14px] w-[14px] shrink-0 text-[#39abdb]"
                />
                <span className="min-w-0">{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

function MobileEnterprisePanel({ className }: { className?: string }) {
  return (
    <article
      aria-labelledby="mobile-enterprise-heading"
      className={
        "relative isolate overflow-hidden rounded-[26px] border border-[#b3d6f6] bg-white px-6 pb-7 pt-8 " +
        (className ?? "")
      }
    >
      <img
        src={imgEnterpriseBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[-360px] left-1/2 -z-10 size-[760px] max-w-none -translate-x-1/2 select-none opacity-[0.62]"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <h3
            id="mobile-enterprise-heading"
            className="text-[34px] leading-[26px] text-[#656565]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Enterprise
          </h3>

          <p className="font-inter max-w-[145px] text-right text-[13px] leading-[17px] text-[#484848]">
            *Includes everything in{" "}
            <span className="text-[#2978b9]">Pro</span>
            <br />
            <span className="text-[#2978b9]">+ Specific MCP/s</span>
          </p>
        </div>

        <p className="font-inter mt-8 text-[16px] leading-[24px] text-[#787878]">
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

        <div className="mt-7 flex justify-center">
          <img
            src={imgEnterprise}
            alt="Construct enterprise agent with beams of light"
            className="max-h-[220px] w-full max-w-[300px] object-contain"
          />
        </div>

        <div className="mt-7 flex flex-col items-stretch gap-4">
          <a
            href="https://cal.com/construct/15min"
            target="_blank"
            rel="noopener noreferrer"
            style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
            className="font-inter inline-flex h-[54px] w-full items-center justify-center rounded-[27px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-5 text-[17px] font-medium leading-[22px] text-white active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            Book A Call
          </a>
          <a
            href="mailto:enterprise@construct.computer"
            className="font-inter text-center text-[17px] font-medium leading-[22px] text-[#39abdb] transition-colors hover:text-[#2978b9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            or send us an email
          </a>
        </div>
      </div>
    </article>
  )
}

function MobilePricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="mobile-pricing-heading"
      className="relative isolate w-full px-5 py-14"
    >
      <div className="mx-auto max-w-[400px] text-center">
        <h2
          id="mobile-pricing-heading"
          className="text-balance text-[32px] capitalize leading-[38px]"
        >
          <span className="font-ui text-[#4e4646]">Perfect Plan </span>
          <span className="font-display italic text-[#01b4c8]">
            For Your Every Need
          </span>
        </h2>
        <p className="font-ui mx-auto mt-4 max-w-[340px] text-[15px] leading-[21px] text-[#627c86]">
          Construct is built to adapt to your task, it handles everything and
          can automate most of the workflows without any monitoring.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[430px] flex-col gap-5">
        {PRICING_PLANS.map((plan) => (
          <MobilePricingCard key={plan.name} plan={plan} />
        ))}

        <MobileEnterprisePanel className="mt-1" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile FAQ and footer CTA                                          */
/* ------------------------------------------------------------------ */
function MobileFaqAccordionItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={
        "overflow-hidden rounded-[22px] transition-[background-color] duration-200 " +
        (open ? "bg-[#f3f3f3]" : "bg-[#f8f8f8]")
      }
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-inter flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="text-[18px] font-medium leading-[22px] tracking-[-0.4px] text-[#565656]">
          {question}
        </span>
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center text-[#565656]"
        >
          <svg
            viewBox="0 0 24 24"
            className={
              "h-6 w-6 transition-transform duration-200 " +
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
          <p className="font-inter px-5 pb-5 text-[15px] leading-[21px] text-[#627c86]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function MobileFaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="mobile-faq-heading"
      className="relative w-full px-5 py-16"
    >
      <div className="mx-auto w-full max-w-[430px]">
        <div className="text-center">
          <h2
            id="mobile-faq-heading"
            className="text-balance text-[32px] capitalize leading-[38px]"
          >
            <span className="font-ui text-[#4e4646]">Frequently Asked</span>{" "}
            <span className="font-display italic text-[#01b4c8]">
              Questions
            </span>
          </h2>
          <p className="font-ui mx-auto mt-4 max-w-[340px] text-[15px] leading-[21px] text-[#627c86]">
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
            className="font-cta mt-7 inline-flex h-[50px] min-w-[190px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-6 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
          >
            <span className="text-[17px] capitalize leading-[50px] text-white">
              Send Us Hello
            </span>
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {LANDING_FAQ.map((f) => (
            <MobileFaqAccordionItem
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
export function MobileLanding() {
  return (
    <div
      className="landing-page relative min-h-dvh w-full overflow-x-clip bg-white text-[#4e4646]"
      onDragStart={preventLandingImageDrag}
    >
      <LandingNav />
      <main id="main">
        <HeroWithStraddlingPortal />
        <ShowcaseStrip />
        <WhatConstructIsSection className="pt-0" />
        <div
          className="relative w-full overflow-visible"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 4%, #ddfaff 10%, #ddfaff 10%, #fefefe 50%, #ffffff 100%)",
          }}
        >
          <img
            src={imgLightBeams}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 z-0 w-full select-none"
            style={{ top: "5%" }}
          />
          <div className="relative z-10">
            <MobileCloudsTransition />
            <AdaptsSection className="py-10" />
            <MobileWorkflowShowcase />
            <MobileFeatureGridSection />
            <MobileWorkVideoSection />
            <MobilePricingSection />
          </div>
        </div>
        <MobileFaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
