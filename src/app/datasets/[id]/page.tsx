import type { Metadata } from "next";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
} from "@/core/config";
import { DatasetDetailPageContent } from "./_components/DatasetDetailPageContent";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

/**
 * Server-side fetch helper that mirrors apiClient's unwrap behaviour.
 * Returns `data.data` when the response uses `{ success, data }` envelope.
 */
async function serverFetch<T>(
  path: string,
  revalidate = 60
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Unwrap envelope used by the backend
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      return json.data as T;
    }
    return json as T;
  } catch {
    return null;
  }
}

// Dynamically generate static pages for top datasets at build time
export async function generateStaticParams() {
  try {
    // Fetch top 20 most viewed datasets
    const res = await fetch(
      `${API_URL}/api/v1/marketplace/datasets?limit=20&sort=viewCount:desc`
    );
    if (res.ok) {
      const data = await res.json();
      const datasets = data.data?.datasets || [];
      return datasets.map((d: any) => ({
        id: d.datasetUniqueId || d.id,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch datasets for static generation:", error);
  }
  return [];
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return genMeta({
    title: `Dataset ${id}`,
    description:
      "View detailed information about this dataset including samples, schema, pricing, and reviews on Kuinbee Marketplace.",
    keywords: ["dataset details", "buy dataset", "dataset preview", "data sample"],
    path: `/datasets/${id}`,
  });
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;

  // ── Server-side prefetch: dataset details + KDTS in parallel ──
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["datasets", id, "details"],
      queryFn: () =>
        serverFetch(`/api/v1/marketplace/datasets/${id}`, 60),
      staleTime: 60_000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["dataset-kdts", id],
      queryFn: () =>
        serverFetch(`/api/v1/datasets/${id}/kdts`, 300),
      staleTime: 5 * 60_000,
    }),
  ]);

  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Datasets", url: "/datasets" },
    { name: `Dataset ${id}`, url: `/datasets/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DatasetDetailPageContent />
      </HydrationBoundary>
    </>
  );
}

