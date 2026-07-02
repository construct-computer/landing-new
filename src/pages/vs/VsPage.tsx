import { getVsPage } from "@/content/vs"
import { ComparisonTable, WhenToChoose } from "@/components/ComparisonTable"
import { useRoute } from "@/router"
import { NotFoundPage } from "@/pages/NotFound"
import { LegalSection, LegalShell } from "../LegalShell"

export function VsPageView() {
  const pathname = useRoute()
  const slug = pathname.replace(/^\/vs\//, "")
  const page = getVsPage(slug)

  if (!page) return <NotFoundPage />

  return (
    <LegalShell title={page.title} subtitle={page.summary}>
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
    </LegalShell>
  )
}
