import { NextResponse } from "next/server";
import { z } from "zod";
import { extractCompanyInfoFromUrl } from "@/lib/tools/extractFromUrl";

const requestSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
    }

    const result = await extractCompanyInfoFromUrl(parsed.data.url);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Website extraction failed", error);
    return NextResponse.json({ error: "Unable to extract company information at this time." }, { status: 500 });
  }
}
