import { isPostHogEnabled, posthog } from "@/lib/posthog-client"

export function identifyBetaVisitor(email: string, source?: string): void {
  if (!isPostHogEnabled() || typeof window === "undefined") return
  const normalized = email.toLowerCase().trim()
  posthog.identify(normalized, {
    email: normalized,
    identification_stage: "waitlist",
    ...(source ? { beta_signup_source: source } : {}),
  })
}

export function trackBetaSignupSubmitted(source?: string): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_signup_submitted", { source: source ?? "unknown" })
}

export function trackBetaSignupGranted(source?: string): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_signup_granted", { source: source ?? "unknown" })
}

export function trackBetaOpened(): void {
  if (!isPostHogEnabled()) return
  posthog.capture("beta_opened")
}
