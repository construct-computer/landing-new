import { Fragment, useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode, SVGProps } from "react"
import buttonBg from "@/assets/button-bg.svg"
import bgVideoWebm from "@/assets/hero-bg.webm"
import bgVideoMp4 from "@/assets/hero-bg.mp4"
import imgDocs from "@/assets/docs.png"
import imgGmail from "@/assets/gmail.png"
import imgGmeet from "@/assets/gmeet.png"
import type { PricingFeatureIconId } from "@/content/pricing"
import { LANDING_FAQ } from "@/content/faq"
import { Link } from "@/router"

export const PRICING_BUTTON_BOX_SHADOW = [
  "0px 241px 68px rgba(0,0,0,0)",
  "0px 154px 62px rgba(0,0,0,0.01)",
  "0px 87px 52px rgba(0,0,0,0.05)",
  "0px 39px 39px rgba(0,0,0,0.09)",
  "0px 10px 21px rgba(0,0,0,0.1)",
  "inset 0px 7px 4px #2b476e",
].join(", ")

export const PRICING_PRICE_TEXT_SHADOW = [
  "0px 3px 6px rgba(0,0,0,0.05)",
  "0px 11px 11px rgba(0,0,0,0.04)",
  "0px 24px 14px rgba(0,0,0,0.03)",
  "0px 42px 17px rgba(0,0,0,0.01)",
  "0px 66px 18px rgba(0,0,0,0)",
].join(", ")

/* ------------------------------------------------------------------ */
/* Pricing benefit icons                                              */
/* Inline SVG paths sourced from the Iconify sets used in Figma:       */
/*   bolt        → material-symbols:electric-bolt-rounded              */
/*   footprint   → material-symbols-light:footprint                    */
/*   timer       → ri:timer-2-fill                                     */
/*   tree        → lsicon:tree-filled (16 viewBox)                     */
/*   cloud       → ri:cloud-fill                                       */
/*   integration → carbon:ibm-webmethods-integration-server (32 vb)    */
/*   key         → heroicons-solid:key (20 viewBox)                    */
/*   email       → ic:sharp-alternate-email                            */
/*   tabs        → fluent:tabs-24-filled                               */
/* `currentColor` lets callers tint via Tailwind text colors.          */
/* ------------------------------------------------------------------ */

type PricingIconDef = {
  readonly viewBox: string
  readonly children: ReactNode
}

