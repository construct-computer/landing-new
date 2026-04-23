import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"
import buttonBg from "@/assets/button-bg.svg"
import imgChat from "@/assets/chat.png"
import imgDocs from "@/assets/docs.png"
import imgGmail from "@/assets/gmail.png"
import imgGmeet from "@/assets/gmeet.png"
import imgReport from "@/assets/report.png"
import imgSearchbar from "@/assets/searchbar.png"
import bgVideoWebm from "@/assets/hero-bg.webm"
import bgVideoMp4 from "@/assets/hero-bg.mp4"

const SECTION_BLURB =
  "Construct is built to adapt your task, it handles everything and can automate most of the workflows without any monitoring."

const FEATURES: readonly { title: string }[] = [
  { title: "Construct Browsing" },
  { title: "Research and Reports" },
  { title: "Live Terminal" },
  { title: "Manages Emails" },
]

const BETA_URL = "https://beta.construct.computer"

const WORKFLOW_CHIPS: readonly { icon: string; label: string; offset: string }[] = [
  { icon: imgGmeet, label: "Attended The Meeting", offset: "0%" },
  { icon: imgGmail, label: "Replied to the Mails", offset: "14%" },
  { icon: imgDocs, label: "Prepared the Report", offset: "28%" },
]

/* ------------------------------------------------------------------ */
/* Background video — the dark portal + concentric rings              */
/* ------------------------------------------------------------------ */
function HeroPortal() {
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
        // Swallow AbortError when the browser interrupts a play() on background video.
        void el.play().catch(() => {})
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-3/4 top-1/2 z-0 aspect-square w-[min(120%,1100px)] -translate-x-1/2 -translate-y-1/2"
    >
      <video
        ref={ref}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      >
        <source src={bgVideoWebm} type="video/webm" />
        <source src={bgVideoMp4} type="video/mp4" />
      </video>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Nav                                                                */
/* ------------------------------------------------------------------ */
function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1500px] items-center justify-between gap-4 px-6 lg:px-16">
        <a
          href="/"
          className="font-display text-[18px] italic leading-7 text-[#484848]"
        >
          ConstructComputer
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-[26px] text-[14px] leading-5 text-[#6d6d6d] sm:flex"
        >
          {/* <a href="#docs" className="whitespace-nowrap hover:text-[#484848]">
            Documentation
          </a> */}
          {/* <a href="#blog" className="whitespace-nowrap hover:text-[#484848]">
            Blog
          </a> */}
          {/* <a href="#status" className="whitespace-nowrap hover:text-[#484848]">
            Status
          </a> */}
        </nav>

        <a
          href={BETA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-black px-4 py-2 text-[12px] font-semibold leading-4 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_-3px_2px_0_rgba(255,255,255,0.15),inset_0_3px_2px_0_rgba(255,255,255,0.18)]"
        >
          <span className="relative z-10 px-1">Try Beta</span>
        </a>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Hero content                                                       */
/* ------------------------------------------------------------------ */
function HeroHeadline() {
  return (
    <div className="pointer-events-auto max-w-[560px]">
      <h1 className="font-display text-balance text-4xl capitalize italic leading-[1.1] text-[#4e4646] sm:text-5xl lg:text-[51.8px] lg:leading-[58px]">
        <span className="text-[#01b4c8]">Autonomous </span>
        <span>Computer that </span>
        <span className="text-[#01b4c8]">Works For You</span>
      </h1>

      <p className="font-ui mt-6 max-w-[495px] text-[16px] leading-[21px] text-[#627c86]">
        Deploy AI agents to the cloud. They research, code and create.
        <br />
        Scheduled, persistent, from any device.
      </p>

      <a
        href={BETA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui mt-8 inline-flex h-[57px] w-[227px] items-center justify-center bg-center bg-no-repeat text-center"
        style={{ backgroundImage: `url(${buttonBg})`, backgroundSize: "100% 100%" }}
      >
        <span className="px-2 text-[21px] leading-[60px] text-white">
          Enter Experience
        </span>
      </a>
    </div>
  )
}

function WorkflowChip({ icon, label, style }: { icon: string; label: string; style?: CSSProperties }) {
  return (
    <div
      className="font-ui flex h-[38px] w-[216px] items-center gap-[14px] rounded-[8px] border border-[#f0f0f0] bg-white px-2 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.18),inset_0_4px_4px_0_rgba(255,255,255,0.25)]"
      style={style}
    >
      <img src={icon} alt="" className="h-7 w-7 shrink-0 rounded-[20px] object-contain" />
      <p className="truncate text-[12px] leading-none text-[#0b0b0b]">{label}</p>
    </div>
  )
}

function HeroStage() {
  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-6 lg:px-16">
      {/* Stage: portal + floating UI on a single coordinate system.
         `isolate` creates a stacking context so z-0/z-20 inside resolve here. */}
      {/* overflow-x-visible overflow-y-clip stops the video bleeding into the
         next section vertically while keeping horizontally-extending UI
         (workflow chips, portal edges) fully visible. */}
      <div className="relative isolate mx-auto h-[780px] w-full max-w-[1400px] overflow-x-visible overflow-y-clip sm:h-[860px] lg:h-[900px]">
        <HeroPortal />

        <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2 lg:left-2">
          <HeroHeadline />
        </div>

        <img
          src={imgReport}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[4%] z-20 w-[min(92vw,424px)] -translate-x-[35%] drop-shadow-[0_20px_40px_rgba(71,156,223,0.15)]"
        />

        <div className="pointer-events-none absolute right-0 top-[10%] z-20 hidden w-[280px] sm:block">
          {WORKFLOW_CHIPS.map((chip, i) => (
            <div key={chip.label} style={{ marginTop: i === 0 ? 0 : 18, marginLeft: chip.offset }}>
              <WorkflowChip icon={chip.icon} label={chip.label} />
            </div>
          ))}
        </div>

        <img
          src={imgChat}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[18%] left-[18%] z-20 w-[min(70vw,320px)] drop-shadow-[0_16px_40px_rgba(71,156,223,0.18)] opacity-80"
        />

        <img
          src={imgSearchbar}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[10%] right-0 z-20 w-[min(90vw,455px)] drop-shadow-[0_14px_30px_rgba(71,156,223,0.15)]"
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mid-section intro above the feature grid                           */
/* ------------------------------------------------------------------ */
function AdaptsSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-10 pt-8 text-center">
      <h2 className="text-balance text-3xl capitalize sm:text-4xl lg:text-[51.8px] lg:leading-[58px]">
        <span className="font-ui text-[#4e4646]">It Adapts, Learns and</span>{" "}
        <span className="font-display italic text-[#01b4c8]">
          Automates Your Workflow
        </span>
      </h2>
      <p className="font-ui mx-auto mt-6 max-w-[495px] text-[16px] leading-[21px] text-[#627c86]">
        {SECTION_BLURB}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Features grid — 2x2 with thin cross dividers                       */
/* ------------------------------------------------------------------ */
function FeatureCard({ title }: { title: string }) {
  return (
    <article className="flex flex-col gap-5 px-5 py-10 lg:px-10 lg:py-14">
      <div
        className="relative h-[280px] w-full overflow-hidden rounded-[28px] border border-[#8adcdf] lg:h-[340px]"
        aria-hidden
      >
        {/* Empty cyan-tinted placeholder with bottom fade to white */}
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

function FeatureGrid() {
  return (
    <section aria-labelledby="features-heading" className="mx-auto w-full max-w-[1500px] px-6 pb-28 lg:px-16">
      <h2 id="features-heading" className="sr-only">
        Product capabilities
      </h2>
      <div className="relative">
        {/* Vertical divider for desktop */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#e5e7eb] lg:block"
          aria-hidden
        />
        <div className="grid grid-cols-1 divide-y divide-[#e5e7eb] lg:grid-cols-2 lg:divide-y-0">
          {/* First row */}
          {FEATURES.slice(0, 2).map((f) => (
            <FeatureCard key={f.title} title={f.title} />
          ))}
          {/* Horizontal divider between rows on desktop */}
          <div className="col-span-full h-px w-full bg-[#e5e7eb] lg:col-span-2" aria-hidden />
          {/* Second row */}
          {FEATURES.slice(2).map((f) => (
            <FeatureCard key={f.title} title={f.title} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
export function App() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-[#4e4646]">
      <LandingNav />
      <HeroStage />
      <AdaptsSection />
      <FeatureGrid />
    </div>
  )
}

export default App
