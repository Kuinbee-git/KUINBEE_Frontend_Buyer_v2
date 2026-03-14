/**
 * Marketplace React Query hooks
 */

import { useQuery, keepPreviousData, QueryClient } from "@tanstack/react-query";
import { marketplaceService } from "@/services";
import type { DatasetListQuery, CategoryListQuery } from "@/types";

// Query keys
export const marketplaceKeys = {
  datasets: (query?: DatasetListQuery) => ["datasets", query] as const,
  datasetDetails: (datasetId: string) =>
    ["datasets", datasetId, "details"] as const,
  categories: (query?: CategoryListQuery) => ["categories", query] as const,
};

// List datasets
export const useDatasets = (query?: DatasetListQuery) => {
  return useQuery({
    queryKey: marketplaceKeys.datasets(query),
    queryFn: () => marketplaceService.listDatasets(query),
    placeholderData: keepPreviousData,
  });
};

// Get dataset details
export const useDatasetDetails = (datasetId: string, enabled = true) => {
  return useQuery({
    queryKey: marketplaceKeys.datasetDetails(datasetId),
    queryFn: () => marketplaceService.getDatasetDetails(datasetId),
    enabled,
  });
};

// List categories
export const useCategories = (query?: CategoryListQuery) => {
  return useQuery({
    queryKey: marketplaceKeys.categories(query),
    queryFn: () => marketplaceService.listCategories(query),
  });
};

// ── Prefetch helpers (fire-and-forget, no UI impact) ──

/** Prefetch a dataset list page so it's cached before the user navigates to it. */
export const prefetchDatasets = (queryClient: QueryClient, query: DatasetListQuery) => {
  queryClient.prefetchQuery({
    queryKey: marketplaceKeys.datasets(query),
    queryFn: () => marketplaceService.listDatasets(query),
    staleTime: 30_000, // keep prefetched data fresh for 30s
  });
};

/** Prefetch a single dataset's detail page (e.g. on card hover). */
export const prefetchDatasetDetails = (queryClient: QueryClient, datasetId: string) => {
  queryClient.prefetchQuery({
    queryKey: marketplaceKeys.datasetDetails(datasetId),
    queryFn: () => marketplaceService.getDatasetDetails(datasetId),
    staleTime: 60_000, // keep detail data fresh for 60s
  });
};
