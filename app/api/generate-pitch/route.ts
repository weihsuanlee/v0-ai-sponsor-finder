import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const PitchContentSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  slogan: z.string(),
  collaborationIdeas: z.array(z.string()),
  keyBenefits: z.array(z.string()),
  callToAction: z.string(),
});

// Create provider instance
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(request: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      {
        error: "Google API key is not configured.",
        details: "Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    const { clubData, sponsor, language = "en" } = await request.json();

    const languagePrompts = {
      en: "Generate the content in English.",
      fr: "Générez le contenu en français.",
      de: "Erstellen Sie den Inhalt auf Deutsch.",
    };

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: PitchContentSchema,
      prompt: `
        You are a professional marketing copywriter specializing in sponsorship proposals.

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

        ${languagePrompts[language]}

        Create:
        - Email subject line
        - 3–4 paragraph email body
        - Partnership slogan
        - 4–5 collaboration ideas
        - 3–4 key benefits
        - Clear call to action
      `,
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("[Gemini] Error:", error);

    if (typeof error?.message === "string" && error.message.includes("API key")) {
      return NextResponse.json(
        {
          error: "Google authentication failed.",
          details: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate pitch content.",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
