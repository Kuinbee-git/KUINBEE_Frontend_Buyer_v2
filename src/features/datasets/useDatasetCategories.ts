"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
import {
  datasetCategoryApi,
  DatasetCategoryError,
  isDatasetCategoryId,
} from "@/services/dataset-category.service";
import { buyerCategoryKeys } from "@/lib/buyer-catalogue-keys";
import { marketplaceService } from "@/services/marketplace.service";
import type { Category, PaginatedResponse } from "@/types";

export function useDatasetCategories(tokens: readonly string[]) {
  const directory = useQuery<
    PaginatedResponse<Category> & { revision?: string }
  >({
    queryKey: DATASET_CONTENT_BUYER_ENABLED
      ? buyerCategoryKeys.directory
      : ["categories", { pageSize: 100 }],
    queryFn: ({ signal }) =>
      DATASET_CONTENT_BUYER_ENABLED
        ? datasetCategoryApi.all(signal)
        : marketplaceService.listCategories({ pageSize: 100 }),
    ...(DATASET_CONTENT_BUYER_ENABLED
      ? {
          retry: false,
          staleTime: 0,
          refetchOnWindowFocus: "always" as const,
          refetchOnReconnect: "always" as const,
          refetchInterval: 30_000,
          refetchIntervalInBackground: false,
        }
      : {}),
  });
  const unknown = [
    ...new Set(tokens.filter((token) => !isDatasetCategoryId(token))),
  ];
  const resolve = useQuery({
    queryKey: buyerCategoryKeys.resolution(tokens),
    enabled: DATASET_CONTENT_BUYER_ENABLED && unknown.length > 0,
    retry: false,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      if (tokens.length > 20)
        throw new DatasetCategoryError(
          "Choose at most 20 category filters.",
          "CATEGORY_FILTER_LIMIT",
          400
        );
      const rows = await Promise.all(
        unknown.map(async (token) => ({
          token,
          id: (await datasetCategoryApi.resolve(token, signal)).category.id,
        }))
      );
      return Object.fromEntries(rows.map((row) => [row.token, row.id]));
    },
  });
  const ready =
    !DATASET_CONTENT_BUYER_ENABLED ||
    tokens.length === 0 ||
    (tokens.length <= 20 && (unknown.length === 0 || resolve.isSuccess));
  const ids = useMemo(
    () =>
      DATASET_CONTENT_BUYER_ENABLED
        ? [
            ...new Set(
              tokens
                .map((token) =>
                  isDatasetCategoryId(token) ? token : resolve.data?.[token]
                )
                .filter((id): id is string => Boolean(id))
            ),
          ]
        : [...tokens],
    [tokens, resolve.data]
  );
  return {
    directory,
    ready,
    ids,
    error: DATASET_CONTENT_BUYER_ENABLED
      ? tokens.length > 20
        ? new DatasetCategoryError(
            "Choose at most 20 category filters.",
            "CATEGORY_FILTER_LIMIT",
            400
          )
        : resolve.error
      : null,
  };
}
