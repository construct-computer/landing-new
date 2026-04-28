import { useEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
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
  WhatConstructIsSection,
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

/** Portion of raw ScrollTrigger progress (0–1) used to ease first/last clips in/out. */
const WORKFLOW_SCROLL_EDGE_FADE = 0.14

function workflowScrollEdgeFade(
  demoIndex: number,
  demoCount: number,
  scrollProgress: number,
  reducedMotion: boolean,
): number {
  if (reducedMotion) return 1
  const p = clamp(scrollProgress)
  const fadeIn =
    demoIndex === 0 ? smoothStep(p / WORKFLOW_SCROLL_EDGE_FADE) : 1
  const fadeOut =
    demoIndex === demoCount - 1
      ? smoothStep((1 - p) / WORKFLOW_SCROLL_EDGE_FADE)
      : 1
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
  scrollProgress,
  isVisible,
  reducedMotion,
}: {
  workflowPosition: number
  scrollProgress: number
  isVisible: boolean
  reducedMotion: boolean
}) {
  const dominantIndex = Math.min(
    Math.floor(workflowPosition + 0.1),
    MOBILE_WORKFLOW_DEMOS.length - 1
  )

  return (
    <div className="relative mx-auto aspect-964/694 w-full max-w-[440px] overflow-hidden rounded-[32px] bg-white/20">
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
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
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
  scrollProgress,
  reducedMotion,
}: {
  demo: MobileWorkflowDemo
  demoIndex: number
  distance: number
  isDominant: boolean
  isVisible: boolean
  scrollProgress: number
  reducedMotion: boolean
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const wasDominantRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isDominant && !wasDominantRef.current) video.currentTime = 0
    wasDominantRef.current = isDominant

    if (isVisible && isDominant) {
      void video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [demo.id, isDominant, isVisible])

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const edgeFade = workflowScrollEdgeFade(
    demoIndex,
    MOBILE_WORKFLOW_DEMOS.length,
    scrollProgress,
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
  const blur = reducedMotion
    ? 0
    : distance < 0
      ? 5 * exiting
      : 5 * (1 - entering)

  return (
    <video
      ref={videoRef}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-label={isDominant ? demo.ariaLabel : undefined}
      aria-hidden={!isDominant}
      onLoadedMetadata={(event) => {
        const video = event.currentTarget
        if (isVisible && isDominant) {
          video.currentTime = 0
          void video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
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
    <div className="relative mx-auto mt-8 min-h-[390px] w-full max-w-[420px] overflow-visible text-left">
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
  const exitTitleY = -28
  const upNextAnchorY = 170
  const belowAnchorY = 230
  const supportTopY = 285

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
        <h3 className="max-w-[350px] text-[26px] leading-[34px] text-[#4e4646]">
          {demo.title}{" "}
          <span className="font-display italic text-[#01b4c8]">{demo.accent}</span>
        </h3>
        <p
          style={{ opacity: descriptionOpacity }}
          className="mt-4 max-w-[330px] text-[15px] leading-[22px] text-[#627c86]"
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
          className="inline-flex min-h-12 min-w-[190px] max-w-[min(100%,260px)] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-5 py-2.5 text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
        >
          <span className="text-balance text-[17px] leading-snug text-white">
            {demo.cta}
          </span>
        </a>
        <p className="mt-5 w-[180px] bg-linear-to-r from-[#becace] to-[#d9d9d9] bg-clip-text text-[14px] capitalize leading-[20px] text-transparent">
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
      className="relative mx-auto mt-5 h-7 w-full max-w-[260px]"
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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVideoPlaybackVisible, setIsVideoPlaybackVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    let frame = 0

    const updatePlaybackVisibility = () => {
      frame = 0
      const panel = videoPanelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      const isAboveHalfScreen = rect.top <= window.innerHeight / 2
      const isStillOnScreen = rect.bottom >= 0
      const shouldPlay = isAboveHalfScreen && isStillOnScreen

      setIsVideoPlaybackVisible((current) => (current === shouldPlay ? current : shouldPlay))
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updatePlaybackVisibility)
    }

    updatePlaybackVisibility()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

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
        onUpdate: (self) => setScrollProgress(self.progress),
      })

      cleanup = () => trigger.kill()
    }

    void setupScrollTrigger()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  const workflowPosition = getHeldWorkflowPosition(scrollProgress)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="mobile-workflow-heading"
      className="relative flex min-h-svh w-full items-center px-5 py-10"
    >
      <h2 id="mobile-workflow-heading" className="sr-only">
        Workflow demos
      </h2>
      <div className="mx-auto w-full max-w-[460px]">
        <div ref={videoPanelRef}>
          <MobileWorkflowVideoPanel
            workflowPosition={workflowPosition}
            scrollProgress={scrollProgress}
            isVisible={isVideoPlaybackVisible}
            reducedMotion={reducedMotion}
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
          </div>
        </div>
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
