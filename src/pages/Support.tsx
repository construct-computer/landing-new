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
            <Emph>Activity app</Emph> - review agent, tool, command, and
            delegated work with timestamps, status, source, and reasons when
            available.
          </li>
          <li>
            <Emph>Activity cards in chat</Emph> - each card is expandable and
            shows the exact inputs and outputs of the tool call the agent ran.
          </li>
          <li>
            <Emph>Usage panel in Settings</Emph> - review plan limits, storage,
            current usage, and bring-your-own-key settings where available.
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
            - primary community hub for discussions, support, and feature
            requests
          </li>
          <li>
            <InlineLink href="https://x.com/use_construct">
              X / Twitter
            </InlineLink>{" "}
            - product updates and announcements
          </li>
          <li>
            <InlineLink href="https://github.com/construct-computer">
              GitHub
            </InlineLink>{" "}
            - file issues, read the source, or publish an app to the registry
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
          <li>Your browser, operating system, and the surface you used
            (web desktop, Slack, Telegram, Discord, or agent inbox)</li>
          <li>Screenshots or screen recordings, if applicable</li>
          <li>
            Any relevant entries from the <Emph>Activity</Emph> app in the
            desktop interface
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
          Subscriptions (Lite, Starter, Pro) are managed through Dodo Payments
          and can be viewed and modified from your account{" "}
          <Emph>Billing</Emph> settings. Plan limits and current usage are shown
          in the product and may change as the beta evolves.
        </p>
        <LegalList>
          <li>
            <Emph>Upgrade / downgrade / cancel</Emph> - available directly
            in-app; changes take effect at the next billing cycle.
          </li>
          <li>
            <Emph>Bring your own key</Emph> - available on Pro. BYOK
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
          Your agent can receive messages from Slack, Telegram, and Discord. To
          prevent misuse, each platform has a configurable policy:{" "}
          <Emph>open</Emph>, <Emph>approval required</Emph>, or{" "}
          <Emph>blocked</Emph>. By default, non-trusted senders land in an{" "}
          <Emph>approval queue</Emph> that you can review and approve/deny
          from the Access Control window in the desktop.
        </p>
        <p>
          If the agent is not responding to an inbound message you expected it
          to act on, check Access Control first - the message is almost
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
            or deletion - and whether the request applies to your agent
            memory, workspace files, chat history, Activity history, or all data
          </li>
        </LegalList>
        <p>
          You can inspect, correct, forget, or restore memories from the{" "}
          <Emph>Memories</Emph> app in the desktop. We will process formal data requests within 30
          days. For more details, see our{" "}
          <InlineLink href="/privacy">Privacy Policy</InlineLink>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
