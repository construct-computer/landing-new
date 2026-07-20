import researchVideoMp4 from "@/assets/research.mp4"
import researchVideo from "@/assets/research.webm"
import researchPoster from "@/assets/research-poster.jpg"
import slackVideoMp4 from "@/assets/slack.mp4"
import slackVideo from "@/assets/slack.webm"
import slackPoster from "@/assets/slack-poster.jpg"

export const WORKFLOW_DEMOS = [
  {
    id: "research",
    title: "Research About",
    accent: "Any Topic",
    description:
      "Construct gathers sources, compares details, and turns messy questions into cited research you can review or share.",
    cta: "Research a Topic",
    nextLabel: "Work Together Across Channels",
    mutedAction: "See Report Samples Generated",
    video: researchVideo,
    videoMp4: researchVideoMp4,
    poster: researchPoster,
    ariaLabel: "Construct researching a topic in the product interface",
  },
  {
    id: "channels",
    title: "Work Together",
    accent: "Across Channels",
    description:
      "Bring Construct into Slack, Telegram, Discord, email, and more so your team can share context, assign work, and move together.",
    cta: "Collaborate",
    nextLabel: "Research About Any Topic",
    mutedAction: "See Shared Threads",
    video: slackVideo,
    videoMp4: slackVideoMp4,
    poster: slackPoster,
    ariaLabel:
      "Construct available across Slack, Telegram, Discord, email, and team collaboration",
  },
] as const

export type WorkflowDemo = (typeof WORKFLOW_DEMOS)[number]
