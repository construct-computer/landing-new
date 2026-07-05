import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark" | "auto"
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT_ID = "cf-turnstile-script"
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

function readTurnstileSiteKey(): string {
  return (process.env.BUN_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim()
}

export function getTurnstileSiteKey(): string {
  return readTurnstileSiteKey()
}

function loadTurnstileScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve()
  if (window.turnstile) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("turnstile load failed"))
    document.head.appendChild(script)
  })
}

export function TurnstileWidget({
  onToken,
  onExpire,
}: {
  onToken: (token: string) => void
  onExpire?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = getTurnstileSiteKey()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let cancelled = false

    void loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "light",
          callback: (token) => onToken(token),
          "expired-callback": () => onExpire?.(),
          "error-callback": () => setFailed(true),
        })
      })
      .catch(() => setFailed(true))

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onToken, onExpire])

  if (!siteKey) return null
  if (failed) {
    return (
      <p className="font-ui text-center text-[13px] text-[#627c86]">
        Verification unavailable — try refreshing the page.
      </p>
    )
  }

  return <div ref={containerRef} className="flex justify-center" />
}
