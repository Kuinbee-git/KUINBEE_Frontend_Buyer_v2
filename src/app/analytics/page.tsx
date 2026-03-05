import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { StrotasPageContent } from "./_components/StrotasPageContent";

export const metadata: Metadata = genMeta({
    title: "Strotas — AI-Native Data Pipeline",
    description:
        "Strotas by Kuinbee is an AI-native pipeline engine. Unify scattered sources into validated, query-ready data assets with AI-assisted, human-governed workflows.",
    keywords: [
        "data pipeline",
        "AI data pipeline",
        "ETL tool",
        "data integration",
        "Strotas",
        "data engineering",
    ],
    path: "/analytics",
});

export default function StrotasPage() {
    return <StrotasPageContent />;
}
