import {
  Emph,
  InlineLink,
  LegalList,
  LegalSection,
  LegalShell,
} from "./LegalShell"

export function CareersPage() {
  return (
    <LegalShell
      title="Careers"
      subtitle="We're not hiring right now — but we'd love to hear from you"
    >
      <LegalSection title="Current status">
        <p>
          Construct is a small, focused team shipping quickly. We don&rsquo;t
          have any open roles at the moment, and we&rsquo;re not actively
          recruiting.
        </p>
        <p>
          If that changes, new openings will be posted here first and shared
          from our{" "}
          <InlineLink href="https://x.com/use_construct">
            X / Twitter
          </InlineLink>{" "}
          and{" "}
          <InlineLink href="https://linkedin.com/company/construct-computer">
            LinkedIn
          </InlineLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="Stay in touch">
        <p>
          If you&rsquo;d still like to introduce yourself for future roles, we
          keep an informal talent list. The best way to land on it is to show
          us something real:
        </p>
        <LegalList>
          <li>
            <Emph>Send work, not a r&eacute;sum&eacute;.</Emph> A link to
            something you&rsquo;ve built — a project, a PR, a teardown, a
            post — tells us more than a CV ever will.
          </li>
          <li>
            <Emph>Tell us what you&rsquo;d want to build here.</Emph> A couple
            of sentences on the problem you&rsquo;d love to own at Construct
            beats a generic cover letter.
          </li>
          <li>
            <Emph>Include your GitHub, X, or LinkedIn.</Emph> Whatever best
            represents how you think and ship.
          </li>
        </LegalList>
        <p>
          Email us at{" "}
          <InlineLink href="mailto:careers@construct.computer">
            careers@construct.computer
          </InlineLink>
          . We read every message and keep them on file; we&rsquo;ll reach
          out when we open a role that matches.
        </p>
      </LegalSection>

      <LegalSection title="What working here looks like">
        <p>
          For context when we do hire — this is the kind of team we&rsquo;re
          building:
        </p>
        <LegalList>
          <li>
            <Emph>Small and remote.</Emph> A distributed team that ships
            across time zones. Low meeting load, high written communication.
          </li>
          <li>
            <Emph>Generalists welcome.</Emph> Our work spans agents, web, infra
            (Cloudflare Workers, Durable Objects, D1, R2), and product design.
            We value range.
          </li>
          <li>
            <Emph>Ownership over process.</Emph> You pick up a problem, scope
            it, ship it, measure it. We trust people to make the call.
          </li>
          <li>
            <Emph>Build in public where we can.</Emph> The core platform
            backend stays closed source, but the frontend, SDK, sample apps,
            and app registry are all source-available, and we post what
            we&rsquo;re working on.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Other ways to contribute">
        <p>
          You don&rsquo;t need a job here to work with us:
        </p>
        <LegalList>
          <li>
            <Emph>Publish an app.</Emph> Anyone can build a Construct app and
            publish it to the public{" "}
            <InlineLink href="https://registry.construct.computer">
              app registry
            </InlineLink>{" "}
            — every listing is a PR against{" "}
            <InlineLink href="https://github.com/construct-computer/app-registry">
              construct-computer/app-registry
            </InlineLink>
            .
          </li>
          <li>
            <Emph>Open issues and PRs.</Emph> The frontend, SDK, sample
            apps, and app registry are all source-available on{" "}
            <InlineLink href="https://github.com/construct-computer">
              GitHub
            </InlineLink>
            . Bug reports, docs fixes, and feature proposals are all welcome.
          </li>
          <li>
            <Emph>Join the community.</Emph> Hang out on{" "}
            <InlineLink href="https://discord.gg/puArEQHYN9">
              Discord
            </InlineLink>{" "}
            — it&rsquo;s where a lot of the product direction gets shaped.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="A note on recruiters">
        <p>
          We&rsquo;re not currently working with external recruiters or
          staffing agencies. Unsolicited candidate submissions will not
          create any obligation on our part.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
