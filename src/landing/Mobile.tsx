import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgEnterprise from "@/assets/enterprise.png"
import imgEnterpriseBg from "@/assets/enterprise-bg.png"
import imgGrass from "@/assets/grass.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import workVideo from "@/assets/work.mp4"
import { LANDING_FAQ } from "@/content/faq"
import { PRICING_PLANS, type PricingPlan } from "@/content/pricing"
import researchVideoMp4 from "@/assets/research.mp4"
import researchVideo from "@/assets/research.webm"
import slackVideoMp4 from "@/assets/slack.mp4"
import slackVideo from "@/assets/slack.webm"
import {
  AdaptsSection,
  BETA_URL,
  EnterExperienceButton,
  LandingFooter,
  LandingNav,
  NAV_HEIGHT_PX,
  PortalVideo,
  PRICING_BUTTON_BOX_SHADOW,
  PRICING_PRICE_TEXT_SHADOW,
  PricingFeatureIcon,
  WhatConstructIsSection,
  useSoftPinTransform,
} from "./shared"

const MOBILE_WORKFLOW_DEMOS = [
  {
    id: "research",
    title: "Research About",
    accent: "Any Topic",
    description:
      "Construct gathers sources, compares details, and turns messy questions into cited research you can review or share.",
    cta: "Research a Topic",
    mutedAction: "See Report Samples Generated",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    ariaLabel: "Construct researching a topic in the product interface",
  },
  {
    id: "channels",
    title: "Work Together",
    accent: "Across Channels",
    description:
      "Bring Construct into Slack, Telegram, Discord, email, and more so your team can share context, assign work, and move together.",
    cta: "Collaborate",
    mutedAction: "See Shared Threads",
    video: slackVideo,
    videoMp4: slackVideoMp4,
    ariaLabel:
      "Construct available across Slack, Telegram, Discord, email, and team collaboration",
  },
] as const

type MobileWorkflowDemo = (typeof MOBILE_WORKFLOW_DEMOS)[number]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function smoothStep(value: number) {
  const x = clamp(value)
  return x * x * (3 - 2 * x)
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function getHeldWorkflowPosition(progress: number) {
  const transitionCount = MOBILE_WORKFLOW_DEMOS.length - 1
  if (transitionCount <= 0) return 0
  if (progress >= 1) return transitionCount

  const scaled = clamp(progress) * transitionCount
  const segment = Math.min(Math.floor(scaled), transitionCount - 1)
  const local = scaled - segment
  const transitionStart = 0.24
  const transitionEnd = 0.76
  const localTransition = smoothStep(
    (local - transitionStart) / (transitionEnd - transitionStart)
  )

  return segment + localTransition
}

/** Raw ScrollTrigger scrub progress (0–1) that lands on the start of workflow demo `index`. */
function workflowDemoIndexToScrollProgress(demoIndex: number, demoCount: number) {
  if (demoCount <= 1 || demoIndex <= 0) return 0
  const transitionCount = demoCount - 1
  if (demoIndex >= demoCount) return 1
  
  // The transition to index `n` finishes when the local progress of segment `n-1` reaches 0.76.
  // scaled = (segment) + local = (demoIndex - 1) + 0.76
  const scaled = (demoIndex - 1) + 0.76
  return clamp(scaled / transitionCount)
}

const WORKFLOW_VIDEO_ADVANCE_DELAY_MS = 2000

const WORKFLOW_SCROLL_SPRING_STIFFNESS = 76
const WORKFLOW_SCROLL_SPRING_DAMPING = 17.6
const WORKFLOW_SCROLL_SPRING_MAX_DT = 1 / 24

function useSmoothedWorkflowScrollProgress(reducedMotion: boolean) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetRef = useRef(0)
  const displayRef = useRef(0)
  const velocityRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(reducedMotion)
  reducedMotionRef.current = reducedMotion

  useEffect(() => {
    if (!reducedMotion) return
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    lastTimeRef.current = null
    velocityRef.current = 0
    const t = targetRef.current
    displayRef.current = t
    setScrollProgress(t)
  }, [reducedMotion])

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  const commitScrollProgress = useCallback((p: number) => {
    targetRef.current = p
    if (reducedMotionRef.current) {
      displayRef.current = p
      velocityRef.current = 0
      lastTimeRef.current = null
      setScrollProgress(p)
      return
    }

    const springStep = (time: number) => {
      if (reducedMotionRef.current) {
        const t = targetRef.current
        displayRef.current = t
        velocityRef.current = 0
        lastTimeRef.current = null
        setScrollProgress(t)
        rafRef.current = 0
        return
      }

      const prevTime = lastTimeRef.current
      lastTimeRef.current = time
      const dt =
        prevTime == null
          ? 1 / 60
          : Math.min((time - prevTime) / 1000, WORKFLOW_SCROLL_SPRING_MAX_DT)

      const target = targetRef.current
      let x = displayRef.current
      let v = velocityRef.current

      const displacement = target - x
      const acceleration =
        WORKFLOW_SCROLL_SPRING_STIFFNESS * displacement -
        WORKFLOW_SCROLL_SPRING_DAMPING * v

      v += acceleration * dt
      x += v * dt

      displayRef.current = x
      velocityRef.current = v
      setScrollProgress(clamp(x, 0, 1))

      const settled =
        Math.abs(target - x) < 0.00012 && Math.abs(v) < 0.004

      if (settled) {
        displayRef.current = target
        velocityRef.current = 0
        lastTimeRef.current = null
        setScrollProgress(target)
        rafRef.current = 0
        return
      }

      rafRef.current = requestAnimationFrame(springStep)
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(springStep)
    }
  }, [])

  return [scrollProgress, commitScrollProgress] as const
}

