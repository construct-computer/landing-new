import type { EmailValidationError } from "./validate-email"

export type EmailableVerifyBody = {
  state?: string
  reason?: string
}

/** Map Emailable verify response → our signup errors. */
export function interpretEmailableVerify(
  body: EmailableVerifyBody,
): { ok: true } | { ok: false; error: EmailValidationError } {
  const state = body.state?.toLowerCase()
  const reason = body.reason?.toLowerCase()

  if (state === "deliverable") return { ok: true }

  if (state === "undeliverable") {
    if (reason === "invalid_domain") return { ok: false, error: "no_mx" }
    return { ok: false, error: "mailbox_not_found" }
  }

  if (state === "risky" || state === "unknown") {
    return { ok: false, error: "mailbox_not_found" }
  }

  return { ok: false, error: "verification_unavailable" }
}

/**
 * SMTP mailbox check via Emailable (Workers cannot open port 25).
 * Set EMAILABLE_API_KEY — https://emailable.com
 */
export async function verifyMailboxEmailable(
  email: string,
  apiKey: string,
): Promise<{ ok: true } | { ok: false; error: EmailValidationError }> {
  const url = new URL("https://api.emailable.com/v1/verify")
  url.searchParams.set("email", email)
  url.searchParams.set("api_key", apiKey)

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    })
    if (res.status === 249 || !res.ok) {
      return { ok: false, error: "verification_unavailable" }
    }
    const body = (await res.json()) as EmailableVerifyBody
    return interpretEmailableVerify(body)
  } catch {
    return { ok: false, error: "verification_unavailable" }
  }
}
