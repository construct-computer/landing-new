import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import imgSearchbar from "@/assets/searchbar.png"
import researchVideoMp4 from "@/assets/research.mp4"
import researchVideo from "@/assets/research.webm"
import slackVideoMp4 from "@/assets/slack.mp4"
import slackVideo from "@/assets/slack.webm"
import imgPricingFree from "../assets/pricing-free.jpg"
import imgPricingPro from "../assets/pricing-pro.jpg"
import imgPricingStarter from "../assets/pricing-starter.jpg"
import {
  AdaptsSection,
  BETA_URL,
  EnterExperienceButton,
  LandingFooter,
  LandingNav,
  PortalVideo,
  WhatConstructIsSection,
  WORKFLOW_CHIPS,
  WorkflowChip,
  useSoftPinTransform,
} from "./shared"
import { LANDING_FAQ } from "@/content/faq"

const WORKFLOW_DEMOS = [
  {
    id: "research",
    title: "Research About",
    accent: "Any Topic",
    description:
      "Construct gathers sources, compares details, and turns messy questions into cited research you can review or share.",
    cta: "Research a Topic",
    nextLabel: "Work Together Across Channels",
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
    nextLabel: "Research About Any Topic",
    mutedAction: "See Shared Threads",
    video: slackVideo,
    videoMp4: slackVideoMp4,
    ariaLabel:
      "Construct available across Slack, Telegram, Discord, email, and team collaboration",
  },
] as const

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    image: imgPricingFree,
    imageAlt: "Dark night sky with bright cumulus clouds illuminated by moonlight",
    features: [
      "15 Steps Per Task",
      "5 min Task Execution Time",
      "2 Concurrent Subagents",
      "100 Mb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
    ],
  },
  {
    name: "Starter",
    price: "$59",
    image: imgPricingStarter,
    imageAlt: "Mystical cloud-shrouded golden temple gateway opening into bright light",
    features: [
      "6x More Usage Than Free",
      "50 Steps Per Task",
      "1 hr Task Execution Time",
      "6 Concurrent Subagents",
      "1 Gb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
      "Agent Email Address",
    ],
  },
  {
    name: "Pro",
    price: "$299",
    image: imgPricingPro,
    imageAlt: "Vivid orange and red sunburst with radiant light rays",
    features: [
      "45x More Usage Than Free",
      "100 Steps Per Task",
      "3 hr Task Execution Time",
      "Unlimited Concurrent Subagents",
      "3 Gb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
      "Agent Email Address",
      "Background Execution",
    ],
  },
] as const

type WorkflowDemo = (typeof WORKFLOW_DEMOS)[number]
type PricingPlan = (typeof PRICING_PLANS)[number]

function getWorkflowDemo(index: number): WorkflowDemo {
  return WORKFLOW_DEMOS[index % WORKFLOW_DEMOS.length] ?? WORKFLOW_DEMOS[0]
}

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
  const transitionCount = WORKFLOW_DEMOS.length - 1
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

/** Damped spring follows ScrollTrigger progress — elastic settle vs abrupt lerp snap. */
const WORKFLOW_SCROLL_SPRING_STIFFNESS = 76
/** ~Critical damping (2√k) so motion feels springy without oscillating past 0–1. */
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

/** Portion of section height visible in the viewport (0 = none, 1 = fully on screen). */
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

/**
 * Edge fade/blur driven by viewport: first clip eases in once half the section
 * has entered; last clip fades out as soon as any part starts leaving (visibility below full).
 */
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

