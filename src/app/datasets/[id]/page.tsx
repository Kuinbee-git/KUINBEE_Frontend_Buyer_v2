import type { Metadata } from "next";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
} from "@/core/config";
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
      return datasets.map((d: { datasetUniqueId?: string; id?: string }) => ({
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
    title: "Dataset Details",
    description:
      "View detailed information about this dataset including samples, schema, pricing, quality metrics, and access conditions on Kuinbee Marketplace.",
    keywords: [
      "dataset details",
      "buy dataset",
      "dataset marketplace",
      "data download",
      "dataset schema",
      "dataset quality",
    ],
    path: `/datasets/${id}`,
  });
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;

  // Breadcrumb: Home > Datasets > [Category] > [Dataset Title]
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Datasets", url: "/datasets" },
    { name: `Dataset ${id}`, url: `/datasets/${id}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbSchema(breadcrumbItems);

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    identifier: id,
    url: `https://www.kuinbee.com/datasets/${id}`,
    name: `Dataset ${id}`,
    description: "Dataset detail page on Kuinbee Marketplace",
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Dataset Schema — enables Google Dataset Search indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <DatasetDetailPageContent />
    </>
  );
}
