const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/
const IPV4_MAPPED_RE = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i

function isIpv4(ip: string): boolean {
  if (!IPV4_RE.test(ip)) return false
  return ip.split(".").every((octet) => {
    const n = Number(octet)
    return Number.isInteger(n) && n >= 0 && n <= 255
  })
}

/** Split mapped v6 (::ffff:1.2.3.4) into v4 when present. */
function classifyIp(raw: string): { v4?: string; v6?: string } {
  const ip = raw.trim()
  if (!ip) return {}

  const mapped = IPV4_MAPPED_RE.exec(ip)
  if (mapped?.[1] && isIpv4(mapped[1])) return { v4: mapped[1] }

  if (isIpv4(ip)) return { v4: ip }
  if (ip.includes(":")) return { v6: ip }
  return {}
}

/** Prefer IPv4 over IPv6 across all candidate addresses. */
export function preferClientIp(candidates: string[]): string {
  let v6 = ""
  for (const candidate of candidates) {
    const { v4, v6: v6Candidate } = classifyIp(candidate)
    if (v4) return v4
    if (v6Candidate && !v6) v6 = v6Candidate
  }
  return v6
}

export function clientIp(request: Request): string {
  const candidates: string[] = []
  const cf = request.headers.get("CF-Connecting-IP")?.trim()
  if (cf) candidates.push(cf)

  const xff = request.headers.get("X-Forwarded-For")
  if (xff) {
    for (const part of xff.split(",")) {
      const ip = part.trim()
      if (ip) candidates.push(ip)
    }
  }

  return preferClientIp(candidates)
}
