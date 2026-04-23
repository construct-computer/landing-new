import type { FaqItem } from "@/content/faq"

/**
 * JSON-LD builders. Kept as plain objects so the same module can be imported
 * during static generation (emitted as `<script type="application/ld+json">`)
 * and during client-side navigation (injected into `<head>`).
 */

export const SITE_URL = "https://construct.computer"
export const ORG_NAME = "Construct Computer"
export const ORG_LOGO = `${SITE_URL}/logo.png`

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
