/**
 * SEO configuration and utilities
 */

import type { Metadata } from "next";

export const siteConfig = {
  name: "Kuinbee",
  description:
    "Kuinbee is a marketplace where companies can license datasets or request custom data, and suppliers can sell datasets or respond to open buyer requests.",
  url: "https://www.kuinbee.com",
  logo: "/logo-light.png",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/Kuinbee00",
    linkedin: "https://www.linkedin.com/company/kuinbee",
  },
  keywords: [
    "datasets",
    "data marketplace",
    "AI datasets",
    "machine learning",
    "data science",
    "training data",
    "premium datasets",
  ],
};

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
  keywords,
  path,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  path?: string;
}): Metadata {
  const metaTitle = title || siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || `${siteConfig.url}${siteConfig.ogImage}`;
  const metaKeywords = keywords
    ? [...siteConfig.keywords, ...keywords]
    : siteConfig.keywords;
  const canonicalUrl = path
    ? `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`
    : siteConfig.url;

  return {
    metadataBase: new URL(siteConfig.url),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: "Kuinbee" }],
    creator: "Kuinbee",
    publisher: "Kuinbee",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@Kuinbee00",
    },
    alternates: {
      // Layout metadata must not make every child canonical to the homepage.
      ...(path !== undefined && { canonical: canonicalUrl }),
      types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
    },
  };
}

/**
 * Generate JSON-LD structured data for a dataset
 */
export function generateDatasetSchema(dataset: {
  id: string;
  title: string;
  description?: string;
  price?: string;
  currency?: string;
  license: string;
  createdAt: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: dataset.title,
    description: dataset.description || dataset.title,
    identifier: dataset.id,
    license: dataset.license,
    datePublished: dataset.createdAt,
    dateModified: dataset.updatedAt,
    ...(dataset.price && {
      offers: {
        "@type": "Offer",
        price: dataset.price,
        priceCurrency: dataset.currency || "INR",
      },
    }),
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    sameAs: [siteConfig.links.linkedin, siteConfig.links.twitter],
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for reviews
 */
export function generateReviewSchema(reviews: {
  rating: number;
  reviewCount: number;
}) {
  if (reviews.reviewCount === 0) return null;

  return {
    "@type": "AggregateRating",
    ratingValue: reviews.rating,
    reviewCount: reviews.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}
