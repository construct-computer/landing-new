export const GRANTING_STEP_DELAYS_MS = [0, 900, 1800] as const
export const GRANTING_TOTAL_MS = 2600

export function grantingStepLabel(index: number, email: string): string {
  switch (index) {
    case 0:
      return `Verifying ${email}`
    case 1:
      return "Provisioning your cloud computer"
    case 2:
      return "Granting beta access"
    default:
      return ""
  }
}

export const GRANTING_STEP_COUNT = 3