function workflowViewportEdgeBlurPx(
  demoIndex: number,
  demoCount: number,
  visibilityFraction: number,
  reducedMotion: boolean,
  maxBlur: number,
): number {
  if (reducedMotion) return 0
  const v = clamp(visibilityFraction)
  let edge = 0
  if (demoIndex === 0) {
    const fadeIn = v < 0.5 ? 0 : smoothStep((v - 0.5) / 0.5)
    edge += maxBlur * (1 - fadeIn)
  }
  if (demoIndex === demoCount - 1) {
    const fadeOut = smoothStep(v)
    edge += maxBlur * (1 - fadeOut)
  }
  return edge
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
/* Hero                                                               */
/* ------------------------------------------------------------------ */
function HeroHeadline() {
  return (
    <div className="pointer-events-auto max-w-[560px]">
      <h1 className="font-display text-balance text-5xl capitalize italic leading-[1.1] text-[#4e4646] lg:text-[51.8px] lg:leading-[58px]">
        <span className="text-[#01b4c8]">Autonomous </span>
        <span>Computer that </span>
        <span className="text-[#01b4c8]">Works For You</span>
      </h1>
      <p className="font-ui mt-6 max-w-[520px] text-[16px] leading-[22px] text-[#627c86]">
        Construct is an AI agent with its own cloud computer - it runs code,
        sends email, and works across Slack, Telegram, and your inbox.
      </p>
      <EnterExperienceButton className="mt-8" />
    </div>
  )
}

function HeroStage() {
  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-6 lg:px-16">
      <div className="relative isolate mx-auto h-[900px] w-full max-w-[1400px]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-3/4 top-1/2 z-0 aspect-square w-[min(120%,1100px)] -translate-x-1/2 -translate-y-1/2"
        >
          <PortalVideo />
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
          alt="macOS-style Spotlight search inside the Construct virtual desktop"
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
    WORKFLOW_DEMOS.length - 1
  )

  return (
    <div className="relative aspect-964/694 overflow-hidden rounded-[53px] bg-white/20">
      {WORKFLOW_DEMOS.map((demo, index) => {
        const distance = index - workflowPosition
        const isDominant = index === dominantIndex

        if (reducedMotion && !isDominant) return null
        if (!reducedMotion && (distance <= -1.05 || distance >= 1.05)) return null

        return (
          <WorkflowVideoLayer
            key={demo.id}
            demo={demo}
            demoIndex={index}
            distance={distance}
            isDominant={isDominant}
            isVisible={isVisible}
            sectionVisibilityFraction={sectionVisibilityFraction}
            reducedMotion={reducedMotion}
            workflowDemoCount={WORKFLOW_DEMOS.length}
            onRequestAdvanceAfterVideoEnd={onRequestAdvanceAfterVideoEnd}
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

function WorkflowVideoLayer({
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
  demo: WorkflowDemo
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
    WORKFLOW_DEMOS.length,
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
      ? lerp(0, 28, exiting)
      : lerp(-28, 0, entering)
  const scale = reducedMotion
    ? 1
    : distance < 0
      ? lerp(1, 0.985, exiting)
      : lerp(1.018, 1, entering)
  const crossfadeBlur =
    distance < 0 ? 8 * exiting : 8 * (1 - entering)
  const edgeBlurPx = workflowViewportEdgeBlurPx(
    demoIndex,
    WORKFLOW_DEMOS.length,
    sectionVisibilityFraction,
    reducedMotion,
    8,
  )
  const blur = reducedMotion
    ? 0
    : Math.min(8, crossfadeBlur + edgeBlurPx)

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
      <source src={demo.video} type="video/webm" />
      <source src={demo.videoMp4} type="video/mp4" />
    </video>
  )
}

function WorkflowScrollCopy({
  workflowPosition,
  reducedMotion,
}: {
  workflowPosition: number
  reducedMotion: boolean
}) {
  return (
    <div className="absolute inset-0 overflow-visible">
      {WORKFLOW_DEMOS.map((demo, index) => (
        <WorkflowTextLayer
          key={demo.id}
          demo={demo}
          distance={index - workflowPosition}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

function WorkflowTextLayer({
  demo,
  distance,
  reducedMotion,
}: {
  demo: WorkflowDemo
  distance: number
  reducedMotion: boolean
}) {
  const titleAnchorY = 0
  const exitTitleY = -58
  const upNextAnchorY = 360
  const belowAnchorY = 460

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const preEnter = smoothStep((1.24 - distance) / 0.24)
  const nearby = distance > -1.05 && distance < 1.24

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
        ? lerp(0.78, 1, entering)
        : lerp(0.74, 0.78, preEnter)
  const descriptionOpacity = reducedMotion
    ? headlineOpacity
    : distance < 0
      ? 1 - exiting
      : smoothStep((entering - 0.72) / 0.28)
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
      ? 5 * exiting
      : 0
  const supportAmount = reducedMotion
    ? Math.round(distance) === 0
      ? 1
      : 0
    : smoothStep(1 - Math.abs(distance) / 0.54)

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
        className="absolute inset-x-0 top-0"
      >
        <p
          style={{ opacity: upNextOpacity }}
          className="font-ui mb-3 w-[86px] bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[16.8px] leading-[22px] text-transparent"
        >
          Up Next
        </p>
        <h3 className="text-[31px] leading-[58px] text-[#4e4646]">
          {demo.title}{" "}
          <span className="font-display italic text-[#01b4c8]">{demo.accent}</span>
        </h3>
        <p
          style={{ opacity: descriptionOpacity }}
          className="mt-9 max-w-[300px] text-[16px] leading-[21px] text-[#627c86]"
        >
          {demo.description}
        </p>
      </div>

      <div
        style={{
          opacity: supportAmount,
          transform: `translateY(${28 * (1 - supportAmount)}px)`,
          pointerEvents: supportAmount > 0.85 ? "auto" : "none",
          willChange: "opacity, transform",
        }}
        className="absolute inset-x-0 bottom-10"
      >
        <a
          href={BETA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[57px] w-[227px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-[30px] py-2.5 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
        >
          <span className="text-balance text-center text-[21px] leading-snug text-white">
            {demo.cta}
          </span>
        </a>

        <p className="mt-8 w-[181px] bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[16.8px] capitalize leading-[22px] text-transparent">
          {demo.mutedAction}
        </p>
      </div>
    </>
  )
}

function WorkflowProgressRail({
  workflowPosition,
  reducedMotion,
}: {
  workflowPosition: number
  reducedMotion: boolean
}) {
  const railStartY = 35
  const railEndY = 545
  const totalStops = WORKFLOW_DEMOS.length - 1
  const progress = totalStops === 0 ? 0 : clamp(workflowPosition / totalStops)
  const dotY = lerp(railStartY, railEndY, progress)

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 top-0 w-px"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-[#9dddea]/70" />
      <span
        style={{
          transform: `translate(-50%, ${dotY}px)`,
          willChange: reducedMotion ? undefined : "transform",
        }}
        className="absolute left-0 top-0 h-3 w-3 rounded-full bg-[#4cd8ff] shadow-[0_0_16px_rgba(76,216,255,0.65)]"
      />
    </div>
  )
}

function WorkflowDemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const workflowPinScrollTriggerRef = useRef<{
    readonly start: number
    readonly end: number
  } | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [scrollProgress, commitScrollProgress] =
    useSmoothedWorkflowScrollProgress(reducedMotion)
  const [sectionVisibilityFraction, setSectionVisibilityFraction] = useState(0)
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (section) {
      setSectionVisibilityFraction(getSectionVisibilityFraction(section))
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const section = sectionRef.current
        if (section) {
          setSectionVisibilityFraction(getSectionVisibilityFraction(section))
        }
      })
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  const scrollToWorkflowDemoIndex = useCallback((targetIndex: number) => {
    const st = workflowPinScrollTriggerRef.current
    if (!st || WORKFLOW_DEMOS.length <= 1) return
    const idx = Math.min(
      Math.max(targetIndex, 0),
      WORKFLOW_DEMOS.length - 1,
    )
    const p = workflowDemoIndexToScrollProgress(idx, WORKFLOW_DEMOS.length)
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
        end: () => `+=${window.innerHeight * (WORKFLOW_DEMOS.length + 0.5)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => setIsWorkflowVisible(true),
        onEnterBack: () => setIsWorkflowVisible(true),
        onLeave: () => setIsWorkflowVisible(false),
        onLeaveBack: () => setIsWorkflowVisible(false),
        onToggle: (self) => setIsWorkflowVisible(self.isActive),
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
      aria-labelledby="workflow-demo-heading"
      className="relative flex min-h-screen w-full items-center py-20"
    >
      <h2 id="workflow-demo-heading" className="sr-only">
        Research workflow demo
      </h2>
      <div ref={softPinContentRef} className="mx-auto w-full max-w-[1500px] px-6 lg:px-16 will-change-transform">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] items-stretch gap-10">
          <aside className="font-ui relative pl-10 pt-7">
            <WorkflowProgressRail
              workflowPosition={workflowPosition}
              reducedMotion={reducedMotion}
            />
            <div className="relative h-full min-h-[580px] overflow-visible pr-2">
              <WorkflowScrollCopy
                workflowPosition={workflowPosition}
                reducedMotion={reducedMotion}
              />
            </div>
          </aside>

          <WorkflowVideoPanel
            workflowPosition={workflowPosition}
            sectionVisibilityFraction={sectionVisibilityFraction}
            isVisible={isWorkflowVisible}
            reducedMotion={reducedMotion}
            onRequestAdvanceAfterVideoEnd={requestAdvanceAfterVideoEnd}
          />
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

const PRICING_BUTTON_BOX_SHADOW = [
  "0px 241px 68px rgba(0,0,0,0)",
  "0px 154px 62px rgba(0,0,0,0.01)",
  "0px 87px 52px rgba(0,0,0,0.05)",
  "0px 39px 39px rgba(0,0,0,0.09)",
  "0px 10px 21px rgba(0,0,0,0.1)",
  "inset 0px 7px 4px #2b476e",
].join(", ")

const PRICING_PRICE_TEXT_SHADOW = [
  "0px 3px 6px rgba(0,0,0,0.05)",
  "0px 11px 11px rgba(0,0,0,0.04)",
  "0px 24px 14px rgba(0,0,0,0.03)",
  "0px 42px 17px rgba(0,0,0,0.01)",
  "0px 66px 18px rgba(0,0,0,0)",
].join(", ")

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
            "linear-gradient(to bottom, black 0%, black 50%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 50%, transparent 95%)",
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
          <span className="font-ui mb-[8px] text-[20px] leading-[22px]">
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
        className="font-ui absolute left-1/2 top-[266px] z-10 inline-flex h-[64px] w-[299px] -translate-x-1/2 items-center justify-center rounded-[32px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] text-[22px] font-medium leading-[22px] text-white transition-transform duration-150 ease-out hover:-translate-x-1/2 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
      >
        Try Construct
      </a>

      <ul className="font-ui absolute left-[33px] right-[33px] top-[383px] z-10 flex flex-col gap-[20px] text-[16px] leading-[22px] text-[#4e4646]">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  )
}

/**
 * Concentric semicircular rings rising from the bottom of the pricing
 * section — five circles sharing a single vertical center placed 147px
 * above the section's bottom edge (matching Figma `Mask group` 793:13167).
 *
 * Each ring is positioned by anchoring its bottom edge `radius - 147` px
 * below the section's bottom, so they share a perfectly common center and
 * only the upper arc of each pokes into the visible area.
 *
 *   center distance from section bottom = 147px
 *   ring bottom offset                  = -(radius - 147) px
 *
 * Outer two rings are dashed cyan strokes; inner three are filled with a
 * white-to-transparent (or radial cyan→white) gradient plus an inset cyan
 * glow that softly lights the area inside each arc.
 */
const RING_CENTER_FROM_BOTTOM_PX = 147

function ringBottomOffset(radius: number) {
  return `${RING_CENTER_FROM_BOTTOM_PX - radius}px`
}

function PricingRingsBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Ring 1 — outermost, 1390×1390 (r=695), dashed #43daeb */}
      <div
        className="absolute left-1/2 size-[1390px] -translate-x-1/2 rounded-full border border-dashed border-[#43daeb] opacity-65"
        style={{ bottom: ringBottomOffset(695) }}
      />
      {/* Ring 2 — 1142×1142 (r=571), dashed #91eaf4 */}
      <div
        className="absolute left-1/2 size-[1142px] -translate-x-1/2 rounded-full border border-dashed border-[#91eaf4] opacity-65"
        style={{ bottom: ringBottomOffset(571) }}
      />
      {/* Ring 3 — 950×950 (r=475), bottom-fade + soft cyan inset glow */}
      <div
        className="absolute left-1/2 size-[950px] -translate-x-1/2 rounded-full bg-linear-to-b from-transparent to-white opacity-65 shadow-[inset_0_9px_20.6px_rgba(145,234,244,0.19)]"
        style={{ bottom: ringBottomOffset(475) }}
      />
      {/* Ring 4 — 764×764 (r=382), bottom-fade + stronger cyan inset glow */}
      <div
        className="absolute left-1/2 size-[764px] -translate-x-1/2 rounded-full bg-linear-to-b from-transparent to-white opacity-65 shadow-[inset_0_9px_20.6px_rgba(145,234,244,0.43)]"
        style={{ bottom: ringBottomOffset(382) }}
      />
      {/* Ring 5 — innermost, 600×600 (r=300), radial white→cyan + inset glow */}
      <div
        className="absolute left-1/2 size-[600px] -translate-x-1/2 rounded-full opacity-65 shadow-[inset_0_9px_20.6px_rgba(145,234,244,0.43)]"
        style={{
          bottom: ringBottomOffset(300),
          background:
            "radial-gradient(circle at center, rgba(255,255,255,1) 66.8%, rgba(194,234,238,0.765) 75.1%, rgba(133,213,222,0.53) 83.4%, rgba(73,192,205,0.295) 91.7%, rgba(12,171,189,0.06) 100%)",
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Enterprise panel — sits below the three pricing cards.             */
/*                                                                    */
/* Open "talk to us" invitation rather than a list of fixed enterprise */
/* commitments — anything specific (dedicated support, SLAs, on-prem) */
/* would be dishonest to put on a marketing page until we actually    */
/* offer it. Reuses the pricing card's fading-border technique and    */
/* the same dark navy CTA gradient so it reads as a companion to the  */
/* three priced tiers, plus the hero portal video as a soft backdrop. */
/* ------------------------------------------------------------------ */

function EnterprisePanel() {
  return (
    /*
     * The portal video sits as an unclipped backdrop *behind* the panel —
     * visible through the panel via its 50%-white fill AND spilling around
     * the panel's edges as a soft halo. The article itself stays at full
     * opacity (so the copy reads crisp); only the white scrim is at 50%.
     *
     * The article also drops `overflow-hidden` so the navy CTA's layered
     * drop shadow can fall cleanly into the section's bottom padding rather
     * than being chopped off at the panel's bottom edge.
     */
    <div className="relative mt-[19px] h-[600px] w-full">
      {/*
       * Centered hero portal video, same sizing as the hero stage. NOT
       * clipped to the panel — section-level `overflow-hidden` (on the
       * pricing <section>) is what bounds the spill.
       */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(120%,1100px)] -translate-x-1/2 -translate-y-1/2">
        <PortalVideo />
      </div>

      <article
        aria-labelledby="enterprise-heading"
        className="relative z-10 h-full w-full rounded-[26px]"
      >
        {/*
         * White scrim — split out from the article so it can fade with a
         * top→bottom mask. The mask stays fully opaque through the top 70%
         * (where every piece of copy + the CTA sits) and only dissolves
         * across the bottom 30%, so the panel reads as solid white behind
         * the text but still blends softly into the portal video underneath
         * — no hard horizontal seam at the rounded bottom edge.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[26px] bg-white/90"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        />

        {/* Faded border overlay — same top→bottom dissolve as the cards. */}
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

        {/*
         * Content is anchored to the top (`justify-start` + `pt-[100px]`)
         * rather than vertically centered, so the headline / description /
         * CTA all sit comfortably inside the solid 90%-white scrim region
         * (top 70% of the panel). The lower 30% of the panel is left
         * intentionally empty so the gradient can dissolve into the portal
         * video underneath without ever passing through any copy.
         */}
        <div className="relative z-10 flex h-full flex-col items-center justify-start px-[80px] pt-[100px] text-center">
          <p className="font-ui text-[13px] font-medium uppercase leading-[16px] tracking-[0.22em] text-[#01b4c8]">
            Talk To Us
          </p>

          <h3
            id="enterprise-heading"
            className="mt-[18px] text-balance text-[44px] capitalize leading-[52px]"
          >
            <span className="font-ui text-[#4e4646]">Need Something </span>
            <span className="font-display italic text-[#01b4c8]">Different?</span>
          </h3>

          <p className="font-ui mt-[20px] max-w-[620px] text-[16px] leading-[22px] text-[#627c86]">
            Need Construct for your company, or have a question about how it
            could fit your workflow? Drop us a line and we&rsquo;ll get back
            to you.
          </p>

          <a
            href="mailto:enterprise@construct.computer"
            style={{ boxShadow: PRICING_BUTTON_BOX_SHADOW }}
            className="font-ui mt-[32px] inline-flex h-[60px] items-center justify-center gap-[12px] rounded-[30px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-[26px] text-[17px] font-medium leading-[22px] text-white transition-transform duration-150 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cd8ff] focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" aria-hidden>
              <path
                fill="currentColor"
                d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 8.5L20 7H4l8 6.5Z"
              />
            </svg>
            <span>enterprise@construct.computer</span>
          </a>
        </div>
      </article>
    </div>
  )
}

function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative isolate overflow-hidden bg-white px-6 pb-44 pt-28 lg:px-16 lg:pt-36"
    >
      <PricingRingsBackdrop />

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
         * above the EnterprisePanel wrapper below them. Without this, the
         * panel's absolutely-positioned portal video — which spills above
         * the panel by ~330px — would paint on top of the cards' content
         * (the cards themselves are static, so they paint before any
         * positioned sibling lower in the DOM).
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
        className="font-ui flex w-full items-center justify-between gap-6 px-[55px] py-[30px] text-left"
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
          <p className="font-ui px-[55px] pb-[28px] text-[16px] leading-[22px] text-[#627c86]">
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
            className="font-ui mt-[40px] inline-flex h-[57px] w-[227px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-[30px] text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
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
/* Footer CTA - oversized rounded gradient block                       */
/* (#6bbfe3 → rgba(0,117,150,0.94)) sitting just above the footer.     */
/* ------------------------------------------------------------------ */
function FooterCtaBlock() {
  return (
    <section
      aria-labelledby="footer-cta-heading"
      className="relative w-full px-6 pb-20 pt-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1526px]">
        <div
          className="relative isolate overflow-hidden rounded-[61px] px-12 py-20 lg:px-24 lg:py-28"
          style={{
            background:
              "linear-gradient(to bottom, #6bbfe3 0%, rgba(0,117,150,0.94) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.45),transparent_55%)]"
          />
          <div className="mx-auto flex max-w-[820px] flex-col items-center text-center text-white">
            <h2
              id="footer-cta-heading"
              className="text-balance text-[51.8px] capitalize leading-[58px]"
            >
              <span className="font-ui">Give your work to </span>
              <span className="font-display italic">Construct</span>
            </h2>
            <p className="font-ui mt-6 max-w-[520px] text-[16px] leading-[22px] text-white/85">
              Deploy your own autonomous cloud computer in seconds. Construct
              handles research, code, and email so you can focus on what matters.
            </p>
            <a
              href={BETA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui mt-10 inline-flex h-[64px] min-w-[299px] items-center justify-center rounded-[32px] border border-[#253c5c] bg-linear-to-b from-[#253c5c] to-[#1b2b42] px-10 text-[22px] font-medium leading-[22px] text-white shadow-[0_10px_21px_rgba(0,0,0,0.1),0_39px_39px_rgba(0,0,0,0.09),0_87px_52px_rgba(0,0,0,0.05),inset_0_7px_4px_#2b476e] transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d6f8c]"
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
export function DesktopLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-white text-[#4e4646]">
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
          </div>
        </div>
        <PricingSection />
        <DesktopFaqSection />
        <FooterCtaBlock />
      </main>
      <LandingFooter />
    </div>
  )
}
