import { isPostHogEnabled, posthog } from "@/lib/posthog-client"

export function identifyBetaVisitor(
  email: string,
  source?: string,
  referralSource?: string,
  referralSourceDetail?: string,
): void {
  if (!isPostHogEnabled() || typeof window === "undefined") return
  const normalized = email.toLowerCase().trim()
  posthog.identify(normalized, {
    email: normalized,
    identification_stage: "waitlist",
    ...(source ? { beta_signup_source: source } : {}),
    ...(referralSource ? { beta_referral_source: referralSource } : {}),
    ...(referralSourceDetail
      ? { beta_referral_source_detail: referralSourceDetail }
      : {}),
  })
}

export function trackBetaSignupSubmitted(
  source?: string,
  referralSource?: string,
): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_signup_submitted", {
    source: source ?? "unknown",
    ...(referralSource ? { referral_source: referralSource } : {}),
  })
}

export function trackBetaSignupGranted(
  source?: string,
  referralSource?: string,
): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_signup_granted", {
    source: source ?? "unknown",
    ...(referralSource ? { referral_source: referralSource } : {}),
  })
}

export function trackBetaOpened(): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_opened")
}
