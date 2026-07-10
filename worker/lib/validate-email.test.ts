import { describe, expect, test } from "bun:test"
import {
  isDisposableEmail,
  isValidEmailSyntax,
  normalizeEmail,
  validateEmailLocally,
  validateEmailFull,
  hasValidMxAnswers,
} from "./validate-email"

describe("normalizeEmail", () => {
  test("trims and lowercases", () => {
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com")
  })
})

describe("isValidEmailSyntax", () => {
  test("accepts normal addresses", () => {
    expect(isValidEmailSyntax("user@company.com")).toBe(true)
    expect(isValidEmailSyntax("a.b+c@sub.domain.co")).toBe(true)
  })

  test("rejects malformed", () => {
    expect(isValidEmailSyntax("not-an-email")).toBe(false)
    expect(isValidEmailSyntax("@nodomain.com")).toBe(false)
    expect(isValidEmailSyntax("a@")).toBe(false)
    expect(isValidEmailSyntax("x@y.com")).toBe(false)
  })
})

describe("isDisposableEmail", () => {
  test("flags known disposable domains", () => {
    expect(isDisposableEmail("x@mailinator.com")).toBe(true)
    expect(isDisposableEmail("x@yopmail.com")).toBe(true)
  })

  test("allows real domains", () => {
    expect(isDisposableEmail("x@gmail.com")).toBe(false)
  })
})

describe("validateEmailLocally", () => {
  test("returns normalized email on success", () => {
    const r = validateEmailLocally("User@Gmail.com")
    expect(r).toEqual({ ok: true, email: "user@gmail.com" })
  })

  test("rejects disposable", () => {
    const r = validateEmailLocally("ab@mailinator.com")
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toBe("disposable_email")
  })

  test("rejects invalid syntax", () => {
    const r = validateEmailLocally("bad")
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toBe("invalid_email")
  })
})

describe("validateEmailFull", () => {
  test("accepts any syntactically valid address", async () => {
    const r = await validateEmailFull("user@thisdomaindoesnotexist99999.invalid")
    expect(r).toEqual({ ok: true, email: "user@thisdomaindoesnotexist99999.invalid" })
  })

  test("rejects invalid syntax", async () => {
    const r = await validateEmailFull("not-an-email")
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toBe("invalid_email")
  })
})

describe("hasValidMxAnswers", () => {
  test("accepts real MX", () => {
    expect(
      hasValidMxAnswers([{ type: 15, data: "10 aspmx.l.google.com." }]),
    ).toBe(true)
  })

  test("rejects empty and null MX", () => {
    expect(hasValidMxAnswers([])).toBe(false)
    expect(hasValidMxAnswers(undefined)).toBe(false)
    expect(hasValidMxAnswers([{ type: 15, data: "0 ." }])).toBe(false)
  })

  test("ignores non-MX answers", () => {
    expect(hasValidMxAnswers([{ type: 1, data: "13.223.25.84" }])).toBe(false)
  })
})
