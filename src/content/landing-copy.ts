/** User-facing marketing copy for the landing page. Product facts live in agent-corpus.ts. */

const BETA_URL = "https://beta.construct.computer"

export const CTA = {
  primary: "Start free",
  primaryUrl: BETA_URL,
  workflowDemo: "See it in action",
  pricing: "Start on Free plan",
  enterprise: "Book A Call",
  faq: "Send Us Hello",
} as const

export const HERO = {
  eyebrow: "Free to start · No setup project",
  /** Neutral + accent parts for two-tone H1 styling */
  headlineNeutralBefore: "Put ",
  headlineAccent: "AI to work",
  headlineNeutralAfter: " in your business",
  subhead:
    "An AI employee with its own cloud computer. Assign a task, start free, and reach it from web, Slack, or email.",
  subheadMobile:
    "An AI employee with its own cloud computer. Assign a task and start free in minutes.",
} as const

export const DIFFERENTIATION = {
  headlineNeutral: "Not a chatbot. ",
  headlineAccent: "Not another browser tab.",
  body: "A persistent AI employee with its own cloud computer that runs real work across your apps.",
} as const

export const HOW_IT_WORKS = {
  headlineNeutral: "From signup to done in ",
  headlineAccent: "minutes",
  steps: [
    {
      step: 1,
      title: "Assign a task",
      body: "Start free from web, Slack, Telegram, or email.",
    },
    {
      step: 2,
      title: "Construct runs it",
      body: "On its own cloud desktop. Watch live or walk away.",
    },
    {
      step: 3,
      title: "Review and control",
      body: "Audit log, approvals, memory, or take over any window.",
    },
  ] as const,
} as const

export const SECTIONS = {
  adapts: {
    headlineNeutral: "Assign work once. ",
    headlineAccent: "Construct handles the rest.",
    blurb:
      "Research, inbox, reports, and ops: multi-step tasks that run on their own cloud desktop while you stay in control.",
  },
  pain: {
    headlineNeutral: "Your week shouldn't disappear into ",
    headlineAccent: "email, files, and CRM updates",
    closingAccent: "Hand the busywork",
    closingNeutral: " to Construct",
  },
  features: {
    headlineNeutral: "Everything an employee needs ",
    headlineAccent: "in the cloud",
    subhead:
      "1,000+ integrations including Gmail, Slack, Notion, and more. Schedules, automations, and a desktop you can open from any device.",
  },
  pricing: {
    headlineNeutral: "Start free. ",
    headlineAccent: "Scale when the work grows.",
    subhead:
      "Same agent on every plan. Paid tiers add runtime, parallel sub-agents, storage, and an agent email address.",
  },
  enterprise: {
    headlineNeutral: "Need custom integrations or a ",
    headlineAccent: "private deployment?",
    body: "We work with your team to connect internal tools and ship an agent built for your workflows.",
    footnotePro: "Pro",
    footnotePlus: " + custom integrations",
  },
  faqIntro:
    "Straight answers about how Construct works, what it costs, and how your data is handled.",
} as const

export const WORKFLOW_DEMOS_COPY = {
  research: {
    title: "Research About",
    accent: "Any Topic",
    description:
      "Gathers sources, compares them, and delivers a cited report you can share.",
    mutedAction: "See Report Samples Generated",
  },
  channels: {
    title: "Work Together",
    accent: "Across Channels",
    description:
      "Reach Construct from Slack, Telegram, or email, with the same agent, memory, and desktop.",
    mutedAction: "See Shared Threads",
  },
} as const

export const SEO_HOME = {
  title: "Construct Computer - put AI to work in your business",
  description:
    "An AI employee with its own cloud computer. Assign tasks from web, Slack, Telegram, or email. Start free, no integration project required.",
} as const
