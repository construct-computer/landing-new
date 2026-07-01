const ALLOWED = new Set([
  "twitter",
  "reddit",
  "hackernews",
  "producthunt",
  "linkedin",
  "discord",
  "other",
])

export function parseReferralSource(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const v = raw.trim().toLowerCase()
  return ALLOWED.has(v) ? v : null
}

export function parseReferralSourceDetail(
  source: string,
  raw: unknown,
): { ok: true; detail: string | null } | { ok: false } {
  if (source !== "other") return { ok: true, detail: null }
  if (typeof raw !== "string") return { ok: false }
  const detail = raw.trim().slice(0, 120)
  if (detail.length < 2) return { ok: false }
  return { ok: true, detail }
}

export function formatReferralForSheet(
  source: string,
  detail: string | null,
): string {
  if (source === "other" && detail) return `other: ${detail}`
  return source
}
