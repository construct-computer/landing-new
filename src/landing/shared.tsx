import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"
import buttonBg from "@/assets/button-bg.svg"
import bgVideoWebm from "@/assets/hero-bg.webm"
import bgVideoMp4 from "@/assets/hero-bg.mp4"
import imgDocs from "@/assets/docs.png"
import imgGmail from "@/assets/gmail.png"
import imgGmeet from "@/assets/gmeet.png"

/* ------------------------------------------------------------------ */
/* Shared data                                                        */
/* ------------------------------------------------------------------ */
export const BETA_URL = "https://beta.construct.computer"

export const SECTION_BLURB =
  "Construct is built to adapt your task, it handles everything and can automate most of the workflows without any monitoring."

export const FEATURES: readonly { title: string }[] = [
  { title: "Construct Browsing" },
  { title: "Research and Reports" },
  { title: "Live Terminal" },
  { title: "Manages Emails" },
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
        "font-ui flex h-[38px] w-[216px] items-center gap-[14px] rounded-[8px] border border-[#f0f0f0] bg-white px-2 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.18),inset_0_4px_4px_0_rgba(255,255,255,0.25)] " +
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
        "font-ui inline-flex h-[57px] w-[227px] items-center justify-center bg-center bg-no-repeat text-center " +
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
      <span className="relative z-10">Early Access</span>
    </a>
  )
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
/* Feature card                                                       */
/* ------------------------------------------------------------------ */
export function FeatureCard({ title, compact = false }: { title: string; compact?: boolean }) {
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
        <div className="h-full w-full bg-gradient-to-b from-[#e4f7fa] via-[#f2fbfd] to-white" />
      </div>
      <div className="font-ui space-y-2">
        <h3 className="text-[20px] leading-[21px] text-[#235061]">{title}</h3>
        <p className="max-w-[544px] text-[16px] leading-[21px] text-[#627c86]">
          {SECTION_BLURB}
        </p>
      </div>
    </article>
  )
}
