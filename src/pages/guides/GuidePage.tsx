import { getGuidePage } from "@/content/guides"
import { BetaAccessTrigger } from "@/landing/beta-access/BetaAccessTrigger"
import { LegalList, LegalSection, LegalShell } from "@/pages/LegalShell"
import { Link, useRoute } from "@/router"
import { NotFoundPage } from "@/pages/NotFound"

const RELATED = [
  { path: "/blog/what-is-an-ai-employee", label: "What is an AI employee?" },
  { path: "/vs/chatgpt", label: "Construct vs ChatGPT" },
  { path: "/ai-workflow-automation", label: "AI workflow automation" },
  { path: "/ai-agent-memory", label: "AI agent memory" },
] as const

export function GuidePageView() {
  const slug = useRoute().replace(/^\//, "")
  const page = getGuidePage(slug)

  if (!page) return <NotFoundPage />

  return (
    <LegalShell title={page.title} subtitle={page.summary}>
      {page.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <LegalList>
              {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </LegalList>
          )}
        </LegalSection>
      ))}

      <LegalSection title="Continue exploring">
        <ul className="grid gap-3 sm:grid-cols-2">
          {RELATED.filter((item) => item.path !== `/${page.slug}`).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-[#01b4c8] underline-offset-2 hover:underline"
              >
                {item.label} →
              </Link>
            </li>
          ))}
        </ul>
        <BetaAccessTrigger source="guide" variant="link">
          Request beta access →
        </BetaAccessTrigger>
      </LegalSection>
    </LegalShell>
  )
}
