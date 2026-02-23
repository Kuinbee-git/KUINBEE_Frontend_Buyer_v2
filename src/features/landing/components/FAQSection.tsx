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
    answer: "Kuinbee is building the Data OS for the global data ecosystem. It addresses the two most critical challenges in data today: access and process. While data is widely available, it is often fragmented, unverified, and difficult to work with. Kuinbee's goal is to make data easy to access, trustworthy by default, and simple to process, creating a unified system where data can be discovered, transformed, and turned into intelligence at a global scale.",
  },
  {
    question: "What does Kuinbee offer?",
    answer: "Kuinbee offers two core capabilities: a verified data marketplace and an agentic, end-to-end data pipeline and processing software. Users can access ready-to-use datasets, request custom data, or run automated workflows for ingestion, cleaning, transformation, and analysis. Each capability can be used independently or combined, depending on how users want to work with data.",
  },
  {
    question: "Can Kuinbee provide custom datasets?",
    answer: "Kuinbee does not directly collect data. Instead, users can place custom data requests on the platform. Kuinbee helps with data discovery, sourcing, and procurement by connecting users to relevant data suppliers and existing datasets, ensuring the data meets quality, structure, and usability expectations.",
  },
  {
    question: "How is Kuinbee different from other data platforms?",
    answer: "Most data platforms focus on only one layer, such as data access or analytics. Kuinbee is built as a Data OS that connects access and process in a single system. Its data marketplace uses built-in credibility systems to verify data suppliers and datasets through a structured scoring mechanism called KDTS, helping users assess reliability before using or purchasing data. This removes trust gaps and reduces the need for external validation.",
  },
  {
    question: "Who is Kuinbee built for?",
    answer: "Kuinbee is built for anyone who works with data at scale or relies on data for decision-making. This includes enterprises, startups, governments, researchers, analysts, data suppliers, and students. Whether the goal is sourcing reliable data, running data pipelines, or enabling data-driven decisions, Kuinbee adapts to different levels of complexity and use cases.",
  },
  {
    question: "Can data suppliers sell data on Kuinbee?",
    answer: "Yes. Kuinbee enables data suppliers to publish and distribute datasets through its marketplace. Each supplier and dataset is evaluated using Kuinbee's KDTS credibility scoring system, helping buyers understand data reliability and source quality before purchasing. This creates a trusted environment for data exchange while giving suppliers access to a global audience.",
  },
  {
    question: "How does Kuinbee ensure data credibility?",
    answer: "Kuinbee treats data credibility as data due diligence, not just data cleaning. Every dataset listed on the marketplace goes through a multi-layer credibility evaluation that checks technical soundness, logical consistency, provenance, legal compliance, and commercial usability. These checks ensure that data is not only valid, but also trustworthy and fit for real-world decision-making.",
  },
  {
    question: "What checks are performed before a dataset is listed?",
    answer: "Before listing, datasets are evaluated across five credibility layers: Parametric & structural checks to validate schema integrity, completeness, statistical sanity, and uniqueness; Consistency and temporal checks to ensure logical behavior across time, geography, and related fields; Provenance and methodology checks to understand where the data comes from and how it was created; Legal and compliance checks to verify ownership, licensing rights, and regulatory alignment; Market usability checks to assess whether the data is usable, joinable, and commercially viable. These checks form the backbone of Kuinbee's marketplace credibility framework.",
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
