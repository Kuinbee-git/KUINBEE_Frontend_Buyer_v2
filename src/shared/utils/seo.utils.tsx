/**
 * SEO utility components and functions
 */

import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? data : [data]),
      }}
    />
  );
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://marketplace.kuinbee.com";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generate robots meta tag content
 */
export function getRobotsContent(options: {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
}): string {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
  } = options;

  const robots = [];
  robots.push(index ? "index" : "noindex");
  robots.push(follow ? "follow" : "nofollow");
  if (noarchive) robots.push("noarchive");
  if (nosnippet) robots.push("nosnippet");

  return robots.join(", ");
}

/**
 * Generate optimized page title
 */
export function generatePageTitle(
  title: string,
  siteName: string = "Kuinbee Marketplace"
): string {
  // Keep titles under 60 characters for optimal display
  const separator = " | ";
  const maxLength = 60;

  if (title === siteName) return title;

  const fullTitle = `${title}${separator}${siteName}`;

  if (fullTitle.length <= maxLength) return fullTitle;

  // Truncate the page title if too long
  const availableLength = maxLength - separator.length - siteName.length - 3; // 3 for "..."
  const truncatedTitle =
    title.length > availableLength
      ? `${title.substring(0, availableLength)}...`
      : title;

  return `${truncatedTitle}${separator}${siteName}`;
}

/**
 * Generate optimized meta description
 */
export function generateMetaDescription(
  description: string,
  maxLength: number = 155
): string {
  if (description.length <= maxLength) return description;

  // Truncate at last complete word before max length
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}
