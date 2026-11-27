import { ArrowRight } from "lucide-react";
import styles from "../supplier-page.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

const faqs = [
  {
    question: "What is KDTS and how does it work?",
    answer:
      "KDTS is Kuinbee's dataset and supplier credibility scoring system used within the marketplace. It aggregates results from automated validations, analyst reviews, provenance checks, and legal clearance into clear trust signals. KDTS helps buyers understand dataset reliability before purchase, instead of discovering issues post-delivery.",
  },
  {
    question: "How are data suppliers onboarded?",
    answer:
      "Suppliers onboard through Kuinbee's supplier panel by submitting dataset details, source declarations, usage rights, and update capabilities. Kuinbee then runs a structured intake process that includes automated checks, analyst review, and legal validation. Only datasets that pass these stages are approved for listing on the marketplace.",
  },
  {
    question: "Are all datasets treated the same during verification?",
    answer:
      "No. Datasets may be approved with different trust statuses based on evaluation results. Some datasets are fully approved, while others may be tagged with conditions, limitations, or freshness tiers. Kuinbee makes these signals visible so buyers understand strengths and constraints upfront.",
  },
  {
    question: "How is data delivered after purchase?",
    answer:
      "After purchase or access, datasets are delivered in structured, standardized formats along with supporting metadata. This includes information about schema, update frequency, intended use cases, and known limitations, enabling users to integrate the data directly into analytics workflows or data pipelines without additional cleanup.",
  },
  {
    question: "Does Kuinbee take exclusivity rights to my data?",
    answer:
      "Absolutely not. You're granting Kuinbee the right to distribute your data under the terms you define, but you retain full intellectual property ownership. You can sell your data on other platforms simultaneously.",
  },
  {
    question: "How long does the manual review process take?",
    answer:
      "We aim to review all new dataset proposals within 2-3 business days. If change requests are made, revisions are prioritized and usually reviewed within 24 hours of resubmission.",
  },
  {
    question: "Can I update the actual dataset file after it is published?",
    answer:
      "Currently, Kuinbee supports static dataset deliveries. If your data changes, submit a new dataset proposal representing the new timeframe or version. You can use descriptive fields to indicate it's a point-in-time snapshot. Versioning support is on the roadmap.",
  },
  {
    question: "Who handles buyer disputes or refunds?",
    answer:
      "Because buyers agree to your explicit licensing terms and receive structural schema and samples upfront, refunds are strictly limited. Kuinbee mediates disputes solely based on whether the final delivered data matches the approved proposal's schema and sample perfectly.",
  },
  {
    question: "What currencies do you support?",
    answer:
      "We support Indian Rupee (INR), US Dollar (USD), Euro (EUR), and British Pound (GBP). You can set your pricing in any of these currencies, and we handle the conversion for international buyers.",
  },
  {
    question: "Is there a commission or fee?",
    answer:
      "Yes, Kuinbee takes a percentage of each transaction. The exact percentage depends on your supplier tier and agreement. We're transparent about all fees upfront, no hidden costs.",
  },
];

export function SuppliersFAQ() {
  return (
    <section
      id="faq"
      className={styles.section}
      aria-labelledby="supplier-faq-heading"
    >
      <div className={`${styles.content} ${styles.faq}`}>
        <div className={styles.faqIntro}>
          <h2 id="supplier-faq-heading" className={styles.heading}>
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className={styles.questions}>
          {faqs.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent>
                <p className={styles.answer}>{answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className={styles.support}>
          <h3 className={styles.subheading}>Still have questions?</h3>
          <p>Our supplier success team is here to help you get started.</p>
          <a href="mailto:support@kuinbee.com" className={styles.textLink}>
            Contact Support <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
