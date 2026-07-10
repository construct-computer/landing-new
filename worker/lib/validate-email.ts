import disposableDomains from "../data/disposable-domains.txt" with { type: "text" }

const DISPOSABLE = new Set(
  disposableDomains
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 0 && !line.startsWith("#")),
)

/** RFC 5322–ish — good enough for marketing gate, not full RFC compliance. */
const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i

export type EmailValidationError =
  | "invalid_email"
  | "disposable_email"
  | "no_mx"
  | "mailbox_not_found"
  | "verification_unavailable"

export type EmailValidationEnv = {
  EMAILABLE_API_KEY?: string
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidEmailSyntax(email: string): boolean {
  if (!email || email.length > 254) return false
  if (!EMAIL_RE.test(email)) return false
  const [local] = email.split("@")
  if (!local || local.length < 2) return false
  return true
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]
  if (!domain) return true
  return DISPOSABLE.has(domain)
}

export function validateEmailLocally(
  email: string,
): { ok: true; email: string } | { ok: false; error: EmailValidationError } {
  const normalized = normalizeEmail(email)
  if (!isValidEmailSyntax(normalized)) {
    return { ok: false, error: "invalid_email" }
  }
  if (isDisposableEmail(normalized)) {
    return { ok: false, error: "disposable_email" }
  }
  return { ok: true, email: normalized }
}

type DnsAnswer = { type?: number; data?: string }

/** True when Answer contains at least one non-null MX (RFC 7505 `.` = no mail). */
export function hasValidMxAnswers(answers: DnsAnswer[] | undefined): boolean {
  const mx = answers?.filter((a) => a.type === 15) ?? []
  if (mx.length === 0) return false
  return mx.some((a) => {
    const parts = (a.data ?? "").trim().split(/\s+/)
    const exchange = (parts[parts.length - 1] ?? "").replace(/\.$/, "").toLowerCase()
    return exchange.length > 0 && exchange !== "."
  })
}

/** Require MX records — A-only domains are not valid mail hosts. */
export async function domainHasMailCapability(domain: string): Promise<boolean> {
  const url = new URL("https://cloudflare-dns.com/dns-query")
  url.searchParams.set("name", domain)
  url.searchParams.set("type", "MX")

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/dns-json" },
  })
  if (!res.ok) return false

  const body = (await res.json()) as { Answer?: DnsAnswer[]; Status?: number }
  if (body.Status !== 0) return false
  return hasValidMxAnswers(body.Answer)
}

export async function validateEmailFull(
  raw: string,
  _env?: EmailValidationEnv,
): Promise<{ ok: true; email: string } | { ok: false; error: EmailValidationError }> {
  const normalized = normalizeEmail(raw)
  if (!isValidEmailSyntax(normalized)) {
    return { ok: false, error: "invalid_email" }
  }
  return { ok: true, email: normalized }
}
