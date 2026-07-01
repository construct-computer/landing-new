export type BetaSignupError =
  | "invalid_email"
  | "disposable_email"
  | "no_mx"
  | "rate_limited"
  | "bot_check_failed"
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
    case "rate_limited":
      return "Too many attempts. Please try again in a little while."
    case "bot_check_failed":
      return "Verification failed. Please refresh and try again."
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
  turnstileToken?: string
}): Promise<{ ok: true } | { ok: false; error: BetaSignupError }> {
  try {
    const res = await fetch("/api/beta-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.email,
        source: params.source ?? "unknown",
        turnstileToken: params.turnstileToken ?? "",
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
    if (code === "rate_limited") return { ok: false, error: "rate_limited" }
    if (code === "bot_check_failed") return { ok: false, error: "bot_check_failed" }
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
