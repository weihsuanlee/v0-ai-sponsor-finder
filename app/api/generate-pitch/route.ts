import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const PitchContentSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  slogan: z.string(),
  collaborationIdeas: z.array(z.string()),
  keyBenefits: z.array(z.string()),
  callToAction: z.string(),
})

export async function POST(request: NextRequest) {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error("[OpenAI] API key is not configured")
    return NextResponse.json(
      {
        error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.",
        details: "Contact your administrator to configure the API key in Vercel environment settings.",
      },
      { status: 500 }
    )
  }

  try {
    const { clubData, sponsor, language = "en" } = await request.json()

    const languagePrompts = {
      en: "Generate the content in English",
      fr: "Generate the content in French",
      de: "Generate the content in German",
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: PitchContentSchema,
      prompt: `
        You are a professional marketing copywriter specializing in sponsorship proposals. Create compelling pitch materials for a sports club seeking sponsorship.

        Club Information:
        - Name: ${clubData.clubName}
        - Sport: ${clubData.sportType}
        - Location: ${clubData.location}
        - Total Members: ${clubData.totalMembers}
        - Age Groups: ${clubData.ageGroups}
        - Gender Split: ${clubData.genderSplit}
        - Competition Level: ${clubData.competitionLevel}
        - Additional Info: ${clubData.additionalInfo}

        Target Sponsor:
        - Name: ${sponsor.name}
        - Industry: ${sponsor.industry}
        - Description: ${sponsor.description}
        - Target Audience: ${sponsor.targetAudience}
        - Match Reason: ${sponsor.matchReason}

        ${languagePrompts[language as keyof typeof languagePrompts]}

        Create:
        1. A compelling email subject line
        2. A professional email body (3-4 paragraphs) that highlights mutual benefits
        3. A catchy slogan for the partnership
        4. 4-5 specific collaboration ideas (events, promotions, co-marketing)
        5. 3-4 key benefits for the sponsor
        6. A clear call to action

        Make it professional yet personable, focusing on the value proposition and mutual benefits.
      `,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("[OpenAI] Error generating pitch:", error)

    // Check if it's an API key error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
      return NextResponse.json(
        {
          error: "OpenAI authentication failed",
          details: "Please verify that your OPENAI_API_KEY is valid and has sufficient credits.",
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate pitch content",
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
