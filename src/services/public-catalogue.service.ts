import { cache } from "react";
import { API_BASE_URL } from "@/core/api/endpoints";
import type {
  Category,
  Dataset,
  DatasetDetailsResponse,
  DatasetListQuery,
  PaginatedResponse,
  CustomCollectionService,
  CustomCollectionListQuery,
  CustomCollectionListResponse,
} from "@/types";

export class PublicCatalogueError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

async function publicGet<T>(path: string, query?: object): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === "") continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      url.searchParams.append(key, String(item));
    }
  }
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.data) {
    throw new PublicCatalogueError(
      response.status,
      payload?.error?.message || "Public catalogue unavailable"
    );
  }
  return payload.data as T;
}

export const listPublicDatasets = (query: DatasetListQuery = {}) =>
  publicGet<PaginatedResponse<Dataset>>("/api/v1/marketplace/datasets", query);

export const getPublicDataset = cache((id: string) =>
  publicGet<DatasetDetailsResponse>(
    `/api/v1/marketplace/datasets/${encodeURIComponent(id)}`
  )
);

export const listPublicCollectionServices = (
  query: CustomCollectionListQuery = {}
) =>
  publicGet<CustomCollectionListResponse>(
    "/api/v1/marketplace/custom-collection-services",
    query
  );

export const getPublicCollectionService = cache(async (slug: string) => {
  const data = await publicGet<{ service: CustomCollectionService }>(
    `/api/v1/marketplace/custom-collection-services/${encodeURIComponent(slug)}`
  );
  return data.service;
});

export const listPublicCategories = cache(() =>
  publicGet<PaginatedResponse<Category>>("/api/v1/marketplace/categories", {
    page: 1,
    pageSize: 100,
  })
);

export const categorySlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function listAllPublished<T>(
  load: (page: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page += 1) {
    const result = await load(page);
    if (
      result.page !== page ||
      (!result.items.length && items.length < result.total)
    ) {
      throw new Error("Public catalogue pagination did not advance");
    }
    items.push(...result.items);
    if (items.length >= result.total) return items;
  }
}

export function datasetDescription(data: DatasetDetailsResponse): string {
  return (
    data.dataset.description ||
    data.aboutDatasetInfo?.overview ||
    `Explore ${data.dataset.title} on Kuinbee. Review coverage, format, licensing, samples, and access conditions.`
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
