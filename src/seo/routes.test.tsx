import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { App } from "@/App"
import { getAllRenderableRoutes } from "./routes"

test("route metadata stays within audit limits", () => {
  for (const route of getAllRenderableRoutes()) {
    expect(route.title.length, `${route.path} title`).toBeLessThanOrEqual(60)
    expect(route.description.length, `${route.path} description`).toBeGreaterThanOrEqual(70)
    expect(route.description.length, `${route.path} description`).toBeLessThanOrEqual(160)
  }
})

test("the pre-rendered homepage has one h1", () => {
  const html = renderToStaticMarkup(<App initialPath="/" />)
  expect(html.match(/<h1\b/g)?.length).toBe(1)
})
