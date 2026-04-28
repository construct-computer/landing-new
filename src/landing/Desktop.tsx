import { useEffect, useRef, useState } from "react"
import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import imgSearchbar from "@/assets/searchbar.png"
import researchVideoMp4 from "@/assets/research.mp4"
import researchVideo from "@/assets/research.webm"
import {
  AdaptsSection,
  BETA_URL,
  EnterExperienceButton,
  FaqSection,
  LandingFooter,
  LandingNav,
  PortalVideo,
  WhatConstructIsSection,
  WORKFLOW_CHIPS,
  WorkflowChip,
} from "./shared"

const WORKFLOW_DEMOS = [
  {
    id: "research",
    title: "Research About",
    accent: "Any Topic",
    description:
      "Construct gathers sources, compares details, and turns messy questions into cited research you can review or share.",
    cta: "Research a Topic",
    nextLabel: "Browse The Web",
    mutedAction: "See Report Samples Generated",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    ariaLabel: "Construct researching a topic in the product interface",
  },
  {
    id: "browse",
    title: "Browse Across",
    accent: "Any Website",
    description:
      "Construct uses a real browser to navigate pages, fill forms, extract details, and continue work across sessions.",
    cta: "Browse the Web",
    nextLabel: "Manage Your Calendar",
    mutedAction: "Review Browsing Steps",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    ariaLabel: "Construct browsing the web in the product interface",
  },
  {
    id: "calendar",
    title: "Schedule Around",
    accent: "Your Calendar",
    description:
      "Construct coordinates availability, prepares meeting context, and keeps follow-ups moving without manual back-and-forth.",
    cta: "Plan a Meeting",
    nextLabel: "Triage Your Email",
    mutedAction: "See Meetings Prepared",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    ariaLabel: "Construct managing calendar work in the product interface",
  },
  {
    id: "email",
    title: "Handle Every",
    accent: "Email Thread",
    description:
      "Construct reads long threads, drafts replies in your voice, and flags the decisions that still need your attention.",
    cta: "Draft a Reply",
    nextLabel: "Research About Any Topic",
    mutedAction: "Preview Draft Replies",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    ariaLabel: "Construct handling email work in the product interface",
  },
] as const

type WorkflowDemo = (typeof WORKFLOW_DEMOS)[number]

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
  isVisible,
  reducedMotion,
}: {
  workflowPosition: number
  isVisible: boolean
  reducedMotion: boolean
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
            distance={distance}
            isDominant={isDominant}
            isVisible={isVisible}
            reducedMotion={reducedMotion}
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
  distance,
  isDominant,
  isVisible,
  reducedMotion,
}: {
  demo: WorkflowDemo
  distance: number
  isDominant: boolean
  isVisible: boolean
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
    }
  }, [demo.id, isDominant, isVisible])

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const opacity = reducedMotion
    ? isDominant
      ? 1
      : 0
    : distance < 0
      ? 1 - exiting
      : lerp(0, 1, entering)
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
  const blur = reducedMotion
    ? 0
    : distance < 0
      ? 8 * exiting
      : 8 * (1 - entering)

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
        if (isDominant) video.currentTime = 0
        if (isVisible && isDominant) {
          void video.play().catch(() => {})
        } else {
          video.pause()
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
          className="inline-flex h-[57px] w-[227px] items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] px-[30px] pt-px text-center shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
        >
          <span className="text-[21px] leading-[60px] text-white">{demo.cta}</span>
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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

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
      aria-labelledby="workflow-demo-heading"
      className="relative flex min-h-screen w-full items-center py-20"
    >
      <h2 id="workflow-demo-heading" className="sr-only">
        Research workflow demo
      </h2>
      <div className="mx-auto w-full max-w-[1500px] px-6 lg:px-16">
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
            isVisible={isWorkflowVisible}
            reducedMotion={reducedMotion}
          />
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
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
