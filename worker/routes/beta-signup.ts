import { clientIp } from "../lib/client-ip"
import { appendBetaSignupToSheet } from "../lib/google-sheet"
import { parseLandingReferrer } from "../lib/landing-referrer"
import {
  formatReferralForSheet,
  parseReferralSource,
  parseReferralSourceDetail,
} from "../lib/referral-source"
import {
  isSignupRateLimited,
  recordSignupAttempt,
} from "../lib/rate-limit"
import { validateEmailFull } from "../lib/validate-email"

export type BetaSignupEnv = {
  GOOGLE_SHEETS_WEBHOOK_URL?: string
  GOOGLE_SHEETS_WEBHOOK_SECRET?: string
}

type SignupBody = {
  email?: string
  source?: string
  referralSource?: string
  referralSourceDetail?: string
  landingReferrer?: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

export async function handleBetaSignup(
  request: Request,
  env: BetaSignupEnv,
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405)
  }

  let body: SignupBody
  try {
    body = (await request.json()) as SignupBody
  } catch {
    return json({ error: "invalid_json" }, 400)
  }

  const emailRaw = typeof body.email === "string" ? body.email : ""
  const source =
    typeof body.source === "string" ? body.source.slice(0, 64) : null
  const referralSource = parseReferralSource(body.referralSource)
  const landingReferrer = parseLandingReferrer(body.landingReferrer)

  const validated = await validateEmailFull(emailRaw)
  if (!validated.ok) {
    return json({ error: validated.error }, 400)
  }

  if (!referralSource) {
    return json({ error: "invalid_referral_source" }, 400)
  }

  const referralDetail = parseReferralSourceDetail(
    referralSource,
    body.referralSourceDetail,
  )
  if (!referralDetail.ok) {
    return json({ error: "invalid_referral_source" }, 400)
  }

  const ip = clientIp(request)

  if (ip && (await isSignupRateLimited(ip))) {
    return json({ error: "rate_limited" }, 400)
  }

  const ua = request.headers.get("User-Agent")?.slice(0, 512) ?? null
  const createdAt = new Date().toISOString()

  const sheet = await appendBetaSignupToSheet(
    {
      email: validated.email,
      source,
      createdAt,
      ip,
      referralSource: formatReferralForSheet(
        referralSource,
        referralDetail.detail,
      ),
      landingReferrer,
      userAgent: ua,
    },
    env,
  )

  if (!sheet.ok) {
    return json({ error: sheet.error }, 503)
  }

  if (ip) await recordSignupAttempt(ip)

  return json({ ok: true, duplicate: sheet.duplicate === true })
}
