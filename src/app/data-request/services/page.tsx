import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { CustomCollectionMarketplacePage } from "@/features/custom-collection/CustomCollectionMarketplacePage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { listPublicCollectionServices } from "@/services/public-catalogue.service";
import {
  toUrlSearchParams,
  type SearchParams,
} from "@/features/datasets/discovery-query";
import type { CustomCollectionListQuery } from "@/types";

export const metadata: Metadata = genMeta({
  title: "Custom Data Collection Services | Kuinbee",
  description:
    "Browse reviewed custom data collection services from verified suppliers and submit a scoped project request through Kuinbee.",
  keywords: [
    "custom data collection services",
    "data collection suppliers",
    "survey data collection",
    "bespoke datasets",
    "custom data sourcing",
  ],
  path: "/data-request/services",
});

export default async function CustomCollectionServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = toUrlSearchParams(await searchParams);
  const sort = params.get("sort");
  const query: CustomCollectionListQuery = {
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
    pageSize: 9,
    q: params.get("q") || undefined,
    categoryId: params.get("categoryId") || undefined,
    sort: sort === "TITLE_ASC" || sort === "TITLE_DESC" ? sort : "NEWEST",
  };
  for (const key of [
    "collectionMethods",
    "industries",
    "geographies",
    "supportedFormats",
    "languages",
  ] as const) {
    const values = params.getAll(key);
    if (values.length) query[key] = values;
  }
  const client = new QueryClient();
  client.setQueryData(
    ["custom-collection-services", "list", query],
    await listPublicCollectionServices(query)
  );
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Suspense fallback={<ServicesPageFallback />}>
        <CustomCollectionMarketplacePage />
      </Suspense>
    </HydrationBoundary>
  );
}

function ServicesPageFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border/50 sticky top-0 z-50 bg-background" />
      <section className="pt-20 md:pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 space-y-3">
            <div className="h-9 w-72 rounded-lg bg-muted/50 animate-pulse" />
            <div className="h-4 w-full max-w-xl rounded bg-muted/30 animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted/20 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            <div className="hidden lg:block rounded-lg border border-border bg-card p-5 h-[620px]">
              <div className="animate-pulse space-y-5">
                <div className="h-4 w-24 rounded-sm bg-muted" />
                <div className="space-y-2">
                  <div className="h-9 w-full rounded-md bg-muted" />
                  <div className="h-9 w-full rounded-md bg-muted" />
                  <div className="h-9 w-full rounded-md bg-muted" />
                </div>
                <div className="h-px bg-border" />
                <div className="h-4 w-28 rounded-sm bg-muted" />
                <div className="space-y-2">
                  <div className="h-9 w-full rounded-md bg-muted" />
                  <div className="h-9 w-full rounded-md bg-muted" />
                </div>
                <div className="h-px bg-border" />
                <div className="h-4 w-20 rounded-sm bg-muted" />
                <div className="h-20 w-full rounded-md bg-muted" />
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-xl border border-border/40 bg-card p-4 h-[67px] animate-pulse" />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-border/40 bg-card animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-muted/70" />
                    <div className="space-y-4 p-5">
                      <div className="h-3 w-24 rounded-sm bg-muted" />
                      <div className="h-6 w-4/5 rounded-sm bg-muted" />
                      <div className="h-16 w-full rounded-sm bg-muted" />
                      <div className="flex gap-2">
                        <div className="h-6 w-20 rounded-md bg-muted" />
                        <div className="h-6 w-24 rounded-md bg-muted" />
                      </div>
                      <div className="h-10 w-full rounded-md bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
