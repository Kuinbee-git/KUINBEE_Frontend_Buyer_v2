import { BUYER_DATASET_QUERY_VERSION } from "./dataset-content-environment";
import type { DatasetListQuery } from "@/types";
export const buyerCategoryKeys = {
  directory: ["dataset-category-directory-v1"] as const,
  resolution: (tokens: readonly string[]) =>
    ["dataset-category-link-resolution-v1", tokens] as const,
};
export const buyerCatalogueKeys = {
  list: (query?: DatasetListQuery) =>
    ["datasets", BUYER_DATASET_QUERY_VERSION, "list", query] as const,
  detail: (datasetId: string) =>
    ["datasets", BUYER_DATASET_QUERY_VERSION, "details", datasetId] as const,
};
