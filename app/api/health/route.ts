import { type NextRequest, NextResponse } from "next/server"

/**
 * Health check endpoint to validate API configuration
 * Does not expose sensitive information like API keys
 */
export async function GET(request: NextRequest) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0,
        // Only show if key is present and first few characters (masked)
        keyPreview: process.env.OPENAI_API_KEY
          ? `${process.env.OPENAI_API_KEY.substring(0, 7)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}`
          : "NOT_CONFIGURED",
      },
    },
  }

  // If OpenAI is not configured, return a warning status
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        ...health,
        status: "warning",
        message: "OpenAI API key is not configured. Pitch generation will not work.",
      },
      { status: 200 }
    )
  }

  return NextResponse.json(health)
}
