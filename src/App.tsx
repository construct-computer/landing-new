import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DesktopLanding } from "@/landing/Desktop"
import { MobileLanding } from "@/landing/Mobile"
import { AboutPage } from "@/pages/About"
import { CareersPage } from "@/pages/Careers"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicy"
import { SupportPage } from "@/pages/Support"
import { TermsPage } from "@/pages/Terms"
import { RouterProvider, useRoute } from "@/router"

const DESKTOP_QUERY = "(min-width: 1024px)"

/**
 * Responsive split between the desktop and mobile landings.
 *
 * Why render both for the SSG/first-paint pass?
 * --------------------------------------------
 * The SSG loop in `build.ts` runs this tree on the server with no `window`,
 * so a plain `useMediaQuery` call resolves to its default (desktop) and
 * bakes the desktop layout into the HTML. A mobile visitor then has to wait
 * for React to hydrate and a `useEffect` to flip the state before the right
 * layout shows up — and if the JS bundle is delayed, fails, or the device
 * is on a slow network, iOS Safari just auto-scales the oversized desktop
 * content to fit the viewport (classic zoomed-out "desktop-on-phone" bug).
 *
 * The fix is the standard SSR-responsive pattern: emit BOTH trees in the
 * HTML and let Tailwind's `lg:` breakpoint decide which one is visible.
 * The correct layout is painted instantly on every device, no JS required.
 * Once hydrated, we drop the off-screen tree so its videos and effects
 * don't run in the background.
 */
function Landing() {
  const [hydrated, setHydrated] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (hydrated) {
    return isDesktop ? <DesktopLanding /> : <MobileLanding />
  }

  return (
    <>
      <div className="lg:hidden">
        <MobileLanding />
      </div>
      <div className="hidden lg:block">
        <DesktopLanding />
      </div>
    </>
  )
}

/**
 * Static route table. Kept tiny on purpose — this is a marketing site, not
 * an app. Unknown paths fall back to the landing.
 */
function Routes() {
  const pathname = useRoute()
  switch (pathname) {
    case "/about":
      return <AboutPage />
    case "/careers":
      return <CareersPage />
    case "/privacy":
      return <PrivacyPolicyPage />
    case "/terms":
      return <TermsPage />
    case "/support":
      return <SupportPage />
    default:
      return <Landing />
  }
}

export function App({ initialPath }: { initialPath?: string } = {}) {
  return (
    <RouterProvider initialPath={initialPath}>
      <Routes />
    </RouterProvider>
  )
}

export default App
