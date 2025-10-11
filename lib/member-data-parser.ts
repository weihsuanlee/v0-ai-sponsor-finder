import type { MemberDataRow, ParsedMemberData } from "./types"

/**
 * Calculate age from date of birth string
 */
function calculateAge(dateString: string): number {
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * Normalize column name for flexible matching
 */
function normalizeColumnName(columnName: string): string {
  return columnName.toLowerCase().trim().replace(/[_\s-]/g, "")
}

/**
 * Find a column value from row with flexible matching
 */
function findColumnValue(row: MemberDataRow, possibleNames: string[]): any {
  const normalizedRow: Record<string, any> = {}

  // Normalize all keys in the row
  for (const [key, value] of Object.entries(row)) {
    normalizedRow[normalizeColumnName(key)] = value
  }

  // Try to find a match
  for (const name of possibleNames) {
    const normalized = normalizeColumnName(name)
    if (normalized in normalizedRow) {
      return normalizedRow[normalized]
    }
  }

  return undefined
}

/**
 * Extract age from a row (from age column or date of birth)
 */
function extractAge(row: MemberDataRow): number | null {
  // Try age column first
  const ageValue = findColumnValue(row, ["age", "Age", "AGE", "member_age", "memberAge"])

  if (ageValue !== undefined && ageValue !== null && ageValue !== "") {
    const age = typeof ageValue === "number" ? ageValue : Number.parseInt(String(ageValue), 10)
    if (!Number.isNaN(age) && age > 0 && age < 120) {
      return age
    }
  }

  // Try date of birth
  const dobValue = findColumnValue(row, [
    "dateofbirth",
    "date_of_birth",
    "dob",
    "DOB",
    "birthdate",
    "birth_date",
  ])

  if (dobValue) {
    const age = calculateAge(String(dobValue))
    if (!Number.isNaN(age) && age > 0 && age < 120) {
      return age
    }
  }

  return null
}

/**
 * Extract gender from a row
 */
function extractGender(row: MemberDataRow): string {
  const genderValue = findColumnValue(row, ["gender", "Gender", "GENDER", "sex", "Sex"])

  if (genderValue === undefined || genderValue === null || genderValue === "") {
    return "other"
  }

  const gender = String(genderValue).toLowerCase().trim()

  if (gender.startsWith("m") || gender === "male") {
    return "male"
  }
  if (gender.startsWith("f") || gender === "female") {
    return "female"
  }

  return "other"
}

/**
 * Categorize age into age group
 */
function categorizeAge(age: number): keyof ParsedMemberData["ageDistribution"] | null {
  if (age >= 6 && age <= 17) return "youth"
  if (age >= 18 && age <= 25) return "youngAdult"
  if (age >= 26 && age <= 40) return "adult"
  if (age > 40) return "senior"
  return null
}

/**
 * Parse member data from CSV/Excel rows
 */
export function parseMemberData(rows: MemberDataRow[]): ParsedMemberData {
  const ageDistribution = {
    youth: 0,
    youngAdult: 0,
    adult: 0,
    senior: 0,
  }

  const genderDistribution = {
    male: 0,
    female: 0,
    other: 0,
  }

  let validAgeCount = 0

  // Process each row
  for (const row of rows) {
    // Extract and categorize age
    const age = extractAge(row)
    if (age !== null) {
      const ageGroup = categorizeAge(age)
      if (ageGroup) {
        ageDistribution[ageGroup]++
        validAgeCount++
      }
    }

    // Extract and count gender
    const gender = extractGender(row)
    if (gender in genderDistribution) {
      genderDistribution[gender as keyof typeof genderDistribution]++
    }
  }

  const totalMembers = rows.length

  // Calculate percentages
  const ageDistributionPercentages = {
    youth: validAgeCount > 0 ? Math.round((ageDistribution.youth / validAgeCount) * 100) : 0,
    youngAdult: validAgeCount > 0 ? Math.round((ageDistribution.youngAdult / validAgeCount) * 100) : 0,
    adult: validAgeCount > 0 ? Math.round((ageDistribution.adult / validAgeCount) * 100) : 0,
    senior: validAgeCount > 0 ? Math.round((ageDistribution.senior / validAgeCount) * 100) : 0,
  }

  const genderDistributionPercentages = {
    male: totalMembers > 0 ? Math.round((genderDistribution.male / totalMembers) * 100) : 0,
    female: totalMembers > 0 ? Math.round((genderDistribution.female / totalMembers) * 100) : 0,
    other: totalMembers > 0 ? Math.round((genderDistribution.other / totalMembers) * 100) : 0,
  }

  // Determine dominant age group
  let dominantAgeGroup = "mixed"
  let maxAgeCount = 0
  for (const [group, count] of Object.entries(ageDistribution)) {
    if (count > maxAgeCount) {
      maxAgeCount = count
      dominantAgeGroup = group
    }
  }

  // Map to form values
  const dominantAgeGroupMap: Record<string, string> = {
    youth: "youth",
    youngAdult: "young-adult",
    adult: "adult",
    senior: "senior",
  }

  // Determine dominant gender
  let dominantGender = "balanced"
  const malePercent = genderDistributionPercentages.male
  const femalePercent = genderDistributionPercentages.female

  if (malePercent >= 70) {
    dominantGender = "male-majority"
  } else if (femalePercent >= 70) {
    dominantGender = "female-majority"
  } else {
    dominantGender = "balanced"
  }

  return {
    totalMembers,
    ageDistribution,
    ageDistributionPercentages,
    genderDistribution,
    genderDistributionPercentages,
    dominantAgeGroup: dominantAgeGroupMap[dominantAgeGroup] || "mixed",
    dominantGender,
  }
}

/**
 * Detect column names from rows
 */
export function detectColumns(rows: MemberDataRow[]): string[] {
  if (rows.length === 0) return []
  return Object.keys(rows[0])
}
