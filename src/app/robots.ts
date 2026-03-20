import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const marketplaceUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://marketplace.kuinbee.com";

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
    sitemap: [
      `${marketplaceUrl}/sitemap.xml`,
      "https://www.kuinbee.com/sitemap.xml",
    ],
  };
}
