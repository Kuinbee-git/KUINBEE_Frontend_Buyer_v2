"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

const faqs = [
  {
    question: "What is Kuinbee's governance model?",
    answer:
      "Kuinbee operates as a governed marketplace with mandatory supplier verification, fixed pricing, quality standards, and compliance controls. All transactions are logged and auditable.",
  },
  {
    question: "How are suppliers verified?",
    answer:
      "Suppliers undergo organizational identity verification, capability assessment, data quality audits, and ongoing compliance monitoring. Only verified suppliers can list datasets.",
  },
  {
    question: "What compliance frameworks does Kuinbee support?",
    answer:
      "Kuinbee maintains alignment with GDPR, CCPA, and industry-specific regulations. Our platform includes built-in compliance controls, audit trails, and jurisdiction-aware delivery mechanisms.",
  },
  {
    question: "How does pricing work?",
    answer:
      "All dataset prices are fixed and publicly listed. There are no negotiations, volume discounts, or preferential treatment. Pricing is transparent and consistent for all buyers.",
  },
  {
    question: "Who can access the marketplace?",
    answer:
      "Access is restricted to verified organizations. Individual buyers and organizations must complete identity verification and agree to the governance framework before purchasing.",
  },
  {
    question: "How is data quality assured?",
    answer:
      "Every dataset includes standardized quality metrics: completeness scores, freshness indicators, validation reports, and schema documentation. Suppliers must maintain minimum quality thresholds.",
  },
];

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background - Consistent with other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 relative z-10">
        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
            <HelpCircle className="h-4 w-4 text-primary dark:text-white" />
            <span className="text-sm font-medium text-primary dark:text-white">
              Registry Information
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl">
            Frequently Asked
            <br />
            <span className="text-muted-foreground">Questions</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact support */}
        <div className="mt-12 rounded-lg border border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm p-6 text-center shadow-lg">
          <p className="text-foreground">Additional questions?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Review our documentation or contact the registry administrator.
          </p>
          <a
            href="/docs"
            className="mt-4 inline-flex items-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card"
          >
            Access Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
