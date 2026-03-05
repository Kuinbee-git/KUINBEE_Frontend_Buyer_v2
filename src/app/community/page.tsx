import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { CommunityPageContent } from "./_components/CommunityPageContent";

export const metadata: Metadata = genMeta({
    title: "Community",
    description:
        "Join the Kuinbee data community. Connect with data professionals on Discord, LinkedIn, Instagram, Twitter, Reddit, and YouTube. Share, collaborate, and grow together.",
    keywords: [
        "data community",
        "data professionals",
        "Kuinbee community",
        "data collaboration",
    ],
    path: "/community",
});

export default function CommunityPage() {
    return <CommunityPageContent />;
}
