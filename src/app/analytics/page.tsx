"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    ArrowDown,
    ArrowRight,
    AlertTriangle,
    BarChart3,
    Bot,
    BrainCircuit,
    Check,
    CheckCircle,
    Database,
    Eye,
    GitMerge,
    Layers,
    Link2,
    Mail,
    Play,
    Radar,
    ScanSearch,
    Send,
    Shield,
    Sparkles,
    Unplug,
    Workflow,
    Zap,
} from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";

/* ── Data ─────────────────────────────────────────────────────────── */

const stages = [
    {
        number: "01",
        tag: "Ingest",
        title: "Connect Any Source",
        description:
            "Pull data from anywhere — on schedule or in real time. Nothing gets lost, nothing gets changed prematurely.",
        icon: Database,
        highlights: [
            "APIs, databases, files, webhooks",
            "Scheduled or real-time",
            "Raw data preserved as-is",
        ],
        color: "from-blue-500/20 to-blue-600/10",
        borderColor: "border-blue-500/20",
    },
    {
        number: "02",
        tag: "Profile",
        title: "Understand the Shape",
        description:
            "Automatically scan incoming data to understand its structure, quality, and patterns before you decide what to do with it.",
        icon: ScanSearch,
        highlights: [
            "Column types and cardinality",
            "Null rates and distributions",
            "Outlier patterns surfaced",
        ],
        color: "from-violet-500/20 to-violet-600/10",
        borderColor: "border-violet-500/20",
    },
    {
        number: "03",
        tag: "Map",
        title: "Stabilise the Schema",
        description:
            "Map volatile source fields to a stable internal structure. When sources change, only the mapping updates. Everything downstream stays intact.",
        icon: GitMerge,
        highlights: [
            "Canonical semantic contract",
            "Source changes absorbed",
            "Zero downstream breakage",
        ],
        color: "from-emerald-500/20 to-emerald-600/10",
        borderColor: "border-emerald-500/20",
        featured: true,
    },
    {
        number: "04",
        tag: "Transform",
        title: "Clean, Reshape, Enrich",
        description:
            "Merge duplicates, normalise formats, compute new fields, join across sources. AI proposes the plan. You approve it.",
        icon: Workflow,
        highlights: [
            "AI-generated transform plans",
            "Dedup and normalisation",
            "Cross-source joins",
        ],
        color: "from-amber-500/20 to-amber-600/10",
        borderColor: "border-amber-500/20",
    },
    {
        number: "05",
        tag: "Validate",
        title: "Enforce Quality Rules",
        description:
            "Set the rules your data must pass before reaching production. Failures are caught, logged, and surfaced — never silently passed through.",
        icon: Shield,
        highlights: [
            "Custom quality contracts",
            "Automated pass/fail gating",
            "Full failure audit trail",
        ],
        color: "from-rose-500/20 to-rose-600/10",
        borderColor: "border-rose-500/20",
    },
    {
        number: "06",
        tag: "Publish",
        title: "Ship Trusted Datasets",
        description:
            "Clean data is published and ready for your tools, warehouse, or marketplace. Versioned, documented, access-controlled.",
        icon: Send,
        highlights: [
            "Query-ready in seconds",
            "Schema-versioned releases",
            "Auto documentation",
        ],
        color: "from-cyan-500/20 to-cyan-600/10",
        borderColor: "border-cyan-500/20",
    },
    {
        number: "07",
        tag: "Monitor",
        title: "Watch Continuously",
        description:
            "Track freshness, detect drift, and alert on anomalies. Know when something changes before your stakeholders do.",
        icon: Radar,
        highlights: [
            "Schema drift detection",
            "Volume and freshness alerts",
            "Distribution shift monitoring",
        ],
        color: "from-orange-500/20 to-orange-600/10",
        borderColor: "border-orange-500/20",
    },
];

const aiPrinciples = [
    {
        title: "Propose, Don\u2019t Decide",
        description:
            "Every AI action is a suggestion surfaced for your review. Mappings, transforms, quality rules — nothing runs until you say so.",
        icon: Sparkles,
        stat: "100%",
        statLabel: "Human approval",
    },
    {
        title: "Degrade Gracefully",
        description:
            "If the AI is unavailable, the pipeline doesn\u2019t stall. Every operation can be done manually through the same interface.",
        icon: Layers,
        stat: "0%",
        statLabel: "AI-caused downtime",
    },
    {
        title: "Learn From You",
        description:
            "Every approval, edit, and rejection teaches the AI more about your domain. Suggestions get sharper with every interaction.",
        icon: BrainCircuit,
        stat: "\u221E",
        statLabel: "Continuous learning",
    },
];

