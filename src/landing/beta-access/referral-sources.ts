export const REFERRAL_SOURCES = [
  { id: "twitter", label: "X / Twitter" },
  { id: "reddit", label: "Reddit" },
  { id: "hackernews", label: "Hacker News" },
  { id: "producthunt", label: "Product Hunt" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "discord", label: "Discord" },
  { id: "other", label: "Other" },
] as const

export type ReferralSourceId = (typeof REFERRAL_SOURCES)[number]["id"]

const REFERRAL_SOURCE_IDS = new Set<string>(REFERRAL_SOURCES.map((o) => o.id))

export function isReferralSourceId(value: string): value is ReferralSourceId {
  return REFERRAL_SOURCE_IDS.has(value)
}

export function isReferralSourceOtherValid(detail: string): boolean {
  const trimmed = detail.trim()
  return trimmed.length >= 2 && trimmed.length <= 120
}

export function formatReferralForSheet(
  source: ReferralSourceId,
  detail: string,
): string {
  if (source === "other") {
    return `other: ${detail.trim()}`
  }
  return source
}
