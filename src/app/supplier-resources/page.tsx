"use client";

import { LandingHeader, LandingFooter } from "@/features/landing";

import { SuppliersHero } from "./components/suppliers-hero";
import { SuppliersValue } from "./components/suppliers-value";
import { SuppliersGuide } from "./components/suppliers-guide";
import { SuppliersBestPractices } from "./components/suppliers-best-practices";
import { SuppliersFAQ } from "./components/suppliers-faq";
import { SuppliersCTA } from "./components/suppliers-cta";

export default function SupplierResourcePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <SuppliersHero />
      <SuppliersValue />
      <SuppliersGuide />
      <SuppliersBestPractices />
      <SuppliersFAQ />
      <SuppliersCTA />
      <LandingFooter />
    </main>
  );
}
