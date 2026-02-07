"use client";

import {
  LandingHeader,
  LandingHero,
  DataCategories,
  HowItWorksSection,
  GovernanceValue,
  SecuritySection,
  SupplierSection,
  FAQSection,
  LandingFooter,
} from "@/features/landing";

export default function LandingPage() {
  return (
     <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <LandingHero />
      <DataCategories />
      <HowItWorksSection />
      <GovernanceValue />
      <SupplierSection />
      <SecuritySection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
