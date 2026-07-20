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
    question: "What is an AI employee?",
    answer:
      "An AI employee is an agent that can accept an outcome, choose tools, and complete multi-step work. Construct gives that agent a persistent workspace with files, memory, browser and terminal tools, schedules, workflows, an inbox, and connected business applications.",
  },
  {
    question: "How is Construct different from ChatGPT or Claude?",
    answer:
      "Chat assistants are excellent for answers and drafts. Construct is built for execution that persists beyond a thread: it can operate tools, create files, run scheduled jobs, reuse workflows, and keep inspectable memory and Activity history in one work desktop.",
  },
  {
    question: "What work can Construct complete?",
    answer:
      "Construct can research and write cited reports, analyze workspace files, read and send email, update connected applications, run scripts, create artifacts, and delegate bounded subtasks in parallel. It is most useful when a job crosses several tools or needs to run again later.",
  },
  {
    question: "Can Construct run recurring work?",
    answer:
      "Yes. Construct's native Calendar schedules one-time or recurring agent jobs and workflow runs. A successful process can become a reusable, versioned workflow containing agent steps, connected-app actions, and notifications, with run history available for inspection.",
  },
  {
    question: "Which apps can Construct connect to?",
    answer:
      "Construct supports more than 1,000 applications through its integration layer, including Gmail, Google Calendar, Slack, Notion, Linear, Jira, GitHub, HubSpot, and Airtable. You can also connect custom MCP tools, while Slack, Telegram, and Discord provide messaging access to the same workspace.",
  },
  {
    question: "Can I see and control what the agent does?",
    answer:
      "Yes. The work desktop exposes files, browser activity, terminal output, workflows, memories, notifications, and Activity records. You can inspect results, interrupt a running turn, answer questions when Construct needs a decision, and correct or forget information stored in long-term memory.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Each user gets an isolated workspace and sandbox. Credentials remain server-side and stored secrets are encrypted. You can inspect, correct, forget, or restore agent memories, while Activity records provide a history of agent and tool actions.",
  },
  {
    question: "How is Construct priced?",
    answer:
      "Construct offers Lite ($9/month), Starter ($59/month), and Pro ($299/month). Plans increase task steps, parallel agent jobs, storage, and scheduled-job capacity. Native agent email starts on Starter, while Pro adds bring-your-own model keys.",
  },
]
