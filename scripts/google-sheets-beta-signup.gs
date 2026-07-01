/**
 * Google Apps Script for beta waitlist → Google Sheet
 *
 * Sheet: https://docs.google.com/spreadsheets/d/SHEET_ID
 *
 * Setup:
 * 1. Extensions → Apps Script → paste this file
 * 2. Project Settings → Script properties → add WEBHOOK_SECRET (random string)
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL → wrangler secret put GOOGLE_SHEETS_WEBHOOK_URL
 * 5. Same secret string → wrangler secret put GOOGLE_SHEETS_WEBHOOK_SECRET
 */

const SHEET_ID = "SHEET ID HERE"

function doPost(e) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET")
    if (!secret) {
      return json({ ok: false, error: "not_configured" }, 500)
    }

    const body = JSON.parse(e.postData.contents)
    if (body.secret !== secret) {
      return json({ ok: false, error: "unauthorized" }, 401)
    }

    const email = String(body.email || "").trim().toLowerCase()
    if (!email || !email.includes("@")) {
      return json({ ok: false, error: "invalid_email" }, 400)
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
    ensureHeaderRow(sheet)

    if (emailExists(sheet, email)) {
      return json({ ok: true, duplicate: true })
    }

    sheet.appendRow([
      email,
      body.source || "",
      body.created_at || new Date().toISOString(),
      body.ip_hash || "",
      body.user_agent || "",
    ])

    return json({ ok: true, duplicate: false })
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500)
  }
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() > 0) return
  sheet.appendRow(["email", "source", "created_at", "ip_hash", "user_agent"])
}

function emailExists(sheet, email) {
  const values = sheet.getRange("A:A").getValues()
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "").toLowerCase() === email) return true
  }
  return false
}

function json(payload, status) {
  const out = ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
  // Apps Script web apps can't set HTTP status codes; encode in body instead.
  if (status && status >= 400) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: payload.error || "error" }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
  return out
}
