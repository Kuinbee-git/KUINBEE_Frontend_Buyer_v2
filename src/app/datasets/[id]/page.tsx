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
import { catalogueDetailIdentity } from "@/services/buyer-catalogue.service";
import { buyerCatalogueKeys } from "@/lib/buyer-catalogue-keys";

// Current visibility and canonical publication metadata cannot be served from
// a prior ISR generation. React cache still deduplicates this request's reads.
export const dynamic = "force-dynamic";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await loadDataset(id);
  const dataset = catalogueDetailIdentity(data);
  return genMeta({
    title: `${dataset.title} | Kuinbee`,
    description: datasetDescription(data).slice(0, 160),
    keywords:
      data.representation === "CONTENT"
        ? [data.item.category.name, ...data.item.tags]
        : [data.legacy.primaryCategory.name, ...data.legacy.tags],
    path: `/datasets/${dataset.id}`,
  });
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await loadDataset(id);
  const dataset = catalogueDetailIdentity(data);
  const client = new QueryClient();
  client.setQueryData(buyerCatalogueKeys.detail(id), data);
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
    datePublished:
      data.representation === "CONTENT"
        ? data.item.publication.publishedAt
        : dataset.createdAt,
    dateModified: dataset.updatedAt,
    keywords:
      data.representation === "CONTENT"
        ? data.description.tags
        : data.legacy.tags,
    ...((data.representation === "CONTENT"
      ? data.description.sourceAtFreeze.name
      : data.legacy.source?.name) && {
      creator: {
        "@type": "Organization",
        name:
          data.representation === "CONTENT"
            ? data.description.sourceAtFreeze.name
            : data.legacy.source!.name,
      },
    }),
    ...(dataset.license &&
      /^https?:\/\//.test(dataset.license) && { license: dataset.license }),
    ...(data.representation === "LEGACY" &&
      data.legacy.locationInfo?.coverage && {
        spatialCoverage: data.legacy.locationInfo.coverage,
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
