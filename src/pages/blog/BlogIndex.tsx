import { getPublishedPosts } from "@/content/blog/load"
import { Link } from "@/router"
import { LegalShell } from "../LegalShell"

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogIndexPage() {
  const posts = getPublishedPosts()

  return (
    <LegalShell
      title="AI Employee Guides"
      subtitle="Practical guides to AI employees, autonomous agents, and software that completes work—not just chat."
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
            An AI employee is a persistent autonomous agent that can use a
            browser, terminal, files, email, calendar, and connected apps from
            its own computer. These guides explain how that model differs from
            chat assistants, coding agents, copilots, and fixed automations.
          </p>
          <p>
            Start with the definition of an AI employee, then use the
            comparisons to decide when you need conversation, a specialist
            coding tool, or an agent that can execute an entire cross-app
            workflow and leave proof of the result.
          </p>
        </section>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-[#e5e7eb] p-6 transition-colors hover:border-[#8adcdf]"
            >
              <time
                dateTime={post.date}
                className="font-ui text-[12px] uppercase tracking-[0.08em] text-[#8a9aa2]"
              >
                {formatDate(post.date)}
              </time>
              <h2 className="font-display mt-2 text-[24px] italic leading-[1.2] text-[#4e4646]">
                <Link
                  to={`/blog/${post.slug}`}
                  className="transition-colors hover:text-[#01b4c8]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="font-ui mt-2 text-[15px] leading-[1.6] text-[#627c86]">
                {post.description}
              </p>
              <Link
                to={`/blog/${post.slug}`}
                className="font-ui mt-4 inline-block text-[14px] text-[#01b4c8] hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))
        )}
      </div>
    </LegalShell>
  )
}
