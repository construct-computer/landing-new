/** ponytail: per-IP cap via Cache API; not global across all PoPs */
const RATE_LIMIT_PREFIX = "beta-signup:"
const RATE_LIMIT_PER_HOUR = 5
const HOUR_SECONDS = 3600

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip)
  const buf = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32)
}

export async function isSignupRateLimited(ip: string): Promise<boolean> {
  const ipKey = await hashIp(ip)
  const cache = caches.default
  const key = new Request(`https://rate-limit.local/${RATE_LIMIT_PREFIX}${ipKey}`)
  const hit = await cache.match(key)
  if (!hit) return false
  const count = Number(await hit.text())
  return Number.isFinite(count) && count >= RATE_LIMIT_PER_HOUR
}

export async function recordSignupAttempt(ip: string): Promise<void> {
  const ipKey = await hashIp(ip)
  const cache = caches.default
  const key = new Request(`https://rate-limit.local/${RATE_LIMIT_PREFIX}${ipKey}`)
  const hit = await cache.match(key)
  const count = hit ? Number(await hit.text()) + 1 : 1
  await cache.put(
    key,
    new Response(String(count), {
      headers: {
        "Cache-Control": `max-age=${HOUR_SECONDS}`,
      },
    }),
  )
}
