import type { BusinessProfile, ClubData, SponsorFitScore } from "@/lib/types"

export function scoreSponsorFit(profile: BusinessProfile, club: ClubData): SponsorFitScore {
  let score = 60
  const fitReasons: string[] = []

  const locationMatch =
    club.location && profile.geography.toLowerCase().includes(club.location.toLowerCase().split(",")[0] || "")
  if (locationMatch) {
    score += 10
    fitReasons.push("Strong regional overlap with your club's location.")
  }

  if (profile.audience.includes("families") && club.ageGroups.includes("youth")) {
    score += 8
    fitReasons.push("Family-focused audience aligns with your youth programs.")
  } else if (profile.audience.includes("athletes")) {
    score += 8
    fitReasons.push("Active consumer focus matches your athlete community.")
  } else {
    fitReasons.push("Broad consumer focus can amplify your community reach.")
  }

  if (profile.industry === "Sports Equipment" || profile.industry === "Technology") {
    score += 6
    fitReasons.push(`${profile.industry} partners often activate well with sports clubs.`)
  }

  if (profile.brandVoice === "community") {
    score += 6
    fitReasons.push("Community-driven messaging complements your club values.")
  }

  if (profile.services.toLowerCase().includes(club.sportType.toLowerCase())) {
    score += 5
    fitReasons.push("Services directly reference your sport vertical.")
  }

  score = Math.min(98, Math.max(40, score))

  const suggestedSponsorshipType =
    score > 85 ? "Presenting Partner" : score > 75 ? "Community Impact Partner" : "Event Activation Partner"

  return {
    score,
    fitReasons,
    suggestedSponsorshipType,
  }
}