const pipelineNodes = [
    { label: "Ingest", icon: Database, desc: "Connect sources" },
    { label: "Profile", icon: ScanSearch, desc: "Scan structure" },
    { label: "Map", icon: GitMerge, desc: "Stabilise schema" },
    { label: "Transform", icon: Workflow, desc: "Clean & enrich" },
    { label: "Validate", icon: Shield, desc: "Quality gates" },
    { label: "Publish", icon: Send, desc: "Ship datasets" },
    { label: "Monitor", icon: Radar, desc: "Watch always" },
];

/* ── Pipeline Flow (Hero) ─────────────────────────────────────────── */

function PipelineFlowAnimation() {
    return (
        <div className="relative flex flex-col items-start py-2 select-none w-full">
            {/* Flowing line */}
            <div className="absolute top-5 bottom-5 left-[22px] w-px">
                <div className="h-full w-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 dark:from-white/15 dark:via-white/30 dark:to-white/15" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary dark:bg-white animate-[flowDown_3s_ease-in-out_infinite]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/50 dark:bg-white/50 animate-[flowDown_3s_ease-in-out_1.2s_infinite]" />
            </div>

            {pipelineNodes.map((node, i) => {
                const Icon = node.icon;
                return (
                    <motion.div
                        key={node.label}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                        className="relative flex items-center gap-3.5 mb-4 last:mb-0 w-full"
                    >
                        {/* Node dot */}
                        <div className="relative z-10 w-11 h-11 rounded-xl bg-card border border-primary/20 dark:border-white/15 flex items-center justify-center shadow-md">
                            <Icon className="w-[18px] h-[18px] text-primary dark:text-white" />
                        </div>
                        {/* Text */}
                        <div className="flex-1">
                            <div className="text-[13px] font-medium text-foreground dark:text-white/90 leading-none mb-0.5">
                                {node.label}
                            </div>
                            <div className="text-[11px] text-muted-foreground dark:text-white/45 leading-none">
                                {node.desc}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            <style jsx>{`
        @keyframes flowDown {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function StrotasPage() {
    const [email, setEmail] = useState("");
    const [state, handleSubmit] = useForm("xdkwzkgj");
    const timelineRef = useRef<HTMLDivElement>(null);
    const timelineInView = useInView(timelineRef, { once: true, amount: 0.05 });

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

            {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Hero
          ══════════════════════════════════════════════════════════ */}
            <section className="relative pt-12 pb-20 overflow-hidden">
                <InstitutionalBackground />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

                <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-28 z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-7"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 dark:border-white/20 bg-gradient-to-r from-[#1a2240]/90 to-[#2d3a5f]/90 dark:from-white/15 dark:to-white/5 px-4 py-1.5 backdrop-blur-xl shadow-lg">
                                <BarChart3 className="h-3.5 w-3.5 text-white" />
                                <span className="text-xs font-medium text-white tracking-wide">
                                    Strotas by Kuinbee
                                </span>
                            </div>

                            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                                Pipeline Software
                                <br />
                                <span className="bg-gradient-to-r from-primary via-primary/60 to-primary dark:from-white dark:via-white/70 dark:to-white bg-clip-text text-transparent">
                                    That Thinks.
                                </span>
                            </h1>

                            <p className="max-w-lg text-[15px] md:text-base leading-relaxed text-muted-foreground dark:text-white/65">
                                Strotas is an AI-native data pipeline platform. Connect
                                scattered sources and transform them into trusted, queryable
                                datasets. AI agents propose. Humans approve. The pipeline never
                                stalls.
                            </p>

                            {/* Pills */}
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    { icon: Zap, label: "Any Source, One Pipeline" },
                                    { icon: BrainCircuit, label: "AI-Assisted, Human-Governed" },
                                    { icon: Shield, label: "Schemas That Don\u2019t Break" },
                                ].map((pill) => (
                                    <div
                                        key={pill.label}
                                        className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3.5 py-2 rounded-full border border-border/80 shadow-sm text-[13px] font-medium text-foreground dark:text-white/85 hover:shadow-md hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300"
                                    >
                                        <pill.icon className="w-3.5 h-3.5 text-primary dark:text-white/70" />
                                        {pill.label}
                                    </div>
                                ))}
                            </div>

                            {/* Stats strip */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex items-center gap-6 pt-2"
                            >
                                {[
                                    { value: "7", label: "Pipeline Stages" },
                                    { value: "1", label: "Stable Contract" },
                                    { value: "0", label: "Downstream Breaks" },
                                ].map((stat, i) => (
                                    <div key={stat.label} className="flex items-center gap-2">
                                        {i > 0 && (
                                            <div className="w-px h-8 bg-border dark:bg-white/10 -ml-2 mr-1" />
                                        )}
                                        <div>
                                            <div className="text-2xl font-bold text-primary dark:text-white leading-none">
                                                {stat.value}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground dark:text-white/40 uppercase tracking-wider mt-0.5">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTAs */}
                            <div className="flex items-center gap-3 pt-1">
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("waitlist")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    size="lg"
                                    className="h-11 px-7 bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Join the Waitlist
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("pipeline")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    variant="outline"
                                    size="lg"
                                    className="h-11 px-5 rounded-xl border-border/80 text-foreground dark:text-white/80 hover:bg-primary/5 dark:hover:bg-white/5"
                                >
                                    How It Works
                                    <ArrowDown className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Right — Pipeline Flow */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:flex justify-center"
                        >
                            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-5 shadow-2xl shadow-primary/5 dark:shadow-black/30 w-full max-w-[260px]">
                                <PipelineFlowAnimation />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          SECTION 2 — Canonical Mapping Layer
          ══════════════════════════════════════════════════════════ */}
            <section className="relative py-14 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] dark:via-[#1a2240]/15 to-background" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-[#141d38] dark:to-[#0d1525] rounded-3xl p-8 md:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-white/10">
                            {/* Decorative orbs */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full -translate-y-40 translate-x-40 blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/[0.05] rounded-full translate-y-30 -translate-x-30 blur-2xl" />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                                        <GitMerge className="w-4 h-4 text-white/90" />
                                    </div>
                                    <span className="text-xs font-medium text-white/50 uppercase tracking-[0.15em]">
                                        Core Innovation
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 leading-tight max-w-xl">
                                    The Canonical Mapping Layer
                                </h2>
                                <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
                                    Every data pipeline has the same fatal flaw: when a source
                                    changes its schema, everything downstream shatters. Strotas
                                    solves this with a single stable layer that absorbs all
                                    volatility.
                                </p>

                                {/* 3-part flow */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                                    {/* Sources */}
                                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm">
                                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Database className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div className="text-sm font-medium text-white/85 mb-1">
                                            Your Sources
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">
                                            Volatile, inconsistent, constantly changing formats and
                                            field names
                                        </p>
                                    </div>

                                    {/* Canonical — highlighted */}
                                    <div className="rounded-xl border-2 border-emerald-400/30 bg-emerald-500/[0.08] p-5 text-center relative shadow-[0_0_30px_rgba(52,211,153,0.08)]">
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-emerald-500/25 text-emerald-200 px-3 py-0.5 rounded-full border border-emerald-400/25">
                                                Stable
                                            </span>
                                        </div>
                                        <div className="w-11 h-11 bg-emerald-400/15 rounded-xl flex items-center justify-center mx-auto mb-3 mt-1">
                                            <GitMerge className="w-5 h-5 text-emerald-300" />
                                        </div>
                                        <div className="text-sm font-medium text-emerald-200 mb-1">
                                            Canonical Layer
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">
                                            One stable structure. All source changes absorbed here and
                                            only here.
                                        </p>
                                    </div>

                                    {/* Downstream */}
                                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm">
                                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <BarChart3 className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div className="text-sm font-medium text-white/85 mb-1">
                                            Downstream
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">
                                            Transforms, validations, dashboards — completely
                                            unaffected by changes
                                        </p>
                                    </div>
                                </div>

                                {/* Before / After */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-300/80" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-300/80">
                                                Without Strotas
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {[
                                                "Source renames a field",
                                                "Transforms break silently",
                                                "Dashboards show wrong data",
                                                "Engineers scramble for days",
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2 text-[13px] text-white/60"
                                                >
                                                    <Unplug className="w-3 h-3 text-red-400/70 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Link2 className="w-3.5 h-3.5 text-emerald-300/80" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300/80">
                                                With Strotas
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {[
                                                "Source renames a field",
                                                "One mapping updates in seconds",
                                                "Downstream stays fully intact",
                                                "Zero engineering intervention",
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2 text-[13px] text-white/60"
                                                >
                                                    <CheckCircle className="w-3 h-3 text-emerald-400/70 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          SECTION 3 — Pipeline Stages
          ══════════════════════════════════════════════════════════ */}
            <section
                id="pipeline"
                className="relative py-16 md:py-24 overflow-hidden"
            >
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
                    <div
                        className="absolute inset-0 opacity-[0.015] dark:opacity-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26,34,64,0.4) 1px, transparent 0)`,
                            backgroundSize: "24px 24px",
                        }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 dark:border-white/15 bg-primary/5 dark:bg-white/5 px-4 py-1.5 mb-5">
                            <Workflow className="h-3.5 w-3.5 text-primary dark:text-white/70" />
                            <span className="text-xs font-medium text-primary dark:text-white/70 tracking-wide">
                                The Pipeline
                            </span>
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl mb-3">
                            Seven Stages. One Outcome.
                        </h2>
                        <p className="mx-auto max-w-lg text-[15px] text-muted-foreground dark:text-white/55 leading-relaxed">
                            From scattered sources to trusted datasets — every stage is
                            observable, auditable, and AI-accelerated.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div ref={timelineRef} className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px overflow-hidden">
                            <motion.div
                                className="w-full bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5 dark:from-white/30 dark:via-white/15 dark:to-white/5"
                                initial={{ height: "0%" }}
                                animate={
                                    timelineInView ? { height: "100%" } : { height: "0%" }
                                }
                                transition={{ duration: 3, ease: "easeOut" }}
                            />
                        </div>

                        <div className="space-y-4">
                            {stages.map((stage, index) => {
                                const Icon = stage.icon;
                                return (
                                    <motion.div
                                        key={stage.number}
                                        initial={{ opacity: 0, x: -16 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.45, delay: 0.05 * index }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        className="relative pl-16 md:pl-20"
                                    >
                                        {/* Node */}
                                        <div
                                            className={`absolute left-3.5 md:left-5.5 top-5 w-5 h-5 rounded-full bg-card border-2 ${stage.featured
                                                ? "border-emerald-500/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                                : "border-primary/30 dark:border-white/20"
                                                } shadow-sm z-10`}
                                        />

                                        <div
                                            className={`bg-card rounded-2xl border p-5 md:p-6 hover:shadow-lg transition-all duration-300 group ${stage.featured
                                                ? "border-emerald-500/20 dark:border-emerald-400/15 shadow-md shadow-emerald-500/5"
                                                : "border-border hover:border-primary/25 dark:hover:border-white/15"
                                                }`}
                                        >
                                            {/* Featured badge */}
                                            {stage.featured && (
                                                <div className="absolute -top-2.5 right-5">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/20 dark:border-emerald-400/20">
                                                        Core Innovation
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-4">
                                                {/* Icon + number */}
                                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                                    <div
                                                        className={`w-10 h-10 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border ${stage.borderColor}`}
                                                    >
                                                        <Icon className="w-[18px] h-[18px] text-primary dark:text-white" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-primary/25 dark:text-white/15">
                                                        {stage.number}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/45 dark:text-white/35">
                                                            {stage.tag}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-[15px] font-semibold text-foreground dark:text-white mb-1">
                                                        {stage.title}
                                                    </h3>
                                                    <p className="text-[13px] text-muted-foreground dark:text-white/55 leading-relaxed mb-3">
                                                        {stage.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {stage.highlights.map((h) => (
                                                            <span
                                                                key={h}
                                                                className="inline-flex items-center gap-1 text-[11px] bg-primary/[0.04] dark:bg-white/[0.04] text-primary/60 dark:text-white/45 px-2 py-0.5 rounded-md border border-primary/[0.08] dark:border-white/[0.08]"
                                                            >
                                                                <Check className="w-2.5 h-2.5" />
                                                                {h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ══════════════════════════════════════════════════════════
          SECTION 4 — AI Agents
          ══════════════════════════════════════════════════════════ */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] dark:via-[#1a2240]/15 to-background" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 dark:border-white/15 bg-primary/5 dark:bg-white/5 px-4 py-1.5 mb-5">
                            <BrainCircuit className="h-3.5 w-3.5 text-primary dark:text-white/70" />
                            <span className="text-xs font-medium text-primary dark:text-white/70 tracking-wide">
                                Intelligence Layer
                            </span>
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl mb-3">
                            AI That Accelerates. Never Gates.
                        </h2>
                        <p className="mx-auto max-w-lg text-[15px] text-muted-foreground dark:text-white/55 leading-relaxed">
                            AI agents are embedded in every stage — but they are assistants,
                            not gatekeepers.
                        </p>
                    </div>

                    {/* Approval Flow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/80 p-6 md:p-8 mb-8 shadow-lg"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
                            {[
                                {
                                    icon: Bot,
                                    label: "AI Proposes",
                                    desc: "Mappings, transforms, rules",
                                    accent: false,
                                },
                                {
                                    icon: Eye,
                                    label: "You Review",
                                    desc: "Approve, edit, or reject",
                                    accent: false,
                                },
                                {
                                    icon: Play,
                                    label: "Pipeline Runs",
                                    desc: "Reliable, audited execution",
                                    accent: true,
                                },
                            ].map((step, i) => (
                                <div key={step.label} className="flex items-center gap-8 sm:gap-10">
                                    {i > 0 && (
                                        <>
                                            <ArrowRight className="hidden sm:block w-5 h-5 text-primary/20 dark:text-white/15 -ml-6 -mr-6" />
                                            <ArrowDown className="sm:hidden w-5 h-5 text-primary/20 dark:text-white/15 -mt-4 -mb-4" />
                                        </>
                                    )}
                                    <div className="flex flex-col items-center gap-2.5">
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${step.accent
                                                ? "bg-emerald-500/10 border-emerald-500/25 shadow-emerald-500/5"
                                                : "bg-primary/[0.06] dark:bg-white/[0.06] border-primary/15 dark:border-white/10"
                                                }`}
                                        >
                                            <step.icon
                                                className={`w-6 h-6 ${step.accent
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-primary dark:text-white"
                                                    }`}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div
                                                className={`text-[13px] font-semibold leading-none mb-0.5 ${step.accent
                                                    ? "text-emerald-700 dark:text-emerald-400"
                                                    : "text-foreground dark:text-white"
                                                    }`}
                                            >
                                                {step.label}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground dark:text-white/40">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Principle cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiPrinciples.map((principle, index) => {
                            const Icon = principle.icon;
                            return (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    viewport={{ once: true }}
                                    className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 dark:hover:border-white/15 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-primary/[0.07] dark:bg-white/[0.07] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5 text-primary dark:text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary dark:text-white leading-none">
                                                {principle.stat}
                                            </div>
                                            <div className="text-[9px] text-muted-foreground dark:text-white/35 uppercase tracking-[0.1em] mt-0.5">
                                                {principle.statLabel}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-[15px] font-semibold text-foreground dark:text-white mb-1.5">
                                        {principle.title}
                                    </h3>
                                    <p className="text-[13px] text-muted-foreground dark:text-white/55 leading-relaxed">
                                        {principle.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          SECTION 5 — Waitlist CTA
          ══════════════════════════════════════════════════════════ */}
            <section
                id="waitlist"
                className="relative overflow-hidden py-16 md:py-24"
            >
                <InstitutionalBackground />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background dark:from-[#0a0f1e] to-transparent z-[1]" />

                <div className="relative mx-auto max-w-3xl px-6 text-center z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h2 className="text-3xl font-semibold tracking-tight text-primary dark:text-white md:text-4xl lg:text-5xl">
                            Strotas Is Coming. Build With Us.
                        </h2>

                        <p className="mx-auto max-w-xl text-[15px] text-muted-foreground dark:text-white/55 leading-relaxed">
                            We&apos;re onboarding early design partners. Join the waitlist for
                            priority access, direct input on the product, and founding-member
                            pricing.
                        </p>

                        <div className="pt-3">
                            {!state.succeeded ? (
                                <form
                                    onSubmit={handleWaitlistSubmit}
                                    className="max-w-md mx-auto"
                                >
                                    <div className="flex flex-col sm:flex-row gap-2.5">
                                        <div className="flex-1">
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={state.submitting}
                                                className="h-11 sm:h-12 px-4 text-sm rounded-xl border-border bg-card text-foreground dark:text-white placeholder:text-muted-foreground/70 focus:border-primary dark:focus:border-white/30 shadow-sm disabled:opacity-50"
                                            />
                                            <ValidationError
                                                prefix="Email"
                                                field="email"
                                                errors={state.errors}
                                                className="text-red-500 text-xs mt-1.5 text-left"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={state.submitting || !email.trim()}
                                            className="h-11 sm:h-12 px-6 bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            {state.submitting ? "Joining..." : "Join Waitlist"}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-card rounded-2xl p-7 border border-border max-w-sm mx-auto"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                                        <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                                        You&apos;re on the list.
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/55">
                                        We&apos;ll reach out when Strotas is ready for early
                                        partners.
                                    </p>
                                </motion.div>
                            )}

                            {state.errors && Object.keys(state.errors).length > 0 && (
                                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 max-w-md mx-auto">
                                    <p className="text-red-600 dark:text-red-400 text-xs text-center">
                                        Something went wrong. Please try again.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 text-xs text-muted-foreground dark:text-white/35 space-y-0.5">
                            <p>Expected launch: Q2 2026</p>
                            <p>
                                Priority access for early subscribers · No spam, unsubscribe
                                anytime
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
