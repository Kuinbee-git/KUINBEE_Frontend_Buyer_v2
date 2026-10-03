import { NextResponse } from "next/server";
import { blogPostsMeta } from "@/features/blog/blog-posts";
import { siteConfig } from "@/core/config/seo.config";
import { buildRssFeed } from "@/features/rss/feed";
import { listRssDataRequirements } from "@/services/rss-feed.service";

export async function GET() {
  try {
    const requirements = await listRssDataRequirements();
    const feedXml = buildRssFeed({
      site: siteConfig,
      posts: blogPostsMeta,
      requirements,
    });

    return new NextResponse(feedXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
      },
    });
  } catch {
    // Consumers should retry, not treat a partial/fallback feed as authoritative.
    return new NextResponse(
      "RSS feed is temporarily unavailable. Please retry.",
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "Retry-After": "60",
        },
      }
    );
  }
}
