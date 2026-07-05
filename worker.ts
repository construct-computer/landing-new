import { handleBetaSignup, type BetaSignupEnv } from "./worker/routes/beta-signup"

interface Env extends BetaSignupEnv {
  ASSETS: Fetcher
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Thin edge wrapper around static assets: force HTTPS (and www → apex) before
 * delegating to the pre-rendered `dist/` bundle. Asset routing (trailing
 * slashes, 404.html) is handled by the ASSETS binding config in wrangler.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const forwardedProto = request.headers.get("X-Forwarded-Proto")

    if (url.protocol === "http:" || forwardedProto === "http") {
      url.protocol = "https:"
      return Response.redirect(url.toString(), 301)
    }

    if (url.hostname === "www.construct.computer") {
      url.hostname = "construct.computer"
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === "/api/beta-signup") {
      return withSecurityHeaders(await handleBetaSignup(request, env))
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request))
  },
} satisfies ExportedHandler<Env>
