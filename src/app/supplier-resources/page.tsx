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

import styles from "./supplier-page.module.css";

export const metadata: Metadata = genMeta({
  title: "Supplier Resources",
  description:
    "Learn how to become a Kuinbee supplier, document your dataset, prepare a sample, and submit licensing and pricing details for marketplace review.",
  keywords: [
    "sell datasets",
    "data supplier",
    "monetize data",
    "list datasets",
    "data provider",
  ],
  path: "/supplier-resources",
});

export default async function SupplierResourcePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value)
      ? value
      : value === undefined
        ? []
        : [value]) {
      query.append(key, item);
    }
  }
  const supplierQuery = query.toString();

  return (
    <main className={styles.page}>
      <div className="pointer-events-none sticky top-0 z-50 h-16">
        <LandingHeader />
      </div>
      <SuppliersHero supplierQuery={supplierQuery} />
      <SuppliersValue />
      <SuppliersGuide supplierQuery={supplierQuery} />
      <SuppliersBestPractices />
      <SuppliersTraction />
      <SuppliersTestimonials />
      <SuppliersFAQ />
      <SuppliersCTA supplierQuery={supplierQuery} />
      <LandingFooter />
    </main>
  );
}
