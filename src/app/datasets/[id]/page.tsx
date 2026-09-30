import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
  siteConfig,
} from "@/core/config";
import {
  getPublicDataset,
  datasetDescription,
  PublicCatalogueError,
} from "@/services/public-catalogue.service";
import { DatasetDetailPageContent } from "./_components/DatasetDetailPageContent";

export const revalidate = 3600;
type Props = { params: Promise<{ id: string }> };

async function loadDataset(id: string) {
  try {
    return await getPublicDataset(id);
  } catch (error) {
    if (
      error instanceof PublicCatalogueError &&
      [404, 410].includes(error.status)
    )
      notFound();
    throw error;
  }
}

export function generateStaticParams() {
  // Generate on the first real visit, not during builds. The existing detail
  // API records analytics views even for GET requests.
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await loadDataset(id);
  return genMeta({
    title: `${data.dataset.title} | Kuinbee`,
    description: datasetDescription(data).slice(0, 160),
    keywords: [data.primaryCategory.name, ...data.tags],
    path: `/datasets/${data.dataset.id}`,
  });
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await loadDataset(id);
  const dataset = data.dataset;
  const client = new QueryClient();
  client.setQueryData(["datasets", id, "details"], data);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Datasets", url: "/datasets" },
    { name: dataset.title, url: `/datasets/${dataset.id}` },
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: dataset.title,
    description: datasetDescription(data),
    identifier: dataset.datasetUniqueId || dataset.id,
    url: `${siteConfig.url}/datasets/${dataset.id}`,
    datePublished: dataset.createdAt,
    dateModified: dataset.updatedAt,
    keywords: data.tags,
    ...(data.source?.name && {
      creator: { "@type": "Organization", name: data.source.name },
    }),
    ...(dataset.license &&
      /^https?:\/\//.test(dataset.license) && { license: dataset.license }),
    ...(data.locationInfo?.coverage && {
      spatialCoverage: data.locationInfo.coverage,
    }),
  };
  const json = (value: object) =>
    JSON.stringify(value).replace(/</g, "\\u003c");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json(schema) }}
      />
      <HydrationBoundary state={dehydrate(client)}>
        <DatasetDetailPageContent />
      </HydrationBoundary>
    </>
  );
}
