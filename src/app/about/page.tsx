import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { AboutPageContent } from "./_components/AboutPageContent";

export const metadata: Metadata = genMeta({
  title: "About Kuinbee | Building the Future of Data Access",
  description:
    "Learn how Kuinbee is reshaping how organizations discover and access trusted data through a governed, AI-ready marketplace.",
  keywords: [
    "about Kuinbee",
    "data marketplace company",
    "Kuinbee mission",
    "data accessibility",
  ],
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
