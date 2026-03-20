import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { DatasetDiscoveryV2 } from "@/features/datasets/components";
import DatasetsLoading from "./loading";

export const metadata: Metadata = genMeta({
  title: "Buy Verified Datasets for AI, ML & Research | Kuinbee",
  description:
    "Browse thousands of governed, verified datasets across finance, climate, health, and more. Trusted by data teams worldwide.",
  keywords: [
    "browse datasets",
    "search datasets",
    "dataset marketplace",
    "find training data",
    "data discovery",
  ],
  path: "/datasets",
});

export default function DatasetsPage() {
  return (
    <Suspense fallback={<DatasetsLoading />}>
      <DatasetDiscoveryV2 />
    </Suspense>
  );
}
