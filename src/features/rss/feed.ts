export interface RssBlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
}

export interface RssDataRequirement {
  referenceCode: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
}

interface FeedItem {
  title: string;
  link: string;
  guid: string;
  permalink: boolean;
  category: string;
  publishedAt: string;
  description: string;
}

// XML 1.0 excludes most control characters and unpaired UTF-16 surrogates.
function xmlText(value: string): string {
  return Array.from(value)
    .filter((character) => {
      const code = character.codePointAt(0)!;
      return (
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 0x20 && code <= 0xd7ff) ||
        (code >= 0xe000 && code <= 0xfffd) ||
        (code >= 0x10000 && code <= 0x10ffff)
      );
    })
    .join("");
}

function escapeXml(value: string): string {
  return xmlText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cdata(value: string): string {
  return `<![CDATA[${xmlText(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function publicationTime(value: string): number {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new Error("Invalid RSS publication date");
  return time;
}

export function buildRssFeed({
  site,
  posts,
  requirements,
}: {
  site: { name: string; url: string; description: string };
  posts: readonly RssBlogPost[];
  requirements: readonly RssDataRequirement[];
}): string {
  const baseUrl = site.url.replace(/\/+$/, "");
  const uniqueRequirements = new Map(
    requirements.map((requirement) => [requirement.referenceCode, requirement])
  );
  const items: FeedItem[] = [
    ...posts.map((post) => {
      // Preserve the existing blog URLs and GUIDs for current subscribers.
      const link = `${baseUrl}/blog/${post.slug}`;
      return {
        title: post.title,
        link,
        guid: link,
        permalink: true,
        category: post.category,
        publishedAt: post.publishedAt,
        description: post.description,
      };
    }),
    ...Array.from(uniqueRequirements.values()).map((requirement) => ({
      title: requirement.title,
      link: `${baseUrl}/data-request/active-requirements/${encodeURIComponent(requirement.slug)}`,
      guid: `urn:kuinbee:requirement:${requirement.referenceCode}`,
      permalink: false,
      category: "Active Data Requirement",
      publishedAt: requirement.publishedAt,
      description: requirement.summary,
    })),
  ];
  // A stable tie-breaker also handles bulk publications with identical dates.
  items.sort(
    (left, right) =>
      publicationTime(right.publishedAt) - publicationTime(left.publishedAt) ||
      left.guid.localeCompare(right.guid)
  );

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} Updates</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${baseUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${cdata(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="${item.permalink}">${escapeXml(item.guid)}</guid>
      <category>${cdata(item.category)}</category>
      <pubDate>${new Date(publicationTime(item.publishedAt)).toUTCString()}</pubDate>
      <description>${cdata(item.description)}</description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;
}
