"use client";

import { LandingHeader } from "@/components/screens/landing/sections/LandingHeader";
import { LandingHero } from "@/components/screens/landing/sections/LandingHero";
import { DataCategories } from "@/components/screens/landing/sections/DataCategories";
import { HowItWorksSection } from "@/components/screens/landing/sections/HowItWorksSection";
import { GovernanceValue } from "@/components/screens/landing/sections/GovernanceValue";
import { SecuritySection } from "@/components/screens/landing/sections/SecuritySection";
import { SupplierSection } from "@/components/screens/landing/sections/SupplierSection";
import { FAQSection } from "@/components/screens/landing/sections/FAQSection";
import { LandingFooter } from "@/components/screens/landing/sections/LandingFooter";

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
