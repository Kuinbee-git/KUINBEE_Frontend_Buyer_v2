/**
 * Library service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  LibraryItem,
  LibraryItemDetailsResponse,
  LibraryListQuery,
  DownloadUrlResponse,
  EntitlementsResponse,
  EntitlementCheckResponse,
  PaginatedResponse,
  SuccessResponse,
  ApiResponse,
} from "@/types";

export const libraryService = {
  // Library
  listLibrary: (query?: LibraryListQuery) =>
    apiClient.get<PaginatedResponse<LibraryItem>>(
      API_ENDPOINTS.LIBRARY.BASE,
      query as Record<string, unknown>
    ),

  getLibraryItem: (datasetId: string) =>
    apiClient.get<LibraryItemDetailsResponse>(
      API_ENDPOINTS.LIBRARY.ITEM(datasetId)
    ),

  getDownloadUrl: (datasetId: string) =>
    apiClient.get<DownloadUrlResponse>(
      API_ENDPOINTS.LIBRARY.DOWNLOAD_URL(datasetId)
    ),

  claimFreeDataset: (datasetId: string) =>
    apiClient.post<SuccessResponse>(API_ENDPOINTS.LIBRARY.CLAIM(datasetId)),

  // Entitlements
  listEntitlements: () =>
    apiClient.get<EntitlementsResponse>(API_ENDPOINTS.ENTITLEMENTS.BASE),

  checkEntitlement: (datasetId: string) =>
    apiClient.get<EntitlementCheckResponse>(
      API_ENDPOINTS.ENTITLEMENTS.CHECK(datasetId)
    ),
};
