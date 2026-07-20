import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DesktopLanding } from "@/landing/Desktop"
import { MobileLanding } from "@/landing/Mobile"
import { AboutPage } from "@/pages/About"
import { BlogIndexPage } from "@/pages/blog/BlogIndex"
import { BlogPostPage } from "@/pages/blog/BlogPost"
import { CareersPage } from "@/pages/Careers"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicy"
import { SupportPage } from "@/pages/Support"
import { NotFoundPage } from "@/pages/NotFound"
import { TermsPage } from "@/pages/Terms"
import { VsIndexPage } from "@/pages/vs/VsIndex"
import { VsPageView } from "@/pages/vs/VsPage"
import { isKnownRoute } from "@/seo/routes"
import { RouterProvider, useRoute } from "@/router"
import { BetaAccessProvider } from "@/landing/beta-access/BetaAccessProvider"

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
 * layout shows up - and if the JS bundle is delayed, fails, or the device
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

  return (
    <>
      <h1 className="sr-only">
        Construct Computer: the AI employee with its own cloud computer
      </h1>
      {hydrated ? (
        isDesktop ? <DesktopLanding /> : <MobileLanding />
      ) : (
        <>
          <div className="lg:hidden">
            <MobileLanding />
          </div>
          <div className="hidden lg:block">
            <DesktopLanding />
          </div>
        </>
      )}
    </>
  )
}

/**
 * Static route table. Kept tiny on purpose - this is a marketing site, not
 * an app. Unknown paths render the 404 page (and `dist/404.html` in prod).
 */
function Routes() {
  const pathname = useRoute()
  if (!isKnownRoute(pathname)) {
    return <NotFoundPage />
  }
  if (pathname.startsWith("/blog/")) return <BlogPostPage />
  if (pathname.startsWith("/vs/")) return <VsPageView />

  switch (pathname) {
    case "/about":
      return <AboutPage />
    case "/blog":
      return <BlogIndexPage />
    case "/careers":
      return <CareersPage />
    case "/privacy":
      return <PrivacyPolicyPage />
    case "/terms":
      return <TermsPage />
    case "/support":
      return <SupportPage />
    case "/vs":
      return <VsIndexPage />
    default:
      return <Landing />
  }
}

export function App({ initialPath }: { initialPath?: string } = {}) {
  return (
    <RouterProvider initialPath={initialPath}>
      <BetaAccessProvider>
        <Routes />
      </BetaAccessProvider>
    </RouterProvider>
  )
}

export default App
