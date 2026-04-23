import { ROUTES } from "./routes"
import { SITE_URL } from "./jsonLd"

/**
 * Build-time emitters for crawler discovery files (robots/sitemap/llms/etc.).
 * Kept pure (no fs) so `build.ts` can choose where/how to write them.
 */

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "cohere-ai",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "YouBot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
] as const

export function robotsTxt(): string {
  const allowBlocks = AI_BOTS.map(
    (ua) => `User-agent: ${ua}\nAllow: /`,
  ).join("\n\n")
  return `User-agent: *
Allow: /

${allowBlocks}

Sitemap: ${SITE_URL}/sitemap.xml
`
}

export function sitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = ROUTES.map((r) => {
    const priority =
      r.path === "/" ? "1.0" : r.path === "/privacy" || r.path === "/terms" ? "0.3" : "0.7"
    const changefreq = r.path === "/" ? "weekly" : "monthly"
    return `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/**
 * Minimal `llms.txt` index following the emerging spec
 * (https://llmstxt.org). Short, plaintext, easy for LLMs to parse.
 */
export function llmsTxt(): string {
  const lines: string[] = []
  lines.push(`# Construct Computer`)
  lines.push("")
  lines.push(
    `> Construct Computer is an AI agent with its own cloud computer - a persistent AI employee that logs into a full virtual desktop, runs a browser and terminal, manages email and calendar, and connects to 1,000+ SaaS apps via Composio. Reachable from the web, Slack, Telegram, email, and a macOS companion app.`,
  )
  lines.push("")
  lines.push(`## Pages`)
  for (const r of ROUTES) {
    lines.push(`- [${r.title}](${r.canonical}): ${r.description}`)
  }
  lines.push("")
  lines.push(`## External`)
  lines.push(`- [Beta (live product)](https://beta.construct.computer)`)
  lines.push(`- [App Registry](https://registry.construct.computer)`)
  lines.push(`- [GitHub](https://github.com/construct-computer)`)
  lines.push(`- [X / Twitter](https://x.com/use_construct)`)
  lines.push(`- [LinkedIn](https://linkedin.com/company/construct-computer)`)
  lines.push(`- [Discord](https://discord.gg/puArEQHYN9)`)
  lines.push("")
  return lines.join("\n")
}

/**
 * `llms-full.txt` - a concatenated plain-text bundle of the most important
 * product claims and answers. Designed to be the single thing an LLM crawler
 * can fetch to "know" the product.
 */
export function llmsFullTxt(): string {
  return `# Construct Computer - full product context

Construct Computer is an AI agent with its own computer in the cloud. Unlike a chat assistant, Construct is a persistent autonomous agent with a dedicated Linux sandbox, a real web browser, an email inbox, long-term memory, a calendar, a task tracker, and integrations with over 1,000 SaaS apps via Composio.

## What it is
- An AI employee, not a chatbot. You assign it tasks and it executes them end-to-end across tools.
- Each user gets a per-user Cloudflare Durable Object that coordinates a Docker-based Linux sandbox (via the Cloudflare Sandbox SDK), R2 object storage for files, D1 databases for structured state, and an AI Gateway for model routing.
- Reachable from a web virtual desktop, Slack, Telegram, a Telegram Mini App, email, and a macOS notch companion.
- The core agent backend is proprietary and closed source. The frontend, app SDK, sample apps, and app registry are source-available under Business Source License 1.1.

## Capabilities
- Autonomous web browsing (TinyFish remote browser).
- Document generation (Markdown, PDF reports) written to R2.
- Live terminal: shell commands, Python, and Git via the gh CLI inside the sandbox.
- Agent email inbox (AgentMail) - the agent can receive and send email.
- Calendar, task tracker, long-term memory (Mem0), and a knowledge wiki, all addressable by the agent.
- Multi-agent orchestration: primary agent can delegate subtasks to sub-agents.
- Voice: ElevenLabs Scribe and Cloudflare Whisper for transcription.
- Integrations: Google Workspace, Gmail, Slack, Notion, Linear, Jira, GitHub, HubSpot, Airtable, Dropbox, and 1,000+ others through Composio; additional apps from the public Construct App Registry.

## Models
- Default agent model: Moonshot Kimi K2.6 served via Cloudflare Workers AI.
- Fallback / premium tier: Google Gemini 3.1 Pro.
- Bring Your Own Key (BYOK) via OpenRouter is available on every tier.

## Plans
- Free, Starter, and Pro subscriptions.
- Metered by real model cost via Cloudflare AI Gateway, with a weekly budget and a 4-hour burst window cap - not per-message.
- Pro auto-downgrades to a lighter model at 80% of the weekly budget and hard-stops at 100%.
- Bonus credits available for sharing the product; BYOK usage never counts against the bundled budget.
- Subscriptions managed through Dodo Payments.

## Privacy & security
- Per-user isolation: Durable Object + dedicated Docker sandbox + scoped R2 prefix.
- AES-256-GCM (Web Crypto API) for all stored OAuth tokens, integration credentials, and BYOK API keys.
- Full audit log of every tool call, command, and sub-agent invocation - queryable by the user.
- Access-control approval queues for inbound messages to the agent.
- Users can inspect, edit, or bulk-delete memories at any time via the in-desktop Memory app.

## Where to start
- Live product: https://beta.construct.computer
- Company site: https://construct.computer
- App registry: https://registry.construct.computer
- Source (frontend, SDK, sample apps, app registry): https://github.com/construct-computer
- Community: https://discord.gg/puArEQHYN9
- Support: support@construct.computer

## FAQ
Q: What is Construct Computer?
A: An AI agent that has its own computer in the cloud. It logs into a full virtual desktop, uses a browser, runs code, writes files, manages a calendar, and sends email on your behalf.

Q: How is Construct different from ChatGPT or Claude?
A: ChatGPT and Claude are chat assistants. Construct is a persistent autonomous agent with a workstation - a dedicated Linux sandbox, a real browser, an email inbox, long-term memory, and 1,000+ SaaS integrations. It executes tasks end-to-end and leaves an audit trail.

Q: Can I connect Slack, Telegram, Gmail, and other tools?
A: Yes. The agent is reachable from the web, Slack, Telegram, email, and a macOS companion. It integrates with Gmail, Google Calendar, Notion, Linear, Jira, GitHub, HubSpot, Airtable, and 1,000+ other apps via Composio.

Q: Is my data private and secure?
A: Each user runs on a dedicated Cloudflare Durable Object with an isolated Docker sandbox. OAuth tokens and API keys are encrypted with AES-256-GCM. You can inspect, forget, or bulk-delete agent memories at any time. Every tool call is audit-logged.

Q: How is Construct priced?
A: Free, Starter, and Pro tiers. Usage is metered by real model cost via Cloudflare AI Gateway with a weekly budget and a 4-hour burst cap. Bring-your-own-key is available on every tier and does not count against the bundled budget.
`
}

export function securityTxt(): string {
  // Expiry ~1y from today per RFC 9116.
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  return `Contact: mailto:security@construct.computer
Expires: ${expires}
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt
`
}

export function manifestJson(): string {
  const manifest = {
    name: "Construct Computer",
    short_name: "Construct",
    description:
      "The AI employee with their own computer. A persistent AI agent that logs into a full virtual desktop and works across Slack, Telegram, and email.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  }
  return JSON.stringify(manifest, null, 2) + "\n"
}
