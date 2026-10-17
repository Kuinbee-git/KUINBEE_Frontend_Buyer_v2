import { cache } from "react";
import { API_BASE_URL } from "@/core/api/endpoints";
import { buyerDatasetApi } from "./dataset-content.service";
import {
  legacyCatalogueCard,
  legacyCatalogueDetail,
  type BuyerDatasetCardView,
  type BuyerDatasetDetailView,
} from "./buyer-catalogue.service";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
import { datasetCategoryApi } from "./dataset-category.service";
import {
  datasetCategoryLegacySlug,
  datasetCategoryRouteKey,
} from "@kuinbee/dataset-preparation-contracts";
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
    ...(DATASET_CONTENT_BUYER_ENABLED &&
    path === "/api/v1/marketplace/categories"
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600 } }),
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

export const listPublicDatasets = async (query: DatasetListQuery = {}) => {
  if (!DATASET_CONTENT_BUYER_ENABLED) {
    const result = await publicGet<PaginatedResponse<Dataset>>(
      "/api/v1/marketplace/datasets",
      query
    );
    return {
      ...result,
      items: result.items.map((legacy) => ({
        representation: "LEGACY" as const,
        legacy,
      })),
    };
  }
  try {
    const result = await buyerDatasetApi.catalogue(query);
    return {
      ...result,
      items: result.items.map(
        (row): BuyerDatasetCardView =>
          row.representation === "CONTENT"
            ? row
            : {
                representation: "LEGACY",
                legacy: legacyCatalogueCard(row.legacy),
              }
      ),
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number"
    )
      throw new PublicCatalogueError(
        error.status,
        "Public Dataset catalogue unavailable"
      );
    throw error;
  }
};

export const getPublicDataset = cache(
  async (id: string): Promise<BuyerDatasetDetailView> => {
    if (!DATASET_CONTENT_BUYER_ENABLED)
      return {
        representation: "LEGACY",
        legacy: await publicGet<DatasetDetailsResponse>(
          `/api/v1/marketplace/datasets/${encodeURIComponent(id)}`
        ),
      };
    try {
      const result = await buyerDatasetApi.detail(id);
      return result.representation === "CONTENT"
        ? result
        : {
            representation: "LEGACY",
            legacy: legacyCatalogueDetail(result.legacy),
          };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number"
      )
        throw new PublicCatalogueError(
          error.status,
          "Public Dataset unavailable"
        );
      throw error;
    }
  }
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
  DATASET_CONTENT_BUYER_ENABLED
    ? datasetCategoryApi.all()
    : publicGet<PaginatedResponse<Category>>("/api/v1/marketplace/categories", {
        page: 1,
        pageSize: 100,
      })
);

export const categorySlug = datasetCategoryLegacySlug;
export const categoryHref = (category: Category) =>
  `/datasets/categories/${DATASET_CONTENT_BUYER_ENABLED ? datasetCategoryRouteKey(category.id, category.name) : categorySlug(category.name)}`;

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

export function datasetDescription(result: BuyerDatasetDetailView): string {
  if (result.representation === "CONTENT")
    return result.description.description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const data = result.legacy;
  return (
    data.dataset.description ||
    data.aboutDatasetInfo?.overview ||
    `Explore ${data.dataset.title} on Kuinbee. Review coverage, format, licensing, samples, and access conditions.`
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
