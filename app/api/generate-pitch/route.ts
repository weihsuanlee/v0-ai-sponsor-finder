import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import aj from "@/lib/arcjet"

const PitchContentSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  slogan: z.string(),
  collaborationIdeas: z.array(z.string()),
  keyBenefits: z.array(z.string()),
  callToAction: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const decision = await aj.protect(request)

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          {
            error: "Too many requests. Please wait before generating more pitch materials to protect our AI quota.",
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

    return await generatePitchContent(request)
  } catch (error: any) {
    console.error("Error with Arcjet protection:", error)

    if (error.message?.includes("digest") || error.message?.includes("Arcjet")) {
      console.log("[v0] Arcjet protection failed, continuing without rate limiting")
      return await generatePitchContent(request)
    }

    return NextResponse.json({ error: "Failed to generate pitch content" }, { status: 500 })
  }
}

async function generatePitchContent(request: NextRequest) {
  try {
    const { clubData, sponsor, language = "en" } = await request.json()

    const languagePrompts = {
      en: "Generate the content in English",
      fr: "Generate the content in French (France/Luxembourg French)",
      de: "Generate the content in German (Luxembourg German)",
      lb: "Generate the content in Luxembourgish",
    }

    const generateMockPitch = () => {
      const mockPitch = {
        emailSubject: `Partnership Opportunity: ${clubData.clubName} & ${sponsor.name}`,
        emailBody: `Dear ${sponsor.name} Team,\n\nI hope this message finds you well. I am writing on behalf of ${clubData.clubName}, a ${clubData.sportType} club based in ${clubData.location} with ${clubData.totalMembers} dedicated members.\n\nWe believe there is a fantastic opportunity for a mutually beneficial partnership between our organizations. Your company's focus on ${sponsor.targetAudience} aligns perfectly with our club's demographic and values.\n\nWe would love to discuss how we can work together to create meaningful engagement opportunities that benefit both our club members and your business objectives.\n\nI would be delighted to schedule a meeting to discuss this opportunity further.\n\nBest regards,\n${clubData.clubName} Management`,
        slogan: `${clubData.clubName} & ${sponsor.name} - Stronger Together`,
        collaborationIdeas: [
          "Co-branded team uniforms and equipment",
          "Joint community sports events",
          "Social media cross-promotion campaigns",
          "Exclusive member discounts and offers",
          "Corporate team-building activities",
        ],
        keyBenefits: [
          "Brand visibility to active, engaged community",
          "Positive association with health and wellness",
          "Local community goodwill and recognition",
          "Networking opportunities with club members",
        ],
        callToAction: "Let's schedule a meeting to explore this exciting partnership opportunity!",
      }
      return mockPitch
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("[v0] No OpenAI API key found, using mock pitch data")
      return NextResponse.json(generateMockPitch())
    }

    try {
      console.log("[v0] Attempting AI pitch generation")
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: PitchContentSchema,
        prompt: `
          You are a professional marketing copywriter specializing in sponsorship proposals for sports clubs in Luxembourg. Create compelling, culturally appropriate pitch materials.

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

          ${languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en}

          Create professional, culturally appropriate content for Luxembourg market:
          1. A compelling email subject line (concise, professional)
          2. A professional email body (3-4 paragraphs) highlighting mutual benefits and local community impact
          3. A catchy partnership slogan
          4. 5-6 specific collaboration ideas (events, promotions, co-marketing, community engagement)
          5. 4-5 key benefits for the sponsor (brand visibility, community goodwill, target audience reach)
          6. A clear, actionable call to action

          Focus on:
          - Local community impact and Luxembourg market specifics
          - Professional tone appropriate for business communications
          - Mutual value proposition and long-term partnership potential
          - Cultural sensitivity for Luxembourg business environment
        `,
      })

      console.log("[v0] AI pitch generation successful")
      return NextResponse.json(object)
    } catch (aiError: any) {
      console.error("[v0] AI pitch generation failed:", aiError?.message || aiError)

      // Check for specific API errors
      if (
        aiError?.message?.includes("quota") ||
        aiError?.message?.includes("billing") ||
        aiError?.message?.includes("insufficient_quota") ||
        aiError?.status === 429
      ) {
        console.log("[v0] API quota/billing error detected, falling back to mock pitch data")
      } else {
        console.log("[v0] AI error occurred, falling back to mock pitch data")
      }

      return NextResponse.json(generateMockPitch())
    }
  } catch (error) {
    console.error("[v0] Error in pitch generation endpoint:", error)
    return NextResponse.json({ error: "Failed to generate pitch content" }, { status: 500 })
  }
}