function getSectionVisibilityFraction(el: HTMLElement | null): number {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const h = rect.height
  if (h <= 0) return 0
  const vh = window.innerHeight
  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(vh, rect.bottom)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  return clamp(visibleHeight / h)
}

/** Viewport edge opacity only on mobile — blur uses crossfade path only (see MobileWorkflowVideoLayer). */
function workflowViewportEdgeFade(
  demoIndex: number,
  demoCount: number,
  visibilityFraction: number,
  reducedMotion: boolean,
): number {
  if (reducedMotion) return 1
  const v = clamp(visibilityFraction)
  const fadeIn =
    demoIndex === 0
      ? v < 0.5
        ? 0
        : smoothStep((v - 0.5) / 0.5)
      : 1
  const fadeOut =
    demoIndex === demoCount - 1 ? smoothStep(v) : 1
  return fadeIn * fadeOut
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(media.matches)

    const onChange = () => setPrefersReducedMotion(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}

type MobileWorkflowViewportMode = "normal" | "compact" | "short"

function getMobileWorkflowViewportMode(): MobileWorkflowViewportMode {
  if (typeof window === "undefined") return "normal"
  if (window.innerHeight <= 640) return "short"
  if (window.innerHeight <= 740) return "compact"
  return "normal"
}

function useMobileWorkflowViewportMode() {
  const [mode, setMode] = useState<MobileWorkflowViewportMode>(
    getMobileWorkflowViewportMode,
  )

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
      <h1 className="font-display text-balance text-[38px] capitalize italic leading-[1.1] text-[#4e4646]">
        <span className="text-[#01b4c8]">Autonomous </span>
        <span>Computer that </span>
        <span className="text-[#01b4c8]">Works For You</span>
      </h1>
      <p className="font-ui mx-auto mt-5 max-w-[360px] text-[15px] leading-[21px] text-[#627c86]">
        An AI agent with its own cloud computer — works across Slack,
        Telegram, and email, on any device.
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
          <PortalVideo />
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
  sectionVisibilityFraction,
  isVisible,
  reducedMotion,
  viewportMode,
  onRequestAdvanceAfterVideoEnd,
}: {
  workflowPosition: number
  sectionVisibilityFraction: number
  isVisible: boolean
  reducedMotion: boolean
  viewportMode: MobileWorkflowViewportMode
  onRequestAdvanceAfterVideoEnd?: (endedDemoIndex: number) => void
}) {
  const dominantIndex = Math.min(
    Math.floor(workflowPosition + 0.1),
    MOBILE_WORKFLOW_DEMOS.length - 1
  )

  return (
    <div 
      className="relative mx-auto aspect-964/694 w-full overflow-hidden rounded-[32px] bg-white/20"
      style={{
        maxWidth:
          viewportMode === "short"
            ? "min(320px, 40dvh)"
            : viewportMode === "compact"
              ? "min(380px, 48dvh)"
              : "min(440px, 60dvh)",
      }}
    >
      {MOBILE_WORKFLOW_DEMOS.map((demo, index) => {
        const distance = index - workflowPosition
        const isDominant = index === dominantIndex

        if (reducedMotion && !isDominant) return null
        if (!reducedMotion && (distance <= -1.05 || distance >= 1.05)) return null

        return (
          <MobileWorkflowVideoLayer
            key={demo.id}
            demo={demo}
            demoIndex={index}
            distance={distance}
            isDominant={isDominant}
            isVisible={isVisible}
            sectionVisibilityFraction={sectionVisibilityFraction}
            reducedMotion={reducedMotion}
            workflowDemoCount={MOBILE_WORKFLOW_DEMOS.length}
            onRequestAdvanceAfterVideoEnd={onRequestAdvanceAfterVideoEnd}
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

function MobileWorkflowVideoLayer({
  demo,
  demoIndex,
  distance,
  isDominant,
  isVisible,
  sectionVisibilityFraction,
  reducedMotion,
  workflowDemoCount,
  onRequestAdvanceAfterVideoEnd,
}: {
  demo: MobileWorkflowDemo
  demoIndex: number
  distance: number
  isDominant: boolean
  isVisible: boolean
  sectionVisibilityFraction: number
  reducedMotion: boolean
  workflowDemoCount: number
  onRequestAdvanceAfterVideoEnd?: (endedDemoIndex: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const wasDominantRef = useRef(false)
  const advanceTimerRef = useRef<number | null>(null)

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current != null) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearAdvanceTimer()
  }, [clearAdvanceTimer])

  useEffect(() => {
    if (!isDominant || !isVisible) clearAdvanceTimer()
  }, [isDominant, isVisible, clearAdvanceTimer])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isDominant && !wasDominantRef.current) video.currentTime = 0
    wasDominantRef.current = isDominant

    if (isVisible && isDominant) {
      if (demoIndex === workflowDemoCount - 1) {
        const isAtEnd = video.currentTime > 0 && video.currentTime >= (video.duration || 0) - 0.5
        if (!isAtEnd) {
          void video.play().catch(() => {})
        }
      } else {
        void video.play().catch(() => {})
      }
    } else {
      video.pause()
      if (demoIndex === workflowDemoCount - 1 && isDominant) {
        video.currentTime = 999999
      } else {
        video.currentTime = 0
      }
    }
  }, [demo.id, isDominant, isVisible, demoIndex, workflowDemoCount])

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const edgeFade = workflowViewportEdgeFade(
    demoIndex,
    MOBILE_WORKFLOW_DEMOS.length,
    sectionVisibilityFraction,
    reducedMotion,
  )
  const opacity = reducedMotion
    ? isDominant
      ? 1 * edgeFade
      : 0
    : (distance < 0 ? 1 - exiting : lerp(0, 1, entering)) * edgeFade
  const translateY = reducedMotion
    ? 0
    : distance < 0
      ? lerp(0, 16, exiting)
      : lerp(-16, 0, entering)
  const scale = reducedMotion
    ? 1
    : distance < 0
      ? lerp(1, 0.99, exiting)
      : lerp(1.012, 1, entering)
  const crossfadeBlur =
    distance < 0 ? 5 * exiting : 5 * (1 - entering)
  /** Clip-to-clip blur only; first/last viewport in/out stay sharp (no edgeBlurPx on mobile). */
  const blur = reducedMotion ? 0 : Math.min(5, crossfadeBlur)

  const handleVideoEnded = useCallback(() => {
    if (!isDominant || !isVisible || reducedMotion) return
    if (demoIndex >= workflowDemoCount - 1) return
    if (!onRequestAdvanceAfterVideoEnd) return
    clearAdvanceTimer()
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null
      onRequestAdvanceAfterVideoEnd(demoIndex)
    }, WORKFLOW_VIDEO_ADVANCE_DELAY_MS)
  }, [
    isDominant,
    isVisible,
    reducedMotion,
    demoIndex,
    workflowDemoCount,
    onRequestAdvanceAfterVideoEnd,
    clearAdvanceTimer,
  ])

  return (
    <video
      ref={videoRef}
      muted
      autoPlay
      playsInline
      preload="auto"
      aria-label={isDominant ? demo.ariaLabel : undefined}
      aria-hidden={!isDominant}
      onEnded={handleVideoEnded}
      onLoadedMetadata={(event) => {
        const video = event.currentTarget
        if (isVisible && isDominant) {
          if (demoIndex === workflowDemoCount - 1) {
            const isAtEnd = video.currentTime > 0 && video.currentTime >= (video.duration || 0) - 0.5
            if (!isAtEnd) {
              video.currentTime = 0
              void video.play().catch(() => {})
            }
          } else {
            video.currentTime = 0
            void video.play().catch(() => {})
          }
        } else {
          video.pause()
          if (demoIndex === workflowDemoCount - 1 && isDominant) {
            video.currentTime = 999999
          } else {
            video.currentTime = 0
          }
        }
      }}
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        zIndex: Math.round(20 - Math.abs(distance) * 10),
        willChange: "opacity, transform, filter",
      }}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={demo.videoMp4} type="video/mp4" />
      <source src={demo.video} type="video/webm" />
    </video>
  )
}

