import imgFeatureAutomations from "@/assets/features/feature-automations.png"
import imgFeatureCloud from "@/assets/features/feature-cloud.png"
import imgFeatureIntegrations from "@/assets/features/feature-integrations.png"
import imgFeatureSchedules from "@/assets/features/feature-schedules.png"
import imgFeatureSocial from "@/assets/features/feature-social.png"

type FeatureCardAsset = {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

const FEATURE_CARDS = {
  schedules: {
    src: imgFeatureSchedules,
    alt: "Schedules repeating tasks with calendar and automated email, meeting, and log monitoring",
    width: 346,
    height: 346,
  },
  integrations: {
    src: imgFeatureIntegrations,
    alt: "More than 1,000 connected apps including Slack, Telegram, Discord, Drive, Gmail, and GitHub",
    width: 712,
    height: 346,
  },
  social: {
    src: imgFeatureSocial,
    alt: "Works as your social manager across Twitter, Reddit, and LinkedIn",
    width: 346,
    height: 346,
  },
  cloud: {
    src: imgFeatureCloud,
    alt: "Everything on cloud with control from any device via mobile dashboard",
    width: 346,
    height: 346,
  },
  automations: {
    src: imgFeatureAutomations,
    alt: "Orchestrate complex multi-step automations with sub-agents and task flows",
    width: 346,
    height: 346,
  },
} as const satisfies Record<string, FeatureCardAsset>

function FeatureCardImage({ card }: { card: FeatureCardAsset }) {
  return (
    <img
      src={card.src}
      alt={card.alt}
      width={card.width}
      height={card.height}
      draggable={false}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full rounded-[18px] shadow-[0_8px_32px_rgba(71,156,223,0.12)]"
    />
  )
}

/**
 * Five-up capability grid from Figma (nodes 961:13130–961:14068).
 * Top row: schedules (346×346) + integrations (712×346).
 * Bottom row: social, cloud, automations (346×346 each).
 */
export function FeatureGridSection({ className }: { className?: string }) {
  return (
    <section
      aria-label="Construct capabilities"
      className={className ?? "pt-16 pb-4 lg:pt-20 lg:pb-6"}
    >
      <div className="mx-auto w-full max-w-[1078px] px-6 lg:px-0">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,346px)_minmax(0,712px)] lg:justify-between">
            <FeatureCardImage card={FEATURE_CARDS.schedules} />
            <FeatureCardImage card={FEATURE_CARDS.integrations} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCardImage card={FEATURE_CARDS.social} />
            <FeatureCardImage card={FEATURE_CARDS.cloud} />
            <FeatureCardImage card={FEATURE_CARDS.automations} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function MobileFeatureGridSection({ className }: { className?: string }) {
  const cards = [
    FEATURE_CARDS.schedules,
    FEATURE_CARDS.integrations,
    FEATURE_CARDS.social,
    FEATURE_CARDS.cloud,
    FEATURE_CARDS.automations,
  ] as const

  return (
    <section
      aria-label="Construct capabilities"
      className={className ?? "relative z-30 pt-12 pb-4"}
    >
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-4 px-5">
        {cards.map((card) => (
          <FeatureCardImage key={card.alt} card={card} />
        ))}
      </div>
    </section>
  )
}
