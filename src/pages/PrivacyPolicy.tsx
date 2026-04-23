import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
  LegalSubheading,
} from "./LegalShell"

export function PrivacyPolicyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="April 23, 2026">
      <LegalSection title="1. Introduction">
        <p>
          Construct Computer (&ldquo;Construct,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates a cloud-based
          virtual desktop platform where each user receives an isolated
          personal computer powered by an AI agent. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your
          information when you visit our website at construct.computer, use
          our platform at beta.construct.computer, interact with your agent
          through Slack, Telegram, the Telegram Mini App, email, or our macOS
          companion app, or use any of our related services (collectively, the
          &ldquo;Services&rdquo;). By using the Services, you consent to the
          practices described in this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <LegalSubheading>2.1 Account Information</LegalSubheading>
        <p>When you create an account or join our waitlist, we collect:</p>
        <LegalList>
          <li>
            Your email address and name (provided directly or via Google
            OAuth)
          </li>
          <li>
            Google profile information if you sign in with Google, including
            your profile ID and avatar URL
          </li>
          <li>
            Any additional information you voluntarily provide, such as
            responses on our waitlist form
          </li>
        </LegalList>

        <LegalSubheading>2.2 Virtual Desktop &amp; Agent Data</LegalSubheading>
        <p>
          When you use the Construct platform, the following data is created
          and stored within your isolated virtual environment:
        </p>
        <LegalList>
          <li>
            <Emph>Workspace files</Emph> — any files, documents, code, or
            other content you upload or that the AI agent creates on your
            behalf, stored in per-user Cloudflare R2 storage
          </li>
          <li>
            <Emph>Chat &amp; session history</Emph> — conversations between
            you and your agent across every surface (web desktop, Slack,
            Telegram, Mini App, email), stored in your per-user Cloudflare
            Durable Object
          </li>
          <li>
            <Emph>Agent memory</Emph> — semantic long-term memory via Mem0:
            after each turn, durable facts are automatically extracted and
            relevance-ranked memories are injected on new tasks. You can view,
            search, forget, or bulk-delete memories at any time from the
            Memory app
          </li>
          <li>
            <Emph>Knowledge wiki</Emph> — a persistent <code>wiki/</code>{" "}
            directory inside your workspace that the agent maintains as
            long-form reference notes
          </li>
          <li>
            <Emph>Task tracker &amp; scheduled tasks</Emph> — structured tasks
            with dependencies and one-shot future actions, stored in your
            agent&rsquo;s SQLite state
          </li>
          <li>
            <Emph>Calendar</Emph> — per-agent events and reminders, stored in
            Cloudflare D1
          </li>
          <li>
            <Emph>Agent email inbox</Emph> — each agent gets its own address at{" "}
            <Emph>&lt;agentname&gt;@agents.construct.computer</Emph>; incoming
            messages, threads, and sent replies are retained to provide thread
            state
          </li>
          <li>
            <Emph>Audit log</Emph> — every tool call, system event, and error
            is written to a queryable activity log with timestamp, category,
            platform source, duration, and result
          </li>
          <li>
            <Emph>Access-control records</Emph> — per-platform inbound policy,
            trusted-user list, and the approval queue for non-trusted senders
          </li>
          <li>
            <Emph>Voice audio</Emph> — when you use voice input, audio is
            streamed to a speech-to-text provider for transcription and is
            not retained after the transcript is returned
          </li>
        </LegalList>

        <LegalSubheading>2.3 Integration Credentials</LegalSubheading>
        <p>
          If you connect third-party services to your Construct environment,
          we store the credentials needed to maintain those connections:
        </p>
        <LegalList>
          <li>
            <Emph>Composio connected accounts</Emph> — OAuth tokens for any of
            the 1,000+ SaaS apps you connect via Composio (Google Workspace,
            Gmail, Slack, Notion, Linear, Jira, HubSpot, GitHub, Airtable,
            Dropbox, and more). Connection management, scopes, and refresh are
            handled through Composio.
          </li>
          <li>
            <Emph>Direct integrations</Emph> — Slack workspace tokens,
            Telegram bot tokens, and any OAuth tokens issued directly to
            Construct
          </li>
          <li>
            <Emph>App Registry credentials</Emph> — per-app auth (OAuth2, API
            key, Bearer, or HTTP Basic) for any app you install from the
            public{" "}
            <InlineLink href="https://registry.construct.computer">
              Construct App Registry
            </InlineLink>
          </li>
          <li>
            <Emph>Bring-Your-Own-Key (BYOK) API keys</Emph> — optional model
            provider keys (for example, OpenRouter) that you choose to use
            instead of our bundled provisioning
          </li>
        </LegalList>
        <p>
          All integration credentials and BYOK API keys are encrypted at rest
          using AES-256-GCM (Web Crypto) and injected scoped per-call.
        </p>

        <LegalSubheading>
          2.4 Billing &amp; Subscription Data
        </LegalSubheading>
        <p>
          If you subscribe to a paid plan, we store the subscription state
          (tier, status, period) and a customer identifier from our payments
          processor. Payment method details (card numbers, bank info) are
          never stored by Construct — they are handled entirely by our
          processor, Dodo Payments. We also record per-call usage (service,
          model, token counts, latency, and real dollar cost via Cloudflare AI
          Gateway) so you can view usage history and we can enforce weekly and
          burst caps.
        </p>

        <LegalSubheading>2.5 Technical &amp; Usage Data</LegalSubheading>
        <LegalList>
          <li>IP address (used for rate limiting and security purposes)</li>
          <li>Browser type and operating system</li>
          <li>
            Authentication tokens (JSON Web Tokens stored in your
            browser&rsquo;s local storage)
          </li>
          <li>
            Aggregated analytics via PostHog, including per-LLM-generation
            events (token counts, latency, cost) used for observability and
            product improvement
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <LegalList>
          <li>
            <Emph>Providing the Services</Emph> — to operate your agent and
            sandbox, maintain your workspace, route inbound messages across
            surfaces, and facilitate the integrations you connect
          </li>
          <li>
            <Emph>Authentication</Emph> — to verify your identity via Google
            OAuth or magic-link email and manage your session
          </li>
          <li>
            <Emph>Personalization</Emph> — to enable your agent to remember
            preferences, context, and prior interactions across sessions and
            platforms
          </li>
          <li>
            <Emph>Communication</Emph> — to send you transactional emails
            (magic-link sign-in, usage notifications at 50/75/90/100% of
            budget, subscription events) and, with your consent, product
            updates
          </li>
          <li>
            <Emph>Billing</Emph> — to process subscriptions, meter usage
            against plan caps, and reconcile BYOK vs bundled cost
          </li>
          <li>
            <Emph>Security &amp; abuse prevention</Emph> — to enforce rate
            limits, verify webhook signatures (Slack HMAC-SHA256, Telegram,
            Dodo Payments), detect unauthorized access, and protect
            infrastructure
          </li>
          <li>
            <Emph>Improvement</Emph> — to diagnose technical issues, monitor
            model behavior via aggregated analytics, and improve the Services
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Third-Party Services & Data Sharing">
        <p>
          We do not sell your personal information. Your data may be shared
          with or processed by third parties only in the following
          circumstances:
        </p>

        <LegalSubheading>4.1 Services You Connect</LegalSubheading>
        <p>
          When you choose to integrate third-party services with your
          Construct environment, data is exchanged with those services as
          necessary to provide the integration:
        </p>
        <LegalList>
          <li>
            <Emph>Google</Emph> — if you sign in with Google or connect Google
            Workspace tools, your account data, calendar events, and files
            are exchanged with Google&rsquo;s APIs as needed
          </li>
          <li>
            <Emph>Composio</Emph> — manages OAuth and executes tool calls
            against 1,000+ SaaS apps you connect. Prompts, parameters, and
            returned results for tools you invoke are processed by Composio
            on your behalf
          </li>
          <li>
            <Emph>Slack &amp; Telegram</Emph> — if you connect these services,
            messages, files, and metadata are processed to enable
            communication with your agent
          </li>
          <li>
            <Emph>Model providers</Emph> — prompts and conversations are sent
            to the LLM provider serving your plan. By default, bundled tiers
            run on Cloudflare Workers AI and AI Gateway. Pro traffic can
            downgrade to Google Gemini when budget is tight. If you provide a
            BYOK OpenRouter key, your traffic is routed directly through
            OpenRouter — see{" "}
            <InlineLink href="https://openrouter.ai/privacy">
              OpenRouter&rsquo;s privacy policy
            </InlineLink>
          </li>
          <li>
            <Emph>TinyFish</Emph> — powers the remote browser for the agent.
            Target URLs and form data relevant to a browsing task are sent to
            TinyFish; rendered frames are streamed back for you to view
          </li>
          <li>
            <Emph>AgentMail</Emph> — provides the{" "}
            <Emph>@agents.construct.computer</Emph> inbox. Inbound and
            outbound email content is handled by AgentMail
          </li>
          <li>
            <Emph>ElevenLabs (Scribe Realtime)</Emph> &amp;{" "}
            <Emph>Cloudflare Whisper</Emph> — voice input audio is transcribed
            via these providers. Audio is not retained after transcription
          </li>
          <li>
            <Emph>Mem0</Emph> — hosts your agent&rsquo;s long-term semantic
            memory. Extracted facts are stored and queried via Mem0
          </li>
          <li>
            <Emph>Custom apps from the App Registry</Emph> — when you invoke
            an app tool, parameters are routed through our registry worker to
            the app&rsquo;s Cloudflare Worker endpoint, with your injected
            credentials for that app
          </li>
        </LegalList>

        <LegalSubheading>4.2 Platform &amp; Infrastructure</LegalSubheading>
        <p>
          Construct runs on Cloudflare (Workers, Durable Objects, D1, R2,
          Sandbox SDK, AI Gateway). Data-at-rest and in-transit for platform
          state is handled by Cloudflare. Aggregated product analytics flow
          to PostHog. Application logs flow to Cloudflare Logs for
          observability.
        </p>

        <LegalSubheading>4.3 Email &amp; Payments</LegalSubheading>
        <p>
          We use <Emph>Resend</Emph> to deliver transactional emails
          (magic-link sign-in, usage alerts). We use <Emph>Dodo Payments</Emph>{" "}
          to process subscriptions; Dodo holds payment-method data and sends
          us signed webhooks for subscription lifecycle events. Your email
          address is shared with these providers solely for these purposes.
        </p>

        <LegalSubheading>4.4 Legal &amp; Safety</LegalSubheading>
        <p>
          We may disclose your information if required by law, regulation, or
          legal process, or if we believe in good faith that disclosure is
          necessary to protect the rights, safety, or property of Construct
          Computer, our users, or the public.
        </p>

        <LegalSubheading>4.5 Business Transfers</LegalSubheading>
        <p>
          In the event of a merger, acquisition, reorganization, or sale of
          assets, your information may be transferred as part of that
          transaction. We will notify you of any such change.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Storage & Security">
        <p>
          We take the security of your data seriously and implement the
          following measures:
        </p>
        <LegalList>
          <li>
            <Emph>Per-user isolation</Emph> — each user runs on a dedicated
            Cloudflare Durable Object with its own SQLite state and a
            dedicated Cloudflare Sandbox (Docker) container. Workspace data is
            separated at the storage layer, not at the application layer
          </li>
          <li>
            <Emph>Encryption at rest</Emph> — OAuth tokens, BYOK API keys, and
            App Registry credentials are encrypted with AES-256-GCM (Web
            Crypto) before being written to D1, and decrypted only at
            call-time
          </li>
          <li>
            <Emph>Resource &amp; budget limits</Emph> — each container has CPU,
            memory, and timeout limits; each user has a rolling 4-hour burst
            cap and a weekly spending cap, both denominated in real provider
            cost via Cloudflare AI Gateway
          </li>
          <li>
            <Emph>Rate limiting</Emph> — authentication endpoints, app calls,
            and API routes are rate-limited to prevent brute-force and
            resource-abuse attacks
          </li>
          <li>
            <Emph>Webhook verification</Emph> — Slack HMAC-SHA256 signatures
            with a 5-minute replay window, Telegram bot-token verification,
            and signed Dodo Payments events
          </li>
          <li>
            <Emph>JWT authentication</Emph> — sessions are managed via signed
            JSON Web Tokens with configurable expiration
          </li>
          <li>
            <Emph>Role &amp; access control</Emph> — inbound senders on Slack,
            Telegram, and email are tagged OWNER, TRUSTED, GUEST, or BLOCKED
            before the agent ever sees the message, and non-trusted senders
            go to an approval queue
          </li>
        </LegalList>
        <p>
          Despite these measures, no system is completely secure. We cannot
          guarantee absolute security of your data.
        </p>
      </LegalSection>

      <LegalSection title="6. Metered Usage and Bring Your Own Key">
        <p>
          Construct supports two billing modes, which you can mix per request:
        </p>
        <LegalList>
          <li>
            <Emph>Bundled (default)</Emph> — your plan includes a weekly
            budget in USD at real model cost via Cloudflare AI Gateway, with a
            rolling 4-hour burst cap. Usage is metered per-generation and is
            visible in your account&rsquo;s usage history. Pro automatically
            downgrades to a lighter model at 80% of weekly budget and
            hard-stops at 100%
          </li>
          <li>
            <Emph>BYOK</Emph> — you may provide your own API keys (e.g.
            OpenRouter). BYOK traffic is billed directly by the provider, does
            not count against your bundled budget, and is used solely to make
            requests on your behalf. We do not monitor, log, or retain the
            content of provider responses beyond what is needed to display
            results and maintain conversation context
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Data Retention">
        <p>We retain your data as follows:</p>
        <LegalList>
          <li>
            <Emph>Account data</Emph> — retained for as long as your account
            is active. You may request deletion at any time
          </li>
          <li>
            <Emph>Virtual desktop data</Emph> — workspace files, agent memory,
            chat history, audit logs, calendar, and agent email persist for
            as long as your account is active and are deleted when your
            account is closed
          </li>
          <li>
            <Emph>Voice audio</Emph> — not retained; only the transcript is
            saved to the conversation
          </li>
          <li>
            <Emph>Webhook event IDs</Emph> — retained briefly for idempotency
            and replay protection, then pruned
          </li>
          <li>
            <Emph>Waitlist data</Emph> — email addresses and responses are
            retained until you are granted access or request removal
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Cookies & Local Storage">
        <p>
          The Construct platform does not use cookies for user session
          management. Authentication tokens are stored in your browser&rsquo;s
          local storage. We do not use third-party tracking cookies. An
          HTTP-only session cookie is used only for administrative access to
          internal dashboards and does not apply to regular users.
        </p>
      </LegalSection>

      <LegalSection title="9. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <LegalList>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate or incomplete data</li>
          <li>
            Request deletion of your account and all associated data,
            including your sandbox container, workspace files, memory, audit
            log, and agent email
          </li>
          <li>
            Inspect, search, and delete individual memories at any time from
            the Memory app
          </li>
          <li>Object to or restrict the processing of your data</li>
          <li>Withdraw consent for optional processing at any time</li>
          <li>Request a portable copy of your data</li>
          <li>
            Disconnect third-party integrations (Composio connections, direct
            OAuth, App Registry apps) through your account settings, which
            revokes stored credentials
          </li>
        </LegalList>
        <p>
          To exercise any of these rights, please contact us — see our{" "}
          <InlineLink href="/support">Support page</InlineLink>.
        </p>
      </LegalSection>

      <LegalSection title="10. Children's Privacy">
        <p>
          The Services are not directed to individuals under the age of 13. We
          do not knowingly collect personal information from children under
          13. If we become aware that we have collected data from a child
          under 13 without parental consent, we will promptly delete that
          information and terminate the associated account.
        </p>
      </LegalSection>

      <LegalSection title="11. Autonomous Browsing &amp; Third-Party Links">
        <p>
          Our website and your virtual desktop environment may contain links
          to third-party websites. The AI agent may also navigate to
          third-party websites on your behalf via the remote browser, extract
          content, or submit forms. We are not responsible for the privacy
          practices or content of those websites, and you are responsible for
          tasks you delegate to the agent. We encourage you to review the
          privacy policies of any third-party service you connect or visit.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by posting the updated policy on this page
          with a revised &ldquo;Last updated&rdquo; date. Your continued use
          of the Services after any changes constitutes your acceptance of
          the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Us">
        <p>
          If you have any questions about this Privacy Policy or wish to
          exercise your data rights, please contact us at:{" "}
          <InlineLink href="mailto:support@construct.computer">
            support@construct.computer
          </InlineLink>
          .
        </p>
      </LegalSection>
    </LegalShell>
  )
}
