import type { ClubData, SponsorsResponse, PitchContent, Sponsor, Language } from "./types"

export async function generateSponsors(clubData: ClubData): Promise<SponsorsResponse> {
  const response = await fetch("/api/generate-sponsors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clubData),
  })

  if (!response.ok) {
    throw new Error("Failed to generate sponsors")
  }

  return response.json()
}

export async function generatePitch(
  clubData: ClubData,
  sponsor: Sponsor,
  language: Language = "en",
): Promise<PitchContent> {
  const response = await fetch("/api/generate-pitch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clubData, sponsor, language }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate pitch")
  }

  return response.json()
}

export async function generatePitchMaterials(
  sponsor: Sponsor,
  clubData: ClubData,
  language: Language = "en",
): Promise<{
  emailSubject: string
  pitchEmail: string
  talkingPoints: string[]
}> {
  const response = await fetch("/api/generate-pitch-materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sponsor, clubData, language }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate pitch materials")
  }

  return response.json()
}
