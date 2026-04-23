/**
 * Shared FAQ content. Rendered as a visible `<section>` on the landing and
 * also emitted as `FAQPage` JSON-LD, so LLMs and Google see the same Q&As.
 *
 * Keep answers tight (<= 50 words), keyword-weighted, and self-contained -
 * the same answer will often be quoted verbatim by LLM crawlers.
 */
export type FaqItem = { readonly question: string; readonly answer: string }

export const LANDING_FAQ: readonly FaqItem[] = [
  {
    question: "What is Construct Computer?",
    answer:
      "Construct Computer is an AI agent that has its own computer in the cloud. It logs into a full virtual desktop, uses a browser, runs code, writes files, manages a calendar, and sends email on your behalf - think of it as an AI employee, not another chatbot.",
  },
  {
    question: "How is Construct different from ChatGPT or Claude?",
    answer:
      "ChatGPT and Claude are chat assistants. Construct is a persistent autonomous agent with a workstation - a dedicated Linux sandbox, a real browser, an email inbox, long-term memory, and integrations with 1,000+ SaaS apps via Composio. You give it tasks; it executes them end-to-end and leaves an audit trail.",
  },
  {
    question: "Can I connect Slack, Telegram, Gmail, and other tools?",
    answer:
      "Yes. Your Construct agent is reachable from the web desktop, Slack, Telegram, a Telegram Mini App, email, and a macOS companion app. It connects to Gmail, Google Calendar, Notion, Linear, Jira, GitHub, HubSpot, Airtable, and over a thousand other SaaS apps through Composio.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Each user runs on a dedicated Cloudflare Durable Object with an isolated Docker sandbox. OAuth tokens and API keys are encrypted with AES-256-GCM. You can inspect, forget, or bulk-delete agent memories at any time, and every tool call is written to a queryable audit log.",
  },
  {
    question: "How is Construct priced?",
    answer:
      "Free, Starter, and Pro tiers. Usage is metered by real model cost via Cloudflare AI Gateway with a weekly budget and a 4-hour burst cap, not per message. Bring-your-own-key is available on every tier and does not count against the bundled budget.",
  },
]
