export function parseLandingReferrer(raw: unknown): string {
  if (typeof raw !== "string") return ""
  const trimmed = raw.trim().toLowerCase().slice(0, 253)
  if (!trimmed) return ""
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(trimmed)) {
    return ""
  }
  return trimmed
}
