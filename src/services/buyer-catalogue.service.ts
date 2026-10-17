import {
  buyerDatasetApi,
  type BuyerCatalogueDetail,
  type BuyerCatalogueCard,
} from "./dataset-content.service";
import { marketplaceService } from "./marketplace.service";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
import type {
  Dataset,
  DatasetDetailsResponse,
  DatasetListQuery,
} from "@/types";

export type BuyerDatasetCardView =
  | Extract<BuyerCatalogueCard, { representation: "CONTENT" }>
  | { representation: "LEGACY"; legacy: Dataset };
export type BuyerDatasetDetailView =
  | Extract<BuyerCatalogueDetail, { representation: "CONTENT" }>
  | { representation: "LEGACY"; legacy: DatasetDetailsResponse };
export function legacyCatalogueCard(
  row: Extract<BuyerCatalogueCard, { representation: "LEGACY" }>["legacy"]
): Dataset {
  return { ...row, rating: row.rating === null ? null : Number(row.rating) };
}
export function legacyCatalogueDetail(
  row: Extract<BuyerCatalogueDetail, { representation: "LEGACY" }>["legacy"]
): DatasetDetailsResponse {
  return {
    ...row,
    dataset: {
      ...row.dataset,
      rating: row.dataset.rating === null ? null : Number(row.dataset.rating),
    },
  };
}
export const buyerCatalogueService = {
  async list(query: DatasetListQuery = {}, signal?: AbortSignal) {
    if (!DATASET_CONTENT_BUYER_ENABLED) {
      const result = await marketplaceService.listDatasets(query);
      return {
        ...result,
        items: result.items.map((legacy) => ({
          representation: "LEGACY" as const,
          legacy,
        })),
      };
    }
    const result = await buyerDatasetApi.catalogue(query, signal);
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
  },
  async publicMetadata(
    datasetId: string,
    signal?: AbortSignal
  ): Promise<BuyerDatasetDetailView> {
    if (!DATASET_CONTENT_BUYER_ENABLED)
      return {
        representation: "LEGACY",
        legacy: await marketplaceService.getDatasetDetails(datasetId),
      };
    const result = await buyerDatasetApi.publicMetadata(datasetId, signal);
    return result.representation === "CONTENT"
      ? result
      : {
          representation: "LEGACY",
          legacy: legacyCatalogueDetail(result.legacy),
        };
  },
  async detail(
    datasetId: string,
    signal?: AbortSignal
  ): Promise<BuyerDatasetDetailView> {
    if (!DATASET_CONTENT_BUYER_ENABLED)
      return {
        representation: "LEGACY",
        legacy: await marketplaceService.getDatasetDetails(datasetId),
      };
    const result = await buyerDatasetApi.detail(datasetId, signal);
    return result.representation === "CONTENT"
      ? result
      : {
          representation: "LEGACY",
          legacy: legacyCatalogueDetail(result.legacy),
        };
  },
};

export const catalogueCardIdentity = (row: BuyerDatasetCardView) =>
  row.representation === "CONTENT" ? row.item : row.legacy;
export const catalogueDetailIdentity = (row: BuyerDatasetDetailView) =>
  row.representation === "CONTENT" ? row.item : row.legacy.dataset;
