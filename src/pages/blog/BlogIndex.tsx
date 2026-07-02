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
    <LegalShell title="Blog" subtitle="Product updates, guides, and SEO resources">
      <div className="space-y-8">
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
