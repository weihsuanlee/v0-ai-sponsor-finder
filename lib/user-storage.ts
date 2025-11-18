import type { User, UserSession, ClubData, TrackedSponsor, SponsorsResponse } from "./types"

// Simple user management system using localStorage
type SponsorCacheEntry = {
  signature: string
  generatedAt: string
  data: SponsorsResponse
}

export class UserStorage {
  private static readonly USER_KEY = "ai-sponsor-user"
  private static readonly SESSION_KEY = "ai-sponsor-session"
  private static readonly SPONSOR_CACHE_PREFIX = "ai-sponsor-cache"

  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  static getCurrentSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      return sessionData ? JSON.parse(sessionData) : null
    } catch {
      return null
    }
  }

  static createUser(name: string, email: string): User {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    // Create initial session
    const session: UserSession = {
      userId: user.id,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

    return user
  }

  static updateSession(clubData: ClubData): void {
    const session = this.getCurrentSession()
    if (session) {
      const updatedSession: UserSession = {
        ...session,
        clubData,
      }
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedSession))
    }
  }

  static getClubData(): ClubData | null {
    const session = this.getCurrentSession()
    return session?.clubData || null
  }

  static getTrackedSponsors(): TrackedSponsor[] {
    const user = this.getCurrentUser()
    if (!user) return []

    try {
      const key = `trackedSponsors_${user.id}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  static saveTrackedSponsors(sponsors: TrackedSponsor[]): void {
    const user = this.getCurrentUser()
    if (!user) return

    const key = `trackedSponsors_${user.id}`
    localStorage.setItem(key, JSON.stringify(sponsors))
  }

  static addTrackedSponsor(sponsor: TrackedSponsor): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const existing = this.getTrackedSponsors()

    // Check for duplicates based on sponsor name and user
    const isDuplicate = existing.some((s) => s.name.toLowerCase() === sponsor.name.toLowerCase())

    if (isDuplicate) {
      return false // Don't add duplicate
    }

    const updated = [...existing, sponsor]
    this.saveTrackedSponsors(updated)
    return true
  }

  static isSponsorTracked(sponsorName: string): boolean {
    const existing = this.getTrackedSponsors()
    return existing.some((s) => s.name.toLowerCase() === sponsorName.toLowerCase())
  }

  static removeTrackedSponsor(sponsorId: string): void {
    const existing = this.getTrackedSponsors()
    const updated = existing.filter((s) => s.id !== sponsorId)
    this.saveTrackedSponsors(updated)
  }

  static updateSponsorStatus(sponsorId: string, status: string): void {
    const existing = this.getTrackedSponsors()
    const updated = existing.map((s) => (s.id === sponsorId ? { ...s, status } : s))
    this.saveTrackedSponsors(updated)
  }

  static clearUserData(): void {
    const user = this.getCurrentUser()
    if (user) {
      localStorage.removeItem(`trackedSponsors_${user.id}`)
      localStorage.removeItem(this.getSponsorCacheKey(user.id))
    }
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.SESSION_KEY)
    // Also clear legacy data
    localStorage.removeItem("clubData")
    localStorage.removeItem("trackedSponsors")
  }

  static getCachedSponsors(clubData: ClubData): SponsorsResponse | null {
    const user = this.getCurrentUser()
    if (!user) return null

    try {
      const raw = localStorage.getItem(this.getSponsorCacheKey(user.id))
      if (!raw) return null
      const cache = JSON.parse(raw) as SponsorCacheEntry
      if (cache.signature === this.getClubSignature(clubData)) {
        return cache.data
      }
    } catch {
      return null
    }

    return null
  }

  static saveSponsorResults(clubData: ClubData, data: SponsorsResponse): void {
    const user = this.getCurrentUser()
    if (!user) return

    const cache: SponsorCacheEntry = {
      signature: this.getClubSignature(clubData),
      generatedAt: new Date().toISOString(),
      data,
    }

    localStorage.setItem(this.getSponsorCacheKey(user.id), JSON.stringify(cache))
  }

  private static getSponsorCacheKey(userId: string) {
    return `${this.SPONSOR_CACHE_PREFIX}_${userId}`
  }

  private static getClubSignature(clubData: ClubData) {
    const fields = [
      clubData.clubName,
      clubData.sportType,
      clubData.location,
      clubData.totalMembers,
      clubData.ageGroups,
      clubData.genderSplit,
      clubData.competitionLevel,
      clubData.additionalInfo,
    ]

    return fields.map((value) => String(value ?? "").trim().toLowerCase()).join("|")
  }
}
