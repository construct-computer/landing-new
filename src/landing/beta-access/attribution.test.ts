import { describe, expect, test } from "bun:test"
import { readLandingAttribution } from "./attribution"

describe("readLandingAttribution", () => {
  test("returns empty when unset", () => {
    expect(readLandingAttribution()).toEqual({ landingReferrer: "" })
  })
})
