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
  const query = discoveryQuery(toUrlSearchParams(await searchParams));
  const client = new QueryClient();
  const data = await listPublicDatasets(query);
  client.setQueryData(["datasets", query], data);
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Suspense fallback={<DatasetsLoading />}>
        <DatasetDiscoveryV2 />
      </Suspense>
    </HydrationBoundary>
  );
}
