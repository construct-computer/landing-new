import { LANDING_FAQ } from "@/content/faq"
import {
  blogKeywords,
  getBlogSlugs,
  getPostBySlug,
  getPublishedPosts,
} from "@/content/blog/load"
import { getVsPage, getVsSlugs } from "@/content/vs"
import {
  articleJsonLd,
  blogIndexJsonLd,
  breadcrumbListJsonLd,
  faqPageJsonLd,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
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
  /** Absolute OG image URL. Must be HTTPS + accessible server-side. */
  readonly ogImage: string
  /** Pixel width of `ogImage`. LinkedIn/Facebook size cards from this. */
  readonly ogImageWidth: number
  /** Pixel height of `ogImage`. */
  readonly ogImageHeight: number
  /** MIME type of `ogImage` - `image/png`, `image/jpeg`, `image/webp`. */
  readonly ogImageType: string
  /** Accessibility/alt text for `ogImage` (Slack renders this). */
  readonly ogImageAlt: string
  /**
   * Twitter card style. Use `summary` for square images and
   * `summary_large_image` only when `ogImage` is landscape (≥ 2:1).
   */
  readonly twitterCard: "summary" | "summary_large_image"
  /** Open Graph type — `article` for blog posts. */
  readonly ogType?: "website" | "article"
  /** ISO date for blog post lastmod in sitemap. */
  readonly lastmod?: string
  /** JSON-LD objects to emit on this page (in order). */
  readonly jsonLd: readonly Record<string, unknown>[]
  /** Optional `<meta name="robots">` override. */
  readonly robots?: string
}

const KEYWORDS_COMMON =
  "AI agent, AI employee, virtual desktop, cloud computer, autonomous agent, Cloudflare agent, Construct Computer, Composio, Slack AI, Telegram AI"

/** Default OG image block shared by every route. */
const DEFAULT_OG = {
  ogImage: OG_IMAGE_URL,
  ogImageWidth: OG_IMAGE_WIDTH,
  ogImageHeight: OG_IMAGE_HEIGHT,
  ogImageType: OG_IMAGE_TYPE,
  ogImageAlt: OG_IMAGE_ALT,
  twitterCard: "summary_large_image",
} as const satisfies Partial<RouteMeta>

