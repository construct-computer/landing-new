import { useEffect, useState } from "react"

/**
 * Reactive wrapper around `window.matchMedia`.
 *
 * Returns `false` on the server / before mount, then subscribes to changes on
 * the client so the consumer re-renders when the match state flips.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

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
