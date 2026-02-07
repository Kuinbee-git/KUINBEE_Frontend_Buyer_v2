/**
 * Library React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services";
import type { LibraryListQuery } from "@/types";

// Query keys
export const libraryKeys = {
  library: (query?: LibraryListQuery) => ["library", query] as const,
  libraryItem: (datasetId: string) => ["library", datasetId] as const,
  downloadUrl: (datasetId: string) =>
    ["library", datasetId, "download-url"] as const,
  entitlements: ["entitlements"] as const,
  entitlementCheck: (datasetId: string) =>
    ["entitlements", datasetId, "check"] as const,
};

// List library
export const useLibrary = (query?: LibraryListQuery) => {
  return useQuery({
    queryKey: libraryKeys.library(query),
    queryFn: () => libraryService.listLibrary(query),
  });
};

// Get library item
export const useLibraryItem = (datasetId: string, enabled = true) => {
  return useQuery({
    queryKey: libraryKeys.libraryItem(datasetId),
    queryFn: () => libraryService.getLibraryItem(datasetId),
    enabled,
  });
};

// Get download URL
export const useDownloadUrl = (datasetId: string, enabled = false) => {
  return useQuery({
    queryKey: libraryKeys.downloadUrl(datasetId),
    queryFn: () => libraryService.getDownloadUrl(datasetId),
    enabled,
    staleTime: 0, // Always fetch fresh download URLs
  });
};

// Claim free dataset
export const useClaimDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datasetId: string) =>
      libraryService.claimFreeDataset(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      queryClient.invalidateQueries({ queryKey: ["entitlements"] });
    },
  });
};

// List entitlements
export const useEntitlements = () => {
  return useQuery({
    queryKey: libraryKeys.entitlements,
    queryFn: libraryService.listEntitlements,
  });
};

// Check entitlement
export const useCheckEntitlement = (datasetId: string, enabled = true) => {
  return useQuery({
    queryKey: libraryKeys.entitlementCheck(datasetId),
    queryFn: () => libraryService.checkEntitlement(datasetId),
    enabled,
  });
};
