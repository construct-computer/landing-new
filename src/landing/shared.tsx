import { Fragment, useEffect, useRef } from "react"
import type { CSSProperties, ReactNode } from "react"
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
/* Footer — intentionally minimal + stylised                          */
/* ------------------------------------------------------------------ */
type FooterLink = { label: string; href: string; external?: boolean }

const FOOTER_LINKS: readonly FooterLink[] = [
  { label: "Beta", href: BETA_URL, external: true },
  { label: "About", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "mailto:hello@construct.computer" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
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
        {/* Oversized italic wordmark — the footer's one expressive moment. */}
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
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="transition-colors duration-150 hover:text-[#01b4c8]"
              >
                {l.label}
              </a>
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
