"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Mail,
    Zap,
    Sparkles,
    TrendingUp,
    ArrowRight,
} from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";

const features = [
    {
        icon: Zap,
        title: "Automated Data Ingestion",
        description:
            "Connect databases, files, and APIs. Auto-discover schemas, map keys and land canonical datasets instantly.",
    },
    {
        icon: Sparkles,
        title: "Smart Cleaning & Validation",
        description:
            "Detect errors, fill gaps and enforce schema rules with hybrid rule + ML validations and full audit trails.",
    },
    {
        icon: TrendingUp,
        title: "AI Modeling & Insights",
        description:
            "Auto-generate descriptive and predictive models. Get ready-to-use metrics, forecasts and anomaly alerts.",
    },
    {
        icon: BarChart3,
        title: "Instant Visualizations",
        description:
            "Turn processed data into dynamic dashboards and narrative summaries in seconds.",
    },
    {
        icon: Zap,
        title: "Real-Time Analytics",
        description:
            "Continuous updates, streaming metrics and alerts so decisions are based on current data, not stale reports.",
    },
    {
        icon: Sparkles,
        title: "Governance & Credibility",
        description:
            "Lineage, versioning and validations at every step so analytics are auditable and regulatory-ready.",
    },
];

const pillBadges = [
    { icon: Zap, label: "Automated Data Ingestion" },
    { icon: TrendingUp, label: "AI Modeling & Insights" },
    { icon: Sparkles, label: "Real-Time Analytics" },
];

export default function StrotasPage() {
    const [email, setEmail] = useState("");
    const [state, handleSubmit] = useForm("xdkwzkgj");

    const handleWaitlistSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("source", "Strotas Waitlist");
            handleSubmit(formData);
            setEmail("");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50">
                <LandingHeader />
            </div>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative pt-16 pb-16 overflow-hidden">
                <InstitutionalBackground />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

                <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-20 lg:py-28 z-20">
                    <div className="mx-auto max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex justify-center"
                            >
                                <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/30 bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10 px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-xl shadow-lg">
                                    <BarChart3 className="h-3.5 w-3.5 text-white" />
                                    <span className="text-xs md:text-sm font-medium text-white">
                                        Strotas by Kuinbee
                                    </span>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl font-medium leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
                            >
                                AI End to End{" "}
                                <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/90 dark:from-white dark:via-white/80 dark:to-white bg-clip-text text-transparent">
                                    Data Pipeline
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0"
                            >
                                Transform chaos into clarity. Kuinbee automates ingestion,
                                cleaning, modelling and visualization so teams ship reliable
                                analytics without manual glue.
                            </motion.p>

                            {/* Pill badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4 px-4"
                            >
                                {pillBadges.map((pill) => (
                                    <div
                                        key={pill.label}
                                        className="flex items-center gap-2 bg-card backdrop-blur-sm px-4 sm:px-5 py-2.5 rounded-full border border-border shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300"
                                    >
                                        <pill.icon className="w-4 h-4 text-primary dark:text-white" />
                                        <span className="text-sm font-medium text-foreground dark:text-white/90">
                                            {pill.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Highlighted Feature ──────────────────────────────── */}
            <section className="relative py-14 md:py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,34,64,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-[#1a2240] dark:to-[#0f1729] rounded-2xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                            <div className="relative z-10 text-center max-w-4xl mx-auto">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-xl mb-6">
                                    <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-medium mb-4">
                                    Deploy anywhere: APIs, dashboards, or a warehouse, one click
                                </h3>
                                <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
                                    Deploy insights via APIs, dashboards or warehouse connectors.
                                    Enterprise-grade scale, developer-grade ergonomics, and
                                    governance built-in.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features Grid ────────────────────────────────────── */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.3) 1px, transparent 0)`,
                            backgroundSize: "32px 32px",
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                            <Zap className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                Capabilities
                            </span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Features
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Everything you need to go from raw data to actionable insights,
                            automatically.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border p-6 md:p-7 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── Waitlist CTA ─────────────────────────────────────── */}
            <section className="relative overflow-hidden py-16 md:py-24">
                <InstitutionalBackground />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background dark:from-[#0a0f1e] to-transparent z-[1]" />

                <div className="relative mx-auto max-w-4xl px-6 text-center z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-white/10 mb-4">
                            <Sparkles className="w-8 h-8 text-primary dark:text-white" />
                        </div>

                        <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white md:text-4xl lg:text-5xl">
                            Join the Strotas Waitlist
                        </h2>

                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground dark:text-white/60 leading-relaxed">
                            Join the waitlist to unlock the future of trusted, automated
                            analytics.
                        </p>

                        <div className="pt-4">
                            {!state.succeeded ? (
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    onSubmit={handleWaitlistSubmit}
                                    className="max-w-xl mx-auto"
                                >
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={state.submitting}
                                                className="h-12 sm:h-14 px-5 text-base rounded-xl border-border bg-card text-foreground dark:text-white placeholder:text-muted-foreground focus:border-primary dark:focus:border-white/40 focus:ring-primary/20 dark:focus:ring-white/10 shadow-sm disabled:opacity-50"
                                            />
                                            <ValidationError
                                                prefix="Email"
                                                field="email"
                                                errors={state.errors}
                                                className="text-red-500 text-sm mt-2 text-left"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={state.submitting || !email.trim()}
                                            size="lg"
                                            className="h-12 sm:h-14 px-8 bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Mail className="w-5 h-5 mr-2" />
                                            {state.submitting ? "Joining..." : "Join Waitlist"}
                                        </Button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-card rounded-2xl p-8 border border-border max-w-lg mx-auto shadow-sm"
                                >
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                                        <Mail className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-medium text-foreground dark:text-white mb-3">
                                        You&apos;re on the list!
                                    </h3>
                                    <p className="text-muted-foreground dark:text-white/60">
                                        Thanks for joining! We&apos;ll notify you as soon as Strotas
                                        is ready.
                                    </p>
                                </motion.div>
                            )}

                            {state.errors && Object.keys(state.errors).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 max-w-xl mx-auto"
                                >
                                    <p className="text-red-600 dark:text-red-400 text-sm text-center">
                                        Something went wrong. Please try again or contact support.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="pt-8 text-sm text-muted-foreground dark:text-white/40 space-y-1"
                        >
                            <p>Expected launch: Q2 2026</p>
                            <p>
                                Priority access for early subscribers · No spam, unsubscribe
                                anytime
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
