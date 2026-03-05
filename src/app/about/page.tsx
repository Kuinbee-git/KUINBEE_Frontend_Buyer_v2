import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { AboutPageContent } from "./_components/AboutPageContent";

export const metadata: Metadata = genMeta({
  title: "About Kuinbee",
  description:
    "Learn about Kuinbee's mission to democratize data access. We connect data providers with businesses and researchers through a trusted, quality-assured marketplace.",
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
