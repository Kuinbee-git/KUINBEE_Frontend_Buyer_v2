import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import styles from "../supplier-page.module.css";
import { SupplierEntryLink } from "./supplier-entry-link";
import { SupplierMetrics } from "./supplier-metrics";

const benefits = [
  "Full IP Protection",
  "Transparent Pricing",
  "Complete Control",
];

const stats = [
  { value: "150+", label: "Enterprise Suppliers" },
  { value: "1000+", label: "Published Datasets" },
  { value: "20+", label: "Unique Sources" },
];

export function SuppliersCTA({ supplierQuery }: { supplierQuery: string }) {
  return (
    <section className={styles.section} aria-labelledby="supplier-cta-heading">
      <div className={`${styles.content} ${styles.cta}`}>
        <div>
          <h2 id="supplier-cta-heading" className={styles.heading}>
            Ready to Start Supplying?
          </h2>
          <p className={styles.intro}>
            Publishing on Kuinbee means real buyers, fair compensation, and
            complete control over your intellectual property. No negotiations.
            No compromises.
          </p>
          <ul className={styles.benefits} role="list">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <Check size={15} aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
          <Button className={styles.ctaButton} size="lg" asChild>
            <SupplierEntryLink query={supplierQuery}>
              Apply to become a Kuinbee supplier{" "}
              <ArrowRight aria-hidden="true" />
            </SupplierEntryLink>
          </Button>
          <p className={styles.verification}>
            Identity verification required. Access subject to compliance review.
          </p>
        </div>
        <SupplierMetrics
          metrics={stats}
          label="Supplier marketplace activity"
        />
      </div>
    </section>
  );
}
