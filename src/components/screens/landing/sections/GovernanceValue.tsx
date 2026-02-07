"use client";

import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";
import { CTABox } from "@/components/domain";

const problems = [
  {
    problem: "Unverified data sources create compliance risk.",
    solution: "Supplier Verification Framework",
    description:
      "All suppliers undergo identity verification, capability assessment, and ongoing compliance monitoring.",
  },
  {
    problem: "Unclear data provenance undermines trust.",
    solution: "Complete Audit Trail",
    description:
      "Full chain-of-custody tracking from source to delivery with immutable transaction records.",
  },
  {
    problem: "Opaque pricing and negotiation processes.",
    solution: "Fixed, Published Pricing",
    description:
      "All dataset prices are publicly listed. No negotiations, no hidden fees, no preferential treatment.",
  },
  {
    problem: "No quality assurance or validation.",
    solution: "Mandatory Quality Metrics",
    description:
      "Standardized quality scores, freshness indicators, and validation reports for every dataset.",
  },
  {
    problem: "Fragmented access and inconsistent delivery.",
    solution: "Controlled Access Protocol",
    description:
      "Standardized delivery mechanisms with version control, access logging, and usage tracking.",
  },
  {
    problem: "Regulatory uncertainty in data transactions.",
    solution: "Compliance-First Architecture",
    description:
      "Built-in regulatory compliance, license management, and jurisdiction-aware delivery.",
  },
];

export function GovernanceValue() {
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
      className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background - Consistent with other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
            <Shield className="h-4 w-4 text-primary dark:text-white" />
            <span className="text-sm font-medium text-primary dark:text-white">
              Marketplace Governance
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary sm:text-4xl md:text-5xl">
            Controlled Process
            <br />
            <span className="text-muted-foreground">Reduces Risk</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Unregulated data marketplaces create compliance exposure and
            operational risk. Kuinbee enforces governance at every transaction
            point.
          </p>
        </div>

        {/* Problems/Solutions table */}
        <div className="overflow-hidden rounded-lg border border-border/80 shadow-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm">
          {/* Header */}
          <div className="grid grid-cols-1 border-b border-border bg-gradient-to-r from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5 md:grid-cols-2">
            <div className="border-b border-white/10 dark:border-white/10 p-5 text-sm font-semibold uppercase tracking-wider text-white dark:text-white md:border-b-0 md:border-r md:border-white/10 dark:md:border-white/10">
              Market Risk
            </div>
            <div className="p-5 text-sm font-semibold uppercase tracking-wider text-white dark:text-white">
              Kuinbee Control
            </div>
          </div>

          {/* Rows */}
          {problems.map((item, index) => (
            <div
              key={item.solution}
              className={`grid grid-cols-1 md:grid-cols-2 bg-card dark:bg-card/50 ${
                index !== problems.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <div className="border-b border-border/60 p-5 md:border-b-0 md:border-r md:border-border/60">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.problem}
                </p>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                  {item.solution}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