const PRICING_FEATURE_ICONS: Record<PricingFeatureIconId, PricingIconDef> = {
  bolt: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="m11 14.5l-5.925-.75q-.625-.075-.813-.675t.263-1.025l10.225-9.8q.125-.125.3-.187T15.525 2q.5 0 .763.425t.012.875L13 9.5l5.925.75q.625.075.813.675t-.263 1.025L9.25 21.75q-.125.125-.3.188T8.475 22q-.5 0-.763-.425T7.7 20.7z"
      />
    ),
  },
  footprint: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="M6.5 2q1.529 0 2.515 1.484Q10 4.967 10 7q0 1.16-.337 2.344q-.338 1.185-.71 2.025L4.58 12.43q-.721-1.167-1.15-2.493T3 7q0-2.152.996-3.576T6.5 2m1.375 15q-1.313 0-2.09-1.035Q5.01 14.929 5 13.342l4.162-.992q.296.502.567 1.107T10 14.675q0 1.002-.599 1.664T7.875 17M17.5 7q1.508 0 2.504 1.424T21 12q0 1.667-.467 3.013t-1.227 2.57l-4.298-1.29q-.352-.841-.68-1.997Q14 13.141 14 12q0-2.033.986-3.516Q15.97 7 17.5 7m-1.375 15q-.927 0-1.526-.662T14 19.676q0-.633.29-1.257t.587-1.145l4.117 1.262q-.048 1.47-.821 2.468Q17.4 22 16.125 22"
      />
    ),
  },
  timer: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12S6.48 2 12 2m3.536 5.05L10.586 12L12 13.414l4.95-4.95z"
      />
    ),
  },
  tree: {
    viewBox: "0 0 16 16",
    children: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.146 2.153a.5.5 0 0 1 .354-.146h3a.5.5 0 0 1 .5.5V4.51a.5.5 0 0 1-.5.5H8.497V7h4.5a.5.5 0 0 1 .5.5V10H14.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.997V8h-4v2H9.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.997V8h-4v2H4.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.997V7.5a.5.5 0 0 1 .5-.5h4.5V5.01H6.5a.5.5 0 0 1-.5-.5V2.508a.5.5 0 0 1 .146-.354"
      />
    ),
  },
  cloud: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="M17 7a8 8 0 0 0-7.493 5.19l1.874.703A6.002 6.002 0 0 1 23 15a6 6 0 0 1-6 6H7A6 6 0 0 1 5.008 9.339a7 7 0 0 1 13.757-2.143A8 8 0 0 0 17 7"
      />
    ),
  },
  integration: {
    viewBox: "0 0 32 32",
    children: (
      <path
        fill="currentColor"
        d="M13 28c0 1.654 1.346 3 3 3s3-1.346 3-3a2.995 2.995 0 0 0-2-2.816V22h-2v3.184A2.995 2.995 0 0 0 13 28m3-1a1 1 0 0 1 0 2a1 1 0 0 1 0-2M15 6.816V10h2V6.816A2.995 2.995 0 0 0 19 4c0-1.654-1.346-3-3-3s-3 1.346-3 3c0 1.302.839 2.402 2 2.816M15 4a1 1 0 0 1 2 0a1 1 0 0 1-2 0m11 15a2.97 2.97 0 0 0-1.897.695l-2.627-1.576l-1 1.733l2.584 1.55A3.003 3.003 0 0 0 26 25c1.654 0 3-1.346 3-3s-1.346-3-3-3m0 4a1 1 0 0 1 0-2a1 1 0 0 1 0 2m0-16a3.003 3.003 0 0 0-2.94 3.598l-2.536 1.521l1 1.733l2.579-1.547A2.97 2.97 0 0 0 26 13c1.654 0 3-1.346 3-3s-1.346-3-3-3m0 4a1 1 0 0 1 0-2a1 1 0 0 1 0 2m-14.524 1.12L8.94 10.598Q9 10.308 9 10c0-1.654-1.346-3-3-3s-3 1.346-3 3s1.346 3 3 3a2.97 2.97 0 0 0 1.897-.695l2.58 1.547zM6 11a1 1 0 0 1 0-2a1 1 0 0 1 0 2m5.464 8.888l-1-1.733l-2.567 1.54A2.97 2.97 0 0 0 6 19c-1.654 0-3 1.346-3 3s1.346 3 3 3a3.003 3.003 0 0 0 2.94-3.597zM6 23a1 1 0 0 1 0-2a1 1 0 0 1 0 2m10-3c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4m0-6c-1.102 0-2 .897-2 2s.898 2 2 2s2-.897 2-2s-.897-2-2-2"
      />
    ),
  },
  key: {
    viewBox: "0 0 20 20",
    children: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 8a6 6 0 0 1-7.743 5.743L10 14l-1 1l-1 1H6v2H2v-4l4.257-4.257A6 6 0 1 1 18 8m-6-4a1 1 0 1 0 0 2a2 2 0 0 1 2 2a1 1 0 1 0 2 0a4 4 0 0 0-4-4"
      />
    ),
  },
  email: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8s8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47c.65.89 1.77 1.47 2.96 1.47c1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10m0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3"
      />
    ),
  },
  tabs: {
    viewBox: "0 0 24 24",
    children: (
      <path
        fill="currentColor"
        d="M2 9.25A7.25 7.25 0 0 1 9.25 2h3.5a3.25 3.25 0 0 1 3 2h-5.5A6.25 6.25 0 0 0 4 10.25v5.5a3.25 3.25 0 0 1-2-3zm3 1C5 7.35 7.35 5 10.25 5h5.5a3.25 3.25 0 0 1 3 2h-7.5A4.25 4.25 0 0 0 7 11.25v7.5a3.25 3.25 0 0 1-2-3zM11.25 8A3.25 3.25 0 0 0 8 11.25v7.5A3.25 3.25 0 0 0 11.25 22h7.5A3.25 3.25 0 0 0 22 18.75v-7.5A3.25 3.25 0 0 0 18.75 8z"
      />
    ),
  },
}

