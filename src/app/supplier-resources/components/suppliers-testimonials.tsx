import { SupplierTestimonialsBlock } from "@/features/landing/components/CustomerTestimonialsSection";
import styles from "../supplier-page.module.css";

export function SuppliersTestimonials() {
  return (
    <section
      id="supplier-page-testimonials"
      className={styles.section}
      aria-labelledby="supplier-testimonials-heading"
    >
      <div className={styles.content}>
        <h2 id="supplier-testimonials-heading" className={styles.heading}>
          Supplier testimonials
        </h2>
        <SupplierTestimonialsBlock
          id="supplier-resources-testimonials"
          showDivider={false}
          editorialLayout={{ list: styles.quotes, card: styles.quote }}
        />
      </div>
    </section>
  );
}
