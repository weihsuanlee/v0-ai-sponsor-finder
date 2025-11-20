import type { BusinessProfile, SearchBusinessInfoResult } from "@/lib/types"

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  Technology: ["software", "technology", "platform", "saas", "cloud", "tech"],
  "Food & Beverage": ["restaurant", "cafe", "beverage", "food", "drink"],
  Healthcare: ["wellness", "health", "medical", "pharma", "clinic"],
  Finance: ["bank", "financial", "fintech", "investment", "insurance"],
  "Sports Equipment": ["sports", "gear", "apparel", "fitness", "equipment"],
  Retail: ["retail", "store", "shop", "ecommerce"],
  Education: ["education", "training", "school", "learning"],
  Automotive: ["automotive", "mobility", "transport", "vehicle"],
}

const BRAND_VOICE_KEYWORDS: Record<string, string[]> = {
  energetic: ["energy", "dynamic", "fast", "innovation", "future"],
  community: ["community", "local", "neighbors", "grassroots", "together"],
  premium: ["premium", "luxury", "exclusive", "elite"],
  playful: ["fun", "playful", "delight", "creative"],
}

const AUDIENCE_KEYWORDS: Record<string, string[]> = {
  families: ["family", "parents", "kids"],
  professionals: ["professionals", "enterprise", "business"],
  athletes: ["athlete", "sports", "fitness"],
  youth: ["youth", "student", "teen"],
}

function matchKeywordGroup(keywords: Record<string, string[]>, text: string, fallback: string) {
  const lowered = text.toLowerCase()
  for (const [label, triggers] of Object.entries(keywords)) {
    if (triggers.some((token) => lowered.includes(token))) {
      return label
    }
  }
  return fallback
}

export function extractBusinessProfile(
  businessName: string,
  info: SearchBusinessInfoResult,
): BusinessProfile {
  const combined = `${info.description} ${info.snippet} ${info.title}`.toLowerCase()
  let industry = "General"

  for (const [label, triggers] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (triggers.some((keyword) => combined.includes(keyword))) {
      industry = label
      break
    }
  }

  const services = info.rawItems
    .slice(0, 3)
    .map((item) => item.title)
    .filter(Boolean)
    .join(", ")

  const brandVoice = matchKeywordGroup(BRAND_VOICE_KEYWORDS, combined, "professional")
  const audience = matchKeywordGroup(AUDIENCE_KEYWORDS, combined, "broad consumers")

  const geographyMatch = info.rawItems.find((item) => item.snippet.toLowerCase().includes("based in"))
  const geography =
    geographyMatch?.snippet.match(/based in ([^.]+)/i)?.[1]?.trim() ??
    info.rawItems[0]?.snippet?.match(/[A-Z][a-z]+,\s?[A-Z]{2}/)?.[0] ??
    "Multiple regions"

  return {
    industry,
    services: services || `${businessName} solutions`,
    brandVoice,
    audience,
    geography,
    relevantNotes: info.rawItems[0]?.snippet ?? `Limited public info about ${businessName}`,
  }
}
