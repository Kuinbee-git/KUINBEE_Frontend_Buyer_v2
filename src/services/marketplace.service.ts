/**
 * Marketplace service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  Dataset,
  DatasetDetailsResponse,
  DatasetListQuery,
  Category,
  CategoryListQuery,
  PaginatedResponse,
} from "@/types";

export const marketplaceService = {
  // Datasets
  listDatasets: (query?: DatasetListQuery) =>
    apiClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.MARKETPLACE.DATASETS,
      query as Record<string, unknown>
    ),

  getDatasetDetails: (datasetId: string) =>
    apiClient.get<DatasetDetailsResponse>(
      API_ENDPOINTS.MARKETPLACE.DATASET_DETAILS(datasetId)
    ),

  // Categories
  listCategories: (query?: CategoryListQuery) =>
    apiClient.get<PaginatedResponse<Category>>(
      API_ENDPOINTS.MARKETPLACE.CATEGORIES,
      query as Record<string, unknown>
    ),
};
