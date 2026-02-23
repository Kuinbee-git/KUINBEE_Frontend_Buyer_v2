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
    { question: "What is KDTS and how does it work?", answer: "KDTS is Kuinbee's dataset and supplier credibility scoring system used within the marketplace. It aggregates results from automated validations, analyst reviews, provenance checks, and legal clearance into clear trust signals. KDTS helps buyers understand dataset reliability before purchase, instead of discovering issues post-delivery." },
    { question: "How are data suppliers onboarded?", answer: "Suppliers onboard through Kuinbee's supplier panel by submitting dataset details, source declarations, usage rights, and update capabilities. Kuinbee then runs a structured intake process that includes automated checks, analyst review, and legal validation. Only datasets that pass these stages are approved for listing on the marketplace." },
    { question: "Are all datasets treated the same during verification?", answer: "No. Datasets may be approved with different trust statuses based on evaluation results. Some datasets are fully approved, while others may be tagged with conditions, limitations, or freshness tiers. Kuinbee makes these signals visible so buyers understand strengths and constraints upfront." },
    { question: "How is data delivered after purchase?", answer: "After purchase or access, datasets are delivered in structured, standardized formats along with supporting metadata. This includes information about schema, update frequency, intended use cases, and known limitations, enabling users to integrate the data directly into analytics workflows or data pipelines without additional cleanup." },
    { question: "Does Kuinbee take exclusivity rights to my data?", answer: "Absolutely not. You're granting Kuinbee the right to distribute your data under the terms you define, but you retain full intellectual property ownership. You can sell your data on other platforms simultaneously." },
    { question: "How long does the manual review process take?", answer: "We aim to review all new dataset proposals within 2-3 business days. If change requests are made, revisions are prioritized and usually reviewed within 24 hours of resubmission." },
    { question: "Can I update the actual dataset file after it is published?", answer: "Currently, Kuinbee supports static dataset deliveries. If your data changes, submit a new dataset proposal representing the new timeframe or version. You can use descriptive fields to indicate it's a point-in-time snapshot. Versioning support is on the roadmap." },
    { question: "Who handles buyer disputes or refunds?", answer: "Because buyers agree to your explicit licensing terms and receive structural schema and samples upfront, refunds are strictly limited. Kuinbee mediates disputes solely based on whether the final delivered data matches the approved proposal's schema and sample perfectly." },
    { question: "What currencies do you support?", answer: "We support Indian Rupee (INR), US Dollar (USD), Euro (EUR), and British Pound (GBP). You can set your pricing in any of these currencies, and we handle the conversion for international buyers." },
    { question: "Is there a commission or fee?", answer: "Yes, Kuinbee takes a percentage of each transaction. The exact percentage depends on your supplier tier and agreement. We're transparent about all fees upfront—no hidden costs." },
];

export function SuppliersFAQ() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="faq"
            className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Background — matches FAQSection on landing */}
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
                        <span className="text-sm font-medium text-primary dark:text-white">Supplier FAQ</span>
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
                        <AccordionItem key={index} value={`item-${index}`} className="border-border">
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
                    <p className="text-foreground dark:text-white">Still have questions?</p>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-white/60">
                        Our supplier success team is here to help you get started.
                    </p>
                    <a
                        href="mailto:support@kuinbee.com"
                        className="mt-4 inline-flex items-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground dark:text-white transition-colors hover:bg-card"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
}
