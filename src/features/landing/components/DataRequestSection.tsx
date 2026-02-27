"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui";
import {
    Database,
    ArrowRight,
    Search,
    FileText,
    BarChart3,
    GraduationCap,
    CheckCircle,
    Send,
} from "lucide-react";

const useCases = [
    {
        icon: BarChart3,
        label: "Market Research",
        description: "Industry trends, competitor analysis, consumer behaviour",
    },
    {
        icon: GraduationCap,
        label: "Academic Research",
        description: "Structured datasets for studies, papers and institutions",
    },
    {
        icon: Database,
        label: "AI & ML Training",
        description: "Labeled, cleaned datasets ready for model training",
    },
    {
        icon: FileText,
        label: "Business Intelligence",
        description: "Custom data feeds for dashboards and forecasting",
    },
];

const highlights = [
    "Response from our team within 24 hours",
    "Verified and compliance-checked datasets",
    "Delivered in your preferred format",
];

export function DataRequestSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="data-request"
            className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            {/* Background — matches GovernanceValue / HowItWorksSection */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* ── Left: copy ───────────────────────────────────── */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                                <Search className="h-4 w-4 text-primary dark:text-white" />
                                <span className="text-sm font-medium text-primary dark:text-white">
                                    Custom Data Sourcing
                                </span>
                            </div>

                            <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                                Can't Find
                                <br />
                                <span className="text-muted-foreground dark:text-white/70">
                                    What You Need?
                                </span>
                            </h2>

                            <p className="mt-6 text-lg text-muted-foreground dark:text-white/70 leading-relaxed">
                                Our marketplace has thousands of datasets, but if you need
                                something specific, our sourcing team will find, verify, and
                                deliver it to you.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-3">
                            {highlights.map((hl) => (
                                <div key={hl} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary dark:text-white flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground dark:text-white/70">
                                        {hl}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 px-8"
                            >
                                <Link href="/data-request">
                                    <Send className="w-5 h-5 mr-2" />
                                    Submit a Request
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm px-8"
                            >
                                <Link href="/datasets">
                                    <Database className="w-5 h-5 mr-2" />
                                    Browse Datasets
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* ── Right: use-case grid ──────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {useCases.map((item, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-11 h-11 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-5 h-5 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-foreground dark:text-white mb-1.5">
                                    {item.label}
                                </h3>
                                <p className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}

                        {/* Inline CTA tile */}
                        <div className="sm:col-span-2 bg-gradient-to-r from-primary/5 to-primary/[0.02] dark:from-white/5 dark:to-white/[0.02] rounded-2xl border border-primary/20 dark:border-white/10 p-5 flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-primary dark:text-white">
                                Don't see your use case?{" "}
                                <span className="text-muted-foreground dark:text-white/60 font-normal">
                                    We source data across any industry or geography.
                                </span>
                            </p>
                            <Link
                                href="/data-request"
                                className="flex-shrink-0 text-sm font-medium text-primary dark:text-white flex items-center gap-1 hover:gap-2 transition-all"
                            >
                                Request now <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
