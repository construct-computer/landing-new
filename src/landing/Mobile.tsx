import imgChat from "@/assets/chat.png"
import imgClouds from "@/assets/clouds.png"
import imgLightBeams from "@/assets/light-through-clouds.png"
import imgReport from "@/assets/report.png"
import {
  AdaptsSection,
  EnterExperienceButton,
  FaqSection,
  FEATURES,
  FeatureCard,
  LandingFooter,
  LandingNav,
  NAV_HEIGHT_PX,
  PortalVideo,
  WhatConstructIsSection,
} from "./shared"

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
/* Features - single column                                           */
/* ------------------------------------------------------------------ */
function MobileFeatureGrid() {
  return (
    <section
      aria-labelledby="features-heading-mobile"
      className="mx-auto w-full max-w-[480px] px-5 pb-16"
    >
      <h2 id="features-heading-mobile" className="sr-only">
        Product capabilities
      </h2>
      <div className="divide-y divide-[#e5e7eb] border-[#e5e7eb]">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.title}
            title={f.title}
            description={f.description}
            compact
          />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
export function MobileLanding() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-clip bg-white text-[#4e4646]">
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
            <MobileFeatureGrid />
          </div>
        </div>
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
