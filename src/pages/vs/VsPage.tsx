import { getVsPage } from "@/content/vs"
import { ComparisonTable, WhenToChoose } from "@/components/ComparisonTable"
import { Link, useRoute } from "@/router"
import { NotFoundPage } from "@/pages/NotFound"
import { LegalSection } from "../LegalShell"
import { BlogShell } from "../BlogShell"

export function VsPageView() {
  const pathname = useRoute()
  const slug = pathname.replace(/^\/vs\//, "")
  const page = getVsPage(slug)

  if (!page) return <NotFoundPage />

  return (
    <BlogShell
      title={page.title}
      subtitle={`Updated July 20, 2026 · ${page.summary}`}
      backTo="/blog"
      backLabel="Back to resources"
      tags={["comparison", "AI employee"]}
    >
      {page.comparisonTable && (
        <LegalSection title="Side by side">
          <ComparisonTable competitor={page.competitor} rows={page.comparisonTable} />
        </LegalSection>
      )}

      {page.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <p>{section.body}</p>
        </LegalSection>
      ))}

      <LegalSection title="When to choose">
        <WhenToChoose
          competitor={page.competitor}
          construct={page.whenToChoose.construct}
          competitorReasons={page.whenToChoose.competitor}
        />
      </LegalSection>

      <LegalSection title="Related resources">
        <ul>
          <li><Link to="/ai-employee">AI employee product guide</Link></li>
          <li><Link to="/blog/what-is-an-ai-employee">What is an AI employee?</Link></li>
          <li><Link to="/ai-workflow-automation">AI workflow automation</Link></li>
          <li><Link to="/blog">All AI employee resources</Link></li>
        </ul>
      </LegalSection>
    </BlogShell>
  )
}
