import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
} from "./LegalShell"

export function AboutPage() {
  return (
    <LegalShell
      title="About"
      subtitle="The AI employee with their own computer"
    >
      <LegalSection title="What we're building">
        <p>
          Construct Computer is an AI agent with its own computer in the
          cloud. Not another chat window — a persistent colleague who logs into
          a full virtual desktop, uses a browser, writes files, runs terminal
          commands, sends email, updates calendars, posts in Slack, and closes
          tickets. You can watch them work, take over any window, and reach
          them from any device.
        </p>
        <p>
          Think of a junior-to-mid-level generalist employee who never sleeps,
          works in parallel, remembers you across sessions, and costs a
          fraction of a salary — with the catch that their work is metered by
          weekly compute budget rather than by hours.
        </p>
      </LegalSection>

      <LegalSection title="The workstation">
        <p>
          Every Construct agent is provisioned with a complete working
          environment on day one:
        </p>
        <LegalList>
          <li>
            A browser-based, macOS-style desktop — dock, Spotlight, Mission
            Control, windows, notifications — where all of the agent&rsquo;s
            work happens in view
          </li>
          <li>
            An isolated Linux sandbox with Python, Node.js, LibreOffice,
            pandoc, ffmpeg, ImageMagick, tesseract OCR, the{" "}
            <Emph>gh</Emph> CLI, and the full document-generation stack
          </li>
          <li>
            A persistent cloud workspace (Cloudflare R2) that survives across
            sessions — up to 2 GB, searchable, drag-and-drop uploadable
          </li>
          <li>
            A dedicated email inbox at{" "}
            <Emph>&lt;agentname&gt;@agents.construct.computer</Emph>
          </li>
          <li>
            A live remote browser that handles JavaScript, cookie banners, and
            bot protection — with country-proxied egress and streamed frames
            you can grab at any time
          </li>
          <li>
            A per-agent calendar, a structured task tracker with dependencies,
            and long-term semantic memory that compounds over time
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="How it works">
        <LegalList>
          <li>
            Each user runs on a dedicated Cloudflare Durable Object with its
            own SQLite state and an isolated Docker-based sandbox — your
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
            One agent, one memory, one workspace — accessible from five
            surfaces: the browser desktop, Slack, Telegram, a Telegram Mini
            App, email, and a macOS menubar companion (Notch)
          </li>
          <li>
            Multi-agent orchestration lets your primary agent spawn explore,
            plan, implement, and QA sub-agents in parallel, with long-running
            work continued by background agents
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="What we believe">
        <LegalList>
          <li>
            <Emph>Transparency over magic.</Emph> Every tool call, command, and
            sub-agent shows up live in the UI, and everything is written to a
            queryable audit log. No hidden work.
          </li>
          <li>
            <Emph>Isolation by default.</Emph> Per-user Durable Objects,
            sandboxed containers, AES-256-GCM encryption for every stored
            credential, and strict resource limits.
          </li>
          <li>
            <Emph>Your keys, your choice.</Emph> Bring your own model key if
            you want to — or use the bundled tiers metered by real provider
            cost, capped per-week and per-burst so you never get surprise
            bills.
          </li>
          <li>
            <Emph>Open where we can.</Emph> The core platform backend stays
            closed source, but everything around it — the frontend, the app
            SDK, the app registry, and our sample apps — is source-available
            under the Business Source License 1.1 so you can read, audit, and
            build on it.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Say hello">
        <p>
          We&rsquo;re a small team shipping fast and listening hard.{" "}
          <InlineLink href="https://beta.construct.computer">
            Try the beta
          </InlineLink>
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
