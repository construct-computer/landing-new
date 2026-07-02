import { getPostBySlug } from "@/content/blog/load"
import { useRoute } from "@/router"
import { NotFoundPage } from "@/pages/NotFound"
import { BlogShell } from "@/pages/BlogShell"

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogPostPage() {
  const pathname = useRoute()
  const slug = pathname.replace(/^\/blog\//, "")
  const post = getPostBySlug(slug)

  if (!post) return <NotFoundPage />

  return (
    <BlogShell
      title={post.title}
      subtitle={`${formatDate(post.date)} · ${post.author}`}
      tags={post.tags}
    >
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </BlogShell>
  )
}
