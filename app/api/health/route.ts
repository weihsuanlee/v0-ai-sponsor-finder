import { type NextRequest, NextResponse } from "next/server";

/**
 * Health check endpoint to validate API configuration
 * Does not expose sensitive information like API keys
 */
export async function GET(request: NextRequest) {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      gemini: {
        configured: !!key,
        keyLength: key?.length || 0,
        // show only masked preview if key exists
        keyPreview: key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : "NOT_CONFIGURED",
      },
    },
  };

  if (!key) {
    return NextResponse.json(
      {
        ...health,
        status: "warning",
        message: "Google Generative AI API key is not configured. Pitch generation will not work.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(health);
}