function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`
}

function homeBreadcrumbs(page: { name: string; path: string }) {
  return breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: page.name, path: page.path },
  ])
}

export const ROUTES: readonly RouteMeta[] = [
  {
    ...DEFAULT_OG,
    path: "/",
    title: "Construct Computer - the AI employee with their own computer",
    description:
      "Construct is an AI employee with its own cloud computer that uses a browser, terminal, email, and connected apps to finish work while you are away.",
    keywords:
      "AI agent, AI employee, autonomous AI, virtual desktop, cloud desktop, AI assistant, Construct Computer, AI for Slack, AI for Telegram, AI for email, Cloudflare agent",
    canonical: canonical("/"),
    jsonLd: [organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd(), faqPageJsonLd(LANDING_FAQ)],
  },
  {
    ...DEFAULT_OG,
    path: "/about",
    title: "About - Construct Computer",
    description:
      "Meet Construct Computer, the team building a persistent AI employee with its own cloud computer, browser, inbox, memory, and calendar.",
    keywords: `${KEYWORDS_COMMON}, about Construct, AI employee company, Cloudflare Durable Objects, Composio`,
    canonical: canonical("/about"),
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "About", path: "/about" })],
  },
  {
    ...DEFAULT_OG,
    path: "/careers",
    title: "Careers - Construct Computer",
    description:
      "Construct isn't actively hiring right now, but we'd love to hear from people who want to build AI agents, virtual desktops, and autonomous systems with us.",
    keywords: `${KEYWORDS_COMMON}, AI startup jobs, AI agent jobs, careers at Construct`,
    canonical: canonical("/careers"),
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Careers", path: "/careers" })],
  },
  {
    ...DEFAULT_OG,
    path: "/support",
    title: "Support - Construct Computer",
    description:
      "Get help with your Construct Computer account, billing, integrations, and data requests. Report issues, review audit logs, or contact the team.",
    keywords: `${KEYWORDS_COMMON}, Construct support, AI agent help, AI agent debugging, audit log`,
    canonical: canonical("/support"),
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Support", path: "/support" })],
  },
  {
    ...DEFAULT_OG,
    path: "/privacy",
    title: "Privacy Policy - Construct Computer",
    description:
      "How Construct Computer collects, stores, encrypts, and shares data across the agent backend, virtual desktop, integrations, and billing provider.",
    keywords: `${KEYWORDS_COMMON}, privacy policy, AI agent privacy, AES-256-GCM, Cloudflare privacy`,
    canonical: canonical("/privacy"),
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Privacy Policy", path: "/privacy" })],
  },
  {
    ...DEFAULT_OG,
    path: "/terms",
    title: "Terms & Conditions - Construct Computer",
    description:
      "Terms of service for Construct Computer: subscription plans, acceptable use, autonomous agent actions, BYOK, and licensing of our source-available components.",
    keywords: `${KEYWORDS_COMMON}, terms of service, BSL 1.1, acceptable use policy, BYOK`,
    canonical: canonical("/terms"),
    jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Terms", path: "/terms" })],
  },
]

const BLOG_INDEX_META: RouteMeta = {
  ...DEFAULT_OG,
  path: "/blog",
  title: "AI Employee Guides - Construct Computer",
  description:
    "Guides, product updates, and resources about AI employees, autonomous agents, and how Construct compares to chat assistants and automation tools.",
  keywords: `${KEYWORDS_COMMON}, Construct blog, AI employee guides, AI agent SEO`,
  canonical: canonical("/blog"),
  jsonLd: [
    organizationJsonLd(),
    homeBreadcrumbs({ name: "Blog", path: "/blog" }),
    blogIndexJsonLd(
      getPublishedPosts().map((p) => ({ title: p.title, path: `/blog/${p.slug}` })),
    ),
  ],
}

const VS_INDEX_META: RouteMeta = {
  ...DEFAULT_OG,
  path: "/vs",
  title: "AI Agent Comparisons - Construct Computer",
  description:
    "See how Construct compares to ChatGPT, Microsoft Copilot, Zapier, coding agents, and DIY agent stacks.",
  keywords: `${KEYWORDS_COMMON}, Construct vs ChatGPT, AI agent comparison, Construct vs Zapier`,
  canonical: canonical("/vs"),
  jsonLd: [organizationJsonLd(), homeBreadcrumbs({ name: "Compare", path: "/vs" })],
}

function blogPostMeta(slug: string): RouteMeta | undefined {
  const post = getPostBySlug(slug)
  if (!post) return undefined
  const path = `/blog/${slug}`
  return {
    ...DEFAULT_OG,
    path,
    title: `${post.title} - Construct Computer Blog`,
    description: post.description,
    keywords: blogKeywords(post),
    canonical: canonical(path),
    ogType: "article",
    lastmod: post.date,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbListJsonLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ]),
      articleJsonLd({
        title: post.title,
        description: post.description,
        datePublished: post.date,
        url: canonical(path),
        author: post.author,
      }),
    ],
  }
}

function vsPageMeta(slug: string): RouteMeta | undefined {
  const page = getVsPage(slug)
  if (!page) return undefined
  const path = `/vs/${slug}`
  return {
    ...DEFAULT_OG,
    path,
    title: `${page.title} - Construct Computer`,
    description: page.description,
    keywords: `${KEYWORDS_COMMON}, ${page.title}, Construct comparison`,
    canonical: canonical(path),
    jsonLd: [
      organizationJsonLd(),
      breadcrumbListJsonLd([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/vs" },
        { name: page.title, path },
      ]),
    ],
  }
}

const ROUTE_MAP: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((r) => [r.path, r]),
)

/** All routes pre-rendered at build time and listed in sitemap/agents.md. */
export function getAllRenderableRoutes(): readonly RouteMeta[] {
  const blogPosts = getBlogSlugs().map((slug) => blogPostMeta(slug)).filter(Boolean) as RouteMeta[]
  const vsPages = getVsSlugs().map((slug) => vsPageMeta(slug)).filter(Boolean) as RouteMeta[]
  return [...ROUTES, BLOG_INDEX_META, ...blogPosts, VS_INDEX_META, ...vsPages]
}

const KNOWN_PATHS = new Set(getAllRenderableRoutes().map((r) => r.path))

/** SEO metadata for `dist/404.html` and client-side unknown routes. */
export const NOT_FOUND_META: RouteMeta = {
  ...DEFAULT_OG,
  path: "/404",
  title: "Page not found - Construct Computer",
  description:
    "The page you requested does not exist on construct.computer. Return to the homepage or contact support for help.",
  keywords: KEYWORDS_COMMON,
  canonical: canonical("/"),
  robots: "noindex, follow",
  jsonLd: [organizationJsonLd()],
}

export function isKnownRoute(pathname: string): boolean {
  return KNOWN_PATHS.has(normalizePathname(pathname))
}

/**
 * Strip trailing slashes so `/support/` (common after static hosts redirect
 * directory indexes) matches the same route as `/support`.
 */
export function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "")
  return trimmed === "" ? "/" : trimmed
}

/** Route SEO metadata; unknown paths get `NOT_FOUND_META` (noindex). */
export function getRouteMeta(pathname: string): RouteMeta {
  const normalized = normalizePathname(pathname)
  if (ROUTE_MAP[normalized]) return ROUTE_MAP[normalized]!
  if (normalized === "/blog") return BLOG_INDEX_META
  if (normalized === "/vs") return VS_INDEX_META
  if (normalized.startsWith("/blog/")) {
    const slug = normalized.slice("/blog/".length)
    const meta = blogPostMeta(slug)
    if (meta) return meta
  }
  if (normalized.startsWith("/vs/")) {
    const slug = normalized.slice("/vs/".length)
    const meta = vsPageMeta(slug)
    if (meta) return meta
  }
  return NOT_FOUND_META
}
