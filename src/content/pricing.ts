import imgPricingLite from "@/assets/pricing-lite.jpg"
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
    name: "Lite",
    price: "$9",
    image: imgPricingLite,
    imageAlt: "Dark night sky with bright cumulus clouds illuminated by moonlight",
    features: [
      { label: "50 Steps Per Task", icon: "footprint" },
      { label: "2 Concurrent Agent Jobs", icon: "tree" },
      { label: "100 MB Cloud Storage", icon: "cloud" },
      { label: "3 Scheduled Jobs", icon: "timer" },
      { label: "Full Platform Integrations", icon: "integration" },
    ],
  },
  {
    name: "Starter",
    price: "$59",
    image: imgPricingStarter,
    imageAlt: "Mystical cloud-shrouded golden temple gateway opening into bright light",
    features: [
      { label: "150 Steps Per Task", icon: "footprint" },
      { label: "4 Concurrent Agent Jobs", icon: "tree" },
      { label: "1 GB Cloud Storage", icon: "cloud" },
      { label: "10 Scheduled Jobs", icon: "timer" },
      { label: "Full Platform Integrations", icon: "integration" },
      { label: "Agent Email Address", icon: "email" },
      { label: "Background & Scheduled Tasks", icon: "tabs" },
    ],
  },
  {
    name: "Pro",
    price: "$299",
    image: imgPricingPro,
    imageAlt: "Vivid orange and red sunburst with radiant light rays",
    features: [
      { label: "1,000 Steps Per Task", icon: "footprint" },
      { label: "8 Concurrent Agent Jobs", icon: "tree" },
      { label: "3 GB Cloud Storage", icon: "cloud" },
      { label: "50 Scheduled Jobs", icon: "timer" },
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
