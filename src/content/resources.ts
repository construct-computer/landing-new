import { getPublishedPosts } from "@/content/blog/load"
import { GUIDE_PAGES, guidePath } from "@/content/guides"
import { VS_PAGES, vsPath } from "@/content/vs"

export type ResourceEntry = {
  readonly kind: "article" | "guide" | "comparison"
  readonly title: string
  readonly description: string
  readonly path: string
  readonly date?: string
}

export function getResourceEntries(): readonly ResourceEntry[] {
  const articles = getPublishedPosts().map((post) => ({
    kind: "article" as const,
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    date: post.date,
  }))
  const guides = GUIDE_PAGES.map((page) => ({
    kind: "guide" as const,
    title: page.title,
    description: page.description,
    path: guidePath(page.slug),
    date: page.updated,
  }))
  const comparisons = VS_PAGES.map((page) => ({
    kind: "comparison" as const,
    title: page.title,
    description: page.description,
    path: vsPath(page.slug),
    date: page.updated,
  }))
  return [...articles, ...guides, ...comparisons]
}
