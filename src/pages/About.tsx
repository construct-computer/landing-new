import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
} from "./LegalShell"
import { BetaAccessTrigger } from "@/landing/beta-access/BetaAccessTrigger"

export function AboutPage() {
  return (
    <LegalShell
      title="About"
      subtitle="The personal work OS for an AI employee"
    >
      <LegalSection title="What we're building">
        <p>
          Construct Computer is a personal work OS for an AI employee. It gives
          the agent a persistent workspace for files, memory, browser sessions,
          terminal work, schedules, workflows, email, and connected apps. The
          same workspace remains available after one conversation ends.
        </p>
        <p>
          You assign an outcome and Construct decides which available tools are
          needed. It can research, create artifacts, update business systems,
          and delegate bounded subtasks in parallel. You can inspect its
          outputs, interrupt a running turn, and correct what it remembers.
        </p>
      </LegalSection>

      <LegalSection title="The workstation">
        <p>
          Every Construct agent is provisioned with a complete working
          environment on day one:
        </p>
        <LegalList>
          <li>
            A browser-based work desktop with Chat, Files, Browser, Terminal,
            Email, Calendar, Workflows, Memories, Activity, and connected apps
          </li>
          <li>
            An isolated sandbox terminal for scripts, code, and file
            processing, with a durable <Emph>/workspace</Emph> mount
          </li>
          <li>
            A persistent cloud workspace that survives across sessions, is
            searchable, and supports uploaded or agent-created files
          </li>
          <li>
            A native agent inbox on Starter and Pro for reading threads,
            drafting replies, and sending updates
          </li>
          <li>
            Web search, public-page fetching, and a live browser for
            interactive websites and signed-in sessions
          </li>
          <li>
            A native Calendar for scheduled work, versioned reusable Workflows,
            and long-term memory you can inspect, correct, forget, or restore
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="How it works">
        <LegalList>
          <li>
            Each user runs on a dedicated Cloudflare Durable Object with its
            own SQLite state and an isolated Docker-based sandbox - your
            workspace is separated from everyone else&rsquo;s by default
          </li>
          <li>
            The agent can search the web, operate a real browser, run code,
            manage files, send email, and act across the integrations you
            connect
          </li>
          <li>
            <Emph>1,000+ SaaS integrations</Emph> via Composio (Google
            Workspace, Slack, Notion, Linear, Jira, HubSpot, GitHub, Airtable,
            and more) plus an open{" "}
            <InlineLink href="https://registry.construct.computer">
              app registry
            </InlineLink>{" "}
            where anyone can publish custom apps via a GitHub pull request
          </li>
          <li>
            One workspace accessible from the web, Slack, Telegram, and
            Discord, with a native inbox for agent email
          </li>
          <li>
            Parallel delegation lets the primary agent assign bounded research,
            implementation, and review subtasks to temporary agents
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="What we believe">
        <LegalList>
          <li>
            <Emph>Transparency over magic.</Emph> Activity records show agent,
            tool, command, and delegated work, including the reason for an
            action when one is available.
          </li>
          <li>
            <Emph>Isolation by default.</Emph> Per-user Durable Objects,
            sandboxed containers, AES-256-GCM encryption for every stored
            credential, and strict resource limits.
          </li>
          <li>
            <Emph>Your keys, your choice.</Emph> Use the bundled model access,
            or bring your own model key on Pro.
          </li>
          <li>
            <Emph>Open where we can.</Emph> The core platform backend stays
            closed source, but everything around it - the frontend, the app
            SDK, the app registry, and our sample apps - is source-available
            under the Business Source License 1.1 so you can read, audit, and
            build on it.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Say hello">
        <p>
          We&rsquo;re a small team shipping fast and listening hard.{" "}
          <BetaAccessTrigger source="about" variant="link">
            Try the beta
          </BetaAccessTrigger>
          , join us on{" "}
          <InlineLink href="https://discord.gg/puArEQHYN9">Discord</InlineLink>
          , or reach out at{" "}
          <InlineLink href="mailto:hello@construct.computer">
            hello@construct.computer
          </InlineLink>
          .
        </p>
      </LegalSection>
    </LegalShell>
  )
}
