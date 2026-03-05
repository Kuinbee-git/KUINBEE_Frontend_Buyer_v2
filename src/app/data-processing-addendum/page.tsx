import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { DPAPageContent } from "./_components/DPAPageContent";

export const metadata: Metadata = genMeta({
    title: "Data Processing Addendum",
    description:
        "Review Kuinbee's Data Processing Addendum covering GDPR, DPDP, CCPA, HIPAA compliance, Standard Contractual Clauses, and AI training data governance.",
    keywords: [
        "data processing addendum",
        "DPA",
        "GDPR compliance",
        "DPDP",
        "data privacy",
        "HIPAA BAA",
    ],
    path: "/data-processing-addendum",
});

export default function DataProcessingAddendumPage() {
    return <DPAPageContent />;
}
