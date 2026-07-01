import { describe, expect, test } from "bun:test"
import { clientIp, preferClientIp } from "./client-ip"

describe("preferClientIp", () => {
  test("returns first IPv4", () => {
    expect(preferClientIp(["2001:db8::1", "203.0.113.5"])).toBe("203.0.113.5")
  })

  test("prefers IPv4 over IPv6 in order", () => {
    expect(preferClientIp(["203.0.113.5", "2001:db8::1"])).toBe("203.0.113.5")
  })

  test("falls back to IPv6 when no IPv4", () => {
    expect(preferClientIp(["2001:db8::1", "2001:db8::2"])).toBe("2001:db8::1")
  })

  test("unwraps IPv4-mapped IPv6", () => {
    expect(preferClientIp(["::ffff:198.51.100.10"])).toBe("198.51.100.10")
  })

  test("ignores junk", () => {
    expect(preferClientIp(["", "not-an-ip", "203.0.113.1"])).toBe("203.0.113.1")
  })
})

describe("clientIp", () => {
  test("collects CF-Connecting-IP and X-Forwarded-For", () => {
    const req = new Request("https://example.com", {
      headers: {
        "CF-Connecting-IP": "2001:db8::9",
        "X-Forwarded-For": "203.0.113.7, 10.0.0.1",
      },
    })
    expect(clientIp(req)).toBe("203.0.113.7")
  })

  test("uses CF IPv4 when present", () => {
    const req = new Request("https://example.com", {
      headers: { "CF-Connecting-IP": "203.0.113.2" },
    })
    expect(clientIp(req)).toBe("203.0.113.2")
  })
})