export function PricingFeatureIcon({
  icon,
  ...rest
}: { icon: PricingFeatureIconId } & SVGProps<SVGSVGElement>) {
  const def = PRICING_FEATURE_ICONS[icon]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={def.viewBox}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {def.children}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Shared hooks                                                       */
/* ------------------------------------------------------------------ */

/**
 * Acts as a "shock absorber" for elements pinned by ScrollTrigger.
 * When an element is pinned, its physical screen position stops instantly.
 * This hook creates a damped spring that tracks the container's top position
 * and applies the lag as a transform to the inner content, smoothing out
 * the abrupt lock-in and release.
 */
export function useSoftPinTransform(
  containerRef: React.RefObject<HTMLElement | null>,
  reducedMotion: boolean
) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !contentRef.current) return

    let rafId: number
    let lastTime: number | null = null
    let smoothTop = containerRef.current.getBoundingClientRect().top
    let velocity = 0

    const STIFFNESS = 150
    const DAMPING = 24
    const MAX_DT = 1 / 24

    function tick(time: number) {
      if (!containerRef.current || !contentRef.current) return

      const currentTop = containerRef.current.getBoundingClientRect().top

      if (lastTime === null) {
        lastTime = time
        smoothTop = currentTop
        rafId = requestAnimationFrame(tick)
        return
      }

      // Snap immediately on instantaneous massive jumps (e.g., clicking anchor links)
      if (Math.abs(currentTop - smoothTop) > window.innerHeight) {
        smoothTop = currentTop
        velocity = 0
      }

      const dt = Math.min((time - lastTime) / 1000, MAX_DT)
      lastTime = time

      const displacement = currentTop - smoothTop
      const acceleration = STIFFNESS * displacement - DAMPING * velocity

      velocity += acceleration * dt
      smoothTop += velocity * dt

      const lag = smoothTop - currentTop

      // Apply the lagging transform
      if (Math.abs(lag) < 0.1 && Math.abs(velocity) < 0.1) {
        contentRef.current.style.transform = `translateY(0px)`
        smoothTop = currentTop
        velocity = 0
      } else {
        contentRef.current.style.transform = `translateY(${lag}px)`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [reducedMotion, containerRef])

  return contentRef
}

/* ------------------------------------------------------------------ */
/* Shared data                                                        */
/* ------------------------------------------------------------------ */
export const BETA_URL = "https://beta.construct.computer"

export const SECTION_BLURB =
  "Construct adapts to any task — it handles the full workflow end to end and automates most of it without monitoring."

/**
 * Per-feature copy. Each card has a distinct 2-line paragraph so the page
 * has unique indexable text for every capability while staying scannable:
 * the aim is for a visitor to absorb all four in one sweep without having
 * to slow down and read. Every removed phrase (e.g. "handled by TinyFish",
 * "straight into your R2 workspace") is infrastructure detail that wasn't
 * part of any meta description or JSON-LD — no SEO signal lost.
 */
export const FEATURES: readonly { title: string; description: string }[] = [
  {
    title: "Construct Browsing",
    description:
      "A real browser inside your sandbox — sessions persist across tasks while the agent navigates pages and fills forms.",
  },
  {
    title: "Research and Reports",
    description:
      "Ask for a brief — the agent gathers sources, cross-references them, and writes a cited PDF or Markdown report.",
  },
  {
    title: "Live Terminal",
    description:
      "A dedicated Linux sandbox. The agent runs shell, Python, and the GitHub CLI, shipping code live as you watch.",
  },
  {
    title: "Manages Emails",
    description:
      "Construct has its own inbox — triages mail, drafts replies, schedules meetings, and pings you when a decision is needed.",
  },
]

