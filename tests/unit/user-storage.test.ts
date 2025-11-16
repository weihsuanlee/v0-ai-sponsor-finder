import { describe, expect, beforeEach, it, vi } from "vitest"

import { UserStorage } from "@/lib/user-storage"
import type { ClubData, TrackedSponsor } from "@/lib/types"

const createMockStorage = () => {
  let store = new Map<string, string>()
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  } as Storage
}

const baseClubData: ClubData = {
  clubName: "Demo FC",
  sportType: "football",
  location: "Luxembourg",
  totalMembers: 25,
  ageGroups: "young-adult",
  genderSplit: "balanced",
  competitionLevel: "amateur",
  additionalInfo: "Testing",
}

describe("UserStorage", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // @ts-expect-error - expose global for tests
    global.localStorage = createMockStorage()
    UserStorage.clearUserData()
  })

  it("creates a user and persists the session", () => {
    const user = UserStorage.createUser("Test User", "test@example.com")
    expect(user.id).toMatch(/user_\d+/)

    const storedUser = UserStorage.getCurrentUser()
    expect(storedUser?.email).toBe("test@example.com")

    const session = UserStorage.getCurrentSession()
    expect(session?.userId).toBe(user.id)
  })

  it("updates tracked sponsors and prevents duplicates", () => {
    const user = UserStorage.createUser("Sponsor Lead", "lead@example.com")
    const sponsor: TrackedSponsor = {
      id: "sponsor-1",
      name: "Acme Corp",
      industry: "Technology",
      description: "Leading innovator",
      targetAudience: "Fans",
      sponsorshipBudget: "$10k",
      contactInfo: { email: "hello@acme.test" },
      matchReason: "Perfect fit",
      status: "Not Contacted",
      dateAdded: new Date().toISOString(),
      clubData: baseClubData,
    }

    const added = UserStorage.addTrackedSponsor(sponsor)
    expect(added).toBe(true)
    expect(UserStorage.isSponsorTracked("Acme Corp")).toBe(true)

    const duplicate = UserStorage.addTrackedSponsor({ ...sponsor, id: "sponsor-2" })
    expect(duplicate).toBe(false)

    UserStorage.updateSponsorStatus(sponsor.id, "Contacted")
    const updatedSponsor = UserStorage.getTrackedSponsors()[0]
    expect(updatedSponsor.status).toBe("Contacted")

    UserStorage.removeTrackedSponsor(sponsor.id)
    expect(UserStorage.getTrackedSponsors()).toHaveLength(0)
    expect(UserStorage.getCurrentUser()?.id).toBe(user.id)
  })

  it("persists club data in the active session", () => {
    UserStorage.createUser("Session Owner", "owner@example.com")
    UserStorage.updateSession(baseClubData)

    expect(UserStorage.getClubData()).toEqual(baseClubData)
  })
})
