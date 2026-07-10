export type BetaSignupError =
  | "invalid_email"
  | "disposable_email"
  | "no_mx"
  | "mailbox_not_found"
  | "verification_unavailable"
  | "invalid_referral_source"
  | "rate_limited"
  | "sheet_not_configured"
  | "sheet_request_failed"
  | "network"

export function betaSignupErrorMessage(error: BetaSignupError): string {
  switch (error) {
    case "invalid_email":
      return "Please enter a valid email address."
    case "disposable_email":
      return "Please use a non-disposable email address."
    case "no_mx":
      return "That email domain doesn't look valid."
    case "mailbox_not_found":
      return "We couldn't verify that email address. Check for typos or use your work email."
    case "verification_unavailable":
      return "Email verification is temporarily unavailable. Please try again in a moment."
    case "invalid_referral_source":
      return "Please tell us where you heard about Construct."
    case "rate_limited":
      return "Too many attempts. Please try again in a little while."
    case "sheet_not_configured":
    case "sheet_request_failed":
      return "Signup is temporarily unavailable. Please try again soon."
    case "network":
      return "Something went wrong. Please try again."
  }
}

export async function submitBetaSignup(params: {
  email: string
  source?: string
  referralSource: string
  referralSourceDetail?: string
  landingReferrer?: string
}): Promise<{ ok: true } | { ok: false; error: BetaSignupError }> {
  try {
    const res = await fetch("/api/beta-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.email,
        source: params.source ?? "unknown",
        referralSource: params.referralSource,
        referralSourceDetail: params.referralSourceDetail ?? "",
        landingReferrer: params.landingReferrer ?? "",
      }),
    })

    if (res.ok) return { ok: true }

    let code: string | undefined
    try {
      const body = (await res.json()) as { error?: string }
      code = body.error
    } catch {
      /* */
    }

    if (code === "invalid_email") return { ok: false, error: "invalid_email" }
    if (code === "disposable_email") return { ok: false, error: "disposable_email" }
    if (code === "no_mx") return { ok: false, error: "no_mx" }
    if (code === "mailbox_not_found") {
      return { ok: false, error: "mailbox_not_found" }
    }
    if (code === "verification_unavailable") {
      return { ok: false, error: "verification_unavailable" }
    }
    if (code === "invalid_referral_source") {
      return { ok: false, error: "invalid_referral_source" }
    }
    if (code === "rate_limited") return { ok: false, error: "rate_limited" }
    if (code === "sheet_not_configured") {
      return { ok: false, error: "sheet_not_configured" }
    }
    if (code === "sheet_request_failed") {
      return { ok: false, error: "sheet_request_failed" }
    }
    return { ok: false, error: "network" }
  } catch {
    return { ok: false, error: "network" }
  }
}
