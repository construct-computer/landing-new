import { VS_PAGES } from "@/content/vs"
import { Link } from "@/router"
import { LegalShell } from "@/pages/LegalShell"

export function VsIndexPage() {
  return (
    <LegalShell
      title="Compare"
      subtitle="How Construct differs from chat assistants, copilots, automation tools, and DIY agent stacks"
    >
      <div className="space-y-6">
        {VS_PAGES.map((page) => (
          <article
            key={page.slug}
            className="rounded-xl border border-[#e5e7eb] p-6 transition-colors hover:border-[#8adcdf]"
          >
            <h2 className="font-display text-[24px] italic leading-[1.2] text-[#4e4646]">
              <Link
                to={`/vs/${page.slug}`}
                className="transition-colors hover:text-[#01b4c8]"
              >
                {page.title}
              </Link>
            </h2>
            <p className="font-ui mt-2 text-[15px] leading-[1.6] text-[#627c86]">
              {page.summary}
            </p>
            <Link
              to={`/vs/${page.slug}`}
              className="font-ui mt-4 inline-block text-[14px] text-[#01b4c8] hover:underline"
            >
              Read comparison →
            </Link>
          </article>
        ))}
      </div>
    </LegalShell>
  )
}
