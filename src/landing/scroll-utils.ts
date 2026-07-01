/** ponytail: SSR renders both mobile + desktop trees pre-hydration; skip scroll FX on display:none branch */
export function isLayoutVisible(el: HTMLElement): boolean {
  let node: HTMLElement | null = el
  while (node) {
    if (getComputedStyle(node).display === "none") return false
    node = node.parentElement
  }
  return true
}
