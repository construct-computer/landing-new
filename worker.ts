import { handleBetaSignup, type BetaSignupEnv } from "./worker/routes/beta-signup"

interface Env extends BetaSignupEnv {
  ASSETS: Fetcher
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
      return handleBetaSignup(request, env)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
