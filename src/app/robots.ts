import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  let canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kuinbee.com";
  if (canonicalUrl.includes("vercel.app") || canonicalUrl.includes("marketplace.kuinbee.com")) {
    canonicalUrl = "https://www.kuinbee.com";
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/login/",
          "/signup/",
          "/auth/",
          "/api/",
          "/account/",
          "/library/",
          "/order/",
          "/orders/",
          "/my-datasets/",
          "/wishlist/",
          "/oauth/",
          "/verify-email/",
        ],
      },
    ],
    sitemap: `${canonicalUrl}/sitemap.xml`,
  };
}
