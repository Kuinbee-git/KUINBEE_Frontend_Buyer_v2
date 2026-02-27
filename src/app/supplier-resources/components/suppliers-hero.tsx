"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ArrowRight, TrendingUp } from "lucide-react";

export function SuppliersHero() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);



    return (
        <section className="relative pt-16 pb-16">
            {/* Gradient background with dot pattern — same as LandingHero */}
            <InstitutionalBackground />

            {/* Radial glow effects — exact copy from LandingHero */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:opacity-85"
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle, rgba(26, 34, 64, 0.5) 0%, rgba(45, 58, 95, 0.35) 35%, rgba(26, 34, 64, 0.2) 55%, transparent 75%)'
                            : 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(71, 85, 105, 0.05) 35%, rgba(51, 65, 85, 0.02) 55%, transparent 75%)'
                    }}
                />
                <div
                    className="absolute top-1/3 -left-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle, rgba(78, 90, 126, 0.45) 0%, rgba(45, 58, 95, 0.3) 40%, rgba(36, 47, 82, 0.18) 60%, transparent 80%)'
                            : 'radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, rgba(51, 65, 85, 0.04) 40%, rgba(30, 41, 59, 0.02) 60%, transparent 80%)'
                    }}
                />
                <div
                    className="absolute top-1/3 -right-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle, rgba(45, 58, 95, 0.45) 0%, rgba(78, 90, 126, 0.3) 40%, rgba(26, 34, 64, 0.18) 60%, transparent 80%)'
                            : 'radial-gradient(circle, rgba(100, 116, 139, 0.06) 0%, rgba(71, 85, 105, 0.04) 40%, rgba(51, 65, 85, 0.02) 60%, transparent 80%)'
                    }}
                />
            </div>

            {/* Bottom gradient blend for seamless transition to next section */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

            <div className="relative mx-auto max-w-7xl px-6 z-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-8 mb-20">
                    {/* Left: Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 backdrop-blur-sm shadow-sm">
                            <TrendingUp className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                For Data Suppliers
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.15] tracking-tight text-primary dark:text-white">
                            Turn Data Into
                            <br />
                            <span className="text-muted-foreground">Recurring Revenue</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg leading-relaxed text-muted-foreground dark:text-white/70 max-w-xl">
                            Publish verified datasets to a governed marketplace. No negotiations, no samples, no friction. Just transparent pricing and institutional buyers ready to purchase.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                size="lg"
                                className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                                asChild
                            >
                                <a href="https://supplier.kuinbee.com" target="_blank" rel="noopener noreferrer">
                                    Create Supplier Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm"
                                asChild
                            >
                                <Link href="#guide">Why Kuinbee?</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Supplier Panel Screenshot */}
                    <div className="relative hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/15 dark:border-white/20 shadow-2xl dark:shadow-xl">
                            {/* Browser chrome dots */}
                            <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-black/20 to-transparent">                            </div>
                            <Image
                                src={isDark ? "/supplier-panel-dashboard-light.png" : "/supplier-panel-dashboard-dark.png"}
                                alt="Kuinbee Supplier Panel — Dashboard Overview showing proposals, datasets, and onboarding status"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                        {/* Subtle glow behind the image */}
                        <div className="absolute -inset-4 rounded-3xl bg-primary/5 dark:bg-white/5 blur-3xl -z-10" />
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl border border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm shadow-lg">
                    {[
                        { num: "1-2 Days", text: "Average Time to Approval" },
                        { num: "100%", text: "Control Over Pricing" },
                        { num: "24/7", text: "Buyer Access to Your Data" },
                    ].map((item, i) => (
                        <div key={i} className="text-center py-4 px-2 border-r border-border/50 last:border-r-0">
                            <div className="text-2xl lg:text-3xl font-semibold text-primary dark:text-white">{item.num}</div>
                            <p className="text-xs lg:text-sm text-muted-foreground dark:text-white/60 mt-2">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
