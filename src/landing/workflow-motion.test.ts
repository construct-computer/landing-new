import { describe, expect, test } from "bun:test"
import { getHeldWorkflowPosition, getSoftPinOffset } from "./workflow-motion"

describe("getHeldWorkflowPosition", () => {
  test("holds endpoints and crosses once through the middle", () => {
    expect(getHeldWorkflowPosition(0, 2)).toBe(0)
    expect(getHeldWorkflowPosition(0.1, 2)).toBe(0)
    expect(getHeldWorkflowPosition(0.5, 2)).toBeCloseTo(0.5)
    expect(getHeldWorkflowPosition(0.9, 2)).toBe(1)
    expect(getHeldWorkflowPosition(1, 2)).toBe(1)
  })
})

describe("getSoftPinOffset", () => {
  test("eases into and out of the pinned position", () => {
    expect(getSoftPinOffset(0, 1000, 60, 120)).toBe(0)
    expect(getSoftPinOffset(0.12, 1000, 60, 120)).toBe(-60)
    expect(getSoftPinOffset(0.5, 1000, 60, 120)).toBe(-60)
    expect(getSoftPinOffset(0.88, 1000, 60, 120)).toBe(-60)
    expect(getSoftPinOffset(1, 1000, 60, 120)).toBe(-120)
  })
})
