export type GuidePage = {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly summary: string
  readonly published: string
  readonly updated: string
  readonly sections: readonly {
    readonly title: string
    readonly paragraphs: readonly string[]
    readonly bullets?: readonly string[]
  }[]
}

export const GUIDE_PAGES: readonly GuidePage[] = [
  {
    slug: "ai-employee",
    title: "AI Employee for Real Business Work",
    description:
      "Meet the AI employee that researches, operates tools, creates files, and runs recurring work from a persistent, supervised workspace.",
    summary:
      "An AI employee goes beyond answering questions. It keeps context, operates tools, produces artifacts, and returns with finished work you can inspect.",
    published: "2026-07-20",
    updated: "2026-07-20",
    sections: [
      {
        title: "What is an AI employee?",
        paragraphs: [
          "An AI employee is software that can accept an outcome, decide which tools are needed, and complete a multi-step job. Unlike a chat assistant, it has a persistent workspace for files, memory, browser sessions, schedules, and reusable procedures. The result is not only an answer in a thread: it can be a report, an updated record, a sent message, or a completed workflow.",
          "Construct is the personal work OS around that employee. The agent can research the web, operate a live browser, run commands in a sandbox, manage workspace files, use its inbox, and act through connected business applications. Its work remains visible through the desktop and Activity history.",
        ],
      },
      {
        title: "What work can it complete?",
        paragraphs: [
          "Construct is designed for jobs that cross tools or continue beyond one conversation. You can ask it to research a market and save a cited brief, analyze an uploaded file, triage an inbox, update a CRM, or prepare a recurring operating report. When a job is large, it can delegate bounded parts of the work to temporary agents and combine their results.",
        ],
        bullets: [
          "Research a topic and deliver a cited report",
          "Analyze files and attach a cleaned output",
          "Read an inbox, draft replies, and schedule follow-up work",
          "Update connected apps and record what changed",
          "Run recurring reports from a saved workflow",
        ],
      },
      {
        title: "Persistent, but still supervised",
        paragraphs: [
          "Persistence matters because real work rarely fits inside one prompt. Construct keeps workspace files, conversation state, workflows, schedules, and long-term memory available for later tasks. Its memory is inspectable: you can review what it remembers, correct stale information, or forget it entirely.",
          "Autonomy does not have to mean invisible work. Activity records show which tools ran and, when available, why the agent used them. You can inspect outputs, interrupt a running turn, and answer questions when Construct needs a decision.",
        ],
      },
      {
        title: "One workspace, many applications",
        paragraphs: [
          "Construct connects to more than 1,000 supported applications through its integration layer. The agent can discover available actions, ask you to connect an account when necessary, and then execute the action with server-side credentials. Slack, Telegram, and Discord also let you reach the same workspace away from the web desktop.",
          "When an off-the-shelf connection is not enough, Construct can use its browser or terminal. It can also create a small workspace application for a recurring internal process, publish it to your desktop, and keep the last working build available if a later edit fails.",
        ],
      },
    ],
  },
  {
    slug: "ai-workflow-automation",
    title: "AI Workflow Automation",
    description:
      "Create reusable AI workflows, run them on demand, or schedule recurring work across files, browser sessions, email, and connected business apps.",
    summary:
      "Turn a successful AI task into a durable procedure that can run again without rebuilding the process from scratch.",
    published: "2026-07-20",
    updated: "2026-07-20",
    sections: [
      {
        title: "From one good run to a reusable procedure",
        paragraphs: [
          "Traditional automation works best when every trigger and action is known before the flow is built. AI workflow automation is useful when a procedure contains research, judgment, writing, or tool use that cannot be reduced to a fixed data mapping. Construct combines durable workflow steps with an agent that can handle those less predictable parts.",
          "A workflow can include agent work, connected-app actions, and notifications. Published versions are preserved so a future edit does not silently change a run that already started. Run history makes the procedure easier to inspect and improve over time.",
        ],
      },
      {
        title: "Run now or put it on the Calendar",
        paragraphs: [
          "Construct's Calendar is a scheduler for agent work and workflows. Create a one-time job, define a recurring schedule, run it immediately, or cancel it from the same workspace. The scheduler reconciles missed or delayed work instead of depending on an open browser tab.",
          "This makes recurring operating work practical: weekly market research, an inbox summary, a customer follow-up list, or a report assembled from several connected systems. Google Calendar can be connected as an external app, but Construct's native Calendar controls when agent jobs run.",
        ],
      },
      {
        title: "Use the right execution surface",
        paragraphs: [
          "Each step can use the surface that fits the job. Structured app actions are best for reliable updates. Web search and fetch handle public research. A live browser covers interactive sites and signed-in sessions. The sandbox terminal can process files, run scripts, and generate artifacts in the persistent workspace.",
        ],
        bullets: [
          "Collect sources and create a cited brief",
          "Read messages and update a connected system",
          "Process a file and save the transformed output",
          "Notify a channel when the workflow finishes",
        ],
      },
      {
        title: "Inspect every run",
        paragraphs: [
          "Workflow automation should be debuggable. Construct keeps run state, step results, retry information, and Activity records. You can open the resulting files, review connected-app actions, and return to the originating conversation. If the agent needs missing information during interactive work, it can stop and ask rather than guessing.",
        ],
      },
    ],
  },
  {
    slug: "ai-agent-memory",
    title: "AI Agent Memory You Can Control",
    description:
      "Give an AI agent persistent memory with provenance, corrections, temporal context, and controls to inspect, update, forget, or restore what it knows.",
    summary:
      "Construct remembers useful context across tasks without turning memory into an opaque, permanent transcript you cannot inspect or correct.",
    published: "2026-07-20",
    updated: "2026-07-20",
    sections: [
      {
        title: "Why long-term agent memory matters",
        paragraphs: [
          "A useful work agent needs more than the messages currently visible in chat. It should remember stable preferences, ongoing projects, important people, and prior decisions when they are relevant to a new task. Without that continuity, every recurring workflow begins with the same explanation and the same avoidable mistakes.",
          "Construct recalls relevant context before a turn and ingests useful information after successful work. Files and source episodes remain separate from the assertions the memory system derives from them, so remembered information can retain its origin rather than becoming an unexplained fact.",
        ],
      },
      {
        title: "Corrections instead of silent overwrites",
        paragraphs: [
          "Facts change. A customer changes roles, a project gets renamed, or a preference that was once correct stops applying. Construct versions memory assertions and tracks when information is valid. A correction can supersede an older assertion without erasing the history that explains how the system learned it.",
          "This temporal model helps the agent distinguish current context from old context. It also makes a correction auditable: you can see the updated assertion instead of hoping a new embedding happens to outrank the old one.",
        ],
      },
      {
        title: "Memory controls for people",
        paragraphs: [
          "The Memories app lets you search and inspect what Construct remembers. You can add an explicit memory, correct an existing one, forget information, or restore something removed by mistake. Pending or unreviewed information can be excluded from automatic recall until it is safe to use.",
        ],
        bullets: [
          "Search memories and inspect supporting context",
          "Correct stale or inaccurate assertions",
          "Forget information that should no longer be recalled",
          "Restore previously forgotten information",
        ],
      },
      {
        title: "Memory connects work across time",
        paragraphs: [
          "Memory becomes more valuable when it works with the rest of the workspace. Construct can combine recalled context with files, scheduled jobs, workflows, inbox threads, and connected applications. A weekly report can remember the audience and preferred format; an inbox task can recognize an ongoing customer issue; a research job can build on earlier findings without starting over.",
          "The result is continuity with a control surface. Construct can become more useful over time while the user retains the ability to inspect and change what carries forward.",
        ],
      },
    ],
  },
] as const

export function getGuidePage(slug: string): GuidePage | undefined {
  return GUIDE_PAGES.find((page) => page.slug === slug)
}

export function getGuideSlugs(): readonly string[] {
  return GUIDE_PAGES.map((page) => page.slug)
}

export function guidePath(slug: string): string {
  return `/${slug}`
}
