import type { MetadataRoute } from "next";
import { siteConfig } from "@/core/config/seo.config";
import { blogPostsMeta } from "@/features/blog/blog-posts";
import { listPublicDataRequirements } from "@/services/public-data-requirement.service";
import {
  categorySlug,
  listAllPublished,
  listPublicCategories,
  listPublicCollectionServices,
  listPublicDatasets,
} from "@/services/public-catalogue.service";

// Refresh the sitemap itself as well as the API fetches inside it.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticPaths = [
    "",
    "/datasets",
    "/datasets/categories",
    "/marketplace",
    "/blog",
    "/about",
    "/contact",
    "/team",
    "/supplier-resources",
    "/community",
    "/strotas",
    "/careers",
    "/industries/egocentric",
    "/industries/healthcare",
    "/industries/voice",
    "/support",
    "/data-request",
    "/data-request/services",
    "/data-request/active-requirements",
    "/data-request/submit-requirement",
    "/project-siddhi",
    "/terms-and-conditions",
    "/legal-compliance",
    "/data-processing-addendum",
  ];
  const urls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: baseUrl + path,
  }));
  urls.push(
    ...blogPostsMeta.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    }))
  );

  const sources = await Promise.allSettled([
    listAllPublished((page) => listPublicDatasets({ page, pageSize: 100 })),
    listAllPublished((page) =>
      listPublicCollectionServices({ page, pageSize: 100 })
    ),
    listAllPublished((page) =>
      listPublicDataRequirements({ page, pageSize: 48 })
    ),
    listPublicCategories(),
  ]);
  const [datasets, services, requirements, categories] = sources;
  if (datasets.status === "fulfilled")
    urls.push(
      ...datasets.value.map((dataset) => ({
        // Existing public API and card links use id, not datasetUniqueId.
        url: `${baseUrl}/datasets/${dataset.id}`,
        lastModified: new Date(dataset.updatedAt),
      }))
    );
  if (services.status === "fulfilled")
    urls.push(
      ...services.value.map((service) => ({
        url: `${baseUrl}/data-request/services/${service.slug}`,
        lastModified: new Date(
          service.publishedRevision.publishedAt ||
            service.publishedAt ||
            service.updatedAt
        ),
      }))
    );
  if (requirements.status === "fulfilled")
    urls.push(
      ...requirements.value.map((requirement) => ({
        url: `${baseUrl}/data-request/active-requirements/${requirement.slug}`,
        lastModified: new Date(requirement.publishedAt),
      }))
    );
  if (categories.status === "fulfilled")
    urls.push(
      ...categories.value.items
        .filter((category) => (category.datasetCount ?? 0) > 0)
        .map((category) => ({
          url: `${baseUrl}/datasets/categories/${categorySlug(category.name)}`,
        }))
    );
  sources.forEach((source, index) => {
    if (source.status === "rejected")
      console.error(
        `Sitemap catalogue source ${index} unavailable`,
        source.reason
      );
  });
  return [...new Map(urls.map((entry) => [entry.url, entry])).values()];
}
