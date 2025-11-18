import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"

const SponsorsResponseSchema = z.object({
  demographicsAnalysis: z.string(),
  recommendedIndustries: z.array(z.string()).min(3),
  sponsors: z
    .array(
      z.object({
        name: z.string(),
        industry: z.string(),
        description: z.string(),
        targetAudience: z.string(),
        sponsorshipBudget: z.string(),
        contactInfo: z.object({
          website: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
        }),
        matchReason: z.string(),
        campaignIdeas: z.array(z.string()).optional(),
      }),
    )
    .min(4),
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
})

const CLUB_CONTEXT = `
Fields:
- Club Name
- Sport Type
- Location
- Total Members
- Age Groups
- Gender Split
- Competition Level
- Additional Info
`.trim()

const SPONSOR_PROMPT = `
You are an expert sponsorship strategist. Given the club context below, analyze their demographics,
recommend industries, and generate a list of highly relevant sponsors. Use realistic detail, budgets, and campaign ideas.

${CLUB_CONTEXT}

Response requirements:
- Provide a concise "demographicsAnalysis" paragraph summarizing who the club reaches and why that matters for sponsors.
- Provide 5-8 "recommendedIndustries" entries.
- Provide 6 sponsors with unique industries. Each sponsor MUST include:
  * name (realistic company or brand)
  * industry
  * description
  * targetAudience
  * sponsorshipBudget (range)
  * contactInfo (website and/or email)
  * matchReason (specific to the provided club details)
  * campaignIdeas (3 short bullets describing possible collaborations)
`.trim()

export async function POST(request: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Google API key is not configured." },
      { status: 500 },
    )
  }

  try {
    const clubData = await request.json()
    console.log("[Gemini] Generating sponsors for club:", clubData.clubName)

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: SponsorsResponseSchema,
      prompt: `
        ${SPONSOR_PROMPT}

        Club data:
        - Club Name: ${clubData.clubName}
        - Sport: ${clubData.sportType}
        - Location: ${clubData.location}
        - Total Members: ${clubData.totalMembers}
        - Age Groups: ${clubData.ageGroups}
        - Gender Split: ${clubData.genderSplit}
        - Competition Level: ${clubData.competitionLevel}
        - Additional Info: ${clubData.additionalInfo || "n/a"}
      `,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating sponsors:", error)
    return NextResponse.json(
      { error: "Failed to generate sponsor recommendations" },
      { status: 500 },
    )
  }
}
