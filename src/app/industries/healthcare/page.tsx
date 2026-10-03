import type { Metadata } from "next";

import { generateMetadata as genMeta } from "@/core/config";
import { HealthcarePageContent } from "./_components/HealthcarePageContent";

export const metadata: Metadata = genMeta({
  title: "Healthcare Data for AI and Research | Kuinbee",
  description:
    "Explore healthcare datasets and collection services across clinical imaging, longitudinal records, physiological signals, and outcomes.",
  keywords: [
    "healthcare data",
    "medical imaging data",
    "clinical research data",
    "physiological signal data",
    "health AI data",
  ],
  path: "/industries/healthcare",
});

export default function HealthcareIndustryPage() {
  return <HealthcarePageContent />;
}
