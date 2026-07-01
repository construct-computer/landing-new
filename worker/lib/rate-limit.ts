/** ponytail: per-IP cap via Cache API; not global across all PoPs */
const RATE_LIMIT_PREFIX = "beta-signup:"
const RATE_LIMIT_PER_HOUR = 5
const HOUR_SECONDS = 3600

export async function isSignupRateLimited(ipHash: string): Promise<boolean> {
  const cache = caches.default
  const key = new Request(`https://rate-limit.local/${RATE_LIMIT_PREFIX}${ipHash}`)
  const hit = await cache.match(key)
  if (!hit) return false
  const count = Number(await hit.text())
  return Number.isFinite(count) && count >= RATE_LIMIT_PER_HOUR
}

export async function recordSignupAttempt(ipHash: string): Promise<void> {
  const cache = caches.default
  const key = new Request(`https://rate-limit.local/${RATE_LIMIT_PREFIX}${ipHash}`)
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
