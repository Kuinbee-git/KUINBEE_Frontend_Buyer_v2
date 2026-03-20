import { MetadataRoute } from "next";
import { blogPosts } from "@/features/blog/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Primary canonical domain for public marketing routes
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kuinbee.com";
  if (baseUrl.includes("vercel.app")) {
    baseUrl = "https://www.kuinbee.com";
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/datasets`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/supplier-resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/strotas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/data-request`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/project-siddhi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal-compliance`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/data-processing-addendum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Fetch dynamic dataset pages
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

    // Fetch datasets from the marketplace endpoint
    // Using a high limit to get all relevant datasets for the sitemap
    const res = await fetch(`${apiUrl}/api/v1/marketplace/datasets?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (res.ok) {
      const data = await res.json();
      const datasets: Array<{ datasetUniqueId?: string; id: string; updatedAt?: string }> =
        data?.data?.datasets || [];

      const datasetPages: MetadataRoute.Sitemap = datasets.map((d) => ({
        url: `${baseUrl}/datasets/${d.datasetUniqueId || d.id}`,
        lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      return [...staticPages, ...blogPages, ...datasetPages];
    }
  } catch (error) {
    console.error("Failed to fetch datasets for sitemap:", error);
  }

  return [...staticPages, ...blogPages];
}
