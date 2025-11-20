import type {
  ClubData,
  SponsorsResponse,
  PitchContent,
  Sponsor,
  Language,
  AgentEvaluationResult,
} from "./types"

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
  const response = await fetch("/api/generate-pitch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sponsor, clubData, language }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(errorData.error || "Failed to generate pitch materials")
  }

  // Transform the response to match expected format
  const data = await response.json()
  return {
    emailSubject: data.emailSubject,
    pitchEmail: data.emailBody,
    talkingPoints: data.keyBenefits || [],
  }
}

export async function evaluateBusinessWithAgent(
  businessName: string,
  clubData: ClubData,
  language: Language = "en",
): Promise<AgentEvaluationResult> {
  const response = await fetch("/api/agent/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ businessName, clubProfile: clubData, language }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to analyze company" }))
    const err = new Error(errorData.error || "Failed to analyze company")
    ;(err as any).logs = errorData.logs
    throw err
  }

  return response.json()
}
