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
    question: "What is Kuinbee?",
    answer: "Kuinbee is a governed data marketplace where businesses and researchers can discover, evaluate, and purchase verified datasets for AI, ML, and analytics use cases.",
  },
  {
    question: "What types of datasets are available?",
    answer: "Kuinbee offers datasets across Finance & Markets, Environment & Climate, Healthcare, Demographics, and more — all verified for quality and compliance.",
  },
  {
    question: "How is data quality ensured?",
    answer: "Every dataset on Kuinbee goes through a governance and verification process to ensure accuracy, completeness, and regulatory compliance before listing.",
  },
  {
    question: "Is Kuinbee available globally?",
    answer: "Yes. Kuinbee supports global data buyers and sellers, with compliance checks for GDPR, CCPA, and other regional data regulations.",
  },
  {
    question: "How do I buy a dataset?",
    answer: "Browse the marketplace, preview dataset samples, and request access or purchase directly. Enterprise buyers can request custom pricing.",
  },
  {
    question: "Can I sell my data on Kuinbee?",
    answer: "Yes. Data providers can list their datasets on Kuinbee after a compliance and quality review. Contact us to get started.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

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
      className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              <AccordionContent>
                <div className="border-l-2 border-primary/30 dark:border-white/20 bg-primary/[0.03] dark:bg-white/[0.03] rounded-r-lg px-4 py-3 ml-1">
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
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
