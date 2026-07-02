import { marked } from "marked"
import { RAW_BLOG_POSTS } from "./posts.generated"

export type BlogPost = {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly date: string
  readonly author: string
  readonly tags: readonly string[]
  readonly draft: boolean
  readonly html: string
}

const KEYWORDS_COMMON =
  "AI agent, AI employee, Construct Computer, autonomous agent, virtual desktop"

type Frontmatter = {
  title?: string
  description?: string
  date?: string
  author?: string
  tags?: string[]
  draft?: boolean
}

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }

  const meta: Frontmatter = {}
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (!kv) continue
    const [, key, value] = kv
    const trimmed = value.replace(/^["']|["']$/g, "")
    if (key === "tags") {
      const tagsMatch = trimmed.match(/^\[(.*)\]$/)
      meta.tags = tagsMatch
        ? tagsMatch[1]
            .split(",")
            .map((t) => t.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : []
    } else if (key === "draft") {
      meta.draft = trimmed === "true"
    } else if (key === "title") meta.title = trimmed
    else if (key === "description") meta.description = trimmed
    else if (key === "date") meta.date = trimmed
    else if (key === "author") meta.author = trimmed
  }
  return { meta, body: match[2] }
}

function parsePost(slug: string, raw: string): BlogPost | null {
  const { meta, body } = parseFrontmatter(raw)
  if (!meta.title || !meta.description || !meta.date) return null
  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    author: meta.author ?? "Construct Team",
    tags: meta.tags ?? [],
    draft: meta.draft ?? false,
    html: marked.parse(body, { async: false }) as string,
  }
}

const ALL_POSTS: readonly BlogPost[] = RAW_BLOG_POSTS.map(({ slug, raw }) =>
  parsePost(slug, raw),
).filter((p): p is BlogPost => p !== null)

export function getPublishedPosts(): readonly BlogPost[] {
  return [...ALL_POSTS]
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = ALL_POSTS.find((p) => p.slug === slug && !p.draft)
  return post
}

export function getBlogSlugs(): readonly string[] {
  return getPublishedPosts().map((p) => p.slug)
}

export function blogPath(slug?: string): string {
  return slug ? `/blog/${slug}` : "/blog"
}

export function blogKeywords(post: BlogPost): string {
  const tagPart = post.tags.length > 0 ? post.tags.join(", ") : ""
  return tagPart ? `${tagPart}, ${KEYWORDS_COMMON}` : KEYWORDS_COMMON
}
