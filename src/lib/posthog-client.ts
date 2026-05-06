import posthog from "posthog-js"
import type { PostHogConfig } from "posthog-js"

/** Reverse proxy to PostHog EU (ingest + assets); see project plan. */
export const DEFAULT_POSTHOG_API_HOST = "https://x.construct.computer"

let didInit = false

function readEnvString(value: string | undefined): string {
  return (value ?? "").trim()
}

/**
 * Project API key (`phc_…`). Inlined at build time via `build.ts` `define`;
 * in dev, loaded from the environment.
 */
export function getPostHogKey(): string {
  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return readEnvString(process.env.POSTHOG_KEY)
  }
  return ""
}

/**
 * Ingestion host. Defaults to the first-party proxy; override to hit EU
 * directly (e.g. `https://eu.i.posthog.com`) when debugging the proxy.
 */
export function getPostHogApiHost(): string {
  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    const h = readEnvString(process.env.POSTHOG_API_HOST)
    if (h) return h
  }
  return DEFAULT_POSTHOG_API_HOST
}

export function isPostHogEnabled(): boolean {
  return getPostHogKey().length > 0
}

function buildOptions(): Partial<PostHogConfig> {
  return {
    api_host: getPostHogApiHost(),
    defaults: "2026-01-30",
    capture_pageleave: true,
    enable_heatmaps: true,
    disable_session_recording: false,
  }
}

/**
 * Idempotent; safe to call more than once (e.g. React StrictMode in dev).
 */
export function initPostHog(): void {
  if (didInit) return
  const key = getPostHogKey()
  if (!key) return

  posthog.init(key, buildOptions())
  didInit = true
}

export { posthog }
