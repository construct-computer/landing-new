import imgChat from "@/assets/chat.png"
import imgReport from "@/assets/report.png"
import imgSearchbar from "@/assets/searchbar.png"
import {
  AdaptsSection,
  EnterExperienceButton,
  FaqSection,
  FEATURES,
  FeatureCard,
  LandingFooter,
  LandingNav,
  PortalVideo,
  WhatConstructIsSection,
  WORKFLOW_CHIPS,
  WorkflowChip,
} from "./shared"

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
        Construct is an AI agent with its own cloud computer. It logs into a
        full virtual desktop, runs code, sends email, and works across Slack,
        Telegram, and your inbox — scheduled, persistent, on any device.
      </p>
      <EnterExperienceButton className="mt-8" />
    </div>
  )
}

function HeroStage() {
  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-6 lg:px-16">
      {/* overflow-x-visible + overflow-y-clip keeps the portal from bleeding
         vertically into the next section while preserving horizontal UI. */}
      <div className="relative isolate mx-auto h-[900px] w-full max-w-[1400px] overflow-x-visible overflow-y-clip">
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
          className="pointer-events-none absolute left-1/2 top-[4%] z-20 w-[424px] -translate-x-[35%] drop-shadow-[0_20px_40px_rgba(71,156,223,0.15)]"
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
          className="pointer-events-none absolute bottom-[18%] left-[18%] z-20 w-[320px] drop-shadow-[0_16px_40px_rgba(71,156,223,0.18)]"
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
/* Features grid (2x2)                                                */
/* ------------------------------------------------------------------ */
function FeatureGrid() {
  return (
    <section
      aria-labelledby="features-heading-desktop"
      className="mx-auto w-full max-w-[1500px] px-6 pb-28 lg:px-16"
    >
      <h2 id="features-heading-desktop" className="sr-only">
        Product capabilities
      </h2>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#e5e7eb]"
        />
        <div className="grid grid-cols-2 divide-y-0">
          {FEATURES.slice(0, 2).map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} />
          ))}
          <div aria-hidden className="col-span-2 h-px w-full bg-[#e5e7eb]" />
          {FEATURES.slice(2).map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
export function DesktopLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-[#4e4646]">
      <LandingNav />
      <main id="main">
        <HeroStage />
        <WhatConstructIsSection />
        <AdaptsSection />
        <FeatureGrid />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
