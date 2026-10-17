"use client";

import {
  useQuery,
  keepPreviousData,
  type QueryClient,
} from "@tanstack/react-query";
import type { DatasetListQuery } from "@/types";
import { buyerCatalogueService } from "@/services/buyer-catalogue.service";
import { buyerCatalogueKeys } from "@/lib/buyer-catalogue-keys";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
export { buyerCatalogueKeys } from "@/lib/buyer-catalogue-keys";
export function useBuyerDatasetList(query?: DatasetListQuery, enabled = true) {
  return useQuery({
    queryKey: buyerCatalogueKeys.list(query),
    enabled,
    retry: false,
    placeholderData: DATASET_CONTENT_BUYER_ENABLED
      ? undefined
      : keepPreviousData,
    queryFn: ({ signal }) => buyerCatalogueService.list(query, signal),
    // New filter/page/contract generations must never inherit another result.
    staleTime: DATASET_CONTENT_BUYER_ENABLED ? 0 : undefined,
    refetchOnWindowFocus: DATASET_CONTENT_BUYER_ENABLED ? "always" : false,
    refetchOnReconnect: DATASET_CONTENT_BUYER_ENABLED ? "always" : false,
  });
}
export function useBuyerDatasetDetail(datasetId: string, enabled = true) {
  return useQuery({
    queryKey: buyerCatalogueKeys.detail(datasetId),
    enabled: Boolean(datasetId) && enabled,
    retry: false,
    staleTime: DATASET_CONTENT_BUYER_ENABLED ? 0 : 60_000,
    queryFn: ({ signal }) =>
      DATASET_CONTENT_BUYER_ENABLED
        ? buyerCatalogueService.publicMetadata(datasetId, signal)
        : buyerCatalogueService.detail(datasetId, signal),
    refetchOnWindowFocus: DATASET_CONTENT_BUYER_ENABLED ? "always" : false,
    refetchOnReconnect: DATASET_CONTENT_BUYER_ENABLED ? "always" : false,
    refetchInterval: DATASET_CONTENT_BUYER_ENABLED ? 30_000 : false,
    refetchIntervalInBackground: false,
  });
}
export function prefetchBuyerDatasets(
  client: QueryClient,
  query: DatasetListQuery
) {
  void client.prefetchQuery({
    queryKey: buyerCatalogueKeys.list(query),
    queryFn: ({ signal }) => buyerCatalogueService.list(query, signal),
    staleTime: 0,
  });
}
