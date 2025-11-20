export interface ClubData {
  clubName: string
  sportType: string
  location: string
  totalMembers: number
  ageGroups: string
  genderSplit: string
  competitionLevel: string
  additionalInfo: string
  // Optional detailed demographics from uploaded file
  uploadedDemographics?: {
    ageDistribution: {
      youth: number
      youngAdult: number
      adult: number
      senior: number
    }
    ageDistributionPercentages: {
      youth: number
      youngAdult: number
      adult: number
      senior: number
    }
    genderDistribution: {
      male: number
      female: number
      other: number
    }
    genderDistributionPercentages: {
      male: number
      female: number
      other: number
    }
  }
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
    phone?: string
  }
  matchReason: string
  campaignIdeas?: string[]
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

export type SponsorStatus = "Not Contacted" | "Contacted" | "In Discussion" | "Rejected" | "Approved"

export interface TrackedSponsor extends Sponsor {
  id: string
  status: SponsorStatus
  dateAdded: string
  clubData: ClubData
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface UserSession {
  userId: string
  clubData?: ClubData
  createdAt: string
}

// CSV/Excel Upload Types
export interface MemberDataRow {
  age?: number
  dateOfBirth?: string
  gender?: string
  competitionLevel?: string
  [key: string]: any // Allow flexible column names
}

export interface ParsedMemberData {
  totalMembers: number
  ageDistribution: {
    youth: number // 6-17
    youngAdult: number // 18-25
    adult: number // 26-40
    senior: number // 40+
  }
  ageDistributionPercentages: {
    youth: number
    youngAdult: number
    adult: number
    senior: number
  }
  genderDistribution: {
    male: number
    female: number
    other: number
  }
  genderDistributionPercentages: {
    male: number
    female: number
    other: number
  }
  dominantAgeGroup: string // Most common age group
  dominantGender: string // "male-majority", "female-majority", or "balanced"
  competitionLevels?: Record<string, number>
}

export interface FileUploadResponse {
  success: boolean
  data?: ParsedMemberData
  error?: string
  preview?: {
    rowCount: number
    sampleRows: any[]
    columnsDetected: string[]
  }
}

export type AgentStepType = "tool" | "analysis" | "summary"

export interface AgentStep {
  id: string
  title: string
  type: AgentStepType
  content: string
  metadata?: Record<string, string>
}

export interface AgentRecommendationResponse {
  steps: AgentStep[]
  sponsor: Sponsor
}

export interface SearchBusinessInfoResult {
  query: string
  name: string
  website: string
  title: string
  snippet: string
  description: string
  categories: string[]
  rawItems: Array<{
    title: string
    link: string
    snippet: string
  }>
}

export interface BusinessProfile {
  industry: string
  services: string
  brandVoice: string
  audience: string
  geography: string
  relevantNotes: string
}

export interface SponsorFitScore {
  score: number
  fitReasons: string[]
  suggestedSponsorshipType: string
}

export interface AgentWorkflowLog {
  id: string
  message: string
  status: "pending" | "success" | "error"
  timestamp: string
}

export interface AgentTrackingPayload {
  sponsor: Sponsor
  score: number
  notes: string
  generatedAt: string
  tags: string[]
}

export interface AgentEvaluationResult {
  logs: AgentWorkflowLog[]
  businessInfo: SearchBusinessInfoResult
  profile: BusinessProfile
  fit: SponsorFitScore
  finalSummary: string
  trackingPayload: AgentTrackingPayload
}