function MobileWorkflowText({
  workflowPosition,
  reducedMotion,
  viewportMode,
}: {
  workflowPosition: number
  reducedMotion: boolean
  viewportMode: MobileWorkflowViewportMode
}) {
  const stageClass =
    viewportMode === "short"
      ? "relative mx-auto mt-3 min-h-[250px] w-full max-w-[420px] overflow-visible text-left"
      : viewportMode === "compact"
        ? "relative mx-auto mt-4 min-h-[310px] w-full max-w-[420px] overflow-visible text-left"
        : "relative mx-auto mt-5 min-h-[390px] w-full max-w-[420px] overflow-visible text-left"

  return (
    <div className={stageClass}>
      {MOBILE_WORKFLOW_DEMOS.map((demo, index) => (
        <MobileWorkflowTextLayer
          key={demo.id}
          demo={demo}
          distance={index - workflowPosition}
          reducedMotion={reducedMotion}
          viewportMode={viewportMode}
        />
      ))}
    </div>
  )
}

function MobileWorkflowTextLayer({
  demo,
  distance,
  reducedMotion,
  viewportMode,
}: {
  demo: MobileWorkflowDemo
  distance: number
  reducedMotion: boolean
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
  const enteringTextBlur = showPreview ? 0 : lerp(7, 0, entering)
  const enteringDescriptionOpacity = showPreview
    ? smoothStep((entering - 0.68) / 0.32)
    : smoothStep((entering - 0.16) / 0.68)

  const headlineY = reducedMotion
    ? titleAnchorY
    : distance < 0
      ? lerp(titleAnchorY, exitTitleY, exiting)
      : distance <= 1
        ? lerp(upNextAnchorY, titleAnchorY, entering)
        : lerp(belowAnchorY, upNextAnchorY, preEnter)
  const headlineOpacity = reducedMotion
    ? Math.round(distance) === 0
      ? 1
      : 0
    : distance < 0
      ? 1 - exiting
      : distance <= 1
        ? lerp(enteringTextBaseOpacity, 1, entering)
        : lerp(0, showPreview ? 0.58 : 0, preEnter)
  const headlineScale = reducedMotion
    ? 1
    : distance < 0
      ? 1
      : distance <= 1
        ? lerp(showPreview ? 0.86 : 0.96, 1, entering)
        : lerp(0.96, showPreview ? 0.86 : 0.96, preEnter)
  const descriptionOpacity = reducedMotion
    ? headlineOpacity
    : distance < 0
      ? 1 - exiting
      : enteringDescriptionOpacity
  const upNextOpacity = reducedMotion
    ? 0
    : showPreview && distance > 0
      ? distance <= 1
        ? 1 - entering
        : preEnter
      : 0
  const blur = reducedMotion
    ? 0
    : distance < 0
      ? 4 * exiting
      : enteringTextBlur
  const supportAmount = reducedMotion
    ? Math.round(distance) === 0
      ? 1
      : 0
    : smoothStep(1 - Math.abs(distance) / (viewportMode === "short" ? 0.3 : 0.42))

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
          transform: `translateY(${headlineY}px) scale(${headlineScale})`,
          transformOrigin: "left top",
          filter: `blur(${blur}px)`,
          zIndex: Math.round(20 - Math.abs(distance) * 10),
          willChange: "opacity, transform, filter",
        }}
        className="absolute inset-x-0 top-0 max-w-[360px]"
      >
        <p
          style={{ opacity: upNextOpacity }}
          className={
            "font-ui mb-2 w-[82px] bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[14px] leading-[20px] text-transparent " +
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
          transform: `translateY(${18 * (1 - supportAmount)}px)`,
          pointerEvents: supportAmount > 0.85 ? "auto" : "none",
          willChange: "opacity, transform",
        }}
        className="absolute inset-x-0 bottom-0"
      >
        <a
          href={BETA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaClass}
        >
          <span className="text-balance text-[17px] leading-snug text-white">
            {demo.cta}
          </span>
        </a>
        {showMutedAction ? (
          <p className="mt-3 whitespace-nowrap bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[13px] capitalize leading-[20px] text-transparent">
            {demo.mutedAction}
          </p>
        ) : null}
      </div>
    </>
  )
}

