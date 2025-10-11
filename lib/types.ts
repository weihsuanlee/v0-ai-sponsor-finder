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
