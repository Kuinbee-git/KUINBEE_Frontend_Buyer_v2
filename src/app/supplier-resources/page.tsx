import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";

import { SuppliersHero } from "./components/suppliers-hero";
import { SuppliersValue } from "./components/suppliers-value";
import { SuppliersGuide } from "./components/suppliers-guide";
import { SuppliersBestPractices } from "./components/suppliers-best-practices";
import { SuppliersTraction } from "./components/suppliers-traction";
import { SuppliersTestimonials } from "./components/suppliers-testimonials";
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

export default async function SupplierResourcePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, item);
  }
  const supplierQuery = query.toString();
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <SuppliersHero supplierQuery={supplierQuery} />
      <SuppliersValue />
      <SuppliersGuide />
      <SuppliersBestPractices />
      <SuppliersTraction />
      <SuppliersTestimonials />
      <SuppliersFAQ />
      <SuppliersCTA supplierQuery={supplierQuery} />
      <LandingFooter />
    </main>
  );
}
