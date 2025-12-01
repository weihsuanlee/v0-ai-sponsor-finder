import type { MemberDataRow, ParsedMemberData } from "./types"

const AGE_COLUMN_NAMES = [
  "age",
  "member_age",
  "memberage",
  "athlete_age",
  "player_age",
  "age_years",
  "age(years)",
  "ageyears",
]

const DOB_COLUMN_NAMES = [
  "dateofbirth",
  "date_of_birth",
  "dob",
  "birthdate",
  "birth_date",
  "birthday",
  "birthyear",
  "birth_year",
  "yearofbirth",
  "year_of_birth",
]

const GENDER_COLUMN_NAMES = [
  "gender",
  "sex",
  "genderidentity",
  "gender_identity",
  "gender/sex",
  "player_gender",
  "athlete_gender",
]

/**
 * Calculate age from date of birth string
 */
function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
function parseExcelDate(value: number): Date | null {
  if (!Number.isFinite(value)) return null
  const excelEpoch = new Date(Date.UTC(1899, 11, 30))
  const ms = value * 24 * 60 * 60 * 1000
  return new Date(excelEpoch.getTime() + ms)
}

function toDateValue(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") {
    return null
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === "number") {
    const excelDate = parseExcelDate(value)
    if (excelDate && !Number.isNaN(excelDate.getTime())) {
      return excelDate
    }
  }

  const parsed = new Date(String(value))
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }

  return null
}

/**
 * Normalize column name for flexible matching
 */
function normalizeColumnName(columnName: string): string {
  return columnName.toLowerCase().trim().replace(/[^a-z0-9]/g, "")
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
  const ageValue = findColumnValue(row, AGE_COLUMN_NAMES)

  if (ageValue !== undefined && ageValue !== null && ageValue !== "") {
    const age = typeof ageValue === "number" ? ageValue : Number.parseInt(String(ageValue), 10)
    if (!Number.isNaN(age) && age > 0 && age < 120) {
      return age
    }
  }

  // Try date of birth
  const dobValue = findColumnValue(row, DOB_COLUMN_NAMES)

  if (dobValue) {
    const birthDate = toDateValue(dobValue)
    if (birthDate) {
      const age = calculateAge(birthDate)
      if (!Number.isNaN(age) && age > 0 && age < 120) {
        return age
      }
    }
  }

  return null
}

/**
 * Extract gender from a row
 */
function extractGender(row: MemberDataRow): string {
  const genderValue = findColumnValue(row, GENDER_COLUMN_NAMES)

  if (genderValue === undefined || genderValue === null || genderValue === "") {
    return "other"
  }

  const gender = String(genderValue).toLowerCase().trim()

  if (/^(m|male|man|men)$/i.test(gender)) {
    return "male"
  }
  if (/^(f|female|woman|women)$/i.test(gender)) {
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
