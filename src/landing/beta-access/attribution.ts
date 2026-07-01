const STORAGE_KEY = "construct_landing_attribution_v1"

export type LandingAttribution = {
  landingReferrer: string
}

/** First-touch referrer for this tab session (document.referrer hostname). */
export function captureLandingAttribution(): void {
  if (typeof window === "undefined") return
  if (sessionStorage.getItem(STORAGE_KEY)) return

  let landingReferrer = ""
  if (document.referrer) {
    try {
      landingReferrer = new URL(document.referrer).hostname.toLowerCase()
    } catch {
      landingReferrer = ""
    }
  }

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ landingReferrer } satisfies LandingAttribution),
  )
}

export function readLandingAttribution(): LandingAttribution {
  if (typeof window === "undefined") return { landingReferrer: "" }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { landingReferrer: "" }
    const parsed = JSON.parse(raw) as LandingAttribution
    return {
      landingReferrer:
        typeof parsed.landingReferrer === "string" ? parsed.landingReferrer : "",
    }
  } catch {
    return { landingReferrer: "" }
  }
}
