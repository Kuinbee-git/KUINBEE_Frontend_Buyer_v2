import { MetadataRoute } from "next";
import { siteConfig } from "@/core/config/seo.config";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'staging') return { rules: { userAgent: '*', disallow: '/' } };
  const canonicalUrl = siteConfig.url;

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
