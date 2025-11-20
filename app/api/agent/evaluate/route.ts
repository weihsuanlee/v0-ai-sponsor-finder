import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type {
  AgentEvaluationResult,
  AgentWorkflowLog,
  BusinessProfile,
  ClubData,
  Language,
  SearchBusinessInfoResult,
  Sponsor,
} from "@/lib/types";
import { searchBusinessInfo } from "@/lib/tools/searchBusinessInfo";
import { extractBusinessProfile } from "@/lib/tools/extractBusinessProfile";
import { scoreSponsorFit } from "@/lib/tools/scoreSponsorFit";
import { translations } from "@/lib/i18n";

type RequestPayload = {
  businessName: string;
  clubProfile: ClubData;
  language?: Language;
};

const ensureLanguage = (value?: string): Language => {
  if (value === "fr" || value === "de") {
    return value;
  }
  return "en";
};

const controller = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

const controllerSchema = z.object({
  action: z.enum(["searchBusinessInfo", "extractBusinessProfile", "scoreSponsorFit", "done"]),
});

const createLog = (message: string, status: AgentWorkflowLog["status"]): AgentWorkflowLog => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  message,
  status,
  timestamp: new Date().toISOString(),
});

const buildSponsorFromProfile = (
  businessName: string,
  info: SearchBusinessInfoResult,
  profile: BusinessProfile,
  fitSummary: string
): Sponsor => {
  const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return {
    name: businessName,
    industry: profile.industry,
    description: info.description || profile.services,
    targetAudience: profile.audience,
    sponsorshipBudget: "$25k - $75k",
    contactInfo: {
      website: info.website,
      email: `partnerships@${slug}.com`,
    },
    matchReason: fitSummary,
    campaignIdeas: ["Community experience days", "Content storytelling series", "Co-branded training clinics"],
  };
};

export async function POST(request: Request) {
  const logs: AgentWorkflowLog[] = [];
  let currentLanguage: Language = "en";
  let locale = translations[currentLanguage];

  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: "Missing Google Generative AI key." }, { status: 500 });
    }

    const body: RequestPayload = await request.json();
    currentLanguage = ensureLanguage(body.language);
    locale = translations[currentLanguage] ?? translations.en;

    const { businessName, clubProfile } = body;

    if (!businessName?.trim() || !clubProfile) {
      return NextResponse.json({ error: locale.agentProvideCompanyError }, { status: 400 });
    }

    logs.push(createLog(locale.agentLogReasoning, "success"));

    let searchResult: SearchBusinessInfoResult | null = null;
    let profile: BusinessProfile | null = null;
    let fit: ReturnType<typeof scoreSponsorFit> | null = null;

    const actionToLabel = (action: string) => {
      switch (action) {
        case "searchBusinessInfo":
          return locale.agentActionSearch;
        case "extractBusinessProfile":
          return locale.agentActionProfile;
        case "scoreSponsorFit":
          return locale.agentActionFit;
        case "done":
        default:
          return locale.agentActionDone;
      }
    };

    for (let i = 0; i < 6; i++) {
      logs.push(createLog(locale.agentLogThinking, "pending"));
      const thinkingLog = logs[logs.length - 1];

      const { object } = await generateObject({
        model: controller("gemini-2.5-flash"),
        schema: controllerSchema,
        prompt: `
You are a controller deciding the next action for the Smart Sponsor Evaluator.
Return strict JSON with the "action" field.

State:
businessName: ${businessName}
clubProfile: ${JSON.stringify(clubProfile)}
searchResult: ${searchResult ? JSON.stringify({ name: searchResult.name, website: searchResult.website }) : "null"}
profile: ${profile ? JSON.stringify(profile) : "null"}
fit: ${fit ? JSON.stringify(fit) : "null"}

Decide the next step. Use "done" only when searchResult, profile, and fit are all available.`,
      });

      thinkingLog.status = "success";

      const action = object.action;
      const actionMessage = locale.agentLogControllerDecision.replace("{action}", actionToLabel(action));
      logs.push(createLog(actionMessage, "success"));

      if (action === "done") {
        if (!searchResult || !profile || !fit) {
          throw new Error("Controller exited before all data was collected.");
        }
        break;
      }

      if (action === "searchBusinessInfo") {
        logs.push(createLog(locale.agentLogSearch, "pending"));
        searchResult = await searchBusinessInfo(`${businessName} official site ${clubProfile.location ?? ""}`);
        logs[logs.length - 1].status = "success";
        continue;
      }

      if (action === "extractBusinessProfile") {
        if (!searchResult) {
          throw new Error("Controller requested profile extraction before search results were available.");
        }
        logs.push(createLog(locale.agentLogProfile, "pending"));
        profile = extractBusinessProfile(businessName, searchResult);
        logs[logs.length - 1].status = "success";
        continue;
      }

      if (action === "scoreSponsorFit") {
        if (!profile) {
          throw new Error("Controller requested fit scoring before the profile was extracted.");
        }
        logs.push(createLog(locale.agentLogFit, "pending"));
        fit = scoreSponsorFit(profile, clubProfile);
        logs[logs.length - 1].status = "success";
        continue;
      }
    }

    if (!searchResult || !profile || !fit) {
      throw new Error("Unable to complete evaluation after multiple attempts.");
    }

    const sponsor = buildSponsorFromProfile(
      businessName.trim(),
      searchResult,
      profile,
      fit.fitReasons[0] || "Values and audience alignment"
    );

    logs.push(createLog(locale.agentLogSummary, "success"));

    const summary = locale.agentFinalSummary
      .replace("{business}", businessName)
      .replace("{score}", fit.score.toString())
      .replace("{type}", fit.suggestedSponsorshipType);

    const trackingPayload = {
      sponsor,
      score: fit.score,
      notes: fit.fitReasons.join(" "),
      generatedAt: new Date().toISOString(),
      tags: [profile.industry, fit.suggestedSponsorshipType].filter(Boolean),
    };

    const result: AgentEvaluationResult = {
      logs,
      businessInfo: searchResult,
      profile,
      fit,
      finalSummary: summary,
      trackingPayload,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Agent evaluation failed", error);
    logs.push(createLog(`${locale.agentLogFailurePrefix}: ${error?.message || "Unknown error"}`, "error"));
    return NextResponse.json({ error: locale.agentErrorGeneric, logs }, { status: 500 });
  }
}
