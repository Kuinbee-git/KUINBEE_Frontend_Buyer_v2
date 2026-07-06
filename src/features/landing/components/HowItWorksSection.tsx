"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  ArrowRight,
  Shield,
  Download,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

const steps = [
  {
    number: "01",
    title: "Discover Datasets",
    description: "Search a public registry of verified datasets across multiple domains. Only published and reviewed datasets appear in discovery.",
    highlights: [
      "Structured search and filters",
      "Dataset categories and sources",
      "Verification status and supplier identity",
    ],
    detailTitle: "What buyers see",
    detailItems: ["Finance · Energy · Environment · Public Data"],
  },
  {
    number: "02",
    title: "Review & Evaluate",
    description: "Evaluate datasets using complete metadata before making a purchase decision. There are no previews, samples, or informal access paths.",
    highlights: [
      "Dataset description and coverage",
      "Update frequency and size",
      "Licensing and usage terms",
      "Supplier reference and verification status",
    ],
    detailTitle: "What's available before purchase",
    detailItems: ["All datasets undergo mandatory review before publication."],
  },
  {
    number: "03",
    title: "Purchase Access",
    description: "Purchase dataset access with clear, upfront pricing and defined terms. Transactions are explicit, logged, and auditable.",
    highlights: [
      "Fixed pricing (free or one-time paid)",
      "Clear access rights at checkout",
      "Automated order and invoice records",
    ],
    detailTitle: "Purchase characteristics",
    detailItems: ["No negotiations. No hidden conditions."],
  },
  {
    number: "04",
    title: "Access & Manage",
    description: "Access purchased datasets according to the defined license and access rules. Ownership and access status remain visible over time.",
    highlights: [
      "Direct dataset download access",
      "Clear access state (owned / not owned)",
      "Order and invoice history",
      "Account-level access management",
    ],
    detailTitle: "After purchase",
    detailItems: ["Access is binary and governed."],
  },
];

export function HowItWorksSection() {
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
      className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-0"
          style={{
            backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40">Buyer Journey</span>
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
          </div>
          <h2 className="text-4xl font-semibold text-primary dark:text-white mb-4">
            From Discovery to Access
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white/70">
            A governed, transparent process for purchasing verified datasets
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-8 lg:gap-12">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={step.number}
                className={cn(
                  "relative grid lg:grid-cols-2 gap-8 items-center",
                  !isEven && "lg:grid-flow-dense"
                )}
              >
                {/* Content */}
                <div className={cn(!isEven && "lg:col-start-2")}>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-xs font-mono font-semibold text-primary/30 dark:text-white/25 tabular-nums">{step.number}</span>
                    <span className="h-px w-4 bg-primary/20 dark:bg-white/15 mb-0.5" />
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground dark:text-white/70 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3">
                    {step.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="mt-[0.45em] h-px w-3 shrink-0 bg-primary/35 dark:bg-white/30" />
                        <span className="text-sm text-foreground/80 dark:text-white/80">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-primary/10 dark:border-white/10">
                    <h4 className="text-sm font-semibold text-foreground/80 dark:text-white/90 uppercase tracking-wide mb-2">
                      {step.detailTitle}
                    </h4>
                    <ul className="space-y-2">
                      {step.detailItems.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground dark:text-white/90">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Visual card */}
                <div className={cn("relative", !isEven && "lg:col-start-1 lg:row-start-1")}>
                  <div className="relative rounded-2xl border-2 border-primary/15 dark:border-white/30 bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-[#1a2240]/40 dark:via-[#0f1729]/30 dark:to-[#0a0f1e]/40 p-8 overflow-hidden shadow-lg dark:shadow-xl">
                    {/* Ghost number clipped inside the card */}
                    <div className="absolute -bottom-4 -right-2 text-[120px] font-black leading-none select-none pointer-events-none text-primary/[0.05] dark:text-white/[0.04] tabular-nums">
                      {step.number}
                    </div>
                    <div className="relative space-y-4">
                      {idx === 0 && (
                        <>
                          <div className="flex items-center gap-3 rounded-lg border-2 border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <Search className="h-5 w-5 text-muted-foreground dark:text-white/40" />
                            <span className="text-sm text-muted-foreground dark:text-white/60">
                              Search datasets...
                            </span>
                          </div>
                          <div className="space-y-2">
                            {["Finance · Global Market Data", "Energy · Consumption Patterns", "Environment · Climate Metrics"].map((item) => (
                              <div key={item} className="flex items-center justify-between rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-3 hover:border-primary/30 dark:hover:border-white/30 transition-colors shadow-sm">
                                <span className="text-sm font-medium text-foreground dark:text-white/90">{item}</span>
                                <Shield className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {idx === 1 && (
                        <div className="space-y-3">
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Dataset Description</div>
                            <div className="text-sm font-medium text-foreground dark:text-white/90">Global Market Indicators</div>
                          </div>
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Coverage</div>
                            <div className="text-sm font-medium text-foreground dark:text-white/90">2.5M records · Updated daily</div>
                          </div>
                          <div className="rounded-lg border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-50/50 dark:bg-emerald-500/10 p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Verified Supplier</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {idx === 2 && (
                        <div className="space-y-3">
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">Dataset Access</span>
                              <span className="text-lg font-bold text-foreground dark:text-white/95">$890</span>
                            </div>
                            <div className="text-xs text-muted-foreground dark:text-white/60">One-time purchase</div>
                          </div>
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">License Terms</div>
                            <div className="text-sm font-medium text-foreground dark:text-white/90">Commercial use · Perpetual access</div>
                          </div>
                          <div className="rounded-lg border-2 border-primary/40 dark:border-white/30 bg-primary/[0.08] dark:bg-white/10 p-4 shadow-md hover:bg-primary/[0.12] dark:hover:bg-white/15 transition-colors">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-semibold text-foreground dark:text-white/95">Complete Purchase</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {idx === 3 && (
                        <div className="space-y-3">
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">Access Status</span>
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Owned</span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-foreground dark:text-white/90">Global Market Indicators</div>
                          </div>
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Download Available</div>
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-primary dark:text-white/70" />
                              <span className="text-sm font-medium text-foreground dark:text-white/90">dataset-2024-02.csv</span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Order History</div>
                            <div className="text-sm font-medium text-foreground dark:text-white/90">Invoice #INV-2024-0247</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connection arrow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 -bottom-12 -translate-x-1/2">
                    <ArrowRight className="h-8 w-8 text-primary/30 dark:text-white/20 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
