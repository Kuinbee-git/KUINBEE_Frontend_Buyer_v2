import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { DatasetCategoryDirectory } from "@/features/datasets/components/DatasetCategoryDirectory";
import {
  LandingHeader,
  LandingHero,
  DataCategories,
  HowItWorksSection,
  GovernanceValue,
  CustomerTestimonialsSection,
  SecuritySection,
  SupplierSection,
  FAQSection,
  LandingFooter,
} from "@/features/landing";

export const metadata: Metadata = genMeta({
  title: "Kuinbee — Global Data Marketplace for AI & Research",
  description:
    "Discover, evaluate, and buy verified datasets from a governed marketplace. Kuinbee connects data buyers with trusted data sources globally.",
  keywords: [
    "buy datasets",
    "AI training data",
    "data marketplace",
    "premium datasets",
    "machine learning datasets",
    "curated data",
  ],
  path: "/",
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <LandingHero />
      <DataCategories />
      <DatasetCategoryDirectory />
      <HowItWorksSection />
      <GovernanceValue />
      <CustomerTestimonialsSection />
      <SupplierSection />
      <SecuritySection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
