import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { API_BASE_URL } from "@/core/api/endpoints";
import {
  LandingHeader,
  LandingHero,
  DataCategories,
  HowItWorksSection,
  GovernanceValue,
  CustomerTestimonialsSection,
  DataRequestSection,
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

async function fetchCategories() {
  try {
    const catRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/categories`, {
      next: { revalidate: 3600 }
    });
    
    if (!catRes.ok) return [];
    const catJson = await catRes.json();
    if (!catJson.success || !catJson.data?.items) return [];

    return catJson.data.items.filter((c: { id: string; name: string, datasetCount?: number }) => 
      !c.name.toLowerCase().includes("test") && (c.datasetCount || 0) > 0
    );
  } catch (err) {
    console.error("Failed to execute fetchCategories:", err);
    return [];
  }
}

export default async function HomePage() {
  const dynamicCategories = await fetchCategories();

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <LandingHero />
      <DataCategories categories={dynamicCategories} />
      <HowItWorksSection />
      <GovernanceValue />
      <CustomerTestimonialsSection />
      <DataRequestSection />
      <SupplierSection />
      <SecuritySection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
