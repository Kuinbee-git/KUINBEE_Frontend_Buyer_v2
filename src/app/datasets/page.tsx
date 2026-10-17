import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { DatasetDiscoveryV2 } from "@/features/datasets/components";
import DatasetsLoading from "./catalogue-loading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  discoveryQuery,
  toUrlSearchParams,
  type SearchParams,
} from "@/features/datasets/discovery-query";
import { listPublicDatasets } from "@/services/public-catalogue.service";
import {
  buyerCatalogueKeys,
  buyerCategoryKeys,
} from "@/lib/buyer-catalogue-keys";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
import {
  datasetCategoryApi,
  DatasetCategoryError,
  isDatasetCategoryId,
} from "@/services/dataset-category.service";

export const metadata: Metadata = genMeta({
  title: "Buy Verified Datasets for AI, ML & Research | Kuinbee",
  description:
    "Find datasets for AI training, research, and analytics. Compare finance, healthcare, energy, environmental, and speech data with samples, licensing, and access details.",
  keywords: [
    "browse datasets",
    "search datasets",
    "dataset marketplace",
    "find training data",
    "data discovery",
  ],
  path: "/datasets",
});

export default async function DatasetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Reading searchParams avoids a client-only catalogue shell.
  const params = toUrlSearchParams(await searchParams);
  const query = discoveryQuery(params);
  const client = new QueryClient();
  if (DATASET_CONTENT_BUYER_ENABLED) {
    const tokens = [
      ...new Set(
        params
          .getAll("category")
          .map((value) => value.trim())
          .filter(Boolean)
      ),
    ];
    if (tokens.length > 20)
      throw new DatasetCategoryError(
        "Choose at most 20 category filters.",
        "CATEGORY_FILTER_LIMIT",
        400
      );
    const directory = await datasetCategoryApi.all();
    const resolved = await Promise.all(
      tokens
        .filter((token) => !isDatasetCategoryId(token))
        .map(async (token) => {
          const result = await datasetCategoryApi.resolve(token);
          if (result.revision !== directory.revision)
            throw new DatasetCategoryError(
              "Dataset categories changed. Refresh before continuing.",
              "CATEGORY_DIRECTORY_CHANGED",
              409
            );
          return [token, result.category.id] as const;
        })
    );
    const resolutions = Object.fromEntries(resolved);
    const ids = [
      ...new Set(
        tokens.map((token) =>
          isDatasetCategoryId(token) ? token : resolutions[token]
        )
      ),
    ];
    query.categoryIds = ids.length ? ids : undefined;
    query.expectedCategoryRevision = directory.revision;
    // Match the client's explicit category normalization and page reset.
    if (tokens.some((token, index) => token !== ids[index])) query.page = 1;
    client.setQueryData(buyerCategoryKeys.directory, directory);
    client.setQueryData(buyerCategoryKeys.resolution(tokens), resolutions);
  }
  const data = await listPublicDatasets(query);
  client.setQueryData(buyerCatalogueKeys.list(query), data);
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Suspense fallback={<DatasetsLoading />}>
        <DatasetDiscoveryV2 />
      </Suspense>
    </HydrationBoundary>
  );
}
