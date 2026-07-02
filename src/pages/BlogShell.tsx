import { useEffect, type ReactNode } from "react"
import { LandingFooter, LandingNav } from "@/landing/shared"
import { Link } from "@/router"

/**
 * Reading shell for blog posts — same nav/footer as LegalShell but with
 * prose styling for markdown HTML bodies.
 */
export function BlogShell({
  title,
  subtitle,
  backTo = "/blog",
  backLabel = "Back to blog",
  tags,
  children,
}: {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  tags?: readonly string[]
  children: ReactNode
}) {
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#4e4646]">
      <LandingNav />

      <main id="main" className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-6 lg:pt-16">
        <Link
          to={backTo}
          className="font-ui inline-flex items-center gap-2 text-[13px] leading-5 text-[#8a9aa2] transition-colors hover:text-[#01b4c8]"
        >
          <span aria-hidden>←</span> {backLabel}
        </Link>

        <h1 className="font-display mt-8 text-balance text-[36px] italic leading-[1.1] text-[#4e4646] sm:text-[44px] lg:text-[52px] lg:leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-ui mt-3 text-[13px] leading-5 text-[#8a9aa2]">{subtitle}</p>
        )}
        {tags && tags.length > 0 && (
          <ul className="font-ui mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[12px] text-[#627c86]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="blog-prose font-ui mt-12 text-[15px] leading-[1.7] text-[#627c86] lg:text-[16px]">
          {children}
        </div>
      </main>

      <LandingFooter />

      <style>{`
        .blog-prose h2 {
          font-family: var(--font-display, inherit);
          font-style: italic;
          font-size: 1.375rem;
          line-height: 1.2;
          color: #4e4646;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-prose h3 {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #4e4646;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .blog-prose p { margin-bottom: 1rem; }
        .blog-prose ul, .blog-prose ol {
          margin-bottom: 1rem;
          padding-left: 1.25rem;
        }
        .blog-prose ul { list-style: disc; }
        .blog-prose ol { list-style: decimal; }
        .blog-prose li { margin-bottom: 0.35rem; }
        .blog-prose a {
          color: #01b4c8;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-prose strong { color: #4e4646; font-weight: 500; }
        .blog-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }
        .blog-prose th, .blog-prose td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .blog-prose th { color: #4e4646; background: #fafafa; }
        .blog-prose code {
          font-size: 0.875em;
          background: #f4f6f7;
          padding: 0.1em 0.35em;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  )
}
