import { useMediaQuery } from "@/hooks/use-media-query"
import { DesktopLanding } from "@/landing/Desktop"
import { MobileLanding } from "@/landing/Mobile"

/**
 * Swap between mobile and desktop layouts at Tailwind's `lg` breakpoint
 * (1024px). Only one tree is mounted at a time so we don't pay rendering
 * cost for the layout we aren't showing.
 */
const DESKTOP_QUERY = "(min-width: 1024px)"

export function App() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  return isDesktop ? <DesktopLanding /> : <MobileLanding />
}

export default App
