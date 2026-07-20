import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { App } from "@/App"
import { getAllRenderableRoutes, getRouteMeta, normalizePathname } from "./routes"
import { getResourceEntries } from "@/content/resources"

test("route metadata stays within audit limits", () => {
  for (const route of getAllRenderableRoutes()) {
    expect(route.title.length, `${route.path} title`).toBeLessThanOrEqual(60)
    expect(route.description.length, `${route.path} description`).toBeGreaterThanOrEqual(70)
    expect(route.description.length, `${route.path} description`).toBeLessThanOrEqual(160)
  }
})

test("every pre-rendered page has one h1", () => {
  for (const route of getAllRenderableRoutes()) {
    const html = renderToStaticMarkup(<App initialPath={route.path} />)
    expect(html.match(/<h1\b/g)?.length, route.path).toBe(1)
  }
})

test("blog aliases resolve to one canonical content tree", () => {
  expect(normalizePathname("/blogs")).toBe("/blog")
  expect(normalizePathname("/blogs/what-is-an-ai-employee/")).toBe(
    "/blog/what-is-an-ai-employee",
  )
  expect(getRouteMeta("/blogs").canonical).toBe("https://construct.computer/blog/")
  expect(renderToStaticMarkup(<App initialPath="/blogs" />)).toBe(
    renderToStaticMarkup(<App initialPath="/blog" />),
  )
})

test("the blog resource catalog includes comparisons and guides", () => {
  const paths = getResourceEntries().map((entry) => entry.path)
  expect(paths).toContain("/vs/chatgpt")
  expect(paths).toContain("/ai-employee")
  expect(paths).toContain("/ai-workflow-automation")
  expect(paths).toContain("/ai-agent-memory")
})
