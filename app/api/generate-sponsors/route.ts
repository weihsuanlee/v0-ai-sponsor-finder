import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import aj from "@/lib/arcjet"

const SponsorSchema = z.object({
  name: z.string(),
  industry: z.string(),
  description: z.string(),
  targetAudience: z.string(),
  contactInfo: z.object({
    website: z.string(),
    email: z.string(),
  }),
  matchReason: z.string(),
})

const SponsorsResponseSchema = z.object({
  sponsors: z.array(SponsorSchema),
  demographicsAnalysis: z.string(),
  recommendedIndustries: z.array(z.string()),
})

async function generateRealSponsors(clubData: any) {
  const maxRetries = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.log("[v0] No OpenAI API key found, using mock data")
        return generateMockSponsors(clubData)
      }

      console.log(`[v0] Attempting AI generation (attempt ${attempt}/${maxRetries})`)

      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: SponsorsResponseSchema,
        prompt: `
          You are a business intelligence expert specializing in sponsor matching for sports clubs. Generate realistic sponsor recommendations based on the club information provided.

          Club Information:
          - Name: ${clubData.clubName}
          - Sport: ${clubData.sportType}
          - Location: ${clubData.location}
          - Total Members: ${clubData.totalMembers}
          - Age Groups: ${clubData.ageGroups}
          - Gender Split: ${clubData.genderSplit}
          - Competition Level: ${clubData.competitionLevel}
          - Additional Info: ${clubData.additionalInfo}

          Generate 6 realistic potential sponsors that would be interested in sponsoring this club. Focus on:
          1. Local businesses in ${clubData.location} or Luxembourg region
          2. Companies that align with the sport type (${clubData.sportType})
          3. Businesses targeting the demographic (${clubData.ageGroups}, ${clubData.genderSplit})
          4. Mix of industries: sports equipment, local services, health/nutrition, technology, financial services, etc.

          For each sponsor provide:
          - Realistic company name (avoid using real company names, create plausible fictional ones)
          - Industry category
          - Business description (2-3 sentences)
          - Target audience
          - Professional contact information (use realistic but fictional domains)
          - Specific match reason explaining why they'd sponsor this club

          Also provide:
          - A detailed demographics analysis explaining why this club is attractive to sponsors
          - 8 recommended industries that would be interested in sponsoring

          Make everything realistic and professional, as if these were real businesses that could actually sponsor the club.
        `,
      })

      console.log("[v0] AI generation successful")
      return object
    } catch (error: any) {
      lastError = error
      console.error(`[v0] AI generation attempt ${attempt} failed:`, error?.message || error)

      // Check for specific API errors that shouldn't be retried
      if (
        error?.message?.includes("quota") ||
        error?.message?.includes("billing") ||
        error?.message?.includes("insufficient_quota") ||
        error?.status === 429
      ) {
        console.log("[v0] API quota/billing error detected, falling back to mock data")
        break
      }

      // If this is the last attempt, break
      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  console.log(
    `[v0] Error generating AI sponsors: Failed after ${maxRetries} attempts. Last error:`,
    lastError?.message || lastError,
  )
  console.log("[v0] Falling back to enhanced mock data")
  return generateMockSponsors(clubData)
}

