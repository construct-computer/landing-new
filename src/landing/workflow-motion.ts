export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

export function smoothStep(value: number) {
  const x = clamp(value)
  return x * x * (3 - 2 * x)
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

/** Hold each workflow state briefly, then crossfade through the middle. */
export function getHeldWorkflowPosition(progress: number, demoCount: number) {
  const transitionCount = demoCount - 1
  if (transitionCount <= 0) return 0
  if (progress >= 1) return transitionCount

  const scaled = clamp(progress) * transitionCount
  const segment = Math.min(Math.floor(scaled), transitionCount - 1)
  const local = scaled - segment
  return segment + smoothStep((local - 0.18) / 0.64)
}

/** Continue the section's travel briefly at each pin edge instead of snapping. */
export function getSoftPinOffset(
  progress: number,
  scrollDistance: number,
  pinOffset: number,
  edgeDistance = pinOffset * 2,
) {
  if (progress <= 0 || scrollDistance <= 0) return 0

  const edge = Math.min(edgeDistance, scrollDistance / 2)
  const scrolled = clamp(progress) * scrollDistance
  const entering = clamp(scrolled / edge)
  const leaving = clamp((scrolled - (scrollDistance - edge)) / edge)
  const easeOut = 1 - (1 - entering) ** 2
  const easeIn = leaving ** 2

  return -pinOffset * (easeOut + easeIn)
}
