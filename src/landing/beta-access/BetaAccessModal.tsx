import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react"
import { Input } from "@/components/ui/input"
import { BETA_URL } from "@/landing/constants"
import {
  betaSignupErrorMessage,
  submitBetaSignup,
  type BetaSignupError,
} from "./api"
import {
  GRANTING_STEP_COUNT,
  GRANTING_STEP_DELAYS_MS,
  GRANTING_TOTAL_MS,
  grantingStepLabel,
} from "./granting-steps"
import {
  identifyBetaVisitor,
  trackBetaOpened,
  trackBetaSignupGranted,
  trackBetaSignupSubmitted,
} from "./identify"
import {
  isPlausibleEmail,
  normalizeEmailInput,
  writeBetaAccessGrant,
} from "./storage"
import { getTurnstileSiteKey, TurnstileWidget } from "./TurnstileWidget"

export type BetaModalPhase = "form" | "granting" | "success"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

async function fireConfetti(reducedMotion: boolean) {
  if (reducedMotion) return
  const confetti = (await import("canvas-confetti")).default
  confetti({
    particleCount: 120,
    spread: 72,
    origin: { y: 0.55 },
    colors: ["#01b4c8", "#4cd8ff", "#ffffff", "#8adcdf"],
  })
}

export function BetaAccessModal({
  open,
  source,
  onClose,
  onGranted,
}: {
  open: boolean
  source: string
  onClose: () => void
  onGranted: (email: string) => void
}) {
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const turnstileRequired = getTurnstileSiteKey().length > 0

  const [phase, setPhase] = useState<BetaModalPhase>("form")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [completedSteps, setCompletedSteps] = useState(0)
  const [grantedEmail, setGrantedEmail] = useState("")

  const reset = useCallback(() => {
    setPhase("form")
    setEmail("")
    setError(null)
    setSubmitting(false)
    setTurnstileToken("")
    setCompletedSteps(0)
    setGrantedEmail("")
  }, [])

  useEffect(() => {
    if (!open) {
      reset()
      return
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open, reset])

  useEffect(() => {
    if (!open || phase !== "form") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, phase, onClose])

  useEffect(() => {
    if (phase !== "granting") return

    const timers: number[] = []
    const totalMs = reducedMotion ? 400 : GRANTING_TOTAL_MS
    const stepDelays = reducedMotion
      ? [0, 150, 300]
      : [...GRANTING_STEP_DELAYS_MS]

    for (let i = 0; i < GRANTING_STEP_COUNT; i++) {
      timers.push(
        window.setTimeout(() => setCompletedSteps(i + 1), stepDelays[i] ?? 0),
      )
    }

    timers.push(
      window.setTimeout(async () => {
        await fireConfetti(reducedMotion)
        setPhase("success")
      }, totalMs),
    )

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [phase, reducedMotion])

  const runGrantFlow = useCallback(
    (normalized: string) => {
      writeBetaAccessGrant(normalized)
      identifyBetaVisitor(normalized, source)
      trackBetaSignupGranted(source)
      onGranted(normalized)
      setGrantedEmail(normalized)
      setPhase("granting")
    },
    [onGranted, source],
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizeEmailInput(email)
    if (!isPlausibleEmail(normalized)) {
      setError(betaSignupErrorMessage("invalid_email"))
      return
    }
    if (turnstileRequired && !turnstileToken) {
      setError("Complete the verification check below.")
      return
    }

    setSubmitting(true)
    setError(null)
    trackBetaSignupSubmitted(source)

    const result = await submitBetaSignup({
      email: normalized,
      source,
      turnstileToken: turnstileToken || undefined,
    })

    setSubmitting(false)

    if (!result.ok) {
      setError(betaSignupErrorMessage(result.error as BetaSignupError))
      return
    }

    runGrantFlow(normalized)
  }

  const openBeta = () => {
    trackBetaOpened()
    const opened = window.open(BETA_URL, "_blank", "noopener,noreferrer")
    if (!opened) window.location.assign(BETA_URL)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#235061]/40 backdrop-blur-[2px]"
        onClick={phase === "form" ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="font-ui relative z-10 w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#d9f8ff]/80 bg-white px-8 py-9 shadow-[0_24px_80px_rgba(1,180,200,0.18)]"
      >
        {phase === "form" ? (
          <>
            <h2
              id={titleId}
              className="text-balance text-center text-[26px] leading-[32px] text-[#4e4646]"
            >
              Get{" "}
              <span className="font-display italic text-[#01b4c8]">beta access</span>
            </h2>
            <p className="mt-3 text-center text-[15px] leading-[21px] text-[#627c86]">
              Enter your work email to continue.
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <Input
                ref={inputRef}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                aria-invalid={error ? true : undefined}
                className="h-11 rounded-xl border-[#c5e8ef] bg-[#f8feff] text-[15px]"
              />
              {error ? (
                <p className="text-[13px] leading-[18px] text-[#c44]" role="alert">
                  {error}
                </p>
              ) : null}

              <TurnstileWidget
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
              />

              <button
                type="submit"
                disabled={submitting}
                className="font-cta flex h-[52px] w-full items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] text-[18px] text-white shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)] transition-opacity disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Continue"}
              </button>
            </form>
          </>
        ) : null}

        {phase === "granting" ? (
          <div className="py-2">
            <h2
              id={titleId}
              className="text-center text-[22px] leading-[28px] text-[#4e4646]"
            >
              Setting things up…
            </h2>
            <ul className="mt-8 space-y-4" aria-live="polite">
              {Array.from({ length: GRANTING_STEP_COUNT }, (_, i) => {
                const done = completedSteps > i
                return (
                  <li
                    key={i}
                    className={
                      "flex items-center gap-3 text-[15px] transition-opacity duration-300 " +
                      (done ? "text-[#4e4646] opacity-100" : "text-[#becace] opacity-50")
                    }
                  >
                    <span
                      className={
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] " +
                        (done
                          ? "bg-[#4cd8ff] text-white"
                          : "border border-[#c5e8ef] bg-white")
                      }
                      aria-hidden
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span>{grantingStepLabel(i, grantedEmail)}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        {phase === "success" ? (
          <div className="text-center">
            <h2
              id={titleId}
              className="text-balance text-[24px] leading-[30px] text-[#4e4646]"
            >
              Beta access granted to{" "}
              <span className="font-display italic text-[#01b4c8]">
                {grantedEmail}
              </span>
            </h2>
            <p className="mt-3 text-[15px] leading-[21px] text-[#627c86]">
              Your cloud computer is ready when you are.
            </p>
            <button
              type="button"
              onClick={openBeta}
              className="font-cta mt-8 flex h-[52px] w-full items-center justify-center rounded-[54px] border border-[#d9f8ff] bg-[#4cd8ff] text-[18px] text-white shadow-[inset_0_-5px_14px_rgba(255,255,255,0.92),inset_0_4px_14px_rgba(255,255,255,0.91)]"
            >
              Open Construct
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
