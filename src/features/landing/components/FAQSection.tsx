"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40">Registry Information</span>
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
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

        {/* Backed By band */}
        <div className="mt-20 pt-10 border-t border-primary/10 dark:border-white/10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 dark:text-white/30 mb-8">
            Backed By
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {/* Google Cloud */}
            <Image
              src="/Logo-Google-Cloud-500x313.png"
              alt="Google Cloud"
              width={500}
              height={313}
              className="h-20 w-auto object-contain opacity-70 dark:opacity-90 hover:opacity-100 transition-opacity duration-200 dark:brightness-110"
            />
            {/* AWS light */}
            <Image
              src="/aws-light.png"
              alt="Amazon Web Services"
              width={120}
              height={72}
              className="block dark:hidden h-14 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
            {/* AWS dark */}
            <Image
              src="/aws.png"
              alt="Amazon Web Services"
              width={120}
              height={72}
              className="hidden dark:block h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200 brightness-110"
            />
            {/* NVIDIA Inception */}
            <Image
              src="/nvidia-inception-program-badge-rgb-for-screen.png"
              alt="NVIDIA Inception Program"
              width={200}
              height={80}
              className="h-16 w-auto object-contain opacity-70 dark:opacity-90 hover:opacity-100 transition-opacity duration-200 dark:brightness-110"
            />
            {/* ElevenLabs light — image has large whitespace so constrain width directly */}
            <div className="h-14 w-40 relative flex-shrink-0">
              <Image
                src="https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp"
                alt="ElevenLabs"
                fill
                className="block dark:hidden object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
              <Image
                src="https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp"
                alt="ElevenLabs"
                fill
                className="hidden dark:block object-contain opacity-90 hover:opacity-100 transition-opacity duration-200 brightness-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
