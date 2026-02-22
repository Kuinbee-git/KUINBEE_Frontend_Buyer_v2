"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, FileText, BadgeCheck, DollarSign, Settings, Shield } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export function SuppliersGuide() {
    const sectionRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const filledLineRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Smooth scroll tracking via rAF — light moves between actual node positions
    const updateProgress = useCallback(() => {
        if (!timelineRef.current || !glowRef.current || !filledLineRef.current) return;

        const timelineRect = timelineRef.current.getBoundingClientRect();
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;
        if (timelineHeight === 0) return;

        // Find all numbered nodes on the timeline
        const nodes = timelineRef.current.querySelectorAll<HTMLElement>('[data-timeline-node]');
        if (nodes.length === 0) return;

        // Get each node's Y position relative to the timeline container
        const nodePositions = Array.from(nodes).map(node => {
            const nodeRect = node.getBoundingClientRect();
            // Center of the node, relative to timeline top
            return nodeRect.top + nodeRect.height / 2 - timelineTop;
        });

        // The trigger point — where in the viewport the light should "be at"
        const triggerY = window.innerHeight * 0.4;

        // Find the raw scroll position relative to the timeline
        const scrollY = triggerY - timelineTop;

        // Clamp to first and last node positions
        const firstNodeY = nodePositions[0];
        const lastNodeY = nodePositions[nodePositions.length - 1];
        const clampedY = Math.max(firstNodeY, Math.min(lastNodeY, scrollY));

        // Convert to px position within timeline
        const topPx = `${clampedY}px`;
        glowRef.current.style.top = topPx;
        filledLineRef.current.style.height = topPx;
    }, []);

    useEffect(() => {
        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateProgress);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        updateProgress(); // initial
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [updateProgress]);

    const steps = [
        { number: "01", icon: BadgeCheck, title: "Account Verification & KYC", description: "All suppliers verify identity via secure KYC. PAN for individuals, business registration for companies. Your profile becomes your storefront.", details: ["Self-service identity verification", "PAN or business registration required", "Profile becomes read-only after onboarding", "Changes require support ticket"], timeline: "1-2 hours", color: "text-blue-400", bgColor: "bg-blue-400/10" },
        { number: "02", icon: FileText, title: "Building Dataset Proposals", description: "Document your dataset comprehensively. Schema definitions, methodology, sample data, and licensing declarations required.", details: ["Detailed overview and methodology", "Column-level schema documentation", "Sample data upload (CSV, JSON, Parquet)", "Governance & licensing declaration"], timeline: "As fast as you", color: "text-purple-400", bgColor: "bg-purple-400/10" },
        { number: "03", icon: CheckCircle2, title: "The Quality Review", description: "Human review, not algorithms. Every proposal reviewed for structural, quality, and compliance standards.", details: ["2-3 business days typical turnaround", "Approval or change request feedback", "Locked during review for integrity", "Terminal rejection for policy violations"], timeline: "2-3 days", color: "text-amber-400", bgColor: "bg-amber-400/10" },
        { number: "04", icon: DollarSign, title: "Pricing, Currencies & Revenue", description: "You set the price. Fixed pricing with no negotiation. Multiple currency support with transparent revenue.", details: ["INR, USD, EUR, GBP supported", "Fixed price or free access models", "Mini-approval on price changes", "No platform-determined pricing"], timeline: "Instant", color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
        { number: "05", icon: Settings, title: "Managing Published Data", description: "Your operational hub. Control visibility, track sales, respond to feedback, and manage your portfolio.", details: ["Public, Unlisted, or Private visibility", "Supplier dashboard for tracking", "Archive (not delete) datasets", "Preserve transaction history"], timeline: "Ongoing", color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
    ];

    return (
        <section
            ref={sectionRef}
            id="guide"
            className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Background — matches HowItWorksSection */}
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

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Section header */}
                <div className="mx-auto max-w-3xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <BadgeCheck className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">Supplier Journey</span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                        Your Path to
                        <br />
                        <span className="text-muted-foreground">Revenue</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground dark:text-white/70 max-w-2xl mx-auto">
                        Five straightforward steps from registration to published datasets. No hidden processes. Total transparency.
                    </p>
                </div>

                {/* Timeline with center line */}
                <div className="relative" ref={timelineRef}>
                    {/* Center vertical line (dim track) — visible on lg+ */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-primary/20 via-primary/15 to-primary/10 dark:from-white/20 dark:via-white/10 dark:to-white/5" />

                    {/* Scroll-tracking light on center line — sharp, focused */}
                    <div
                        ref={glowRef}
                        className="hidden lg:block absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
                        style={{ top: '0%', willChange: 'top' }}
                    >
                        {/* Subtle halo — small and tight, not diffused */}
                        <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                width: '20px',
                                height: '20px',
                                background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
                            }}
                        />
                        <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full hidden dark:block"
                            style={{
                                width: '20px',
                                height: '20px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
                            }}
                        />
                        {/* Sharp core dot */}
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-primary dark:bg-white shadow-[0_0_6px_2px_hsl(var(--primary)/0.5)] dark:shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]" />
                    </div>

                    {/* Filled line — grows as you scroll */}
                    <div
                        ref={filledLineRef}
                        className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 w-px bg-primary/50 dark:bg-white/40"
                        style={{
                            height: '0%',
                            willChange: 'height',
                        }}
                    />

                    <div className="space-y-12 lg:space-y-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={step.number}
                                    className={cn(
                                        "relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-start",
                                        !isEven && "lg:grid-flow-dense"
                                    )}
                                >
                                    {/* Center node on the timeline — lg only */}
                                    <div data-timeline-node className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 z-20">
                                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 dark:border-white/20 bg-card shadow-lg backdrop-blur-sm", step.bgColor)}>
                                            <span className="text-sm font-bold text-primary dark:text-white">{step.number}</span>
                                        </div>
                                    </div>

                                    {/* Content card — alternates sides */}
                                    <div className={cn(!isEven && "lg:col-start-2")}>
                                        <div className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
                                            {/* Mobile: inline step number */}
                                            <div className="flex items-center gap-4 mb-4 lg:mb-6">
                                                <div className={cn("lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 dark:border-transparent", step.bgColor)}>
                                                    <span className="text-sm font-bold text-primary dark:text-white">{step.number}</span>
                                                </div>
                                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent", step.bgColor)}>
                                                    <Icon className={cn("h-5 w-5", step.color)} />
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <h3 className="text-xl font-semibold text-foreground dark:text-white">{step.title}</h3>
                                                    <span className="text-xs font-medium text-primary dark:text-white bg-primary/5 dark:bg-white/5 px-3 py-1 rounded-full flex-shrink-0 ml-2">
                                                        {step.timeline}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground dark:text-white/70 mb-6 leading-relaxed">
                                                {step.description}
                                            </p>

                                            {/* Details */}
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {step.details.map((detail) => (
                                                    <div key={detail} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 backdrop-blur-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-foreground/90 dark:text-white/90">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual card on the opposite side — lg only */}
                                    <div className={cn("hidden lg:block relative", !isEven && "lg:col-start-1 lg:row-start-1")}>
                                        <div className="rounded-2xl border-2 border-primary/15 dark:border-white/10 bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-[#1a2240]/40 dark:via-[#0f1729]/30 dark:to-[#0a0f1e]/40 p-8 overflow-hidden shadow-lg dark:shadow-xl">
                                            {/* Decorative gradient overlay */}
                                            <div className={cn("absolute inset-0 opacity-[0.08] dark:opacity-[0.15] bg-gradient-to-br", step.bgColor)} />

                                            <div className="relative space-y-4">
                                                {/* Step 01: KYC Verification */}
                                                {index === 0 && (
                                                    <>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-3 uppercase tracking-wide">Identity Verification</div>
                                                            <div className="space-y-2">
                                                                {["PAN Card Verified", "Business Registration", "Address Confirmed"].map((item) => (
                                                                    <div key={item} className="flex items-center gap-2">
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                                                                        <span className="text-sm text-foreground/90 dark:text-white/80">{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-lg border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-50/50 dark:bg-emerald-500/10 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Verified Supplier</span>
                                                                </div>
                                                                <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">KYC Complete</span>
                                                            </div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Supplier Profile</div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-primary dark:text-white">JD</span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-foreground dark:text-white/90">John Doe</div>
                                                                    <div className="text-xs text-muted-foreground dark:text-white/50">john@datacompany.com</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Step 02: Building Proposals */}
                                                {index === 1 && (
                                                    <>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2 uppercase tracking-wide">Dataset Title</div>
                                                            <div className="text-sm font-medium text-foreground dark:text-white/90">Global Market Indicators Q4 2025</div>
                                                        </div>
                                                        {["Overview & Methodology", "Column Schema (24 fields)", "Sample Data (500 rows)", "License: Commercial Use"].map((field) => (
                                                            <div key={field} className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-3 shadow-sm flex items-center justify-between">
                                                                <span className="text-xs font-medium text-muted-foreground dark:text-white/60">{field}</span>
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                                                            </div>
                                                        ))}
                                                        <div className="rounded-lg border border-blue-500/30 dark:border-blue-400/30 bg-blue-50/50 dark:bg-blue-500/10 p-3 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Ready to Submit for Review</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Step 03: Quality Review */}
                                                {index === 2 && (
                                                    <>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">Review Status</span>
                                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10">
                                                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                                                    <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">In Review</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-medium text-foreground dark:text-white/90">Global Market Indicators Q4 2025</div>
                                                            <div className="text-xs text-muted-foreground dark:text-white/50 mt-1">Submitted 2 days ago</div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-3 uppercase tracking-wide">Quality Checklist</div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {[
                                                                    { label: "Schema Valid", done: true },
                                                                    { label: "Samples Match", done: true },
                                                                    { label: "Governance OK", done: true },
                                                                    { label: "Final Review", done: false },
                                                                ].map((c) => (
                                                                    <div key={c.label} className="flex items-center gap-2">
                                                                        {c.done
                                                                            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                                                                            : <div className="h-3.5 w-3.5 rounded-full border-2 border-amber-400 dark:border-amber-500" />
                                                                        }
                                                                        <span className={cn("text-xs", c.done ? "text-foreground/80 dark:text-white/70" : "text-muted-foreground dark:text-white/50")}>{c.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-3 shadow-sm">
                                                            <div className="text-xs text-muted-foreground dark:text-white/50">Estimated completion: <span className="text-foreground dark:text-white/80 font-medium">1 business day</span></div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Step 04: Pricing & Revenue */}
                                                {index === 3 && (
                                                    <>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">Your Price</span>
                                                                <span className="text-2xl font-bold text-foreground dark:text-white/95">$890</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground dark:text-white/60">One-time purchase · Fixed pricing</div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-3 uppercase tracking-wide">Supported Currencies</div>
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {["INR", "USD", "EUR", "GBP"].map((cur) => (
                                                                    <div key={cur} className={cn("rounded-lg border p-2 text-center text-xs font-medium", cur === "USD" ? "border-primary/40 dark:border-white/30 bg-primary/[0.08] dark:bg-white/10 text-primary dark:text-white" : "border-primary/10 dark:border-white/10 text-muted-foreground dark:text-white/60")}>
                                                                        {cur}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-lg border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-50/50 dark:bg-emerald-500/10 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Revenue This Month</span>
                                                                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">$4,450</span>
                                                            </div>
                                                            <div className="text-xs text-emerald-600/80 dark:text-emerald-400/60 mt-1">5 purchases · 3 unique buyers</div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Step 05: Managing Published Data */}
                                                {index === 4 && (
                                                    <>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">Dataset Status</span>
                                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10">
                                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                                                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Public</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-medium text-foreground dark:text-white/90">Global Market Indicators</div>
                                                            <div className="text-xs text-muted-foreground dark:text-white/50 mt-1">Published Feb 15, 2026</div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-4 shadow-sm">
                                                            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-3 uppercase tracking-wide">Performance</div>
                                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                                {[
                                                                    { label: "Views", value: "1,240" },
                                                                    { label: "Purchases", value: "12" },
                                                                    { label: "Rating", value: "4.8★" },
                                                                ].map((stat) => (
                                                                    <div key={stat.label}>
                                                                        <div className="text-lg font-bold text-foreground dark:text-white">{stat.value}</div>
                                                                        <div className="text-xs text-muted-foreground dark:text-white/50">{stat.label}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-background dark:bg-[#1a2240]/60 p-3 shadow-sm">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-muted-foreground dark:text-white/50">Total Lifetime Revenue</span>
                                                                <span className="text-sm font-bold text-foreground dark:text-white">$10,680</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Important note */}
                <div className="mt-16">
                    <div className="rounded-lg border border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                        <p className="text-sm text-foreground dark:text-white">
                            <span className="font-semibold text-primary dark:text-white">Important:</span>{" "}
                            <span className="text-muted-foreground dark:text-white/70">Published datasets cannot be deleted—only archived. This preserves transaction history for any buyer who previously purchased access.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