export const WORKFLOW_CHIPS: readonly { icon: string; label: string; offset: string }[] = [
  { icon: imgGmeet, label: "Attended The Meeting", offset: "0%" },
  { icon: imgGmail, label: "Replied to the Mails", offset: "14%" },
  { icon: imgDocs, label: "Prepared the Report", offset: "28%" },
]

/* ------------------------------------------------------------------ */
/* Portal background video                                            */
/* ------------------------------------------------------------------ */
export function PortalVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) el.pause()

    const onChange = () => {
      if (mq.matches) {
        el.pause()
      } else {
        // Swallow AbortError when the browser interrupts background video.
        void el.play().catch(() => {})
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // No `poster` on purpose: the only stable still image we had to hand
  // was the square Construct logo, and a 512×512 PNG stretched by
  // `object-cover` into the ~900px portal frame reads as a comically
  // oversized logo until the video decodes. A brief blank portal on hard
  // refresh is far less jarring than that. `preload="auto"` pulls the
  // ~170 KB webm / ~300 KB mp4 as soon as the element mounts so the gap
  // closes fast; if we later extract a real first-frame still in the
  // build pipeline, wire it back in here.
  return (
    <video
      ref={ref}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-hidden
      className={className ?? "h-full w-full object-cover"}
    >
      <source src={bgVideoWebm} type="video/webm" />
      <source src={bgVideoMp4} type="video/mp4" />
    </video>
  )
}

/* ------------------------------------------------------------------ */
/* Workflow chip (pill card shown around the hero portal)             */
/* ------------------------------------------------------------------ */
export function WorkflowChip({
  icon,
  label,
  style,
  className,
}: {
  icon: string
  label: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      style={style}
      className={
        "font-inter flex h-[38px] w-[216px] items-center gap-[14px] rounded-[8px] border border-[#f0f0f0] bg-white px-2 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.18),inset_0_4px_4px_0_rgba(255,255,255,0.25)] " +
        (className ?? "")
      }
    >
      <img src={icon} alt="" className="h-7 w-7 shrink-0 rounded-[20px] object-contain" />
      <p className="truncate text-[12px] leading-none text-[#0b0b0b]">{label}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Call-to-action button ("Enter Experience")                         */
/* ------------------------------------------------------------------ */
export function EnterExperienceButton({ className }: { className?: string }) {
  return (
    <a
      href={BETA_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundImage: `url(${buttonBg})`, backgroundSize: "100% 100%" }}
      className={
        "font-cta inline-flex h-[57px] w-[227px] items-center justify-center bg-center bg-no-repeat text-center " +
        (className ?? "")
      }
    >
      <span className="px-2 text-[21px] leading-[60px] text-white">Enter Experience</span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Early-access pill (in nav)                                         */
/* ------------------------------------------------------------------ */
export function EarlyAccessPill({ className }: { className?: string }) {
  return (
    <a
      href={BETA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-black px-4 py-2 text-[12px] font-semibold leading-4 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_-3px_2px_0_rgba(255,255,255,0.15),inset_0_3px_2px_0_rgba(255,255,255,0.18)] " +
        (className ?? "")
      }
    >
      <span className="relative z-10">Early Beta Access</span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Top navigation (shared between landing + legal pages)              */
/* ------------------------------------------------------------------ */
/** Kept in sync with the mobile hero's `NAV_HEIGHT_PX` (48px). */
export const NAV_HEIGHT_PX = 48

export function SkipToMain() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-100 focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
    >
      Skip to main content
    </a>
  )
}

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-[background-color,backdrop-filter] duration-200 " +
        (scrolled
          ? "bg-white/20 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent")
      }
    >
      <SkipToMain />
      <div className="mx-auto flex h-12 w-full max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-14 lg:px-16">
        <Link
          to="/"
          aria-label="Construct Computer - home"
          className="font-display text-[15px] italic leading-6 lg:text-[18px] lg:leading-7"
        >
          <span className="text-[#4e4646]">Construct</span>
          <span className="text-[#01b4c8]">Computer</span>
        </Link>

        <EarlyAccessPill className="px-3 py-1.5 text-[11px] lg:px-4 lg:py-2 lg:text-[12px]" />
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* "What Construct is" - keyword-weighted intro shown after hero       */
/* ------------------------------------------------------------------ */
export function WhatConstructIsSection({ className }: { className?: string }) {
  return <></>
  // not needed
  // return (
  //   <section
  //     id="what"
  //     aria-labelledby="what-heading"
  //     className={
  //       "mx-auto w-full max-w-3xl px-6 py-12 text-center lg:py-16 " + (className ?? "")
  //     }
  //   >
  //     <h2
  //       id="what-heading"
  //       className="text-balance text-3xl capitalize sm:text-4xl lg:text-[40px] lg:leading-[48px]"
  //     >
  //       <span className="font-ui text-[#4e4646]">The AI employee with their own</span>{" "}
  //       <span className="font-display italic text-[#01b4c8]">computer</span>
  //     </h2>
  //     <div className="font-ui mx-auto mt-6 max-w-[620px] space-y-4 text-[16px] leading-[24px] text-[#627c86]">
  //       <p>
  //         Construct is an <strong className="text-[#4e4646]">AI agent</strong> with
  //         its own cloud computer. Every user gets a dedicated Linux sandbox, a
  //         real web browser, an email inbox, long-term memory, a calendar, and a
  //         live terminal - all wrapped in a virtual desktop you can watch in real
  //         time.
  //       </p>
  //       <p>
  //         Reach it from the web, Slack, Telegram, or email. It connects to
  //         Gmail, Notion, Linear, Jira, GitHub, HubSpot, and 1,000+ other apps
  //         through Composio, and it leaves a full audit log of every action so
  //         you stay in control.
  //       </p>
  //       <p>
  //         Built on Cloudflare Durable Objects, D1, R2, and the Sandbox SDK for
  //         per-user isolation - with models served through the Cloudflare AI
  //         Gateway and BYOK available on every tier.
  //       </p>
  //     </div>
  //   </section>
  // )
}

/* ------------------------------------------------------------------ */
/* Mid-section heading ("It Adapts, Learns and Automates...")         */
/* ------------------------------------------------------------------ */
export function AdaptsSection({ className }: { className?: string }) {
  return (
    <section className={"mx-auto max-w-3xl px-6 text-center " + (className ?? "pb-10 pt-8")}>
      <h2 className="text-balance text-3xl capitalize sm:text-4xl lg:text-[51.8px] lg:leading-[58px]">
        <span className="font-ui text-[#4e4646]">It Adapts, Learns and</span>{" "}
        <span className="font-display italic text-[#01b4c8]">Automates Your Workflow</span>
      </h2>
      <p className="font-ui mx-auto mt-6 max-w-[495px] text-[16px] leading-[21px] text-[#627c86]">
        {SECTION_BLURB}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ section (also emitted as FAQPage JSON-LD in the head)           */
/* ------------------------------------------------------------------ */
export function FaqSection({ className }: { className?: string }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={
        "mx-auto w-full max-w-3xl px-6 pb-16 pt-4 lg:pb-24 " + (className ?? "")
      }
    >
      <h2
        id="faq-heading"
        className="text-balance text-center text-3xl capitalize sm:text-4xl lg:text-[40px] lg:leading-[48px]"
      >
        <span className="font-ui text-[#4e4646]">Frequently asked</span>{" "}
        <span className="font-display italic text-[#01b4c8]">questions</span>
      </h2>
      <dl className="font-ui mt-10 divide-y divide-[#e5e7eb] border-t border-[#e5e7eb]">
        {LANDING_FAQ.map((f) => (
          <div key={f.question} className="py-6">
            <dt>
              <h3 className="text-[18px] leading-[24px] text-[#235061]">
                {f.question}
              </h3>
            </dt>
            <dd className="mt-2 text-[15px] leading-[22px] text-[#627c86]">
              {f.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer - intentionally minimal + stylised                          */
/* ------------------------------------------------------------------ */
type FooterLink = { label: string; href: string; external?: boolean }

const FOOTER_LINKS: readonly FooterLink[] = [
  { label: "Beta", href: BETA_URL, external: true },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-[#e5e7eb] bg-white text-[#627c86] transition-colors duration-150 hover:border-[#8adcdf] hover:text-[#01b4c8]"
    >
      {children}
    </a>
  )
}

export function LandingFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#e5e7eb] bg-white">
      {/* Soft portal-echo accent, sitting behind the wordmark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(140vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(1,180,200,0.12) 0%, rgba(138,220,223,0.06) 40%, rgba(255,255,255,0) 65%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center gap-8 px-6 py-14 text-center lg:gap-10 lg:px-16 lg:py-20">
        {/* Oversized italic wordmark - the footer's one expressive moment. */}
        <span className="font-display text-[30px] italic leading-none text-[#484848] sm:text-[36px] lg:text-[44px]">
          <span className="text-[#4e4646]">Construct</span>
          <span className="text-[#01b4c8]">Computer</span>
        </span>

        {/* Dot-separated inline links. */}
        <nav
          aria-label="Footer"
          className="font-ui flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] leading-5 text-[#627c86] sm:gap-x-5 sm:text-[14px]"
        >
          {FOOTER_LINKS.map((l, i) => (
            <Fragment key={l.label}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-[3px] w-[3px] rounded-full bg-[#cfd7db] sm:inline-block"
                />
              )}
              <Link
                to={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="transition-colors duration-150 hover:text-[#01b4c8]"
              >
                {l.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <SocialIconLink href="https://x.com/use_construct" label="X (Twitter)">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M18.244 2H21.5l-7.51 8.58L22.5 22h-6.78l-5.31-6.94L4.3 22H1.04l8.03-9.18L1.5 2h6.96l4.8 6.35L18.244 2Zm-1.19 18h1.88L7.06 4H5.07l11.984 16Z"
              />
            </svg>
          </SocialIconLink>
          <SocialIconLink href="https://github.com/construct-computer" label="GitHub">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.52 9.52 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
              />
            </svg>
          </SocialIconLink>
          <SocialIconLink
            href="https://discord.gg/puArEQHYN9"
            label="Discord"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
              />
            </svg>
          </SocialIconLink>
          <SocialIconLink
            href="https://linkedin.com/company/construct-computer"
            label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-4V9Z"
              />
            </svg>
          </SocialIconLink>
        </div>

        <p className="font-ui text-[12px] leading-[18px] text-[#8a9aa2]">
          © {year} Construct
        </p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Feature card                                                       */
/* ------------------------------------------------------------------ */
export function FeatureCard({
  title,
  description,
  compact = false,
}: {
  title: string
  description: string
  compact?: boolean
}) {
  return (
    <article
      className={
        "flex flex-col gap-5 " + (compact ? "px-4 py-6" : "px-5 py-10 lg:px-10 lg:py-14")
      }
    >
      <div
        aria-hidden
        className={
          "relative w-full overflow-hidden rounded-[28px] border border-[#8adcdf] " +
          (compact ? "h-[200px]" : "h-[280px] lg:h-[340px]")
        }
      >
        <div className="h-full w-full bg-linear-to-b from-[#e4f7fa] via-[#f2fbfd] to-white" />
      </div>
      <div className="font-ui space-y-2">
        <h3 className="text-[20px] leading-[21px] text-[#235061]">{title}</h3>
        <p className="max-w-[544px] text-[16px] leading-[21px] text-[#627c86]">
          {description}
        </p>
      </div>
    </article>
  )
}
