import { useEffect, type ReactNode } from "react"
import { LandingFooter, LandingNav } from "@/landing/shared"
import { Link } from "@/router"

/**
 * Shared page shell for the static legal pages (Privacy Policy, Terms, etc.).
 * Renders the landing nav + footer for continuity and provides a tight
 * reading-column layout with a "back to home" affordance at the top.
 */
/**
 * Shared page shell for the static content pages (Privacy, Terms, Support…).
 * Pass either `updated` (for policy pages) or `subtitle` (for descriptive
 * pages like Support) — whichever makes sense for the content.
 */
export function LegalShell({
  title,
  updated,
  subtitle,
  children,
}: {
  title: string
  updated?: string
  subtitle?: string
  children: ReactNode
}) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#4e4646]">
      <LandingNav />

      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-6 lg:pt-16">
        <Link
          to="/"
          className="font-ui inline-flex items-center gap-2 text-[13px] leading-5 text-[#8a9aa2] transition-colors hover:text-[#01b4c8]"
        >
          <span aria-hidden>←</span> Back to home
        </Link>

        <h1 className="font-display mt-8 text-balance text-[36px] italic leading-[1.1] text-[#4e4646] sm:text-[44px] lg:text-[52px] lg:leading-[1.05]">
          {title}
        </h1>
        {(updated || subtitle) && (
          <p className="font-ui mt-3 text-[13px] leading-5 text-[#8a9aa2]">
            {updated ? `Last updated: ${updated}` : subtitle}
          </p>
        )}

        <div className="font-ui mt-12 space-y-12 text-[15px] leading-[1.7] text-[#627c86] lg:text-[16px]">
          {children}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-[22px] italic leading-[1.2] text-[#4e4646] lg:text-[26px]">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-ui mt-6 mb-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#4e4646] lg:text-[14px]">
      {children}
    </h3>
  )
}

/** Highlighted phrase at the start of a bullet (e.g. "Container isolation"). */
export function Emph({ children }: { children: ReactNode }) {
  return <span className="font-medium text-[#4e4646]">{children}</span>
}

/**
 * Inline link styled with the site's cyan accent. Uses the client-side
 * router for same-origin paths and a real anchor for everything else.
 */
export function InlineLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const isInternal = href.startsWith("/")
  const className = "text-[#01b4c8] underline-offset-2 hover:underline"
  if (isInternal) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-[#cfd7db]">
      {children}
    </ul>
  )
}
