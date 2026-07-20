import { VS_PAGES } from "@/content/vs"
import { Link } from "@/router"
import { LegalShell } from "@/pages/LegalShell"

export function VsIndexPage() {
  return (
    <LegalShell
      title="AI Agent Comparisons"
      subtitle="Compare Construct with chat assistants, copilots, automation tools, coding agents, and DIY stacks."
    >
      <div className="space-y-6">
        <p>
          These comparisons are part of the{" "}
          <Link to="/blog" className="text-[#01b4c8] hover:underline">
            Construct resource library
          </Link>
          , alongside practical guides to AI employees, workflow automation,
          and long-term agent memory.
        </p>
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
