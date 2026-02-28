"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, Database, Lightbulb, Zap } from "lucide-react";
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
        { icon: Database, title: "The Perfect Sample File", description: "Don't just upload the first 100 rows. Upload a statistically representative sample, obfuscate sensitive fields while maintaining real data variance.", tip: "Buyers rely on samples to test ingestion pipelines before purchase", color: "text-blue-400", bgColor: "bg-blue-400/10" },
        { icon: Lightbulb, title: "Mastering the Schema", description: 'Never leave descriptions blank. Transform "age: int" into "user_age_band: int, Age bucketed into 5-year intervals to preserve entity anonymity."', tip: "Clear field documentation dramatically increases enterprise purchasing confidence", color: "text-amber-400", bgColor: "bg-amber-400/10" },
        { icon: TrendingUp, title: "Clear Methodologies", description: "Tell buyers HOW data was collected. Was it scraped, surveyed, or from IoT sensors? Include collection intervals like 'polled every 15 mins, batched daily at midnight UTC.'", tip: "Collection methodology details prove to enterprise buyers that your data is reliable", color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
        { icon: Zap, title: "Freemium Marketing", description: "Use free pricing strategically. Offer a highly aggregated 1-month historical extract for free, linking to your premium real-time, granular dataset.", tip: "Many top suppliers use freemium to drive trial-to-paid conversions", color: "text-purple-400", bgColor: "bg-purple-400/10" },
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
                        <TrendingUp className="h-4 w-4 text-primary dark:text-white" />
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

                {/* Practices grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {practices.map((practice) => {
                        const Icon = practice.icon;
                        return (
                            <div key={practice.title} className="group relative rounded-2xl overflow-hidden border border-primary/15 dark:border-white/10 bg-card/80 dark:bg-card/30 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent mb-6", practice.bgColor)}>
                                        <Icon className={cn("h-7 w-7", practice.color)} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3">{practice.title}</h3>
                                    <p className="text-muted-foreground dark:text-white/70 mb-6 leading-relaxed flex-1">{practice.description}</p>
                                    <div className="rounded-lg border border-border/50 dark:border-white/10 bg-background/50 dark:bg-[#1a2240]/40 backdrop-blur-sm p-4">
                                        <p className="text-sm text-foreground/90 dark:text-white/80">
                                            <span className="font-semibold text-primary dark:text-white">💡 Tip:</span> {practice.tip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Metrics */}
                <div className="mt-20 grid gap-6 md:grid-cols-3">
                    {[
                        { metric: "3x", label: "Higher conversion with detailed schema" },
                        { metric: "85%", label: "Of top suppliers use freemium models" },
                        { metric: "92%", label: "Enterprise buyers trust clear methodology" }
                    ].map((item, i) => (
                        <div key={i} className="rounded-lg border border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm p-6 text-center shadow-lg">
                            <div className="text-3xl lg:text-4xl font-semibold text-primary dark:text-white mb-2">{item.metric}</div>
                            <p className="text-sm text-muted-foreground dark:text-white/60">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
