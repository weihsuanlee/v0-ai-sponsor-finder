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
import { extractCompanyInfoFromUrl } from "@/lib/tools/extractFromUrl";

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

const detectInputUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const looksLikeDomain = /^[\w.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(trimmed);
  if (!hasProtocol && !looksLikeDomain) {
    return null;
  }
  try {
    const normalized = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    return normalized.toString();
  } catch {
    return null;
  }
};

const controller = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

const controllerSchema = z.object({
  action: z.enum(["extractFromUrl", "searchBusinessInfo", "extractBusinessProfile", "scoreSponsorFit", "done"]),
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

    const trimmedInput = businessName.trim();
    const inputUrl = detectInputUrl(trimmedInput);
    const hasInputUrl = Boolean(inputUrl);

    logs.push(createLog(locale.agentLogReasoning, "success"));

    let companyInfo: SearchBusinessInfoResult | null = null;
    let profile: BusinessProfile | null = null;
    let fit: ReturnType<typeof scoreSponsorFit> | null = null;
    let searchUsed = false;
    let extractionUsed = false;
    let knownWebsite: string | null = inputUrl;
    const actionHistory = new Set<string>();
    const maxControllerSteps = 5;

    const actionToLabel = (action: string) => {
      switch (action) {
        case "extractFromUrl":
          return locale.agentActionExtractFromUrl;
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

    for (let i = 0; i < maxControllerSteps; i++) {
      logs.push(createLog(locale.agentLogThinking, "pending"));
      const thinkingLog = logs[logs.length - 1];

      const searchAllowed = !searchUsed && !hasInputUrl && !companyInfo;
      const extractionUrl = !extractionUsed ? knownWebsite : null;
      const extractionAvailable = Boolean(extractionUrl);

      const { object } = await generateObject({
        model: controller("gemini-2.5-flash"),
        schema: controllerSchema,
        prompt: `
You are a controller deciding the next action for the Smart Sponsor Evaluator.
Return strict JSON with the "action" field.

Guidelines:
- Use "extractFromUrl" to pull content from a website URL when available. This MUST be your first step when inputUrlProvided is true and companyInfo is missing.
- Use "searchBusinessInfo" only when searchAllowed is "yes".
- Each tool may be used at most once.
- Use "extractBusinessProfile" only after companyInfo exists.
- Use "scoreSponsorFit" only after the profile exists.
- Choose "done" only when companyInfo, profile, and fit are already available.

State:
userInput: ${trimmedInput}
inputUrlProvided: ${hasInputUrl}
knownWebsite: ${knownWebsite ?? "unknown"}
searchAllowed: ${searchAllowed ? "yes" : "no"}
extractionAvailable: ${extractionAvailable ? "yes" : "no"}
companyInfo: ${companyInfo ? JSON.stringify({ name: companyInfo.name, website: companyInfo.website }) : "missing"}
profile: ${profile ? JSON.stringify(profile) : "missing"}
fit: ${fit ? JSON.stringify({ score: fit.score }) : "missing"}
actionsTaken: ${JSON.stringify(Array.from(actionHistory))}
        `,
      });

      thinkingLog.status = "success";

      let action = object.action;

      if (hasInputUrl && !companyInfo && !extractionUsed && action !== "extractFromUrl") {
        action = "extractFromUrl";
      }

      const actionMessage = locale.agentLogControllerDecision.replace("{action}", actionToLabel(action));
      logs.push(createLog(actionMessage, "success"));

      if (action === "done") {
        if (!companyInfo || !profile || !fit) {
          throw new Error("Controller exited before all data was collected.");
        }
        break;
      }

      if (actionHistory.has(action)) {
        throw new Error(`Controller attempted to repeat action: ${action}`);
      }
      actionHistory.add(action);

      if (action === "extractFromUrl") {
        if (!extractionAvailable || !extractionUrl) {
          throw new Error("Controller requested website extraction without an available URL.");
        }
        logs.push(createLog(locale.agentLogExtractingWebsite, "pending"));
        const extractionLog = logs[logs.length - 1];
        companyInfo = await extractCompanyInfoFromUrl(extractionUrl);
        extractionLog.status = "success";
        logs.push(createLog(locale.agentLogWebsiteExtractionDone, "success"));
        extractionUsed = true;
        knownWebsite = extractionUrl;
        continue;
      }

      if (action === "searchBusinessInfo") {
        if (hasInputUrl) {
          throw new Error("Search is disabled when a URL is provided by the user.");
        }
        if (!searchAllowed) {
          throw new Error("Search is not available at this point in the workflow.");
        }
        logs.push(createLog(locale.agentLogSearch, "pending"));
        companyInfo = await searchBusinessInfo(`${trimmedInput} official site ${clubProfile.location ?? ""}`);
        knownWebsite = companyInfo.website || knownWebsite;
        logs[logs.length - 1].status = "success";
        searchUsed = true;
        continue;
      }

      if (action === "extractBusinessProfile") {
        if (!companyInfo) {
          throw new Error("Controller requested profile extraction before company information was available.");
        }
        const resolvedName = companyInfo.name?.trim() || trimmedInput;
        logs.push(createLog(locale.agentLogProfile, "pending"));
        profile = extractBusinessProfile(resolvedName, companyInfo);
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

    if (!companyInfo || !profile || !fit) {
      throw new Error("Unable to complete evaluation with the available actions.");
    }

    const resolvedBusinessName = companyInfo.name?.trim() || trimmedInput;

    const sponsor = buildSponsorFromProfile(
      resolvedBusinessName,
      companyInfo,
      profile,
      fit.fitReasons[0] || "Values and audience alignment"
    );

    logs.push(createLog(locale.agentLogSummary, "success"));

    const summary = locale.agentFinalSummary
      .replace("{business}", resolvedBusinessName)
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
      businessInfo: companyInfo,
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
