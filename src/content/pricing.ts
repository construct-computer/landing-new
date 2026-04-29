import imgPricingFree from "@/assets/pricing-free.jpg"
import imgPricingPro from "@/assets/pricing-pro.jpg"
import imgPricingStarter from "@/assets/pricing-starter.jpg"

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    image: imgPricingFree,
    imageAlt: "Dark night sky with bright cumulus clouds illuminated by moonlight",
    features: [
      "15 Steps Per Task",
      "5 min Task Execution Time",
      "2 Concurrent Subagents",
      "100 Mb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
    ],
  },
  {
    name: "Starter",
    price: "$59",
    image: imgPricingStarter,
    imageAlt: "Mystical cloud-shrouded golden temple gateway opening into bright light",
    features: [
      "6x More Usage Than Free",
      "50 Steps Per Task",
      "1 hr Task Execution Time",
      "6 Concurrent Subagents",
      "1 Gb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
      "Agent Email Address",
    ],
  },
  {
    name: "Pro",
    price: "$299",
    image: imgPricingPro,
    imageAlt: "Vivid orange and red sunburst with radiant light rays",
    features: [
      "45x More Usage Than Free",
      "100 Steps Per Task",
      "3 hr Task Execution Time",
      "Unlimited Concurrent Subagents",
      "3 Gb Cloud Storage",
      "Full Platform Integrations",
      "Bring Your Own Keys Available",
      "Agent Email Address",
      "Background Execution",
    ],
  },
] as const

export type PricingPlan = (typeof PRICING_PLANS)[number]
