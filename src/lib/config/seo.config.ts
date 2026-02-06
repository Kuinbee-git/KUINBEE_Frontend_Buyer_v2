/**
 * SEO configuration and utilities
 */

import type { Metadata } from "next";

export const siteConfig = {
  name: "Kuinbee Marketplace",
  description:
    "Discover and purchase premium datasets for AI, ML, and data science projects. Browse curated, high-quality datasets across multiple categories.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://marketplace.kuinbee.com",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/kuinbee",
    github: "https://github.com/kuinbee",
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
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || `${siteConfig.url}${siteConfig.ogImage}`;
  const metaKeywords = keywords
    ? [...siteConfig.keywords, ...keywords]
    : siteConfig.keywords;

  return {
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
      url: siteConfig.url,
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
      creator: "@kuinbee",
    },
    alternates: {
      canonical: siteConfig.url,
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
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
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
