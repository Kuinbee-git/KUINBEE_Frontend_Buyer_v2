import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { generateMetadata as genMeta } from "@/core/config";
import {
  getPublicCollectionService,
  PublicCatalogueError,
} from "@/services/public-catalogue.service";
import CustomCollectionServicePage from "./_components/CustomCollectionServicePage";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };

async function loadService(slug: string) {
  try {
    return await getPublicCollectionService(slug);
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
  const { slug } = await params;
  const service = await loadService(slug);
  return genMeta({
    title: `${service.publishedRevision.title} | Kuinbee`,
    description: service.publishedRevision.shortDescription,
    path: `/data-request/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await loadService(slug);
  const client = new QueryClient();
  client.setQueryData(["custom-collection-services", "detail", slug], {
    service,
  });
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <CustomCollectionServicePage params={params} />
    </HydrationBoundary>
  );
}