function MobileWorkflowProgress({
  workflowPosition,
  reducedMotion,
}: {
  workflowPosition: number
  reducedMotion: boolean
}) {
  const totalStops = MOBILE_WORKFLOW_DEMOS.length - 1
  const progress = totalStops === 0 ? 0 : clamp(workflowPosition / totalStops)

  return (
    <div
      aria-hidden
      className="relative mx-auto mt-4 h-6 w-full max-w-[260px]"
    >
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#9dddea]/70" />
      {MOBILE_WORKFLOW_DEMOS.map((demo, index) => {
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
        style={{
          left: `${progress * 100}%`,
          willChange: reducedMotion ? undefined : "left",
        }}
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4cd8ff] shadow-[0_0_14px_rgba(76,216,255,0.6)]"
      />
    </div>
  )
}

function MobileWorkflowShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoPanelRef = useRef<HTMLDivElement | null>(null)
  const workflowPinScrollTriggerRef = useRef<{
    readonly start: number
    readonly end: number
  } | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const viewportMode = useMobileWorkflowViewportMode()
  const [scrollProgress, commitScrollProgress] =
    useSmoothedWorkflowScrollProgress(reducedMotion)
  const [sectionVisibilityFraction, setSectionVisibilityFraction] = useState(0)
  const [isVideoPlaybackVisible, setIsVideoPlaybackVisible] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (section) {
      setSectionVisibilityFraction(getSectionVisibilityFraction(section))
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const updateScrollDerived = () => {
      frame = 0
      const section = sectionRef.current
      if (section) {
        setSectionVisibilityFraction(getSectionVisibilityFraction(section))
      }
      const panel = videoPanelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      const isAboveHalfScreen = rect.top <= window.innerHeight / 2
      const isStillOnScreen = rect.bottom >= 0
      const shouldPlay = isAboveHalfScreen && isStillOnScreen

      setIsVideoPlaybackVisible((current) =>
        current === shouldPlay ? current : shouldPlay,
      )
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateScrollDerived)
    }

    updateScrollDerived()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  const scrollToWorkflowDemoIndex = useCallback((targetIndex: number) => {
    const st = workflowPinScrollTriggerRef.current
    if (!st || MOBILE_WORKFLOW_DEMOS.length <= 1) return
    const idx = Math.min(
      Math.max(targetIndex, 0),
      MOBILE_WORKFLOW_DEMOS.length - 1,
    )
    const p = workflowDemoIndexToScrollProgress(idx, MOBILE_WORKFLOW_DEMOS.length)
    const y = st.start + (st.end - st.start) * p
    window.scrollTo({ top: y, behavior: "smooth" })
  }, [])

  const requestAdvanceAfterVideoEnd = useCallback(
    (endedDemoIndex: number) => {
      if (reducedMotion) return
      scrollToWorkflowDemoIndex(endedDemoIndex + 1)
    },
    [reducedMotion, scrollToWorkflowDemoIndex],
  )

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false

    async function setupScrollTrigger() {
      const section = sectionRef.current
      if (!section) return

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (MOBILE_WORKFLOW_DEMOS.length + 0.25)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          commitScrollProgress(self.progress)
          setSectionVisibilityFraction(getSectionVisibilityFraction(section))
        },
      })

      workflowPinScrollTriggerRef.current = trigger

      cleanup = () => {
        workflowPinScrollTriggerRef.current = null
        trigger.kill()
      }
    }

    void setupScrollTrigger()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [commitScrollProgress])

  useEffect(() => {
    let cancelled = false
    async function refreshScrollTrigger() {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (!cancelled) ScrollTrigger.refresh()
    }
    void refreshScrollTrigger()
    return () => {
      cancelled = true
    }
  }, [viewportMode])

  const workflowPosition = getHeldWorkflowPosition(scrollProgress)
  const softPinContentRef = useSoftPinTransform(sectionRef, reducedMotion)
  const sectionClass =
    viewportMode === "normal"
      ? "relative flex min-h-svh w-full items-center px-5 pb-8"
      : "relative flex min-h-svh w-full items-start px-5 pb-5"
  const sectionStyle = {
    paddingTop:
      viewportMode === "normal" ? NAV_HEIGHT_PX + 24 : NAV_HEIGHT_PX + 12,
    scrollMarginTop: NAV_HEIGHT_PX,
  }
  const contentClass =
    viewportMode === "short"
      ? "mx-auto flex w-full max-w-[460px] flex-col items-center will-change-transform"
      : viewportMode === "compact"
        ? "mx-auto flex w-full max-w-[460px] flex-col items-center will-change-transform"
        : "mx-auto flex w-full max-w-[460px] flex-col items-center will-change-transform"

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
      <div ref={softPinContentRef} className={contentClass}>
        <div ref={videoPanelRef} className="w-full">
          <MobileWorkflowVideoPanel
            workflowPosition={workflowPosition}
            sectionVisibilityFraction={sectionVisibilityFraction}
            isVisible={isVideoPlaybackVisible}
            reducedMotion={reducedMotion}
            viewportMode={viewportMode}
            onRequestAdvanceAfterVideoEnd={requestAdvanceAfterVideoEnd}
          />
        </div>
        <MobileWorkflowProgress
          workflowPosition={workflowPosition}
          reducedMotion={reducedMotion}
        />
        <MobileWorkflowText
          workflowPosition={workflowPosition}
          reducedMotion={reducedMotion}
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
            <video
              src={workVideo}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              aria-label="Construct organizing work across emails, files, and CRM"
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

          <a
            href={BETA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Try Construct on the ${plan.name} plan`}
            style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
            className="font-inter inline-flex h-[38px] w-full max-w-[132px] items-center justify-center rounded-[20px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-3 text-[12px] font-medium leading-[16px] text-white active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            Try Construct
          </a>
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

function MobileFooterCtaBlock() {
  return (
    <section
      aria-labelledby="mobile-footer-cta-heading"
      className="relative w-full px-5 pb-14 pt-2"
    >
      <div className="mx-auto w-full max-w-[430px]">
        <div
          className="relative isolate overflow-hidden rounded-[38px] px-6 py-12"
          style={{
            background:
              "linear-gradient(to bottom, #6bbfe3 0%, rgba(0,117,150,0.94) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-12%,rgba(255,255,255,0.46),transparent_58%)]"
          />
          <div className="mx-auto flex max-w-[330px] flex-col items-center text-center text-white">
            <h2
              id="mobile-footer-cta-heading"
              className="text-balance text-[34px] capitalize leading-[40px]"
            >
              <span className="font-ui">Give Your Work To </span>
              <span className="font-display italic">Construct</span>
            </h2>
            <p className="font-ui mt-5 text-[15px] leading-[21px] text-white/85">
              Deploy your own autonomous cloud computer in seconds. Construct
              handles research, code, and email so you can focus on what matters.
            </p>
            <a
              href={BETA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter mt-8 inline-flex h-[54px] min-w-[220px] items-center justify-center rounded-[27px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-8 text-[17px] font-medium leading-[22px] text-white shadow-[0_10px_21px_rgba(0,0,0,0.1),0_39px_39px_rgba(0,0,0,0.09),0_87px_52px_rgba(0,0,0,0.05),inset_0_7px_4px_#2b476e] active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d6f8c]"
            >
              Try Construct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
export function MobileLanding() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-clip bg-white text-[#4e4646]">
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
            <MobileWorkVideoSection />
            <MobilePricingSection />
          </div>
        </div>
        <MobileFaqSection />
        <MobileFooterCtaBlock />
      </main>
      <LandingFooter />
    </div>
  )
}
