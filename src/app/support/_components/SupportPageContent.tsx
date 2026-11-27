import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SupplierEntryLink } from "@/app/supplier-resources/components/supplier-entry-link";
import { PublicInformationPage } from "@/features/landing/components/PublicInformationPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { CopyAction } from "@/features/landing/components/CopyAction";
import { marketplaceCardSurface } from "@/features/marketplace/marketplace-card-surface";
import styles from "@/features/landing/components/PublicInformation.module.css";

const faqs = [
  {
    question: "How does Kuinbee ensure data security and accuracy?",
    answer:
      "Kuinbee follows strict protocols to guarantee data security and integrity. All datasets undergo verification, structured validation, and compliance checks before publication. Our platform uses encryption, role-based access controls, and continuous monitoring to ensure your data remains secure and reliable.",
  },
  {
    question: "Can businesses request private or industry-specific data?",
    answer:
      "Yes. Kuinbee allows businesses, researchers, and enterprises to request private, industry-specific, or custom datasets. Our team sources, structures, and delivers exactly what you need for informed decision-making, while ensuring compliance with all relevant security and regulatory standards.",
  },
  {
    question: "What payment methods does Kuinbee support?",
    answer:
      "Kuinbee supports multiple payment options, including credit/debit cards, UPI, bank transfers, and digital wallets. For enterprises and large-scale data projects, we also offer invoicing and subscription-based billing options tailored to your needs.",
  },
  {
    question: "How can I collaborate or partner with Kuinbee?",
    answer:
      "Kuinbee actively collaborates with data suppliers, researchers, freelancers, enterprises, and institutions. You can partner with us to provide datasets, sell your analytics, or co-develop projects. Simply reach out through our contact options to explore partnership opportunities.",
  },
];

export function SupportPageContent() {
  return (
    <PublicInformationPage current="Support">
      <div className={styles.supportLayout}>
        <div>
          <h1 className={styles.title}>Help center</h1>
          <p className={styles.lead}>
            Answers to common questions about buying data, billing, and working
            with Kuinbee.
          </p>
          <a href="#contact-support" className={styles.mobileContact}>
            Contact support <ArrowDown size={15} />
          </a>
          <section className={styles.faq} aria-labelledby="common-questions">
            <h2 id="common-questions" className={styles.sectionTitle}>
              Common questions
            </h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="border-border first:border-t"
                >
                  <AccordionTrigger className="gap-5 py-5 text-left text-[15px] text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className={`${styles.answer} max-w-prose leading-relaxed text-muted-foreground`}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <div className={styles.related}>
            <SupplierEntryLink>
              Apply to become a supplier <ArrowRight size={15} />
            </SupplierEntryLink>
            <Link href="/careers">
              Careers at Kuinbee <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <aside
          id="contact-support"
          className={`${marketplaceCardSurface} border-primary/15 dark:border-white/10 ${styles.contact}`}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">Contact support</h2>
          <p className={styles.ticketHint}>
            Create a ticket or check an existing request.
          </p>
          <Link className={styles.ticketLink} href="/account/support">
            Open or track a ticket <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <h3 className={styles.contactLabel}>Email us</h3>
          <div className={styles.emailLine}>
            <a href="mailto:info@kuinbee.com">info@kuinbee.com</a>
            <CopyAction email="info@kuinbee.com" />
          </div>
          <p className={styles.replyTime}>We reply within 24 hours.</p>
          <h3 className={styles.contactLabel}>Call the team</h3>
          <dl className={styles.phoneList} aria-label="Support phone numbers">
            <div>
              <dt>UK</dt>
              <dd>
                <a href="tel:+447825600683">+44 7825 600683</a>
              </dd>
            </div>
            <div>
              <dt>India</dt>
              <dd>
                <a href="tel:+917796137098">+91 77961 37098</a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </PublicInformationPage>
  );
}
