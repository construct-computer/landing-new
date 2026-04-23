import { LANDING_FAQ } from "@/content/faq"
import {
  breadcrumbListJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  SITE_URL,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "./jsonLd"

/**
 * Per-route SEO metadata. Every field is pre-interpolated into
 * `dist/<path>/index.html` at build time and then refreshed on client-side
 * navigation via `useRouteMeta()` so direct hits and SPA navigations see
 * the same tab title/meta.
 */

export type RouteMeta = {
  readonly path: string
  readonly title: string
  readonly description: string
  /** Keyword list, used for `<meta name="keywords">` (minor but cheap). */
  readonly keywords: string
  /** Full URL written into `og:url` and `<link rel="canonical">`. */
  readonly canonical: string
  /** Absolute OG image URL — should be 1200x630 for `summary_large_image`. */
  readonly ogImage: string
  /** JSON-LD objects to emit on this page (in order). */
  readonly jsonLd: readonly Record<string, unknown>[]
  /** Optional `<meta name="robots">` override. */
  readonly robots?: string
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`
const KEYWORDS_COMMON =
  "AI agent, AI employee, virtual desktop, cloud computer, autonomous agent, Cloudflare agent, Construct Computer, Composio, Slack AI, Telegram AI"

function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

function homeBreadcrumbs(page: { name: string; path: string }) {
  return breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: page.name, path: page.path },
  ])
}

export const ROUTES: readonly RouteMeta[] = [
  {
    path: "/",
    title: "Construct Computer — the AI employee with their own computer",
    description:
      "Construct is an AI agent with its own cloud computer. It logs into a full virtual desktop, runs code, sends email, and works across Slack, Telegram, and your inbox — scheduled, persistent, on any device.",
    keywords:
      "AI agent, AI employee, autonomous AI, virtual desktop, cloud desktop, AI assistant, Construct Computer, AI for Slack, AI for Telegram, AI for email, Cloudflare agent",
    canonical: canonical("/"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd(), faqPageJsonLd(LANDING_FAQ)],
  },
  {
    path: "/about",
    title: "About — Construct Computer",
    description:
      "Construct is building the AI employee — a persistent agent with its own Linux sandbox, browser, inbox, memory, and calendar. Learn about the team, the architecture, and what we believe.",
    keywords: `${KEYWORDS_COMMON}, about Construct, AI employee company, Cloudflare Durable Objects, Composio`,
    canonical: canonical("/about"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "About", path: "/about" })],
  },
  {
    path: "/careers",
    title: "Careers — Construct Computer",
    description:
      "Construct isn't actively hiring right now, but we'd love to hear from people who want to build AI agents, virtual desktops, and autonomous systems with us.",
    keywords: `${KEYWORDS_COMMON}, AI startup jobs, AI agent jobs, careers at Construct`,
    canonical: canonical("/careers"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Careers", path: "/careers" })],
  },
  {
    path: "/support",
    title: "Support — Construct Computer",
    description:
      "Get help with your Construct Computer account, billing, integrations, and data requests. Report issues, review audit logs, or contact the team.",
    keywords: `${KEYWORDS_COMMON}, Construct support, AI agent help, AI agent debugging, audit log`,
    canonical: canonical("/support"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Support", path: "/support" })],
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Construct Computer",
    description:
      "How Construct Computer collects, stores, encrypts, and shares data across the agent backend, virtual desktop, integrations, and billing provider.",
    keywords: `${KEYWORDS_COMMON}, privacy policy, AI agent privacy, AES-256-GCM, Cloudflare privacy`,
    canonical: canonical("/privacy"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Privacy Policy", path: "/privacy" })],
  },
  {
    path: "/terms",
    title: "Terms & Conditions — Construct Computer",
    description:
      "Terms of service for Construct Computer: subscription plans, acceptable use, autonomous agent actions, BYOK, and licensing of our source-available components.",
    keywords: `${KEYWORDS_COMMON}, terms of service, BSL 1.1, acceptable use policy, BYOK`,
    canonical: canonical("/terms"),
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Terms", path: "/terms" })],
  },
]

const ROUTE_MAP: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((r) => [r.path, r]),
)

/** Fallback used on unknown pathnames (client-side) or for 404-ish hits. */
export function getRouteMeta(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  return ROUTE_MAP[normalized] ?? ROUTE_MAP["/"]!
}
