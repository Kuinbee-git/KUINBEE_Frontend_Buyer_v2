import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
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
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
