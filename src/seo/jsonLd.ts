import type { FaqItem } from "@/content/faq"

/**
 * JSON-LD builders. Kept as plain objects so the same module can be imported
 * during static generation (emitted as `<script type="application/ld+json">`)
 * and during client-side navigation (injected into `<head>`).
 */

export const SITE_URL = "https://construct.computer"
export const ORG_NAME = "Construct Computer"
export const ORG_LOGO = `${SITE_URL}/logo.png`

/**
 * Default OG / Twitter share image — the landscape 1200×630 card.
 *
 * Source: `src/assets/og-card.png` (1200×630 PNG, ~310 KB).
 * Build:  converted to JPEG at quality 90 by `build.ts`, emitted as
 *         `dist/og-card.jpg` (~125 KB). JPEG is chosen because it's the
 *         universal format every OG scraper accepts and the only way to
 *         reliably fit under WhatsApp's ~300 KB share-image cap at this
 *         resolution. Non-macOS builds (no `sips`) fall back to copying
 *         the source PNG to `dist/og-card.png` — still works, but may be
 *         rejected by stricter WhatsApp clients.
 *
 * Platform fit:
 *   - Facebook / LinkedIn: 1200×630 is the canonical recommended size.
 *   - X (Twitter): use `twitter:card=summary_large_image` to render the
 *     full landscape card (set at the route level).
 *   - Discord / iMessage / Telegram / Slack: native 1.91:1 landscape.
 *   - WhatsApp: ≤ 300 KB requirement met by the JPEG variant.
 */
export const OG_IMAGE_URL = `${SITE_URL}/og-card.jpg`
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = "image/jpeg"
export const OG_IMAGE_ALT =
  "Construct Computer — autonomous computer that works for you"
export const OG_LOCALE = "en_US"

/** Serialize a JSON-LD object into a `<script>`-safe string. */
export function serializeJsonLd(data: unknown): string {
  // Escape </script> sequences to prevent HTML injection from closing the tag
  // early. JSON-LD also disallows bare `<` and `>` in string values.
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    alternateName: "Construct",
    url: SITE_URL,
    logo: ORG_LOGO,
    description:
      "Construct Computer is an AI agent with its own cloud computer — a persistent AI employee that logs into a virtual desktop and works across Slack, Telegram, and email.",
    sameAs: [
      "https://x.com/use_construct",
      "https://github.com/construct-computer",
      "https://linkedin.com/company/construct-computer",
      "https://discord.gg/puArEQHYN9",
    ],
  } as const
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: SITE_URL,
    publisher: { "@type": "Organization", name: ORG_NAME },
  } as const
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: ORG_NAME,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web, Cloud, iOS, Android, macOS",
    url: SITE_URL,
    description:
      "An AI agent with its own cloud computer. Connects to Slack, Telegram, email, and 1,000+ SaaS apps; runs a persistent virtual desktop with browser, terminal, files, memory, and calendar.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        category: "free",
      },
      {
        "@type": "Offer",
        name: "Starter",
        priceCurrency: "USD",
        category: "subscription",
      },
      {
        "@type": "Offer",
        name: "Pro",
        priceCurrency: "USD",
        category: "subscription",
      },
    ],
    publisher: { "@type": "Organization", name: ORG_NAME },
  } as const
}

export function faqPageJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } as const
}

export type Breadcrumb = { readonly name: string; readonly path: string }

export function breadcrumbListJsonLd(items: readonly Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${SITE_URL}${b.path === "/" ? "" : b.path}`,
    })),
  } as const
}
