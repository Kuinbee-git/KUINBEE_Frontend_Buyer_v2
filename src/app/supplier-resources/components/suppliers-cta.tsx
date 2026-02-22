"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ArrowRight, Lock, TrendingUp, Zap } from "lucide-react";

export function SuppliersCTA() {
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

    const benefits = [
        { icon: Lock, text: "Full IP Protection" },
        { icon: TrendingUp, text: "Zero Negotiation" },
        { icon: Zap, text: "Complete Control" },
    ];

    return (
        <section
            ref={sectionRef}
            className={`relative overflow-hidden py-16 md:py-24 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Background — matches CTASection exactly */}
            <InstitutionalBackground />

            <div className="relative mx-auto max-w-4xl px-6 text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-primary dark:text-white md:text-4xl">
                    Ready to Start Supplying?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground dark:text-white/60">
                    Publishing on Kuinbee means real buyers, fair compensation, and complete control over your intellectual property. No negotiations. No compromises.
                </p>

                {/* Benefits row */}
                <div className="mt-12 grid grid-cols-3 gap-4 md:gap-6 mb-10 max-w-2xl mx-auto">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={benefit.text} className="rounded-lg border border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm p-4 shadow-sm">
                                <Icon className="h-5 w-5 text-primary dark:text-white mx-auto mb-2" />
                                <span className="text-xs md:text-sm font-medium text-foreground dark:text-white text-center block">{benefit.text}</span>
                            </div>
                        );
                    })}
                </div>

                {/* CTAs — exact match to landing CTASection */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90" asChild>
                        <Link href="/supplier/apply">
                            Apply to Supply
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm" asChild>
                        <Link href="/supplier/dashboard">View Dashboard</Link>
                    </Button>
                </div>

                {/* Trust stats */}
                <div className="mt-12 inline-flex flex-col md:flex-row gap-6 text-sm text-muted-foreground dark:text-white/60">
                    {[
                        { value: "250+", label: "Active Suppliers" },
                        { value: "500+", label: "Published Datasets" },
                        { value: "2.4K", label: "Unique Sources" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2 justify-center">
                            <span className="text-lg font-semibold text-primary dark:text-white">{stat.value}</span>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-sm text-muted-foreground/60 dark:text-white/40">
                    Identity verification required. Access subject to compliance review.
                </p>
            </div>
        </section>
    );
}
