import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { CareersPageContent } from "./_components/CareersPageContent";

export const metadata: Metadata = genMeta({
    title: "Careers at Kuinbee",
    description:
        "Join the Kuinbee team and help build the future of data. Explore open roles in engineering, data science, product, and more.",
    keywords: [
        "Kuinbee careers",
        "data jobs",
        "startup jobs India",
        "data marketplace jobs",
    ],
    path: "/careers",
});

export default function CareersPage() {
    return <CareersPageContent />;
}
