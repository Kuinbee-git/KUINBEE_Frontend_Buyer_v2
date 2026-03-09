import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { DatasetDiscoveryV2 } from "@/features/datasets/components";
import DatasetsLoading from "./loading";

export const metadata: Metadata = genMeta({
  title: "Browse Datasets",
  description:
    "Discover and explore premium datasets for AI, machine learning, and data science. Filter by category, format, and price to find the perfect dataset for your project.",
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
