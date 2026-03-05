import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { SupportPageContent } from "./_components/SupportPageContent";

export const metadata: Metadata = genMeta({
    title: "Support & Help Center",
    description:
        "Get help with Kuinbee Marketplace. Contact our team via email or phone, browse FAQs, and find answers to common questions about datasets, billing, and accounts.",
    keywords: [
        "Kuinbee support",
        "help center",
        "contact Kuinbee",
        "dataset support",
        "FAQ",
    ],
    path: "/support",
});

export default function SupportPage() {
    return <SupportPageContent />;
}
