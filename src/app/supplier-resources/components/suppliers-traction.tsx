import styles from "../supplier-page.module.css";
import { SupplierMetrics } from "./supplier-metrics";

const demandSignals = [
  { value: "500+", label: "Verified Buyer Signups" },
  { value: "500+", label: "Buyer–Supplier Conversations" },
  { value: "50+", label: "Enterprise Inbound Interests" },
  { value: "100+", label: "Dataset Waitlist Requests" },
  { value: "247+", label: "Active Discovery Searches" },
  { value: "12–24h", label: "Avg. Dataset Review Time" },
];

const marketStats = [
  { value: "$325B+", label: "Global data economy by 2030" },
  { value: "30%+", label: "AI training data CAGR" },
  { value: "78%", label: "Enterprises increasing data procurement" },
];

export function SuppliersTraction() {
  return (
    <section
      id="traction"
      className={styles.section}
      aria-labelledby="supplier-traction-heading"
    >
      <div className={styles.content}>
        <h2 id="supplier-traction-heading" className={styles.heading}>
          Proven Early Demand Signals
        </h2>
        <p className={styles.intro}>
          Kuinbee is launching publicly after a controlled beta phase.
          Here&apos;s what the numbers look like and what they mean for
          suppliers joining now.
        </p>
        <SupplierMetrics metrics={demandSignals} label="Early demand signals" />
        <div className={styles.context}>
          <div>
            <h3 className={styles.subheading}>Market Context</h3>
            <p className={styles.intro}>
              Structured, compliant datasets are now a procurement priority
              across BFSI, AgriTech, Real Estate, and AI sectors.
            </p>
          </div>
          <SupplierMetrics metrics={marketStats} label="Market context" />
        </div>
      </div>
    </section>
  );
}
