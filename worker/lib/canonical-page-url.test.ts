import { expect, test } from "bun:test"
import { canonicalPageUrl } from "./canonical-page-url"

test("canonicalPageUrl permanently canonicalizes page paths", () => {
  expect(canonicalPageUrl("https://construct.computer/about?ref=x", "GET"))
    .toBe("https://construct.computer/about/?ref=x")
  expect(canonicalPageUrl("https://construct.computer/blogs", "GET"))
    .toBe("https://construct.computer/blog/")
  expect(canonicalPageUrl("https://construct.computer/blogs/example/", "GET"))
    .toBe("https://construct.computer/blog/example/")
  expect(canonicalPageUrl("https://construct.computer/logo.png", "GET")).toBeNull()
  expect(canonicalPageUrl("https://construct.computer/api/beta-signup", "POST")).toBeNull()
})
