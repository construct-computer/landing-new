/**
 * This file is the entry point for the React app. It hydrates (in prod) the
 * pre-rendered HTML produced by the SSG loop in `build.ts`. In dev (with
 * HMR) we fall back to `createRoot` because the dev server always serves the
 * un-rendered `index.html` shell.
 */

import { StrictMode } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import { App } from "./App";
import {
  initPostHog,
  isPostHogEnabled,
  posthog,
} from "./lib/posthog-client";
import "./index.css"

initPostHog();

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    {isPostHogEnabled() ? (
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);

if (import.meta.hot) {
  // Dev: the HTML shell has no server-rendered tree, so mount fresh and
  // persist the root across HMR updates.
  const root: Root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // Prod: SSG has pre-rendered the tree inside `#root`. If for any reason
  // it's empty (unexpected route, degraded build), fall back to a fresh
  // render so the app still mounts.
  if (elem.firstChild) {
    hydrateRoot(elem, app);
  } else {
    createRoot(elem).render(app);
  }
}
