import type { Metadata } from "next";
import { generateMetadata as genMeta, siteConfig } from "@/core/config";
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: { "@id": `${siteConfig.url}/#organization` },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <LandingHero showCustomerBand={process.env.VERCEL_ENV !== "production"} />
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
