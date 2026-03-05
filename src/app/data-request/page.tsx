import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { DataRequestPageContent } from "./_components/DataRequestPageContent";

export const metadata: Metadata = genMeta({
    title: "Request Custom Data",
    description:
        "Can't find the dataset you need? Submit a custom data request and our sourcing team will find, verify, and deliver it. Available across industries and formats.",
    keywords: [
        "custom data request",
        "data sourcing",
        "custom datasets",
        "data procurement",
        "bespoke data",
    ],
    path: "/data-request",
});

export default function DataRequestPage() {
    return <DataRequestPageContent />;
}
