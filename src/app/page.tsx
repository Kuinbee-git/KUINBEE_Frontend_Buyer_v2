import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { API_BASE_URL } from "@/core/api/endpoints";
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

async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const slugMap: Record<string, string> = {
      finance: "finance",
      energy: "energy",
      environment: "environment",
      agriculture: "agriculture",
      economics: "economics",
      realestate: "real estate"
    };
    
    // 1. Fetch live categories to get their true backend UUIDs
    const catRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/categories`, {
      next: { revalidate: 3600 }
    });
    
    if (!catRes.ok) return {};
    const catJson = await catRes.json();
    if (!catJson.success || !catJson.data?.items) return {};

    const dbCategories: { id: string; name: string }[] = catJson.data.items;

    const counts: Record<string, number> = {};
    const fetchPromises = Object.entries(slugMap).map(async ([slug, searchName]) => {
      // Find matching UUID
      const match = dbCategories.find(c => c.name.toLowerCase().includes(searchName));
      if (!match) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/marketplace/datasets?categoryId=${match.id}&pageSize=1`, {
          next: { revalidate: 3600 }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            counts[slug] = json.data.total;
          }
        }
      } catch (e) {
        console.error(`Failed to fetch count for category ${slug}`, e);
      }
    });

    await Promise.allSettled(fetchPromises);
    return counts;
  } catch (err) {
    console.error("Failed to execute getCategoryCounts:", err);
    return {};
  }
}

export default async function HomePage() {
  const categoryCounts = await getCategoryCounts();

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <LandingHero />
      <DataCategories categoryCounts={categoryCounts} />
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
