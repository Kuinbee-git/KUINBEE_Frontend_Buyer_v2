import { BUYER_DATASET_QUERY_VERSION } from "./dataset-content-environment";
import type { DatasetListQuery } from "@/types";
export const buyerCatalogueKeys = {
  list: (query?: DatasetListQuery) =>
    ["datasets", BUYER_DATASET_QUERY_VERSION, "list", query] as const,
  detail: (datasetId: string) =>
    ["datasets", BUYER_DATASET_QUERY_VERSION, "details", datasetId] as const,
};
