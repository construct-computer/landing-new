import imgPricingFree from "@/assets/pricing-free.jpg"
import imgPricingPro from "@/assets/pricing-pro.jpg"
import imgPricingStarter from "@/assets/pricing-starter.jpg"

export type PricingFeatureIconId =
  | "bolt"
  | "footprint"
  | "timer"
  | "tree"
  | "cloud"
  | "integration"
  | "key"
  | "email"
  | "tabs"

export type PricingFeature = {
  readonly label: string
  readonly icon: PricingFeatureIconId
}

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    image: imgPricingFree,
    imageAlt: "Dark night sky with bright cumulus clouds illuminated by moonlight",
    features: [
      { label: "15 Steps Per Task", icon: "footprint" },
      { label: "5 min Task Execution Time", icon: "timer" },
      { label: "2 Concurrent Subagents", icon: "tree" },
      { label: "100 Mb Cloud Storage", icon: "cloud" },
      { label: "Full Platform Integrations", icon: "integration" },
      { label: "Bring Your Own Keys Available", icon: "key" },
    ],
  },
  {
    name: "Starter",
    price: "$59",
    image: imgPricingStarter,
    imageAlt: "Mystical cloud-shrouded golden temple gateway opening into bright light",
    features: [
      { label: "6x More Usage Than Free", icon: "bolt" },
      { label: "50 Steps Per Task", icon: "footprint" },
      { label: "1 hr Task Execution Time", icon: "timer" },
      { label: "6 Concurrent Subagents", icon: "tree" },
      { label: "1 Gb Cloud Storage", icon: "cloud" },
      { label: "Full Platform Integrations", icon: "integration" },
      { label: "Bring Your Own Keys Available", icon: "key" },
      { label: "Agent Email Address", icon: "email" },
    ],
  },
  {
    name: "Pro",
    price: "$299",
    image: imgPricingPro,
    imageAlt: "Vivid orange and red sunburst with radiant light rays",
    features: [
      { label: "45x More Usage Than Free", icon: "bolt" },
      { label: "100 Steps Per Task", icon: "footprint" },
      { label: "3 hr Task Execution Time", icon: "timer" },
      { label: "Unlimited Concurrent Subagents", icon: "tree" },
      { label: "3 Gb Cloud Storage", icon: "cloud" },
      { label: "Full Platform Integrations", icon: "integration" },
      { label: "Bring Your Own Keys Available", icon: "key" },
      { label: "Agent Email Address", icon: "email" },
      { label: "Background Execution", icon: "tabs" },
    ],
  },
] as const satisfies ReadonlyArray<{
  readonly name: string
  readonly price: string
  readonly image: string
  readonly imageAlt: string
  readonly features: ReadonlyArray<PricingFeature>
}>

export type PricingPlan = (typeof PRICING_PLANS)[number]
