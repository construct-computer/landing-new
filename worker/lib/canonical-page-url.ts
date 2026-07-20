export function canonicalPageUrl(requestUrl: string, method: string): string | null {
  if (method !== "GET" && method !== "HEAD") return null

  const url = new URL(requestUrl)
  const wasBlogAlias = url.pathname === "/blogs" || url.pathname.startsWith("/blogs/")
  if (wasBlogAlias) {
    url.pathname = url.pathname.replace(/^\/blogs(?=\/|$)/, "/blog")
  }

  if (
    url.pathname === "/" ||
    url.pathname.endsWith("/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/.well-known/") ||
    /\/[^/]+\.[^/]+$/.test(url.pathname)
  ) {
    return wasBlogAlias ? url.toString() : null
  }

  url.pathname += "/"
  return url.toString()
}
