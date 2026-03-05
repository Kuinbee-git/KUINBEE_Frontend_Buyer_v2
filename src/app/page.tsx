import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import {
  LandingHeader,
  LandingHero,
  DataCategories,
  HowItWorksSection,
  GovernanceValue,
  DataRequestSection,
  SecuritySection,
  SupplierSection,
  FAQSection,
  LandingFooter,
} from "@/features/landing";

export const metadata: Metadata = genMeta({
  title: "Premium Datasets for AI & Data Science",
  description:
    "Discover and purchase premium datasets for AI, ML, and data science projects. Browse curated, high-quality datasets across multiple categories on Kuinbee Marketplace.",
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
      <HowItWorksSection />
      <GovernanceValue />
      <DataRequestSection />
      <SupplierSection />
      <SecuritySection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
