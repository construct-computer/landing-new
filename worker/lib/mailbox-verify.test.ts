import { describe, expect, test } from "bun:test"
import {
  interpretEmailableVerify,
} from "./mailbox-verify"

describe("interpretEmailableVerify", () => {
  test("accepts deliverable", () => {
    expect(
      interpretEmailableVerify({ state: "deliverable", reason: "accepted_email" }),
    ).toEqual({ ok: true })
  })

  test("maps invalid domain to no_mx", () => {
    expect(
      interpretEmailableVerify({ state: "undeliverable", reason: "invalid_domain" }),
    ).toEqual({ ok: false, error: "no_mx" })
  })

  test("maps rejected mailbox to mailbox_not_found", () => {
    expect(
      interpretEmailableVerify({ state: "undeliverable", reason: "rejected_email" }),
    ).toEqual({ ok: false, error: "mailbox_not_found" })
  })

  test("rejects risky and unknown", () => {
    expect(interpretEmailableVerify({ state: "risky", reason: "accept_all" })).toEqual({
      ok: false,
      error: "mailbox_not_found",
    })
    expect(interpretEmailableVerify({ state: "unknown", reason: "timeout" })).toEqual({
      ok: false,
      error: "mailbox_not_found",
    })
  })
})
