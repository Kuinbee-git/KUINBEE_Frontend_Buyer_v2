import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { MarketplaceHubPage } from "@/features/marketplace/MarketplaceHubPage";

export const metadata: Metadata = genMeta({
  title: "Marketplace | Kuinbee",
  description:
    "Browse OTS datasets and custom collection services from verified suppliers on the Kuinbee governed marketplace.",
  keywords: [
    "data marketplace",
    "buy datasets",
    "custom data collection",
    "data services",
    "Kuinbee marketplace",
  ],
  path: "/marketplace",
});

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceHubPage />
    </Suspense>
  );
}
