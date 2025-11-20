import type { SearchBusinessInfoResult } from "@/lib/types";

const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

export async function searchBusinessInfo(query: string): Promise<SearchBusinessInfoResult> {
  if (!GOOGLE_CSE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error("Google Custom Search credentials are not configured.");
  }

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", GOOGLE_CSE_API_KEY);
  url.searchParams.set("cx", GOOGLE_CSE_ID);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "5");
  url.searchParams.set("lr", "lang_en");

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || "Search request failed.");
  }

  const data = await response.json();
  const items = (data.items || []) as Array<{ title?: string; link?: string; snippet?: string }>;

  if (items.length === 0) {
    throw new Error("No search results found for that company.");
  }

  const primary = items[0];

  console.log({
    query,
    name: primary.title ?? query,
    website: primary.link ?? "",
    title: primary.title ?? "",
    snippet: primary.snippet ?? "",
    description: primary.snippet ?? "",
    categories:
      data.context?.facets
        ?.flat()
        ?.map((facet: any) => facet.anchor)
        .filter(Boolean) ?? [],
    rawItems: items.map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      snippet: item.snippet ?? "",
    })),
  });

  return {
    query,
    name: primary.title ?? query,
    website: primary.link ?? "",
    title: primary.title ?? "",
    snippet: primary.snippet ?? "",
    description: primary.snippet ?? "",
    categories:
      data.context?.facets
        ?.flat()
        ?.map((facet: any) => facet.anchor)
        .filter(Boolean) ?? [],
    rawItems: items.map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      snippet: item.snippet ?? "",
    })),
  };
}
