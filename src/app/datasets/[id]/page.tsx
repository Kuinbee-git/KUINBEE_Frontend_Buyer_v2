import type { Metadata } from "next";
import { cache } from "react";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
} from "@/core/config";
import type { DatasetDetailsResponse } from "@/types";
import { DatasetDetailPageContent } from "./_components/DatasetDetailPageContent";

// ISR: cache the server-rendered page for 1 hour at the CDN edge.
export const revalidate = 3600;

// Dynamically generate static pages for top datasets at build time
export async function generateStaticParams() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(
      `${apiUrl}/api/v1/marketplace/datasets?limit=20&sort=viewCount:desc`
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

/** Fetch full dataset details response server-side (no auth needed for published datasets) */
const fetchDatasetDetailsResponse = cache(async (id: string): Promise<DatasetDetailsResponse | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/api/v1/marketplace/datasets/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      // Expected envelope: { success, data: { dataset, ... } }
      const payload = json?.data ?? json;
      return payload?.dataset ? (payload as DatasetDetailsResponse) : null;
    }
  } catch {
    // Silently fail — metadata/schema fall back to defaults
  }
  return null;
});

async function fetchDatasetDetail(id: string) {
  const details = await fetchDatasetDetailsResponse(id);
  return details?.dataset ?? null;
}

function createLightInitialDetails(details: DatasetDetailsResponse | null): DatasetDetailsResponse | undefined {
  if (!details) return undefined;

  return {
    ...details,
    features: [],
    tags: details.tags?.slice(0, 12) || [],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const response = await fetchDatasetDetailsResponse(id);
  const dataset = response?.dataset;

  if (!dataset) {
    return genMeta({
      title: "Dataset",
      description:
        "View detailed information about this dataset including samples, schema, pricing, and reviews on Kuinbee Marketplace.",
      keywords: ["dataset details", "buy dataset", "dataset preview", "data sample"],
      path: `/datasets/${id}`,
    });
  }

  const categoryName = response?.primaryCategory?.name ?? "";
  const providerName = response?.source?.name ?? "";
  const pricing = dataset.isPaid
    ? `Starting at ${dataset.currency ?? "INR"} ${dataset.price}`
    : "Free";

  return genMeta({
    title: dataset.title,
    description:
      dataset.description ??
      `${dataset.title}${categoryName ? ` — ${categoryName} dataset` : ""}${providerName ? ` by ${providerName}` : ""}. ${pricing}. Explore schema, samples, and pricing on Kuinbee Marketplace.`,
    keywords: [
      dataset.title,
      categoryName,
      "buy dataset",
      "dataset marketplace",
      "data download",
      ...(response?.tags ?? []),
    ].filter(Boolean),
    path: `/datasets/${id}`,
  });
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;
  const detailsResponse = await fetchDatasetDetailsResponse(id);
  const dataset = detailsResponse?.dataset ?? null;
  const lightInitialDetails = createLightInitialDetails(detailsResponse);

  const datasetTitle = dataset?.title ?? `Dataset ${id}`;
  const categoryName = detailsResponse?.primaryCategory?.name ?? "";

  // Breadcrumb: Home > Datasets > [Category] > [Dataset Title]
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Datasets", url: "/datasets" },
    ...(categoryName
      ? [{ name: categoryName, url: "/datasets" }]
      : []),
    { name: datasetTitle, url: `/datasets/${id}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbSchema(breadcrumbItems);

  // Google Dataset Schema (schema.org/Dataset) — enables Google Dataset Search indexing
  const datasetJsonLd = dataset
    ? {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: dataset.title,
        description: dataset.description ?? dataset.title,
        identifier: dataset.datasetUniqueId ?? id,
        url: `https://marketplace.kuinbee.com/datasets/${id}`,
        license: dataset.license ?? "Unknown",
        datePublished: dataset.createdAt,
        dateModified: dataset.updatedAt,
        creator: detailsResponse?.source?.name
          ? { "@type": "Organization", name: detailsResponse.source.name }
          : undefined,
        keywords: detailsResponse?.tags ?? [],
        ...(dataset.isPaid && dataset.price
          ? {
              offers: {
                "@type": "Offer",
                price: dataset.price,
                priceCurrency: dataset.currency ?? "INR",
              },
            }
          : { isAccessibleForFree: true }),
        ...(dataset.rating != null
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: dataset.rating,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Dataset Schema — enables Google Dataset Search indexing */}
      {datasetJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
        />
      )}
      <DatasetDetailPageContent initialDatasetDetails={lightInitialDetails} />
    </>
  );
}
