import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { TermsPageContent } from "./_components/TermsPageContent";

export const metadata: Metadata = genMeta({
  title: "Terms and Conditions",
  description:
    "Read the Kuinbee Marketplace terms and conditions for customers and suppliers. Understand licensing, usage rights, refund policies, and legal obligations.",
  keywords: [
    "terms and conditions",
    "Kuinbee legal",
    "data licensing terms",
    "marketplace terms",
  ],
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return <TermsPageContent />;
}
