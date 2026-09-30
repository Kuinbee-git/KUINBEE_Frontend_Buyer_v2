import type { DatasetListQuery, DatasetSortOption, Currency } from "@/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export function toUrlSearchParams(input: SearchParams): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    (Array.isArray(value) ? value : value === undefined ? [] : [value]).forEach(
      (item) => params.append(key, item)
    );
  });
  return params;
}

const sorts: Record<string, DatasetSortOption> = {
  relevance: "relevance",
  newest: "createdAt:desc",
  oldest: "createdAt:asc",
  updated: "updatedAt:desc",
  popular: "viewCount:desc",
  "most-downloaded": "downloadCount:desc",
  "top-rated": "rating:desc",
  "top-kdts": "kdtsScore:desc",
  "price-low": "price:asc",
  "price-high": "price:desc",
};

export function discoveryQuery(params: URLSearchParams): DatasetListQuery {
  const categories = [
    ...new Set(
      params
        .getAll("category")
        .map((item) => item.trim())
        .filter((item) => item.length >= 20)
    ),
  ];
  const paid = params.get("pricingType") === "paid";
  const pricing = params.get("pricingType") || "all";
  return {
    q: params.get("q") || undefined,
    categoryIds: categories.length ? categories : undefined,
    ...(pricing !== "all" && { isPaid: paid }),
    currency: paid
      ? ((params.get("currency") || "INR") as Currency)
      : undefined,
    minPrice: paid ? params.get("minPrice") || undefined : undefined,
    maxPrice: paid ? params.get("maxPrice") || undefined : undefined,
    country: params.get("country") || undefined,
    state: params.get("state") || undefined,
    city: params.get("city") || undefined,
    tags: params.get("tags")?.split(","),
    minKdtsScore: params.get("minKdtsScore") || undefined,
    sort: sorts[params.get("sort") || "relevance"] || "relevance",
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
    pageSize: Math.min(
      100,
      Math.max(1, Number.parseInt(params.get("pageSize") || "10", 10) || 10)
    ),
  };
}
