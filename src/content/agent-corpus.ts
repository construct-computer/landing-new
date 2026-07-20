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
  "The personal work OS for an AI employee. Construct combines persistent memory, files, browser and terminal tools, an inbox, schedules, workflows, and connected apps in one supervised workspace."

export const PRODUCT_ONE_LINER =
  "Construct Computer is a supervised workspace for an AI employee that researches, operates tools, creates files, and runs recurring work across more than 1,000 connected apps."

export const REACH_CHANNELS = [
  "Web work desktop",
  "Slack",
  "Telegram",
  "Discord",
  "Native agent inbox",
] as const

export const CORE_CAPABILITIES = [
  "Purpose-built work desktop with Chat, Files, Browser, Terminal, Email, Calendar, Workflows, Memories, Activity, and connected apps",
  "Web research: search the web, read pages, and use an interactive browser for logins and forms",
  "Sandbox terminal for code, scripts, and file processing with outputs saved to the persistent workspace",
  "Files and reports: create, edit, search, import, organize, and attach artifacts from the workspace",
  "Agent email address on paid plans (`<name>@agents.construct.computer`) — triage mail, draft replies, send updates",
  "Native Calendar for one-time and recurring agent jobs and workflow runs",
  "Versioned, reusable workflows with agent steps, connected-app actions, notifications, retries, and run history",
  "Long-term memory with provenance and controls to inspect, correct, forget, or restore information",
  "Temporary agents for parallel work on bounded subtasks",
  "1,000+ SaaS integrations (Gmail, Google Drive, Slack, Notion, Linear, Jira, GitHub, HubSpot, Airtable, Stripe, and more)",
  "App Store, custom MCP connections, and agent-created workspace applications",
  "Activity history for agent, tool, command, and delegated work, including reasons when available",
  "Bring your own model API key (BYOK) on Pro",
] as const

export const BUILT_IN_WORK = [
  "Cloud drive — list, search, and organize files",
  "Calendar — schedule one-time and recurring agent jobs or workflows",
  "Mail — search and send from the agent inbox",
  "Notes — list and create pages in connected workspaces",
  "Spreadsheets & docs — read, create, and update sheets and documents",
  "Presentations — create and update slide decks",
  "Code hosting — issues, pull requests, and comments",
  "Team chat — send messages and read channel history (when connected)",
  "Payments — list charges, invoices, and customers (when connected)",
] as const

export const PRICING_SUMMARY = `Lite (${PRICING_PLANS[0].price}/mo), Starter (${PRICING_PLANS[1].price}/mo), Pro (${PRICING_PLANS[2].price}/mo). Paid tiers add more steps per task, parallel agent jobs, storage, scheduled jobs, and product capabilities.

- **Lite:** 50 steps/task, 2 concurrent agent jobs, 100 MB storage, 3 scheduled jobs, full integrations
- **Starter:** 150 steps/task, 4 concurrent agent jobs, 1 GB storage, agent email, background work, 10 scheduled jobs
- **Pro:** 1,000 steps/task, 8 concurrent agent jobs, 3 GB storage, agent email, background work, 50 scheduled jobs, BYOK`

export const SECURITY_SUMMARY = [
  "Per-user isolated workspace and sandbox",
  "Encrypted stored credentials and API keys",
  "Activity history for agent and tool actions",
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
