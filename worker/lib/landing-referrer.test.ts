import { describe, expect, test } from "bun:test"
import { parseLandingReferrer } from "./landing-referrer"

describe("parseLandingReferrer", () => {
  test("accepts hostnames", () => {
    expect(parseLandingReferrer("news.ycombinator.com")).toBe(
      "news.ycombinator.com",
    )
    expect(parseLandingReferrer(" T.Co ")).toBe("t.co")
  })

  test("rejects junk", () => {
    expect(parseLandingReferrer("not a host")).toBe("")
    expect(parseLandingReferrer(42)).toBe("")
  })
})
