import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react"
import { BETA_URL } from "@/landing/constants"
import { useBetaAccess } from "./BetaAccessProvider"
import { readBetaAccessGrant } from "./storage"

type BetaAccessTriggerProps = {
  source?: string
  children: ReactNode
  className?: string
  variant?: "button" | "link"
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "href" | "children"
>

/**
 * Anchor styled like a button. Keeps href={BETA_URL} so CTAs work before
 * React hydrates; intercepts click to show the email gate when needed.
 */
export function BetaAccessTrigger({
  source = "unknown",
  children,
  className,
  variant = "button",
  onClick,
  ...rest
}: BetaAccessTriggerProps) {
  const { requestBetaAccess } = useBetaAccess()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (!readBetaAccessGrant()?.email) {
      e.preventDefault()
      requestBetaAccess(source)
    }
  }

  const resolvedClassName = [
    className,
    variant === "link"
      ? "inline cursor-pointer font-inherit text-inherit text-[#01b4c8] underline-offset-2 hover:underline"
      : "inline-flex cursor-pointer no-underline",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <a
      href={BETA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={resolvedClassName}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  )
}
