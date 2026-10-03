import { z } from "zod";

import { API_BASE_URL } from "@/core/api/endpoints";
import type { RssDataRequirement } from "@/features/rss/feed";

const pageSize = 48;
const maxPages = 100;

// Select only publication-approved data. Zod strips additional fields.
const requirementSchema = z.object({
  referenceCode: z.string().regex(/^REQ-\d+$/),
  slug: z
    .string()
    .min(1)
    .max(220)
    .refine((value) => value !== "." && value !== ".."),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  publishedAt: z.string().datetime({ offset: true }),
});

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    items: z.array(requirementSchema).max(pageSize),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive().max(pageSize),
    total: z.number().int().nonnegative(),
  }),
});

/** Authoritative public data only: never use the UI's legacy 404 fallback. */
export async function listRssDataRequirements(): Promise<RssDataRequirement[]> {
  const signal = AbortSignal.timeout(5_000);
  const requirements: RssDataRequirement[] = [];
  const seen = new Set<string>();
  let total: number | undefined;

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL(`${API_BASE_URL}/api/v1/marketplace/data-requirements`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("sort", "NEWEST");
    const response = await fetch(url, {
      // Announcements must not serve a stale cached API list after closure.
      // Successful RSS responses have a short, separate CDN cache instead.
      cache: "no-store",
      signal,
    });
    if (!response.ok) throw new Error("RSS requirements API unavailable");
    const data = responseSchema.parse(await response.json()).data;
    total ??= data.total;
    if (
      data.page !== page ||
      data.pageSize !== pageSize ||
      data.total !== total ||
      data.items.length !== Math.min(pageSize, total - (page - 1) * pageSize)
    ) {
      throw new Error("Inconsistent RSS requirements pagination");
    }
    for (const requirement of data.items) {
      if (seen.has(requirement.referenceCode)) {
        throw new Error("Repeated RSS requirement during pagination");
      }
      seen.add(requirement.referenceCode);
      requirements.push(requirement);
    }
    if (requirements.length === total) return requirements;
  }
  throw new Error("RSS requirements exceeded the pagination safety limit");
}
