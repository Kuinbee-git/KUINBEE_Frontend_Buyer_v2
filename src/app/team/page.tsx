import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { TeamPageContent } from "./_components/TeamPageContent";

export const metadata: Metadata = genMeta({
  title: "Kuinbee Team | Founders Building the World's Data Pipeline",
  description:
    "Meet Kuinbee's founding team across strategy, engineering, product, and operations, building trusted data infrastructure for businesses, researchers, and teams.",
  keywords: [
    "Kuinbee team",
    "Kuinbee founders",
    "data marketplace founders",
    "data infrastructure team",
    "Kuinbee leadership",
  ],
  path: "/team",
});

export default function TeamPage() {
  return <TeamPageContent />;
}
