"use client";

import { useEffect, useRef, useState } from "react";
import {
    TrendingUp,
    BarChart3,
    Users,
    MessageSquare,
    Building2,
    Clock,
    Search,
    FileText,
    Home,
    Wheat,
    Shield,
    Eye,
    ShoppingCart,
    IndianRupee,
    RefreshCcw,
    Upload,
    CheckCircle2,
    Globe,
    Lock,
    Gauge,
    Award,
    Sparkles,
    Star,
    Zap,
    Target,
    Ban,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

/* ─────────────────── Data ─────────────────── */

const demandSignals = [
    { icon: Users, value: "500+", label: "Verified Buyer Signups" },
    { icon: MessageSquare, value: "500+", label: "Buyer–Supplier Conversations" },
    { icon: Building2, value: "50+", label: "Enterprise Inbound Interests" },
    { icon: FileText, value: "100+", label: "Dataset Waitlist Requests" },
    { icon: Search, value: "247+", label: "Active Discovery Searches" },
    { icon: Clock, value: "12–24h", label: "Avg. Dataset Review Time" },
];

const marketStats = [
    { value: "$325B+", label: "Global data economy by 2030" },
    { value: "30%+", label: "AI training data CAGR" },
    { value: "78%", label: "Enterprises increasing data procurement" },
];

const caseStudies = [
    {
        id: "01",
        title: "Monetizing a Niche Real Estate Dataset",
        icon: Home,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        dataset: {
            type: "12-City Residential Transactions Dataset",
            rows: "85,000",
            structure: "Clean schema, geo-tagged, quarterly updates",
        },
        challenge:
            "Independent analyst had structured housing data but no distribution channel, pricing framework, or enterprise access.",
        approach: [
            "Structured schema validation",
            "Tiered pricing model (Basic / Pro / Enterprise)",
            "5% sample preview enabled",
            "Category placement in Real Estate Intelligence",
            "AI-readiness tagging",
        ],
        results: [
            { icon: Eye, value: "1,480", label: "Dataset Views" },
            { icon: MessageSquare, value: "92", label: "Buyer Inquiries" },
            { icon: ShoppingCart, value: "21", label: "Paid Conversions" },
            { icon: IndianRupee, value: "₹4.2L – ₹6.8L", label: "Revenue Range" },
            { icon: RefreshCcw, value: "38%", label: "Repeat Purchase Probability" },
        ],
        insight:
            "Specialized datasets with geographic granularity perform 2.4x better than generic aggregated data.",
    },
    {
        id: "02",
        title: "From Raw CSV to Published Asset in 18 Hours",
        icon: Wheat,
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        dataset: {
            type: "Agricultural Yield & Crop Pattern Data",
            rows: "40,000",
            structure: "Raw CSV",
        },
        challenge:
            "Data owner lacked compliance clarity and pricing confidence.",
        approach: [
            "Account Verification & KYC: 4 Hours",
            "Schema Structuring & Metadata Standardization",
            "Compliance Screening (DPDP, GDPR-aligned)",
            "Preview Generation",
            "Dynamic Pricing Recommendation",
        ],
        results: [
            { icon: Upload, value: "18h", label: "Published in" },
            { icon: Target, value: "Agri Intelligence", label: "Listed Under" },
            { icon: Eye, value: "Featured", label: "Buyer Discovery Feed" },
            { icon: Sparkles, value: "Instant", label: "Waitlist Interest" },
        ],
        insight:
            "Speed-to-market increases early visibility by 30–40% in new marketplace launches.",
    },
    {
        id: "03",
        title: "Retaining Ownership While Monetizing Globally",
        icon: Shield,
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        dataset: {
            type: "Financial Risk Indicators Dataset",
            rows: "120,000",
            structure: "Monthly updates",
        },
        challenge: "Loss of IP control and forced negotiation.",
        approach: [
            "100% Ownership Retained",
            "Non-exclusive listing",
            "Zero Negotiation Pricing",
            "Real-time Pricing Adjustment",
            "Transparent Revenue Dashboard & Access Logs",
        ],
        results: [
            { icon: Eye, value: "2,100", label: "Discovery Impressions" },
            { icon: Users, value: "140", label: "Qualified Buyer Views" },
            { icon: ShoppingCart, value: "28", label: "Conversions" },
            { icon: IndianRupee, value: "₹8L – ₹12L", label: "Revenue Potential" },
        ],
        insight:
            "Suppliers using fixed transparent pricing see 22% higher conversion than negotiated pricing models.",
    },
];

const foundingCategories = [
    "Real Estate Intelligence",
    "Agriculture & Rural Data",
    "Financial & Risk Data",
    "AI Training & Annotation Datasets",
    "Public Sector & Aggregated Intelligence",
];

const foundingBenefits = [
    { icon: Zap, label: "0% Commission for First 90 Days" },
    { icon: Star, label: "Featured Discovery Placement" },
    { icon: BarChart3, label: "Dedicated Pricing Optimization Support" },
    { icon: FileText, label: "Schema Structuring Assistance" },
    { icon: Award, label: "Founding Supplier Badge" },
    { icon: TrendingUp, label: "Early Revenue Amplification" },
];

const structuredDifferences = [
    { bad: "Bidding", good: "No bidding" },
    { bad: "Manual negotiations", good: "No manual negotiations" },
    { bad: "IP surrender", good: "No IP surrender" },
    { bad: "Hidden fees", good: "No hidden fees" },
];

/* ─────────────────── Component ─────────────────── */

export function SuppliersTraction() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="traction"
            className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(26,34,64,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.03),transparent_60%)]" />
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                {/* ───── Section Header ───── */}
                <div className="mx-auto max-w-3xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <BarChart3 className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">
                            Marketplace Traction
                        </span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                        Proven Early
                        <br />
                        <span className="text-muted-foreground">Demand Signals</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground dark:text-white/70 max-w-3xl mx-auto">
                        Kuinbee is launching publicly after a controlled beta phase. Here&apos;s what the numbers look like — and what they mean for suppliers joining now.
                    </p>
                </div>

                {/* ───── Demand Signals Grid ───── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {demandSignals.map((signal) => {
                        const Icon = signal.icon;
                        return (
                            <div
                                key={signal.label}
                                className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <Icon className="h-6 w-6 text-primary dark:text-white mx-auto mb-3 opacity-70" />
                                <div className="text-2xl lg:text-3xl font-semibold text-primary dark:text-white">
                                    {signal.value}
                                </div>
                                <p className="text-xs lg:text-sm text-muted-foreground dark:text-white/60 mt-1">
                                    {signal.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* ───── Market Context ───── */}
                <div className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm p-8 mb-24">
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                        Market Context
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-white/60 mb-6">
                        Structured, compliant datasets are now a procurement priority across BFSI, AgriTech, Real Estate, and AI sectors.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {marketStats.map((stat, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 p-5 text-center"
                            >
                                <div className="text-2xl font-semibold text-primary dark:text-white">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ───── Case Studies Header ───── */}
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <TrendingUp className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">
                            Supplier Success Simulations
                        </span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl">
                        Based on Beta Demand Patterns
                        <br />
                        <span className="text-muted-foreground">& Marketplace Modeling</span>
                    </h2>
                </div>

                {/* ───── Case Study Cards ───── */}
                <div className="space-y-10 mb-24">
                    {caseStudies.map((cs) => {
                        const CsIcon = cs.icon;
                        return (
                            <div
                                key={cs.id}
                                className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Header band */}
                                <div className="flex items-center gap-4 px-8 py-5 border-b border-border/50 dark:border-white/10">
                                    <div
                                        className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent",
                                            cs.bgColor
                                        )}
                                    >
                                        <CsIcon className={cn("h-6 w-6", cs.color)} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground dark:text-white/50 uppercase tracking-wider">
                                            Case Study {cs.id}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white">
                                            {cs.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Dataset info */}
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "Dataset Type", value: cs.dataset.type },
                                            { label: "Rows", value: cs.dataset.rows },
                                            { label: "Structure", value: cs.dataset.structure },
                                        ].map((d) => (
                                            <div
                                                key={d.label}
                                                className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 p-4"
                                            >
                                                <p className="text-xs text-muted-foreground dark:text-white/50 mb-1">
                                                    {d.label}
                                                </p>
                                                <p className="text-sm font-medium text-foreground dark:text-white">
                                                    {d.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Challenge & Approach */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                                                Challenge
                                            </h4>
                                            <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                                                {cs.challenge}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                                                Kuinbee Approach
                                            </h4>
                                            <ul className="space-y-2">
                                                {cs.approach.map((step) => (
                                                    <li
                                                        key={step}
                                                        className="flex items-start gap-2 text-sm text-muted-foreground dark:text-white/70"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Projected results */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-4">
                                            {cs.id === "02"
                                                ? "Outcome"
                                                : "Projected Performance (90 Days)"}
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {cs.results.map((r) => {
                                                const RIcon = r.icon;
                                                return (
                                                    <div
                                                        key={r.label}
                                                        className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 p-4 text-center"
                                                    >
                                                        <RIcon className="h-5 w-5 text-primary dark:text-white mx-auto mb-2 opacity-60" />
                                                        <div className="text-lg font-semibold text-primary dark:text-white">
                                                            {r.value}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                                                            {r.label}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Key insight */}
                                    <div className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 p-4">
                                        <p className="text-sm text-foreground/90 dark:text-white/80">
                                            <span className="font-semibold text-primary dark:text-white">
                                                Key Insight:
                                            </span>{" "}
                                            {cs.insight}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ───── Revenue Projection Example ───── */}
                <div className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm p-8 lg:p-10 mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 border border-primary/20 dark:border-transparent">
                            <IndianRupee className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-muted-foreground dark:text-white/50 uppercase tracking-wider">
                                Revenue Projection
                            </span>
                            <h3 className="text-lg font-semibold text-foreground dark:text-white">
                                Industry-Specific Structured Dataset (50,000 rows)
                            </h3>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { value: "600–900", label: "Est. Monthly Impressions" },
                            { value: "8–12%", label: "Buyer View Rate" },
                            { value: "12–18%", label: "Conversion Rate" },
                            { value: "₹1.5L – ₹3L", label: "Est. Monthly Revenue" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 p-5 text-center"
                            >
                                <div className="text-xl font-semibold text-primary dark:text-white">
                                    {item.value}
                                </div>
                                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground dark:text-white/50 text-center">
                        Revenue varies by domain, exclusivity, update frequency, and schema quality.
                    </p>
                </div>

                {/* ───── Founding Data Supplier Program ───── */}
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <Award className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">
                            Founding Supplier Program
                        </span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl">
                        Join the First 25
                        <br />
                        <span className="text-muted-foreground">Founding Suppliers</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground dark:text-white/70">
                        Kuinbee is onboarding its founding cohort across high-demand data categories. Applications close once filled.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {/* Categories */}
                    <div className="rounded-2xl border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm p-8">
                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-5">
                            Target Categories
                        </h3>
                        <ul className="space-y-3">
                            {foundingCategories.map((cat) => (
                                <li
                                    key={cat}
                                    className="flex items-center gap-3 text-sm text-muted-foreground dark:text-white/70"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Benefits */}
                    <div className="rounded-2xl border border-primary/20 dark:border-white/20 bg-primary/[0.03] dark:bg-white/[0.03] backdrop-blur-sm p-8">
                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-5">
                            Founding Benefits
                        </h3>
                        <ul className="space-y-3">
                            {foundingBenefits.map((b) => {
                                const BIcon = b.icon;
                                return (
                                    <li
                                        key={b.label}
                                        className="flex items-center gap-3 text-sm text-foreground/90 dark:text-white/90"
                                    >
                                        <BIcon className="h-5 w-5 text-primary dark:text-white flex-shrink-0 opacity-70" />
                                        {b.label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* ───── Built for Structured Monetization ───── */}
                <div className="mx-auto max-w-3xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <Lock className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">
                            Built for Structured Monetization
                        </span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl">
                        Unlike Traditional
                        <br />
                        <span className="text-muted-foreground">Freelance Marketplaces</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Traditional */}
                    <div className="rounded-lg border border-border/50 bg-card/50 dark:bg-card/30 p-8 backdrop-blur-sm">
                        <h3 className="font-semibold text-muted-foreground mb-4">
                            Traditional Marketplaces
                        </h3>
                        <ul className="space-y-3">
                            {structuredDifferences.map((d) => (
                                <li
                                    key={d.bad}
                                    className="flex items-start gap-3 text-sm text-muted-foreground"
                                >
                                    <Ban className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                                    {d.bad}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kuinbee */}
                    <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-primary/[0.03] dark:bg-white/[0.03] p-8 backdrop-blur-sm">
                        <h3 className="font-semibold text-foreground dark:text-white mb-4">
                            On Kuinbee
                        </h3>
                        <ul className="space-y-3">
                            {structuredDifferences.map((d) => (
                                <li
                                    key={d.good}
                                    className="flex items-start gap-3 text-sm text-foreground/90 dark:text-white/90"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                    {d.good}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground dark:text-white/60">
                    Kuinbee operates on structured pricing, compliance screening, and demand-driven discovery.
                </p>
            </div>
        </section>
    );
}
