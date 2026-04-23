import {
  createContext,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import { useRouteMeta } from "@/seo/head"

/**
 * A tiny client-side router built on `history.pushState` - enough for the
 * handful of static routes this marketing site needs. We intentionally avoid
 * `react-router` to keep the bundle lean.
 *
 * SSR/SSG: `RouterProvider` accepts an `initialPath` so the server can
 * render the same route that was requested without touching `window`.
 */

const RouteContext = createContext<string>("/")

/** Dispatched by `navigate()` so same-tab navigations update React state. */
const ROUTE_EVENT = "route:change"

export function RouterProvider({
  children,
  initialPath,
}: {
  children: ReactNode
  initialPath?: string
}) {
  const [pathname, setPathname] = useState<string>(() => {
    if (initialPath) return initialPath
    if (typeof window === "undefined") return "/"
    return window.location.pathname
  })

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname)
    sync()
    window.addEventListener("popstate", sync)
    window.addEventListener(ROUTE_EVENT, sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener(ROUTE_EVENT, sync)
    }
  }, [])

  // Keep <title>/meta/JSON-LD in sync on client-side navigations.
  useRouteMeta(pathname)

  return (
    <RouteContext.Provider value={pathname}>{children}</RouteContext.Provider>
  )
}

export function useRoute() {
  return useContext(RouteContext)
}

export function navigate(to: string) {
  if (typeof window === "undefined") return
  if (window.location.pathname === to) {
    window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }
  window.history.pushState({}, "", to)
  window.dispatchEvent(new Event(ROUTE_EVENT))
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/**
 * Drop-in anchor replacement that falls back to a real `<a>` for:
 *   - external protocols (http(s), mailto:, tel:)
 *   - modifier clicks (⌘ / ctrl / shift / middle-click) so new-tab still works
 *   - links that set `target="_blank"` explicitly
 */
export function Link({ to, onClick, target, children, ...rest }: LinkProps) {
  const isExternal =
    /^(https?:)?\/\//.test(to) ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:")

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (isExternal || target === "_blank") return
    if (e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} target={target} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
