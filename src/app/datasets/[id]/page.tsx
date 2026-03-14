import type { Metadata } from "next";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
} from "@/core/config";
import { DatasetDetailPageContent } from "./_components/DatasetDetailPageContent";

// ISR: cache the server-rendered page for 1 hour at the CDN edge.
// The page itself renders only breadcrumb JSON-LD + a client component reference,
// so it's effectively static per dataset ID. This eliminates Vercel serverless
// cold-start latency on repeat visits (the 1.5s RSC payload bottleneck).
export const revalidate = 3600;

// Dynamically generate static pages for top datasets at build time
export async function generateStaticParams() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    // Fetch top 20 most viewed datasets
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
      <DatasetDetailPageContent />
    </>
  );
}

