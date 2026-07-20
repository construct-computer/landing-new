import { getResourceEntries, type ResourceEntry } from "@/content/resources"
import { Link } from "@/router"
import { LegalShell } from "../LegalShell"

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function ResourceCard({ entry }: { entry: ResourceEntry }) {
  return (
    <article className="rounded-xl border border-[#e5e7eb] p-6 transition-colors hover:border-[#8adcdf]">
      <p className="font-ui text-[12px] uppercase tracking-[0.08em] text-[#8a9aa2]">
        {entry.kind}{entry.date ? ` · ${formatDate(entry.date)}` : ""}
      </p>
      <h3 className="font-display mt-2 text-[24px] italic leading-[1.2] text-[#4e4646]">
        <Link to={entry.path} className="transition-colors hover:text-[#01b4c8]">
          {entry.title}
        </Link>
      </h3>
      <p className="font-ui mt-2 text-[15px] leading-[1.6] text-[#627c86]">
        {entry.description}
      </p>
      <Link
        to={entry.path}
        className="font-ui mt-4 inline-block text-[14px] text-[#01b4c8] hover:underline"
      >
        Read {entry.kind} →
      </Link>
    </article>
  )
}

export function BlogIndexPage() {
  const resources = getResourceEntries()
  const groups = [
    { kind: "guide", title: "Product guides" },
    { kind: "article", title: "Articles" },
    { kind: "comparison", title: "Comparisons" },
  ] as const

  return (
    <LegalShell
      title="AI Employee Resources"
      subtitle="Guides, articles, and comparisons for choosing and operating AI that completes real work."
    >
      <div className="space-y-8">
        <section aria-labelledby="blog-introduction" className="space-y-3">
          <h2
            id="blog-introduction"
            className="font-display text-[24px] italic leading-[1.2] text-[#4e4646]"
          >
            From chat answers to finished work
          </h2>
          <p>
            An AI employee accepts an outcome, chooses tools, and completes
            multi-step work from a persistent workspace. These resources
            explain how that model differs from chat assistants, coding agents,
            suite copilots, and fixed automations.
          </p>
          <p>
            Start with the definition of an AI employee, then use the
            comparisons to decide when you need conversation, a specialist
            coding tool, or an agent that can execute an entire cross-app
            workflow and leave inspectable outputs and Activity history.
          </p>
        </section>
        {resources.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          groups.map((group) => {
            const entries = resources.filter((entry) => entry.kind === group.kind)
            if (entries.length === 0) return null
            return (
              <section key={group.kind} aria-labelledby={`${group.kind}-heading`}>
                <h2
                  id={`${group.kind}-heading`}
                  className="font-display mb-5 text-[28px] italic leading-[1.2] text-[#4e4646]"
                >
                  {group.title}
                </h2>
                <div className="space-y-5">
                  {entries.map((entry) => <ResourceCard key={entry.path} entry={entry} />)}
                </div>
              </section>
            )
          })
        )}
      </div>
    </LegalShell>
  )
}
