/**
 * Live smoke test for beta signup email validation (format-only).
 * Run: bun worker/scripts/email-validation-smoke.ts
 */
import { handleBetaSignup } from "../routes/beta-signup"
import { validateEmailFull } from "../lib/validate-email"

type Case = {
  email: string
  label: string
  expect: "pass" | "fail"
}

const CASES: Case[] = [
  { email: "not-an-email", label: "bad syntax", expect: "fail" },
  { email: "a@b.com", label: "local part too short", expect: "fail" },
  { email: "test@mailinator.com", label: "disposable domain", expect: "pass" },
  { email: "ankush4singh@asadad.com", label: "A-only domain (no MX)", expect: "pass" },
  {
    email: "user@thisdomaindoesnotexist99999.invalid",
    label: "NXDOMAIN",
    expect: "pass",
  },
  { email: "support@gmail.com", label: "real provider", expect: "pass" },
  {
    email: "definitely-not-a-real-user-8f3k2j@gmail.com",
    label: "fake mailbox @ gmail",
    expect: "pass",
  },
]

function outcome(r: Awaited<ReturnType<typeof validateEmailFull>>): string {
  return r.ok ? "PASS" : r.error
}

async function main() {
  console.log("\nEmail validation smoke test (format-only)\n")

  console.log("--- validateEmailFull ---")
  console.log("email | label | result | expected")
  for (const c of CASES) {
    const r = await validateEmailFull(c.email)
    const result = outcome(r)
    const ok = c.expect === "pass" ? r.ok : !r.ok
    console.log(
      `${c.email} | ${c.label} | ${result} | ${c.expect} ${ok ? "✓" : "✗ UNEXPECTED"}`,
    )
  }

  console.log("\n--- HTTP handler (stops at Sheets if validation passes) ---")
  for (const c of CASES) {
    const req = new Request("https://construct.computer/api/beta-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: c.email, referralSource: "hackernews" }),
    })
    const res = await handleBetaSignup(req, {})
    const body = (await res.json()) as { error?: string; ok?: boolean }
    let pass: boolean
    let note: string
    if (c.expect === "fail") {
      pass = res.status === 400 && typeof body.error === "string"
      note = body.error ?? "?"
    } else {
      pass = res.status === 503 && body.error === "sheet_not_configured"
      note = "validated → sheets not_configured (expected in dev)"
    }
    console.log(`${c.email} | ${c.label} | ${res.status} ${note} ${pass ? "✓" : "✗"}`)
  }

  console.log("")
}

await main()
