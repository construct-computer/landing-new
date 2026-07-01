import { describe, expect, test } from "bun:test"
import { parseReferralSource, parseReferralSourceDetail, formatReferralForSheet } from "./referral-source"

describe("parseReferralSource", () => {
  test("accepts known sources", () => {
    expect(parseReferralSource("twitter")).toBe("twitter")
    expect(parseReferralSource(" Reddit ")).toBe("reddit")
    expect(parseReferralSource("hackernews")).toBe("hackernews")
    expect(parseReferralSource("producthunt")).toBe("producthunt")
    expect(parseReferralSource("discord")).toBe("discord")
  })

  test("rejects unknown", () => {
    expect(parseReferralSource("facebook")).toBeNull()
    expect(parseReferralSource("")).toBeNull()
  })
})

describe("parseReferralSourceDetail", () => {
  test("allows null detail for non-other", () => {
    expect(parseReferralSourceDetail("twitter", "")).toEqual({
      ok: true,
      detail: null,
    })
  })

  test("requires detail for other", () => {
    expect(parseReferralSourceDetail("other", "x")).toEqual({ ok: false })
    expect(parseReferralSourceDetail("other", "Hacker News")).toEqual({
      ok: true,
      detail: "Hacker News",
    })
  })
})

describe("formatReferralForSheet", () => {
  test("prefixes other with detail", () => {
    expect(formatReferralForSheet("other", "Podcast")).toBe("other: Podcast")
    expect(formatReferralForSheet("twitter", null)).toBe("twitter")
  })
})
