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

function Landing() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  return isDesktop ? <DesktopLanding /> : <MobileLanding />
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

export function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}

export default App
