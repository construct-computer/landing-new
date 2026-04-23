import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
} from "./LegalShell"

export function SupportPage() {
  return (
    <LegalShell title="Support" subtitle="Get help with Construct Computer">
      <LegalSection title="Where to start">
        <p>
          Before reaching out, the quickest path to an answer is usually one
          of these:
        </p>
        <LegalList>
          <li>
            <Emph>Audit Logs window</Emph> — inside the desktop, every tool
            call, sub-agent, command, and error is recorded with a timestamp,
            platform source, and result. If something went wrong, the entry is
            almost always there.
          </li>
          <li>
            <Emph>Activity cards in chat</Emph> — each card is expandable and
            shows the exact inputs and outputs of the tool call the agent ran.
          </li>
          <li>
            <Emph>Usage panel in Settings</Emph> — shows your current weekly
            and 4-hour burst usage, and which model the agent is on. Many
            &ldquo;the agent stopped mid-task&rdquo; reports are budget-caps.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          For questions, bug reports, feature requests, or anything else, you
          can reach our team at:
        </p>
        <p>
          <InlineLink href="mailto:support@construct.computer">
            support@construct.computer
          </InlineLink>
        </p>
        <p>
          We aim to respond to all inquiries within 24 hours on business days.
          Pro subscribers are prioritized.
        </p>
      </LegalSection>

      <LegalSection title="Community">
        <p>
          Join our community for real-time help, feature requests, and
          product announcements:
        </p>
        <LegalList>
          <li>
            <InlineLink href="https://discord.gg/puArEQHYN9">
              Discord
            </InlineLink>{" "}
            — primary community hub for discussions, support, and feature
            requests
          </li>
          <li>
            <InlineLink href="https://x.com/use_construct">
              X / Twitter
            </InlineLink>{" "}
            — product updates and announcements
          </li>
          <li>
            <InlineLink href="https://github.com/construct-computer">
              GitHub
            </InlineLink>{" "}
            — file issues, read the source, or publish an app to the registry
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Reporting issues">
        <p>
          If you encounter a bug or technical issue, please include the
          following when reaching out:
        </p>
        <LegalList>
          <li>A description of what happened and what you expected</li>
          <li>Steps to reproduce the issue, if possible</li>
          <li>Your browser, operating system, and the surface you hit it on
            (web desktop, Slack, Telegram, email, Mini App, macOS Notch)</li>
          <li>Screenshots or screen recordings, if applicable</li>
          <li>
            Any relevant entries from the <Emph>Audit Logs</Emph> window in the
            desktop interface — these contain the exact tool call trace
          </li>
          <li>
            Your approximate timestamp in UTC and your account email, so we
            can correlate with server-side logs
          </li>
        </LegalList>
        <p>
          You can submit bug reports via email at{" "}
          <InlineLink href="mailto:support@construct.computer">
            support@construct.computer
          </InlineLink>{" "}
          or through our{" "}
          <InlineLink href="https://discord.gg/puArEQHYN9">
            Discord server
          </InlineLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="Security concerns">
        <p>
          If you discover a security vulnerability or have concerns about data
          protection, please contact us immediately at{" "}
          <InlineLink href="mailto:security@construct.computer">
            security@construct.computer
          </InlineLink>
          . We take security reports seriously and will respond within 24
          hours. Please do not publicly disclose security vulnerabilities
          before we have had a chance to investigate and address them.
        </p>
      </LegalSection>

      <LegalSection title="Account &amp; billing">
        <p>
          Subscriptions (Free, Starter, Pro) are managed through Dodo Payments
          and can be viewed and modified from your account{" "}
          <Emph>Billing</Emph> settings. Plans are metered by real model-cost
          via Cloudflare AI Gateway, with a rolling 4-hour burst cap and a
          weekly cap that resets every Monday at 00:00 UTC.
        </p>
        <LegalList>
          <li>
            <Emph>Upgrade / downgrade / cancel</Emph> — available directly
            in-app; changes take effect at the next billing cycle.
          </li>
          <li>
            <Emph>Pro auto-downgrade</Emph> — at 80% of the weekly budget, the
            agent automatically switches to a lighter model to stretch the
            remaining budget. It hard-stops at 100% until the week rolls over.
          </li>
          <li>
            <Emph>Bonus credits</Emph> — Pro users can earn additional weekly
            budget by tweeting about the product; the bonus is verified and
            applied automatically.
          </li>
          <li>
            <Emph>Bring your own key</Emph> — available on every tier. BYOK
            traffic does not count against your bundled budget and is billed
            directly by the provider.
          </li>
        </LegalList>
        <p>
          For invoicing questions, refund requests, or general account
          changes, please email{" "}
          <InlineLink href="mailto:support@construct.computer">
            support@construct.computer
          </InlineLink>{" "}
          from the address on the account. We will verify your identity before
          making any changes.
        </p>
      </LegalSection>

      <LegalSection title="Access control &amp; inbound messages">
        <p>
          Your agent can receive messages from Slack, Telegram, and email. To
          prevent misuse, each platform has a configurable policy:{" "}
          <Emph>open</Emph>, <Emph>approval required</Emph>, or{" "}
          <Emph>blocked</Emph>. By default, non-trusted senders land in an{" "}
          <Emph>approval queue</Emph> that you can review and approve/deny
          from the Access Control window in the desktop.
        </p>
        <p>
          If the agent is not responding to an inbound message you expected it
          to act on, check Access Control first — the message is almost
          certainly pending your approval.
        </p>
      </LegalSection>

      <LegalSection title="Data &amp; privacy requests">
        <p>
          You have the right to request access to, correction of, or deletion
          of your personal data. To submit a data request:
        </p>
        <LegalList>
          <li>
            Email{" "}
            <InlineLink href="mailto:support@construct.computer">
              support@construct.computer
            </InlineLink>{" "}
            with the subject line &ldquo;Data Request&rdquo;
          </li>
          <li>Include your account email address</li>
          <li>
            Specify whether you are requesting data access, correction, export,
            or deletion — and whether the request applies to your agent
            memory, workspace files, chat history, audit log, or all data
          </li>
        </LegalList>
        <p>
          You can also delete individual memories at any time from the{" "}
          <Emph>Memory</Emph> app in the desktop, and bulk-delete or export
          from the same screen. We will process formal data requests within 30
          days. For more details, see our{" "}
          <InlineLink href="/privacy">Privacy Policy</InlineLink>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
