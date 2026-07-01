export type SheetSignupRow = {
  email: string
  source: string | null
  referralSource: string
  createdAt: string
  ipHash: string
  userAgent: string | null
}

export type SheetAppendResult =
  | { ok: true; duplicate?: boolean }
  | { ok: false; error: "sheet_not_configured" | "sheet_request_failed" }

export async function appendBetaSignupToSheet(
  row: SheetSignupRow,
  env: { GOOGLE_SHEETS_WEBHOOK_URL?: string; GOOGLE_SHEETS_WEBHOOK_SECRET?: string },
): Promise<SheetAppendResult> {
  const url = env.GOOGLE_SHEETS_WEBHOOK_URL?.trim()
  const secret = env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim()
  if (!url || !secret) {
    return { ok: false, error: "sheet_not_configured" }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      email: row.email,
      source: row.source,
      referral_source: row.referralSource,
      created_at: row.createdAt,
      ip_hash: row.ipHash,
      user_agent: row.userAgent,
    }),
  })

  if (!res.ok) {
    return { ok: false, error: "sheet_request_failed" }
  }

  try {
    const body = (await res.json()) as { ok?: boolean; duplicate?: boolean }
    if (body.ok !== true) {
      return { ok: false, error: "sheet_request_failed" }
    }
    return { ok: true, duplicate: body.duplicate === true }
  } catch {
    return { ok: false, error: "sheet_request_failed" }
  }
}
