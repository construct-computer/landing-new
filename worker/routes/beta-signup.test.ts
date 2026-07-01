import { describe, expect, test } from "bun:test"
import { hashIp } from "../routes/beta-signup"

describe("hashIp", () => {
  test("returns stable 32-char hex prefix", async () => {
    const a = await hashIp("203.0.113.1")
    const b = await hashIp("203.0.113.1")
    expect(a).toBe(b)
    expect(a).toHaveLength(32)
    expect(a).toMatch(/^[0-9a-f]+$/)
  })
})
