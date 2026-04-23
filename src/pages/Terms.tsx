import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
} from "./LegalShell"

export function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" updated="April 23, 2026">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using the Construct Computer website at
          construct.computer, the Construct platform at
          beta.construct.computer, interacting with your agent through Slack,
          Telegram, the Telegram Mini App, email, or our macOS companion app
          (Notch), or using any related services (collectively, the
          &ldquo;Services&rdquo;), you agree to be bound by these Terms &amp;
          Conditions (&ldquo;Terms&rdquo;). If you do not agree to these
          Terms, you must not access or use the Services.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 13 years of age to use the Services. By using
          the Services, you represent and warrant that you meet this age
          requirement and have the legal capacity to enter into these Terms.
          Access to the platform may be subject to a waitlist or invitation
          system at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="3. Description of Services">
        <p>
          Construct Computer provides a cloud-based virtual desktop platform
          where each user receives an isolated personal computer operated by
          an AI agent. The Services include, but are not limited to:
        </p>
        <LegalList>
          <li>
            A browser-based, macOS-style virtual desktop with a live browser,
            terminal, file system, code editor, and activity view
          </li>
          <li>
            An AI agent that can operate the desktop on your behalf —
            including web search, remote browsing, document generation
            (PPTX, DOCX, XLSX, PDF, CSV, HTML, SVG), code and shell work via
            the <Emph>gh</Emph> CLI, OCR, and image processing
          </li>
          <li>
            A dedicated email address at{" "}
            <Emph>&lt;agentname&gt;@agents.construct.computer</Emph>, with
            full send/read/reply/forward support
          </li>
          <li>
            A per-agent calendar, scheduled one-shot tasks, a structured task
            tracker with dependencies, and persistent long-term memory
          </li>
          <li>
            Multi-agent orchestration — the ability for the primary agent to
            spawn explore, plan, implement, and QA sub-agents, plus background
            agents that continue work after the parent turn ends
          </li>
          <li>
            Integrations via <Emph>Composio</Emph> (1,000+ SaaS apps), direct
            connectors for Slack and Telegram, and the open{" "}
            <InlineLink href="https://registry.construct.computer">
              Construct App Registry
            </InlineLink>{" "}
            where anyone can publish custom apps via a GitHub pull request
            against{" "}
            <InlineLink href="https://github.com/construct-computer/app-registry">
              construct-computer/app-registry
            </InlineLink>
          </li>
          <li>
            A full audit log, per-platform access-control policies, and an
            approval queue for inbound messages from non-trusted senders
          </li>
          <li>
            Availability across five surfaces that share one agent, one
            memory, and one workspace: web desktop, Slack, Telegram, Telegram
            Mini App, email, and the macOS Notch companion app
          </li>
        </LegalList>
        <p>
          The Services are under active development. We reserve the right to
          modify, suspend, or discontinue any feature or aspect of the
          Services at any time without prior notice.
        </p>
      </LegalSection>

      <LegalSection title="4. Accounts & Authentication">
        <p>
          To use the platform, you must create an account using one of our
          supported authentication methods (Google OAuth or email magic-link
          via Resend). You agree to:
        </p>
        <LegalList>
          <li>
            Provide accurate and complete information when creating your
            account
          </li>
          <li>
            Maintain the security of your account and not share access with
            others
          </li>
          <li>
            Notify us immediately of any unauthorized use of your account
          </li>
          <li>
            Accept responsibility for all activity that occurs under your
            account, including actions taken by the AI agent on your behalf
            across every surface
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Subscription Plans & Usage Limits">
        <p>
          Construct offers Free, Starter, and Pro plans. Pricing is metered by
          real model cost via Cloudflare AI Gateway, not per-message. Plan
          limits are set in code and may change; current values are listed in
          your in-app Billing settings. You agree that:
        </p>
        <LegalList>
          <li>
            Each plan has a <Emph>weekly USD budget</Emph> and a{" "}
            <Emph>rolling 4-hour burst cap</Emph>, both denominated in real
            provider cost. The weekly cap resets every Monday at 00:00 UTC
          </li>
          <li>
            Features such as agent email sending, background agents, sandbox
            timeout, maximum loop iterations, concurrent sub-agents, scheduled
            tasks, and workspace storage vary by plan
          </li>
          <li>
            On Pro, when you reach 80% of the weekly budget, the agent may
            automatically downgrade to a lighter model to stretch remaining
            budget; at 100% the agent is paused until the weekly window
            resets. Usage notifications are sent at 50/75/90/100%
          </li>
          <li>
            Subscriptions are processed through <Emph>Dodo Payments</Emph>.
            You can upgrade, downgrade, or cancel at any time from the in-app
            Billing settings; changes take effect at the next billing cycle
            unless otherwise stated
          </li>
          <li>
            Bonus weekly budget may be earned via product-related actions
            (such as tweeting about the product) and is granted at our
            discretion
          </li>
          <li>
            Attempting to circumvent or abuse budget caps, bonus credits, or
            resource limits may result in suspension or termination
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Bring Your Own Key (BYOK)">
        <p>
          Construct supports Bring Your Own Key on every tier. BYOK is
          optional and supplements (or replaces) the bundled metered usage.
          You are responsible for:
        </p>
        <LegalList>
          <li>
            Providing your own API keys for model or tool providers (for
            example, OpenRouter)
          </li>
          <li>
            All usage charges incurred through your API keys with those
            third-party providers
          </li>
          <li>
            Complying with the terms of service of each third-party provider
            whose API keys you use within Construct
          </li>
          <li>
            Keeping your API keys secure and revoking them if you suspect
            compromise
          </li>
        </LegalList>
        <p>
          BYOK traffic does not count against your bundled weekly budget.
          Construct Computer is not liable for any charges, data processing,
          or other consequences arising from your use of third-party services
          via your own API keys.
        </p>
      </LegalSection>

      <LegalSection title="7. AI Agent & Autonomous Actions">
        <p>
          The AI agent operates within your virtual desktop and can perform
          actions autonomously on your behalf across every connected surface.
          You acknowledge and agree that:
        </p>
        <LegalList>
          <li>
            The agent may browse websites, execute commands, create and
            modify files, send emails, post on Slack or Telegram, schedule
            future tasks, spawn sub-agents, call integration tools via
            Composio or the App Registry, and interact with connected services
            as part of completing tasks you assign
          </li>
          <li>
            AI-generated outputs (including code, text, files, emails, and
            actions) may contain errors, inaccuracies, or unexpected results.
            You are responsible for reviewing and verifying all agent output
            before relying on it or sharing it externally
          </li>
          <li>
            You retain the ability to intervene, take over, or stop the agent
            at any time. You are ultimately responsible for the consequences
            of actions taken by the agent in your environment
          </li>
          <li>
            Agent memory, task state, and context are based on your prior
            interactions; recall and summaries may not always be accurate or
            complete, and long sessions may undergo automatic compaction
          </li>
          <li>
            We do not guarantee the accuracy, reliability, or suitability of
            AI-generated content for any particular purpose
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Acceptable Use">
        <p>You agree not to use the Services to:</p>
        <LegalList>
          <li>
            Violate any applicable law, regulation, or third-party rights
          </li>
          <li>
            Direct the AI agent to perform illegal, harmful, abusive, or
            deceptive actions — including impersonation, unauthorized
            surveillance, or phishing
          </li>
          <li>
            Attempt to escape or circumvent container isolation, budget caps,
            rate limits, or other platform limits
          </li>
          <li>
            Interfere with or disrupt the Services, infrastructure, or other
            users&rsquo; environments
          </li>
          <li>
            Use the Services for cryptocurrency mining, DDoS, spam, mass
            unsolicited messaging, or other resource-abusive activities
          </li>
          <li>
            Attempt to access other users&rsquo; containers, data, or accounts
          </li>
          <li>
            Transmit malware, viruses, or other harmful code through the
            Services
          </li>
          <li>
            Reverse engineer, decompile, or disassemble any aspect of the
            Services except as permitted by applicable law or the Business
            Source License 1.1
          </li>
          <li>
            Use the Services to violate the terms of service of any
            third-party service (Google, Slack, Telegram, Composio apps, App
            Registry apps, model providers) accessed through your virtual
            desktop
          </li>
          <li>
            Upload deliverables produced for you to unauthorized external hosts
            when our workspace attachment flow is available
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. User Content">
        <p>
          &ldquo;User Content&rdquo; includes all files, code, text, chat
          messages, emails, memories, calendar events, and other content that
          you create or that the AI agent creates on your behalf within your
          virtual desktop environment. Regarding User Content:
        </p>
        <LegalList>
          <li>You retain ownership of your User Content</li>
          <li>
            You grant Construct Computer a limited, non-exclusive license to
            store, process, transmit, and display your User Content solely as
            necessary to provide the Services to you
          </li>
          <li>
            You are responsible for ensuring that your User Content does not
            violate any laws or third-party rights
          </li>
          <li>
            We do not claim ownership over any content generated by the AI
            agent within your environment
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="10. Intellectual Property & Licensing">
        <p>
          The Construct Computer platform, including its software, design,
          branding, documentation, and related intellectual property, is
          owned by Construct Computer and its contributors. The{" "}
          <Emph>core platform backend</Emph> (the hosted agent runtime that
          powers the Services) is proprietary and closed source. All other
          components we publish — including the web frontend, the{" "}
          <Emph>@construct-computer/app-sdk</Emph>, the sample apps, and
          supporting libraries — are released under the{" "}
          <Emph>Business Source License 1.1</Emph>, which permits
          non-commercial use. Commercial use of BSL-licensed components prior
          to the Change Date specified in each repository&rsquo;s LICENSE file
          requires a separate license from us. Except as expressly permitted
          by the applicable license or with our prior written consent, you
          may not copy, modify, distribute, sell, or create derivative works
          of the Services or any closed-source component. The{" "}
          <InlineLink href="https://registry.construct.computer">
            Construct App Registry
          </InlineLink>{" "}
          (source at{" "}
          <InlineLink href="https://github.com/construct-computer/app-registry">
            construct-computer/app-registry
          </InlineLink>
          ) is available under the MIT license; apps you publish remain your
          own intellectual property, subject to the Registry&rsquo;s
          contribution terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-Party Services & Integrations">
        <p>
          The Services integrate with and facilitate access to third-party
          services, including but not limited to:
        </p>
        <LegalList>
          <li>
            <Emph>Composio</Emph> — 1,000+ SaaS app connectors (Google
            Workspace, Gmail, Slack, Notion, Linear, Jira, HubSpot, GitHub,
            Airtable, Dropbox, and more)
          </li>
          <li>
            <Emph>Direct OAuth</Emph> to Google, Slack, and Telegram
          </li>
          <li>
            <Emph>Model providers</Emph> — Cloudflare Workers AI, Cloudflare
            AI Gateway, Google Gemini, and OpenRouter (via BYOK)
          </li>
          <li>
            <Emph>Infrastructure &amp; tooling</Emph> — TinyFish (remote
            browser), AgentMail (agent email), ElevenLabs Scribe Realtime and
            Cloudflare Whisper (voice), Mem0 (long-term memory), PostHog
            (product analytics), Resend (transactional email), and Dodo
            Payments (billing)
          </li>
          <li>
            <Emph>App Registry apps</Emph> — custom Cloudflare Worker apps
            published by third parties
          </li>
        </LegalList>
        <p>You acknowledge that:</p>
        <LegalList>
          <li>
            Your use of third-party services is governed by those
            services&rsquo; own terms and privacy policies
          </li>
          <li>
            Construct Computer is not responsible for the availability,
            accuracy, content, or conduct of any third-party service or
            third-party app
          </li>
          <li>
            Third-party services may change, restrict, or discontinue their
            APIs, which could affect the functionality of Construct
            integrations
          </li>
          <li>
            You are responsible for complying with the terms of service of any
            third-party service you connect or access through the platform
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="12. Disclaimer of Warranties">
        <p>
          The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. Construct Computer makes no warranties,
          whether express, implied, statutory, or otherwise, including implied
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the Services will be
          uninterrupted, error-free, secure, or that the AI agent will produce
          accurate or reliable results. The Services are in active development
          and may contain bugs, errors, or incomplete features.
        </p>
      </LegalSection>

      <LegalSection title="13. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Construct Computer and its
          officers, directors, employees, contributors, and agents shall not
          be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits, revenue, data, or goodwill
          arising from: your use of or inability to use the Services; any
          actions taken by the AI agent or its sub-agents; any content or
          data loss within your virtual environment; reliance on AI-generated
          output; charges incurred through third-party API keys or connected
          services; or any unauthorized access to your account or data.
        </p>
      </LegalSection>

      <LegalSection title="14. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Construct Computer
          and its affiliates, officers, directors, employees, and contributors
          from and against any claims, liabilities, damages, losses, and
          expenses (including reasonable attorneys&rsquo; fees) arising out
          of or in connection with: your use of the Services; your violation
          of these Terms; actions taken by the AI agent in your environment;
          your use of third-party services or App Registry apps via the
          platform; or your User Content.
        </p>
      </LegalSection>

      <LegalSection title="15. Termination">
        <p>
          We reserve the right to suspend or terminate your access to the
          Services at any time, with or without cause, and with or without
          notice — including for violations of these Terms, suspected abuse,
          or failure to pay. You may also delete your account at any time.
          Upon termination:
        </p>
        <LegalList>
          <li>Your right to use the Services will immediately cease</li>
          <li>
            Your sandbox container, workspace files, agent memory, chat
            history, calendar, email inbox, and audit log may be deleted
          </li>
          <li>
            Stored integration credentials (Composio, direct OAuth, App
            Registry apps, BYOK keys) will be revoked and deleted
          </li>
          <li>
            Active subscriptions are cancelled; metered usage incurred prior
            to termination remains payable
          </li>
          <li>
            Provisions of these Terms that by their nature should survive
            termination (including intellectual property, disclaimers,
            limitation of liability, and indemnification) shall survive
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="16. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with
          the laws of India, without regard to conflict of law principles.
          Any disputes arising from these Terms or the Services shall be
          subject to the exclusive jurisdiction of the courts in India.
        </p>
      </LegalSection>

      <LegalSection title="17. Changes to These Terms">
        <p>
          We may revise these Terms at any time by posting the updated
          version on this page with a revised &ldquo;Last updated&rdquo;
          date. Your continued use of the Services after any changes
          constitutes your acceptance of the revised Terms. For material
          changes, we will make reasonable efforts to notify you via email or
          through the platform.
        </p>
      </LegalSection>

      <LegalSection title="18. Contact Us">
        <p>
          If you have any questions about these Terms, please contact us at:{" "}
          <InlineLink href="mailto:support@construct.computer">
            support@construct.computer
          </InlineLink>
          . For product help and bug reports, see our{" "}
          <InlineLink href="/support">Support page</InlineLink>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
