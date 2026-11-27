import styles from "../supplier-page.module.css";
import { SupplierMetrics } from "./supplier-metrics";

const practices = [
  {
    focus: "Sample Quality",
    title: "The Perfect Sample File",
    description:
      "Don't just upload the first 100 rows. Upload a statistically representative sample, obfuscate sensitive fields while maintaining real data variance.",
    impact: "Reduces pre-purchase uncertainty",
  },
  {
    focus: "Schema Clarity",
    title: "Mastering the Schema",
    description:
      'Never leave descriptions blank. Transform "age: int" into "user_age_band: int, Age bucketed into 5-year intervals to preserve entity anonymity."',
    impact: "Improves enterprise approval confidence",
  },
  {
    focus: "Collection Trust",
    title: "Clear Methodologies",
    description:
      "Tell buyers HOW data was collected. Was it scraped, surveyed, or from IoT sensors? Include collection intervals like 'polled every 15 mins, batched daily at midnight UTC.'",
    impact: "Builds reliability for regulated teams",
  },
  {
    focus: "Conversion Strategy",
    title: "Freemium Marketing",
    description:
      "Use free pricing strategically. Offer a highly aggregated 1-month historical extract for free, linking to your premium real-time, granular dataset.",
    impact: "Increases trial-to-paid conversion",
  },
];

const playbook = [
  { value: "3x", label: "Schema Detail" },
  { value: "85%", label: "Freemium Usage" },
  { value: "92%", label: "Methodology Trust" },
];

export function SuppliersBestPractices() {
  return (
    <section
      id="listing-practices"
      className={styles.section}
      aria-labelledby="listing-practices-heading"
    >
      <div className={styles.content}>
        <h2 id="listing-practices-heading" className={styles.heading}>
          Listing best practices
        </h2>
        <p className={styles.intro}>
          Approved datasets get discovered, but meticulously documented datasets
          get purchased. Here&apos;s how top suppliers optimize their listings
          for conversion.
        </p>
        <ul className={styles.practices} role="list">
          {practices.map((practice) => (
            <li key={practice.title} className={styles.practice}>
              <span className={styles.topic}>{practice.focus}</span>
              <h3 className={styles.subheading}>{practice.title}</h3>
              <p>{practice.description}</p>
              <p className={styles.impact}>{practice.impact}</p>
            </li>
          ))}
        </ul>
        <div className={styles.playbook}>
          <div>
            <h3 className={styles.subheading}>Conversion Playbook</h3>
            <p className={styles.intro}>
              High-trust listings close faster and convert better.
            </p>
          </div>
          <SupplierMetrics metrics={playbook} label="Conversion playbook" />
        </div>
      </div>
    </section>
  );
}
