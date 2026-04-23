import { useEffect } from "react"
import { getRouteMeta, type RouteMeta } from "./routes"
import { serializeJsonLd } from "./jsonLd"

/**
 * Shared helpers for head management across SSG (build-time) and client
 * (runtime). Both the build loop and the client's `useRouteMeta` write the
 * same fields so direct hits and SPA navigations stay in sync.
 */

function escapeAttr(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function nameMeta(key: string, value: string) {
  return `<meta name="${escapeAttr(key)}" content="${escapeAttr(value)}" />`
}

function propMeta(key: string, value: string) {
  return `<meta property="${escapeAttr(key)}" content="${escapeAttr(value)}" />`
}

/** Render the per-route `<head>` block as an HTML string for SSG. */
export function renderHeadForRoute(route: RouteMeta): string {
  const parts: string[] = []
  parts.push(`<title>${escapeHtml(route.title)}</title>`)
  parts.push(nameMeta("description", route.description))
  if (route.keywords) parts.push(nameMeta("keywords", route.keywords))
  if (route.robots) parts.push(nameMeta("robots", route.robots))

  parts.push(`<link rel="manifest" href="/manifest.webmanifest" />`)
  parts.push(`<link rel="preload" as="image" href="/logo.png" />`)
  parts.push(`<link rel="canonical" href="${escapeAttr(route.canonical)}" />`)

  parts.push(propMeta("og:type", "website"))
  parts.push(propMeta("og:site_name", "Construct Computer"))
  parts.push(propMeta("og:title", route.title))
  parts.push(propMeta("og:description", route.description))
  parts.push(propMeta("og:url", route.canonical))
  parts.push(propMeta("og:image", route.ogImage))

  parts.push(nameMeta("twitter:card", "summary_large_image"))
  parts.push(nameMeta("twitter:site", "@use_construct"))
  parts.push(nameMeta("twitter:title", route.title))
  parts.push(nameMeta("twitter:description", route.description))
  parts.push(nameMeta("twitter:image", route.ogImage))

  for (const obj of route.jsonLd) {
    parts.push(
      `<script type="application/ld+json">${serializeJsonLd(obj)}</script>`,
    )
  }
  return parts.join("\n    ")
}

/** Inject/refresh head tags on client-side navigation. No-op on SSR. */
export function useRouteMeta(pathname: string) {
  useEffect(() => {
    if (typeof document === "undefined") return
    applyRouteMeta(getRouteMeta(pathname))
  }, [pathname])
}

function applyRouteMeta(route: RouteMeta) {
  document.title = route.title
  setMeta("name", "description", route.description)
  setMeta("name", "keywords", route.keywords)
  if (route.robots) setMeta("name", "robots", route.robots)
  setLink("canonical", route.canonical)

  setMeta("property", "og:title", route.title)
  setMeta("property", "og:description", route.description)
  setMeta("property", "og:url", route.canonical)
  setMeta("property", "og:image", route.ogImage)

  setMeta("name", "twitter:title", route.title)
  setMeta("name", "twitter:description", route.description)
  setMeta("name", "twitter:image", route.ogImage)

  replaceJsonLd(route)
}

const JSON_LD_MARKER = "data-route-jsonld"

function replaceJsonLd(route: RouteMeta) {
  const existing = document.head.querySelectorAll(`script[${JSON_LD_MARKER}]`)
  existing.forEach((n) => n.remove())
  for (const obj of route.jsonLd) {
    const s = document.createElement("script")
    s.type = "application/ld+json"
    s.setAttribute(JSON_LD_MARKER, "1")
    s.textContent = JSON.stringify(obj)
    document.head.appendChild(s)
  }
}

function setMeta(kind: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${kind}="${cssEscape(key)}"]`,
  )
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(kind, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", value)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${cssEscape(rel)}"]`,
  )
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

function cssEscape(v: string) {
  return v.replace(/"/g, '\\"')
}
