export const BETA_URL = "https://beta.construct.computer"

/** noopener makes window.open return null even on success — never fall back to same-tab nav. */
export function openBetaInNewTab(): void {
  window.open(BETA_URL, "_blank", "noopener,noreferrer")
}
