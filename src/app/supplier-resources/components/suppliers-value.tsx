"use client";

import { useEffect, useRef, useState } from "react";
import { Users, TrendingUp, Lock, CheckCircle2, Eye, Zap } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export function SuppliersValue() {
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

    const pillars = [
        { icon: Users, title: "Curated Discovery", description: "Manual review means low-quality data doesn't clutter the marketplace. If it's here, buyers know it's valuable.", color: "text-blue-400", bgColor: "bg-blue-400/10" },
        { icon: TrendingUp, title: "No Hidden Negotiations", description: "You set a fixed price. Buyers either purchase at your stated terms or move on. No painful back-and-forth.", color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
        { icon: Lock, title: "Strict Governance", description: "Column-level schemas, explicit licensing, and quality statements protect you from liability and prove data provenance.", color: "text-amber-400", bgColor: "bg-amber-400/10" },
        { icon: CheckCircle2, title: "Zero Bot Traffic", description: "Identity verification (PAN/business registration) for all. No bots, no fake buyers. Only verified humans.", color: "text-purple-400", bgColor: "bg-purple-400/10" },
        { icon: Eye, title: "Comprehensive Portfolios", description: "Go beyond file uploads. Document use cases, limitations, methodology, and samples. Sell the true value of your work.", color: "text-pink-400", bgColor: "bg-pink-400/10" },
        { icon: Zap, title: "Complete Autonomy", description: "You control visibility. Set datasets to Public, Private, or Unlisted. Unlist anytime. You're always in command.", color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
    ];

    return (
        <section
            ref={sectionRef}
            className={`relative bg-gradient-to-b from-background/50 via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e] pt-12 pb-16 md:pt-16 md:pb-24 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Subtle dot pattern — matches DataCategories */}
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.04) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="mx-auto max-w-6xl px-6 relative z-20">
                {/* Section header */}
                <div className="mx-auto max-w-3xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                        <Users className="h-4 w-4 text-primary dark:text-white" />
                        <span className="text-sm font-medium text-primary dark:text-white">Why Kuinbee</span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                        Why Suppliers Choose
                        <br />
                        <span className="text-muted-foreground">Kuinbee</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground dark:text-white/70 max-w-3xl mx-auto">
                        Built specifically for data creators. No fake buyers. No negotiations. No compromise on your intellectual property.
                    </p>
                </div>

                {/* Pillars grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={pillar.title} className="group relative rounded-2xl overflow-hidden border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent mb-6", pillar.bgColor)}>
                                        <Icon className={cn("h-7 w-7", pillar.color)} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">{pillar.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground dark:text-white/70 flex-1">{pillar.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Comparison row */}
                <div className="mt-20 grid gap-6 md:grid-cols-2">
                    {[
                        { title: "Traditional Marketplaces", items: ["Low data quality", "Endless negotiations", "No visibility on usage", "Buyer anonymity"] },
                        { title: "On Kuinbee", items: ["Strictly reviewed", "Fixed pricing", "Full transparency", "Verified buyers only"] }
                    ].map((col, i) => (
                        <div key={i} className={cn("rounded-lg border p-8 backdrop-blur-sm", i === 0 ? "border-border/50 bg-card/50 dark:bg-card/30" : "border-primary/20 dark:border-white/20 bg-primary/[0.03] dark:bg-white/[0.03]")}>
                            <h3 className={cn("font-semibold mb-4", i === 0 ? "text-muted-foreground" : "text-foreground dark:text-white")}>{col.title}</h3>
                            <ul className="space-y-3">
                                {col.items.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        {i === 0 ? <span className="text-muted-foreground/50 mt-1">✕</span> : <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />}
                                        <span className={cn("text-sm", i === 0 ? "text-muted-foreground" : "text-foreground/90 dark:text-white/90")}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
