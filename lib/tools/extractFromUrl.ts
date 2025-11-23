import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import type { SearchBusinessInfoResult } from "@/lib/types";

const normalizeWhitespace = (value?: string | null) => value?.replace(/\s+/g, " ").trim() ?? "";

const ensureAbsoluteUrl = (value: string) => {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

const collectMetaKeywords = (doc: Document) => {
  const keywordMeta = doc.querySelector('meta[name="keywords"]')?.getAttribute("content") ?? "";
  const tagNodes = Array.from(
    doc.querySelectorAll('meta[property="article:tag"], meta[property="og:site_name"], meta[name="category"]')
  );
  const tags = tagNodes
    .map((node) => node.getAttribute("content")?.trim())
    .filter((value): value is string => Boolean(value));

  return Array.from(
    new Set(
      [
        ...keywordMeta
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        ...tags,
      ]
        .map((keyword) => keyword.replace(/\s+/g, " "))
        .filter(Boolean)
    )
  ).slice(0, 6);
};

export async function extractCompanyInfoFromUrl(inputUrl: string): Promise<SearchBusinessInfoResult> {
  if (!inputUrl?.trim()) {
    throw new Error("URL is required for extraction.");
  }

  const normalizedUrl = new URL(ensureAbsoluteUrl(inputUrl)).toString();
  const response = await fetch(normalizedUrl, {
    headers: {
      "User-Agent": "SmartSponsorEvaluatorBot/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch website content (status ${response.status}).`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url: normalizedUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const fallbackTitle = dom.window.document.title?.trim() || new URL(normalizedUrl).hostname;
  const title = normalizeWhitespace(article?.title) || fallbackTitle;
  const descriptionCandidate =
    normalizeWhitespace(article?.excerpt) ||
    normalizeWhitespace(dom.window.document.querySelector('meta[name="description"]')?.getAttribute("content"));
  const textContent = normalizeWhitespace(article?.textContent) || "";
  const description = descriptionCandidate || textContent.slice(0, 280);
  const snippetSource = description || textContent;
  const snippet =
    snippetSource.length > 220 ? `${snippetSource.slice(0, 217).trimEnd()}...` : snippetSource || fallbackTitle;

  const categories = collectMetaKeywords(dom.window.document);

  const rawItems = [
    {
      title,
      link: normalizedUrl,
      snippet: snippet || description,
    },
  ];

  if (description && description !== snippet) {
    rawItems.push({
      title: `${title} overview`,
      link: normalizedUrl,
      snippet: description,
    });
  }

  if (textContent) {
    rawItems.push({
      title: `${title} details`,
      link: normalizedUrl,
      snippet: textContent.slice(0, 200),
    });
  }

  return {
    query: normalizedUrl,
    name: title,
    website: normalizedUrl,
    title,
    snippet,
    description: description || snippet,
    categories,
    rawItems: rawItems.slice(0, 3),
  };
}