function generateMockSponsors(clubData: any) {
  const sponsors = [
    {
      name: `${clubData.location} Sports Equipment Co.`,
      industry: "Sports Equipment",
      description:
        "Local sports equipment retailer specializing in quality gear for amateur and professional athletes. Family-owned business serving the Luxembourg sports community for over 15 years.",
      targetAudience: "Sports enthusiasts and athletes",
      contactInfo: {
        website: "www.sportsco-lux.com",
        email: "partnerships@sportsco-lux.com",
      },
      matchReason: `Perfect match for ${clubData.sportType} clubs, with a focus on supporting local sports communities and providing equipment discounts.`,
    },
    {
      name: "FitLife Nutrition Luxembourg",
      industry: "Health & Nutrition",
      description:
        "Premium sports nutrition and supplement company focused on athletic performance. Specializes in natural, locally-sourced ingredients for optimal sports nutrition.",
      targetAudience: "Athletes and fitness enthusiasts",
      contactInfo: {
        website: "www.fitlife-lux.com",
        email: "sponsorship@fitlife-lux.com",
      },
      matchReason:
        "Aligns with health-conscious athletes and can provide nutrition support and education for team members.",
    },
    {
      name: `Banque Communautaire ${clubData.location}`,
      industry: "Financial Services",
      description:
        "Local community bank committed to supporting regional sports and youth development. Strong focus on community investment and local partnerships.",
      targetAudience: "Local community members and families",
      contactInfo: {
        website: "www.banque-communautaire.lu",
        email: "community@banque-communautaire.lu",
      },
      matchReason:
        "Strong community presence and commitment to supporting local sports initiatives and youth development programs.",
    },
    {
      name: "ActiveWear Luxembourg",
      industry: "Sportswear",
      description:
        "Athletic apparel brand specializing in performance wear for various sports. Focuses on sustainable materials and local manufacturing partnerships.",
      targetAudience: "Athletes and sports teams",
      contactInfo: {
        website: "www.activewear.lu",
        email: "teams@activewear.lu",
      },
      matchReason: `Excellent opportunity to showcase their ${clubData.sportType} apparel line with your team and develop co-branded merchandise.`,
    },
    {
      name: "TechFlow Solutions Luxembourg",
      industry: "Technology",
      description:
        "Local IT services company providing digital solutions for businesses and organizations. Specializes in sports analytics and team management software.",
      targetAudience: "Tech-savvy professionals and organizations",
      contactInfo: {
        website: "www.techflow.lu",
        email: "marketing@techflow.lu",
      },
      matchReason:
        "Looking to increase brand visibility in the local community and can provide digital solutions for team management.",
    },
    {
      name: "Green Energy Luxembourg",
      industry: "Renewable Energy",
      description:
        "Sustainable energy solutions company with a focus on environmental responsibility. Leading provider of solar and wind energy solutions in Luxembourg.",
      targetAudience: "Environmentally conscious consumers and businesses",
      contactInfo: {
        website: "www.greenenergy.lu",
        email: "partnerships@greenenergy.lu",
      },
      matchReason:
        "Aligns with community values and provides positive brand association with healthy, active lifestyles and environmental consciousness.",
    },
  ]

  const demographicsAnalysis = `Your ${clubData.sportType} club in ${clubData.location} with ${clubData.totalMembers} members represents an attractive sponsorship opportunity in the Luxembourg market. The ${clubData.ageGroups} age demographic and ${clubData.genderSplit} gender distribution appeals to brands targeting active, health-conscious consumers. The ${clubData.competitionLevel} competition level indicates dedicated athletes who influence purchasing decisions in sports and lifestyle categories, making your club valuable for brand exposure and community engagement.`

  const recommendedIndustries = [
    "Sports Equipment",
    "Health & Nutrition",
    "Financial Services",
    "Sportswear & Apparel",
    "Local Businesses",
    "Technology",
    "Automotive",
    "Food & Beverage",
  ]

  return {
    sponsors,
    demographicsAnalysis,
    recommendedIndustries,
  }
}

export async function POST(request: NextRequest) {
  try {
    const decision = await aj.protect(request)

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          {
            error: "Too many requests. Please wait before generating more sponsors to protect our AI quota.",
            retryAfter: decision.reason.resetTime,
          },
          { status: 429 },
        )
      }

      if (decision.reason.isShield()) {
        return NextResponse.json({ error: "Request blocked for security reasons" }, { status: 403 })
      }

      return NextResponse.json({ error: "Request denied" }, { status: 403 })
    }

    const clubData = await request.json()
    console.log("[v0] Received club data:", clubData)

    const sponsorData = await generateRealSponsors(clubData)
    console.log("[v0] Generated sponsor data successfully")

    return NextResponse.json(sponsorData)
  } catch (error: any) {
    console.error("Error in API route:", error)

    if (error.message?.includes("digest") || error.message?.includes("Arcjet")) {
      console.log("[v0] Arcjet protection failed, continuing without rate limiting")
      try {
        const clubData = await request.json()
        console.log("[v0] Received club data:", clubData)

        const sponsorData = await generateRealSponsors(clubData)
        console.log("[v0] Generated sponsor data successfully")

        return NextResponse.json(sponsorData)
      } catch (fallbackError) {
        console.error("Error generating sponsors:", fallbackError)
        return NextResponse.json({ error: "Failed to generate sponsor recommendations" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to generate sponsor recommendations" }, { status: 500 })
  }
}
