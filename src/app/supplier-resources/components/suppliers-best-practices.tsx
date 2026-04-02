"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export function SuppliersBestPractices() {
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

    const practices = [
        {
            step: "01",
            focus: "Sample Quality",
            title: "The Perfect Sample File",
            description: "Don't just upload the first 100 rows. Upload a statistically representative sample, obfuscate sensitive fields while maintaining real data variance.",
            tip: "Buyers rely on samples to test ingestion pipelines before purchase",
            impact: "Reduces pre-purchase uncertainty"
        },
        {
            step: "02",
            focus: "Schema Clarity",
            title: "Mastering the Schema",
            description: 'Never leave descriptions blank. Transform "age: int" into "user_age_band: int, Age bucketed into 5-year intervals to preserve entity anonymity."',
            tip: "Clear field documentation dramatically increases enterprise purchasing confidence",
            impact: "Improves enterprise approval confidence"
        },
        {
            step: "03",
            focus: "Collection Trust",
            title: "Clear Methodologies",
            description: "Tell buyers HOW data was collected. Was it scraped, surveyed, or from IoT sensors? Include collection intervals like 'polled every 15 mins, batched daily at midnight UTC.'",
            tip: "Collection methodology details prove to enterprise buyers that your data is reliable",
            impact: "Builds reliability for regulated teams"
        },
        {
            step: "04",
            focus: "Conversion Strategy",
            title: "Freemium Marketing",
            description: "Use free pricing strategically. Offer a highly aggregated 1-month historical extract for free, linking to your premium real-time, granular dataset.",
            tip: "Many top suppliers use freemium to drive trial-to-paid conversions",
            impact: "Increases trial-to-paid conversion"
        },
    ];

    return (
        <section
            ref={sectionRef}
            className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Background — matches SecuritySection */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(26,34,64,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.03),transparent_60%)]" />
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
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
                        <span className="h-2 w-2 rounded-full bg-primary dark:bg-white animate-pulse" />
                        <span className="text-sm font-medium text-primary dark:text-white">Best Practices</span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                        Convert Views
                        <br />
                        <span className="text-muted-foreground">Into Sales</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground dark:text-white/70">
                        Approved datasets get discovered, but meticulously documented datasets get purchased. Here's how top suppliers optimize their listings for conversion.
                    </p>
                </div>

                <div className="mb-10 rounded-2xl border border-primary/20 dark:border-white/15 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent dark:from-white/[0.08] dark:via-white/[0.04] dark:to-transparent p-6 lg:p-8 backdrop-blur-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-white mb-3">Conversion Playbook</p>
                            <h3 className="text-2xl lg:text-3xl font-semibold text-foreground dark:text-white leading-tight">
                                High-trust listings close faster and convert better.
                            </h3>
                            <p className="mt-3 text-sm lg:text-base text-muted-foreground dark:text-white/70">
                                This is the section buyers evaluate before purchase intent turns into a transaction.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                            {[
                                { metric: "3x", label: "Schema Detail" },
                                { metric: "85%", label: "Freemium Usage" },
                                { metric: "92%", label: "Methodology Trust" },
                            ].map((item) => (
                                <div key={item.label} className="rounded-lg border border-primary/20 dark:border-white/15 bg-background/70 dark:bg-[#1a2240]/50 px-4 py-3 text-center min-w-[92px]">
                                    <div className="text-lg lg:text-xl font-semibold text-primary dark:text-white">{item.metric}</div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground dark:text-white/60">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Practices grid - Editorial Bento Style */}
                <div className="grid gap-6 lg:grid-cols-5">
                    {practices.map((practice, index) => {
                        const isWide = index === 0 || index === 3; // Staggered layout: W-N, N-W
                        return (
                            <div 
                                key={practice.title} 
                                className={cn(
                                    "group relative rounded-3xl overflow-hidden border border-primary/10 dark:border-white/10 bg-card/80 dark:bg-card/20 backdrop-blur-sm p-8 flex flex-col justify-end min-h-[380px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 dark:hover:border-white/20",
                                    isWide ? "lg:col-span-3" : "lg:col-span-2"
                                )}
                            >
                                {/* Hover background glow */}
                                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/[0.06] via-primary/[0.02] to-transparent dark:from-white/[0.04] dark:via-white/[0.02] dark:to-transparent" />
                                
                                {/* Massive Watermark Number */}
                                <div className="absolute -top-6 -right-6 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:-translate-y-3 group-hover:-translate-x-3">
                                    <span className="text-[180px] lg:text-[240px] font-black text-primary/[0.04] dark:text-white/[0.02] leading-none tracking-tighter">
                                        {practice.step}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-1 flex flex-col mt-4 lg:mt-8">
                                    <div className="mb-6">
                                        <span className="inline-flex items-center rounded-full border border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-white/70">
                                            {practice.focus}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-4 leading-tight group-hover:text-primary dark:group-hover:text-white/90 transition-colors duration-300">
                                        {practice.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground dark:text-white/60 mb-8 leading-relaxed max-w-xl flex-1">
                                        {practice.description}
                                    </p>

                                    {/* Impact Bar - Slide-in effect */}
                                    <div className="mt-auto relative overflow-hidden rounded-xl bg-background/50 dark:bg-[#1a2240]/40 border border-primary/10 dark:border-white/10 p-5 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 group-hover:bg-primary/5 dark:group-hover:bg-white/5">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 dark:text-white/40">
                                                Why It Matters
                                            </span>
                                            <span className="text-sm font-semibold text-foreground/90 dark:text-white/90 leading-snug">
                                                {practice.impact}
                                            </span>
                                        </div>
                                        
                                        {/* Glare effect */}
                                        <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-primary/10 dark:via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[150%]" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
