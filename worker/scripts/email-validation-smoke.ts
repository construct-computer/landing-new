/**
 * Live smoke test for beta signup email validation.
 * Run: bun worker/scripts/email-validation-smoke.ts
 * With mailbox checks: EMAILABLE_API_KEY=xxx bun worker/scripts/email-validation-smoke.ts
 */
import { handleBetaSignup } from "../routes/beta-signup"
import { validateEmailFull } from "../lib/validate-email"

type Case = {
  email: string
  label: string
  expectMxOnly?: "pass" | "fail"
  expectFull?: "pass" | "fail"
}

const CASES: Case[] = [
  { email: "not-an-email", label: "bad syntax", expectMxOnly: "fail", expectFull: "fail" },
  { email: "a@b.com", label: "local part too short", expectMxOnly: "fail", expectFull: "fail" },
  { email: "test@mailinator.com", label: "disposable", expectMxOnly: "fail", expectFull: "fail" },
  { email: "ankush4singh@asadad.com", label: "A-only domain (no MX)", expectMxOnly: "fail", expectFull: "fail" },
  {
    email: "user@thisdomaindoesnotexist99999.invalid",
    label: "NXDOMAIN",
    expectMxOnly: "fail",
    expectFull: "fail",
  },
  { email: "support@gmail.com", label: "real provider role address", expectMxOnly: "pass", expectFull: "pass" },
  {
    email: "definitely-not-a-real-user-8f3k2j@gmail.com",
    label: "fake mailbox @ gmail",
    expectMxOnly: "pass",
    expectFull: "fail",
  },
  {
    email: "definitely-not-a-real-user-8f3k2j@construct.computer",
    label: "fake mailbox @ construct",
    expectMxOnly: "pass",
    expectFull: "fail",
  },
  // Emailable documented sandbox-style addresses (if API key set)
  { email: "deliverable@example.com", label: "emailable test deliverable", expectFull: "pass" },
  { email: "undeliverable@example.com", label: "emailable test undeliverable", expectFull: "fail" },
]

function outcome(r: Awaited<ReturnType<typeof validateEmailFull>>): string {
  return r.ok ? "PASS" : r.error
}

async function main() {
  const apiKey = process.env.EMAILABLE_API_KEY?.trim()
  console.log(`\nEmail validation smoke test`)
  console.log(`EMAILABLE_API_KEY: ${apiKey ? "set (full SMTP checks)" : "not set (MX-only)"}\n`)

  console.log("--- MX-only (no Emailable key) ---")
  console.log("email | label | result | expected")
  for (const c of CASES) {
    if (!c.expectMxOnly && c.expectFull) continue
    const r = await validateEmailFull(c.email)
    const result = outcome(r)
    const expected = c.expectMxOnly ?? "?"
    const ok = expected === "pass" ? r.ok : !r.ok
    console.log(
      `${c.email} | ${c.label} | ${result} | ${expected} ${ok ? "✓" : "✗ UNEXPECTED"}`,
    )
  }

  if (apiKey) {
    console.log("\n--- Full validation (MX + Emailable) ---")
    console.log("email | label | result | emailable state | expected")
    for (const c of CASES) {
      if (!c.expectFull) continue
      const r = await validateEmailFull(c.email, { EMAILABLE_API_KEY: apiKey })
      const raw = await fetch(
        `https://api.emailable.com/v1/verify?email=${encodeURIComponent(c.email)}&api_key=${apiKey}`,
        { headers: { Accept: "application/json" } },
      ).then((res) => res.json() as Promise<{ state?: string; reason?: string }>)
      const result = outcome(r)
      const expected = c.expectFull
      const ok = expected === "pass" ? r.ok : !r.ok
      console.log(
        `${c.email} | ${c.label} | ${result} | ${raw.state}/${raw.reason ?? ""} | ${expected} ${ok ? "✓" : "✗ UNEXPECTED"}`,
      )
    }
  } else {
    console.log("\n--- Skipping full SMTP tests (set EMAILABLE_API_KEY) ---")
    console.log("Spot-checking fake@gmail via direct Emailable call skipped.")
  }

  console.log("--- HTTP handler (stops at Sheets if validation passes) ---")
  const env = { EMAILABLE_API_KEY: apiKey }
  for (const c of CASES) {
    const req = new Request("https://construct.computer/api/beta-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: c.email, referralSource: "hackernews" }),
    })
    const res = await handleBetaSignup(req, env)
    const body = (await res.json()) as { error?: string; ok?: boolean }
    const expectFail = c.expectMxOnly === "fail" || (apiKey && c.expectFull === "fail")
    let pass: boolean
    let note: string
    if (expectFail) {
      pass = res.status === 400 && typeof body.error === "string"
      note = body.error ?? "?"
    } else if (apiKey && c.expectFull === "pass") {
      pass = res.status === 503 && body.error === "sheet_not_configured"
      note = "validated → sheets not_configured (expected in dev)"
    } else {
      // MX-only: fake mailboxes pass validation then hit sheets
      pass = res.status === 503 && body.error === "sheet_not_configured"
      note =
        c.expectFull === "fail" && !apiKey
          ? "validated (MX-only gap) → sheets not_configured"
          : "validated → sheets not_configured"
    }
    console.log(`${c.email} | ${c.label} | ${res.status} ${note} ${pass ? "✓" : "✗"}`)
  }

  console.log("")
}

await main()
