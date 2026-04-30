import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import { PRICING_PLANS, type PricingPlan } from "@/content/pricing"
import researchVideoMp4 from "@/assets/research.mp4"
import researchVideo from "@/assets/research.webm"
import slackVideoMp4 from "@/assets/slack.mp4"
import slackVideo from "@/assets/slack.webm"
import {
  AdaptsSection,
  BETA_URL,
  EnterExperienceButton,
  FaqSection,
  LandingFooter,
  LandingNav,
  NAV_HEIGHT_PX,
  PortalVideo,
  PRICING_BUTTON_BOX_SHADOW,
  PRICING_PRICE_TEXT_SHADOW,
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
  onRequestAdvanceAfterVideoEnd,
}: {
  workflowPosition: number
  sectionVisibilityFraction: number
  isVisible: boolean
  reducedMotion: boolean
  onRequestAdvanceAfterVideoEnd?: (endedDemoIndex: number) => void
}) {
  const dominantIndex = Math.min(
    Math.floor(workflowPosition + 0.1),
    MOBILE_WORKFLOW_DEMOS.length - 1
  )

  return (
    <div 
      className="relative mx-auto aspect-964/694 w-full max-w-[440px] overflow-hidden rounded-[32px] bg-white/20"
      style={{ maxWidth: 'min(440px, 60dvh)' }}
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
}: {
  workflowPosition: number
  reducedMotion: boolean
}) {
  return (
    <div className="relative mx-auto mt-5 min-h-[310px] w-full max-w-[420px] overflow-visible text-left">
      {MOBILE_WORKFLOW_DEMOS.map((demo, index) => (
        <MobileWorkflowTextLayer
          key={demo.id}
          demo={demo}
          distance={index - workflowPosition}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

function MobileWorkflowTextLayer({
  demo,
  distance,
  reducedMotion,
}: {
  demo: MobileWorkflowDemo
  distance: number
  reducedMotion: boolean
}) {
  const titleAnchorY = 0
  const exitTitleY = -24
  const upNextAnchorY = 240
  const belowAnchorY = 290
  const supportTopY = 145

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const preEnter = smoothStep((1.22 - distance) / 0.22)
  const nearby = distance > -1.05 && distance < 1.22

  if (!nearby) return null

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
        ? lerp(0.58, 1, entering)
        : lerp(0, 0.58, preEnter)
  const headlineScale = reducedMotion
    ? 1
    : distance < 0
      ? 1
      : distance <= 1
        ? lerp(0.86, 1, entering)
        : lerp(0.82, 0.86, preEnter)
  const descriptionOpacity = reducedMotion
    ? headlineOpacity
    : distance < 0
      ? 1 - exiting
      : smoothStep((entering - 0.68) / 0.32)
  const upNextOpacity = reducedMotion
    ? 0
    : distance > 0
      ? distance <= 1
        ? 1 - entering
        : preEnter
      : 0
  const blur = reducedMotion
    ? 0
    : distance < 0
      ? 4 * exiting
      : 0
  const supportAmount = reducedMotion
    ? Math.round(distance) === 0
      ? 1
      : 0
    : smoothStep(1 - Math.abs(distance) / 0.42)

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
          className="font-ui mb-2 w-[82px] bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[14px] leading-[20px] text-transparent"
        >
          Up Next
        </p>
        <h3 className="max-w-[350px] text-[26px] leading-[32px] text-[#4e4646]">
          {demo.title}{" "}
          <span className="font-display italic text-[#01b4c8]">{demo.accent}</span>
        </h3>
        <p
          style={{ opacity: descriptionOpacity }}
          className="mt-3 max-w-[330px] text-[15px] leading-[21px] text-[#627c86]"
        >
          {demo.description}
        </p>
      </div>

      <div
        style={{
          opacity: supportAmount,
          transform: `translateY(${supportTopY + 18 * (1 - supportAmount)}px)`,
          pointerEvents: supportAmount > 0.85 ? "auto" : "none",
          willChange: "opacity, transform",
        }}
        className="absolute inset-x-0 top-0"
      >
        <a
          href={BETA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-[190px] max-w-[min(100%,260px)] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-5 py-2 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
        >
          <span className="text-balance text-[17px] leading-snug text-white">
            {demo.cta}
          </span>
        </a>
        <p className="mt-3 whitespace-nowrap bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[13px] capitalize leading-[20px] text-transparent">
          {demo.mutedAction}
        </p>
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

  const workflowPosition = getHeldWorkflowPosition(scrollProgress)
  const softPinContentRef = useSoftPinTransform(sectionRef, reducedMotion)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="mobile-workflow-heading"
      className="relative flex min-h-svh w-full items-center px-5 py-10"
    >
      <h2 id="mobile-workflow-heading" className="sr-only">
        Workflow demos
      </h2>
      <div ref={softPinContentRef} className="mx-auto flex w-full max-w-[460px] flex-col items-center will-change-transform">
        <div ref={videoPanelRef} className="w-full">
          <MobileWorkflowVideoPanel
            workflowPosition={workflowPosition}
            sectionVisibilityFraction={sectionVisibilityFraction}
            isVisible={isVideoPlaybackVisible}
            reducedMotion={reducedMotion}
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
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile pricing                                                     */
/* ------------------------------------------------------------------ */
function MobilePricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article className="relative isolate w-full overflow-hidden rounded-[22px] bg-white/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[22px] border border-[#35949a]/50"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div
        className="relative h-[220px] overflow-hidden rounded-t-[18px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
          background: "rgba(0,0,0,1)",
        }}
      >
        <img
          src={plan.image}
          alt={plan.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[140px] px-6 py-6 text-white">
        <h3
          className="text-[30px] leading-[24px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {plan.name}
        </h3>
        <div
          className="absolute bottom-[24px] left-6 flex items-end gap-[5px]"
          style={{ textShadow: PRICING_PRICE_TEXT_SHADOW }}
        >
          <span
            className="text-[58px] leading-[0.78]"
            style={{
              fontFamily: "Georgia, serif",
              fontFeatureSettings: "'lnum' 1, 'pnum' 1",
            }}
          >
            {plan.price}
          </span>
          <span className="font-ui mb-[5px] text-[15px] leading-[18px]">
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
        className="font-ui relative z-10 mx-6 mt-5 flex h-[52px] items-center justify-center rounded-[26px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] text-[17px] font-medium leading-[22px] text-white active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
      >
        Try Construct
      </a>

      <ul className="font-ui relative z-10 flex flex-col gap-[14px] px-6 pb-7 pt-5 text-[15px] leading-[20px] text-[#4e4646]">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  )
}

function MobileEnterprisePanel({ className }: { className?: string }) {
  return (
    <div className={"relative h-[520px] w-full " + (className ?? "")}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(140%,520px)] -translate-x-1/2 -translate-y-1/2">
        <PortalVideo />
      </div>

      <article
        aria-labelledby="mobile-enterprise-heading"
        className="relative z-10 h-full w-full rounded-[22px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[22px] bg-white/90"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] border border-[#35949a]/50"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 28%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 28%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-start px-5 pt-[64px] text-center">
          <p className="font-ui text-[12px] font-medium uppercase leading-[16px] tracking-[0.22em] text-[#01b4c8]">
            Talk To Us
          </p>

          <h3
            id="mobile-enterprise-heading"
            className="mt-4 text-balance text-[30px] capitalize leading-[36px]"
          >
            <span className="font-ui text-[#4e4646]">Need Something </span>
            <span className="font-display italic text-[#01b4c8]">Different?</span>
          </h3>

          <p className="font-ui mt-4 max-w-[310px] text-[14px] leading-[20px] text-[#627c86]">
            Need Construct for your company, or have a question about how it
            could fit your workflow? Drop us a line and we&rsquo;ll get back
            to you.
          </p>

          <a
            href="mailto:enterprise@construct.computer"
            style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
            className="font-ui mt-6 inline-flex h-[54px] w-full max-w-[312px] items-center justify-center gap-[10px] rounded-[27px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-4 text-[14px] font-medium leading-[18px] text-white active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
              <path
                fill="currentColor"
                d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 8.5L20 7H4l8 6.5Z"
              />
            </svg>
            <span className="whitespace-nowrap">enterprise@construct.computer</span>
          </a>
        </div>
      </article>
    </div>
  )
}

function MobilePricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="mobile-pricing-heading"
      className="relative isolate w-full px-5 py-16"
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

      <div className="mx-auto mt-10 flex w-full max-w-[420px] flex-col gap-6">
        {PRICING_PLANS.map((plan) => (
          <MobilePricingCard key={plan.name} plan={plan} />
        ))}

        <MobileEnterprisePanel className="mt-0" />
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
          className="relative w-full overflow-hidden"
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
            <MobilePricingSection />
          </div>
        </div>
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
