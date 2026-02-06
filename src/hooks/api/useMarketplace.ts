/**
 * Marketplace React Query hooks
 */

import { useQuery } from "@tanstack/react-query";
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
