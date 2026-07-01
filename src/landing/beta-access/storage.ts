const STORAGE_KEY = "construct_beta_access_v1"

export type BetaAccessGrant = {
  email: string
  grantedAt: number
}

export function readBetaAccessGrant(): BetaAccessGrant | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BetaAccessGrant
    if (
      typeof parsed.email === "string" &&
      parsed.email.includes("@") &&
      typeof parsed.grantedAt === "number"
    ) {
      return { email: parsed.email.toLowerCase().trim(), grantedAt: parsed.grantedAt }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function writeBetaAccessGrant(email: string): void {
  const grant: BetaAccessGrant = {
    email: email.toLowerCase().trim(),
    grantedAt: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grant))
}

export function normalizeEmailInput(raw: string): string {
  return raw.trim().toLowerCase()
}

/** Client-side syntax check before API call. */
export function isPlausibleEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}
