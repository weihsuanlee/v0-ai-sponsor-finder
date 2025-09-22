export interface ClubData {
  clubName: string
  sportType: string
  location: string
  totalMembers: number
  ageGroups: string
  genderSplit: string
  competitionLevel: string
  additionalInfo: string
}

export interface Sponsor {
  name: string
  industry: string
  description: string
  targetAudience: string
  sponsorshipBudget: string
  contactInfo: {
    website?: string
    email?: string
  }
  matchReason: string
}

export interface SponsorsResponse {
  sponsors: Sponsor[]
  demographicsAnalysis: string
  recommendedIndustries: string[]
}

export interface PitchContent {
  emailSubject: string
  emailBody: string
  slogan: string
  collaborationIdeas: string[]
  keyBenefits: string[]
  callToAction: string
}

export type Language = "en" | "fr" | "de"
