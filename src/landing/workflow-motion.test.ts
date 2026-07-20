import { describe, expect, test } from "bun:test"
import { getHeldWorkflowPosition } from "./workflow-motion"

describe("getHeldWorkflowPosition", () => {
  test("holds endpoints and crosses once through the middle", () => {
    expect(getHeldWorkflowPosition(0, 2)).toBe(0)
    expect(getHeldWorkflowPosition(0.1, 2)).toBe(0)
    expect(getHeldWorkflowPosition(0.5, 2)).toBeCloseTo(0.5)
    expect(getHeldWorkflowPosition(0.9, 2)).toBe(1)
    expect(getHeldWorkflowPosition(1, 2)).toBe(1)
  })
})
