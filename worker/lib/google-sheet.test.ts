import { describe, expect, test } from "bun:test"
import { appendBetaSignupToSheet } from "./google-sheet"

describe("appendBetaSignupToSheet", () => {
  test("returns not_configured when secrets missing", async () => {
    const result = await appendBetaSignupToSheet(
      {
        email: "user@example.com",
        source: "hero",
        createdAt: "2026-01-01T00:00:00.000Z",
        ip: "203.0.113.1",
        referralSource: "twitter",
        landingReferrer: "news.ycombinator.com",
        userAgent: "test",
      },
      {},
    )
    expect(result).toEqual({ ok: false, error: "sheet_not_configured" })
  })
})
