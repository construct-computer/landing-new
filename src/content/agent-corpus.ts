import { LANDING_FAQ } from "@/content/faq"
import { PRICING_PLANS } from "@/content/pricing"
import { getAllRenderableRoutes } from "@/seo/routes"
import { SITE_URL } from "@/seo/jsonLd"

/**
 * Shared product copy for llms.txt, llms-full.txt, and agents.md.
 * User-facing capabilities only — no internal stack or vendor names.
 */

export const PRODUCT_NAME = "Construct Computer"

export const PRODUCT_TAGLINE =
  "An AI employee with its own cloud computer — not a chat assistant. Construct logs into a full virtual desktop, runs a browser and terminal, manages email and calendar, remembers context across sessions, and executes multi-step work across connected apps."

export const PRODUCT_ONE_LINER =
  "Construct Computer is an AI agent with its own cloud computer — a persistent AI employee that uses a virtual desktop, browser, terminal, inbox, memory, and 1,000+ app integrations. Reach it from the web, Slack, Telegram, email, and a macOS companion."

export const REACH_CHANNELS = [
  "Web virtual desktop (watch, pause, or take over any window)",
  "Slack",
  "Telegram (including the Telegram Mini App)",
  "Email",
  "macOS companion app",
] as const

export const CORE_CAPABILITIES = [
  "Virtual desktop with Browser, Terminal, Chat, Calendar, Tasks, Memory, Files, and Audit Log apps",
  "Web research: search the web, read pages, and use an interactive browser for logins and forms",
  "Linux sandbox: shell commands, Python, and GitHub CLI",
  "Documents and reports: PDF, Word, Excel, PowerPoint, Markdown, CSV, HTML, and diagrams saved to your workspace",
  "Agent email address on paid plans (`<name>@agents.construct.computer`) — triage mail, draft replies, send updates",
  "Google Calendar and scheduling: one-off and recurring tasks that run while you are away (paid plans)",
  "Task tracker with dependencies for multi-step work",
  "Long-term memory you can inspect, edit, or delete",
  "Knowledge wiki: interlinked markdown pages in your workspace",
  "Sub-agents for parallel work on large jobs",
  "1,000+ SaaS integrations (Gmail, Google Drive, Slack, Notion, Linear, Jira, GitHub, HubSpot, Airtable, Stripe, and more)",
  "Extra apps from the public Construct App Registry (installable MCP apps)",
  "Queryable audit log of tool calls, commands, and sub-agent actions",
  "Bring your own model API key (BYOK) on every plan",
] as const

export const BUILT_IN_WORK = [
  "Cloud drive — list, search, and organize files",
  "Calendar — list and create events",
  "Mail — search and send from the agent inbox",
  "Notes — list and create pages in connected workspaces",
  "Spreadsheets & docs — read, create, and update sheets and documents",
  "Presentations — create and update slide decks",
  "Code hosting — issues, pull requests, and comments",
  "Team chat — send messages and read channel history (when connected)",
  "Payments — list charges, invoices, and customers (when connected)",
] as const

export const PRICING_SUMMARY = `Free (${PRICING_PLANS[0].price}), Starter (${PRICING_PLANS[1].price}/mo), Pro (${PRICING_PLANS[2].price}/mo). Same model experience on every plan — paid tiers add more steps per task, runtime, parallel sub-agents, storage, and usage budget.

- **Free:** 50 steps/task, 5 min runtime, 2 concurrent sub-agents, 100 MB storage, 3 scheduled tasks, full integrations, BYOK
- **Starter:** 150 steps/task, 30 min runtime, 5 sub-agents, 1 GB storage, agent email, background work, 10 scheduled tasks, BYOK
- **Pro:** 1,000 steps/task, 1 hr runtime, unlimited sub-agents, 3 GB storage, agent email, background work, unlimited scheduled tasks, BYOK

Usage is metered by a weekly compute budget with a 4-hour burst cap — not per message. BYOK usage does not count against the bundled budget.`

export const SECURITY_SUMMARY = [
  "Per-user isolated workspace and sandbox",
  "Encrypted stored credentials and API keys",
  "Full audit log of agent actions",
  "Approval queues for inbound messages when you want them",
  "Memory controls: view, edit, or bulk-delete anytime",
] as const

export const LINKS = {
  beta: "https://beta.construct.computer",
  site: SITE_URL,
  registry: "https://registry.construct.computer",
  github: "https://github.com/construct-computer",
  discord: "https://discord.gg/puArEQHYN9",
  support: "mailto:support@construct.computer",
  x: "https://x.com/use_construct",
  linkedin: "https://linkedin.com/company/construct-computer",
} as const

export function formatFaqBlock(): string {
  return LANDING_FAQ.map(
    (item) => `Q: ${item.question}\nA: ${item.answer}`,
  ).join("\n\n")
}

export function formatPagesList(): string {
  return getAllRenderableRoutes().map((r) => `- [${r.title}](${r.canonical})`).join("\n")
}

export function formatPagesWithDescriptions(): string {
  return getAllRenderableRoutes().map(
    (r) => `- [${r.title}](${r.canonical}): ${r.description}`,
  ).join("\n")
}
