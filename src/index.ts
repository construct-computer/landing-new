// Donot remove react import
import { serve } from "bun";
import index from "./index.html";

/**
 * Dev server. In prod the site is served as pre-rendered static files
 * produced by `build.ts`, so this is really just a convenience wrapper
 * for `bun dev`. We map every known client-side route to the same
 * `index.html` so direct-hit URLs (e.g. `/about`) resolve instead of
 * 404-ing.
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

    "/api/hello": {
      async GET() {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT() {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
