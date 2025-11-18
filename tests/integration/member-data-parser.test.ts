import { describe, expect, it } from "vitest"

import { parseMemberData } from "@/lib/member-data-parser"
import type { MemberDataRow } from "@/lib/types"

describe("member-data-parser integration", () => {
  it("aggregates age and gender statistics from flexible CSV rows", () => {
    const rows: MemberDataRow[] = [
      { Age: 16, Gender: "Female" },
      { member_age: "22", sex: "Male" },
      { date_of_birth: "1990-06-15", gender: "female" },
      { DOB: "1980-01-01", Gender: "Non-Binary" },
    ]

    const parsed = parseMemberData(rows)

    expect(parsed.totalMembers).toBe(4)
    expect(parsed.ageDistribution.youngAdult).toBeGreaterThan(0)
    expect(parsed.ageDistribution.senior).toBeGreaterThan(0)
    expect(parsed.genderDistributionPercentages.female).toBeGreaterThan(10)
    expect(parsed.genderDistribution.other).toBeGreaterThan(0)
    expect(parsed.dominantGender).toMatch(/(female-majority|balanced)/)
  })
})
