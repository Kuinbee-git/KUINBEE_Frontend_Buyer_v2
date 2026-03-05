import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { LandingHeader, LandingFooter } from "@/features/landing";

import { SuppliersHero } from "./components/suppliers-hero";
import { SuppliersValue } from "./components/suppliers-value";
import { SuppliersGuide } from "./components/suppliers-guide";
import { SuppliersBestPractices } from "./components/suppliers-best-practices";
import { SuppliersTraction } from "./components/suppliers-traction";
import { SuppliersFAQ } from "./components/suppliers-faq";
import { SuppliersCTA } from "./components/suppliers-cta";

export const metadata: Metadata = genMeta({
  title: "Supplier Resources",
  description:
    "Become a data supplier on Kuinbee Marketplace. Learn how to list, monetize, and manage your datasets with our step-by-step guide and best practices.",
  keywords: [
    "sell datasets",
    "data supplier",
    "monetize data",
    "list datasets",
    "data provider",
  ],
  path: "/supplier-resources",
});

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
      <SuppliersTraction />
      <SuppliersFAQ />
      <SuppliersCTA />
      <LandingFooter />
    </main>
  );
}
