// Donot remove react import
import { serve } from "bun";
import index from "./index.html";

/**
 * Dev server. In prod the site is served as pre-rendered static files
 * produced by `build.ts`, so this is really just a convenience wrapper
 * for `bun dev`. Known routes map to the SPA shell; everything else
 * still loads the shell (HTTP 200) so the client router can render the
 * 404 page. Production returns `dist/404.html` with a real 404 status.
 */
const server = serve({
  routes: {
    "/": index,
    "/about": index,
    "/careers": index,
    "/support": index,
    "/privacy": index,
    "/terms": index,

    // Fallback: serve the SPA shell for any other path.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
