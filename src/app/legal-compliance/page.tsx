import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { LegalCompliancePageContent } from "./_components/LegalCompliancePageContent";

export const metadata: Metadata = genMeta({
  title: "Legalities & Compliance",
  description:
    "Review Kuinbee's legal framework, regulatory posture, and compliance standards. Covers data protection, responsible AI, export controls, IP protection, and risk allocation.",
  keywords: [
    "legal compliance",
    "data regulation",
    "marketplace compliance",
    "responsible AI",
    "data protection",
  ],
  path: "/legal-compliance",
});

export default function LegalCompliancePage() {
  return <LegalCompliancePageContent />;
}
