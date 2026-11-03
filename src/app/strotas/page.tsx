import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { StrotasPageContent } from "./_components/StrotasPageContent";

export const metadata: Metadata = genMeta({
  title: "Strotas — AI-Native Pipeline Software by Kuinbee",
  description:
    "Discover Strotas by Kuinbee: upcoming AI-native pipeline software for building custom workflows, profiling, cleaning, combining and validating data with versioned outputs and lineage.",
  keywords: [
    "data pipeline",
    "AI data pipeline",
    "ETL tool",
    "data integration",
    "Strotas",
    "data engineering",
  ],
  path: "/strotas",
});

export default function StrotasPage() {
  return <StrotasPageContent />;
}
