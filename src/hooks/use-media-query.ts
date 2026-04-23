import { useEffect, useState } from "react"

/**
 * Reactive wrapper around `window.matchMedia`.
 *
 * - On SSR and the first hydrate pass we return `defaultValue` (true =
 *   desktop) so the pre-rendered HTML matches. The landing's SSG output is
 *   the desktop layout - it has all of the indexable copy.
 * - After mount we attach a real `matchMedia` listener and re-render if the
 *   actual viewport disagrees (e.g. phone user loads a desktop-prerendered
 *   page).
 */
export function useMediaQuery(query: string, defaultValue = true): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [query])

  return matches
}
