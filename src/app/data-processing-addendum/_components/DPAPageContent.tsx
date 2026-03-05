"use client";

import { useState, useEffect } from "react";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { motion } from "framer-motion";
import {
    FileText,
    AlertCircle,
    Calendar,
    Mail,
    ArrowLeft,
    Shield,
    Users,
    BookOpen,
    Lock,
    Scale,
    Globe,
    ChevronRight,
    Server,
    Eye,
    Database,
    Settings,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2 mt-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function SectionCard({
    id,
    number,
    title,
    badge,
    badgeColor,
    children,
}: {
    id: string;
    number: number | string;
    title: string;
    badge: string;
    badgeColor: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            id={id}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="group scroll-mt-28 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
            <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                        <span className="text-base font-bold text-primary">{number}</span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{title}</h2>
                </div>
            </div>
            <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-3 pl-0 md:pl-14 text-sm md:text-base">
                {children}
            </div>
        </motion.div>
    );
}

function AnnexCard({
    id,
    title,
    badge,
    badgeColor,
    children,
}: {
    id: string;
    title: string;
    badge: string;
    badgeColor: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            id={id}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="group scroll-mt-28 relative p-6 md:p-8 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent border border-primary/20 dark:border-primary/30 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10"
        >
            <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/10 dark:from-primary/25 dark:to-primary/15 flex items-center justify-center shadow-sm">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{title}</h2>
                </div>
            </div>
            <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-3 pl-0 md:pl-14 text-sm md:text-base">
                {children}
            </div>
        </motion.div>
    );
}

// ─── Sections metadata ────────────────────────────────────────────────────────
const sections = [
    { id: "s1", title: "Definitions", group: "Overview" },
    { id: "s2", title: "Role of Parties", group: "Structure" },
    { id: "s3", title: "Subject Matter & Duration", group: "Scope" },
    { id: "s4", title: "Processor Obligations", group: "Obligations" },
    { id: "s5", title: "Technical & Org. Measures", group: "Security" },
    { id: "s6", title: "Sub-Processors", group: "Governance" },
    { id: "s7", title: "International Transfers", group: "Compliance" },
    { id: "s8", title: "Data Subject Rights", group: "Rights" },
    { id: "s9", title: "Personal Data Breach", group: "Security" },
    { id: "s10", title: "Audit Rights", group: "Governance" },
    { id: "s11", title: "Retention & Deletion", group: "Lifecycle" },
    { id: "s12", title: "Liability", group: "Legal" },
    { id: "s13", title: "Supplier Data Disclaimer", group: "Legal" },
    { id: "s14", title: "Governing Law", group: "Legal" },
    { id: "s15", title: "Order of Precedence", group: "Legal" },
    { id: "a1", title: "Annex I — Processing Description", group: "Annex" },
    { id: "a2", title: "Annex II — TOMs", group: "Annex" },
    { id: "a3", title: "SCC Integration", group: "Annex" },
    { id: "a4", title: "HIPAA BAA", group: "Annex" },
    { id: "a5", title: "AI Training Compliance", group: "Annex" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export function DPAPageContent() {
    const [isDark, setIsDark] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const updateDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        updateDark();
        const observer = new MutationObserver(updateDark);
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const handleGoBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 110;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setActiveSection(sectionId);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

            <div className="sticky top-0 z-50">
                <LandingHeader />
            </div>

            {/* ── Hero ── */}
            <section className="relative pt-24 md:pt-28 pb-10 md:pb-14 overflow-hidden">
                <InstitutionalBackground />

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:opacity-85"
                        style={{
                            background: isDark
                                ? "radial-gradient(circle, rgba(26,34,64,0.5) 0%, rgba(45,58,95,0.35) 35%, rgba(26,34,64,0.2) 55%, transparent 75%)"
                                : "radial-gradient(circle, rgba(100,116,139,0.08) 0%, rgba(71,85,105,0.05) 35%, rgba(51,65,85,0.02) 55%, transparent 75%)",
                        }}
                    />
                    <div
                        className="absolute top-1/3 -left-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
                        style={{
                            background: isDark
                                ? "radial-gradient(circle, rgba(78,90,126,0.45) 0%, rgba(45,58,95,0.3) 40%, rgba(36,47,82,0.18) 60%, transparent 80%)"
                                : "radial-gradient(circle, rgba(71,85,105,0.06) 0%, rgba(51,65,85,0.04) 40%, rgba(30,41,59,0.02) 60%, transparent 80%)",
                        }}
                    />
                    <div
                        className="absolute top-1/3 -right-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
                        style={{
                            background: isDark
                                ? "radial-gradient(circle, rgba(45,58,95,0.45) 0%, rgba(78,90,126,0.3) 40%, rgba(26,34,64,0.18) 60%, transparent 80%)"
                                : "radial-gradient(circle, rgba(100,116,139,0.06) 0%, rgba(71,85,105,0.04) 40%, rgba(51,65,85,0.02) 60%, transparent 80%)",
                        }}
                    />
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
                    <motion.button
                        onClick={handleGoBack}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white transition-colors duration-200 group mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back</span>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center space-y-5 md:space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 rounded-full border border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/5">
                                <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                                    <Database className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-primary">Data Processing Addendum</span>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground dark:text-white leading-[1.1] tracking-tight">
                                Data Processing{" "}
                                <span className="font-medium bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                    Addendum
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="max-w-2xl mx-auto"
                        >
                            <p className="text-lg md:text-xl text-muted-foreground dark:text-white/70 leading-relaxed font-light">
                                GDPR, DPDP, CCPA-ready data processing terms — including SCCs, HIPAA BAA, and AI Training annexes for enterprise compliance.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
                        >
                            {[
                                { Icon: Calendar, label: "Last Updated", value: "March 2026" },
                                { Icon: Scale, label: "Document Type", value: "DPA + Annexes" },
                                { Icon: Globe, label: "Coverage", value: "GDPR · DPDP · CCPA · HIPAA" },
                            ].map(({ Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">{label}</p>
                                        <p className="text-sm font-semibold text-foreground dark:text-white">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="relative py-10 md:py-14 pb-20 md:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">

                        {/* Sidebar TOC */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent border border-primary/10 dark:border-primary/20 rounded-xl">
                                    <h3 className="text-sm font-semibold text-foreground dark:text-white mb-1 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Table of Contents
                                    </h3>
                                    <p className="text-xs text-muted-foreground dark:text-white/50">{sections.length} sections</p>
                                </div>
                                <div className="bg-background/50 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto hide-scrollbar">
                                    {sections.map((section, index) => {
                                        const isActive = activeSection === section.id;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${isActive
                                                        ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm"
                                                        : "text-muted-foreground dark:text-white/60 hover:bg-muted/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                                                    }`}
                                            >
                                                <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-[10px] font-bold flex-shrink-0 shadow-sm">
                                                    {section.id.startsWith("a") ? section.id.toUpperCase().replace("A", "A") : index + 1}
                                                </div>
                                                <div className="relative flex-1 min-w-0">
                                                    <span className="text-xs font-semibold block truncate">{section.title}</span>
                                                    <span className="text-[10px] text-muted-foreground/60 dark:text-white/40">{section.group}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>

                        {/* Main Column */}
                        <div>

                            {/* Overview Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative mb-6 p-6 md:p-8 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/10 dark:to-transparent border-2 border-primary/30 dark:border-primary/40 rounded-2xl shadow-lg shadow-primary/5 dark:shadow-primary/10 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10" />
                                <div className="flex items-start gap-4 md:gap-5">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                                            <Shield className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                                DPA Overview
                                            </h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full uppercase">Enterprise</span>
                                        </div>
                                        <div className="space-y-3 text-sm md:text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                                            <p>
                                                This Data Processing Addendum forms part of the Terms and Conditions and any applicable Marketplace Agreement between <strong className="text-foreground dark:text-white">Kuinbee Information Services Private Limited</strong> ("Processor") and the entity accessing or using Kuinbee's platform services ("Controller").
                                            </p>
                                            <div className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                                <p className="text-sm">
                                                    <strong className="text-foreground dark:text-white">⚠️ Scope:</strong> This DPA applies where Kuinbee processes Personal Data on behalf of the Customer. Enterprise customers may request execution of this DPA at <a href="mailto:legal@kuinbee.com" className="text-primary hover:underline">legal@kuinbee.com</a>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Mobile TOC */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="lg:hidden mb-6 p-5 md:p-6 bg-gradient-to-br from-muted/50 to-transparent dark:from-white/5 dark:to-transparent border border-border dark:border-white/10 rounded-2xl shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-foreground dark:text-white flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Quick Navigation
                                    </h3>
                                    <div className="text-xs text-muted-foreground dark:text-white/50 font-medium px-2 py-0.5 bg-primary/10 dark:bg-primary/20 rounded-full">
                                        {sections.length}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {sections.map((section, index) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm bg-background dark:bg-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 border border-border dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/30 transition-all"
                                        >
                                            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-xs font-bold flex-shrink-0">
                                                {section.id.startsWith("a") ? "A" : index + 1}
                                            </span>
                                            <span className="text-muted-foreground dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white font-medium truncate transition-colors">
                                                {section.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ── Core DPA Sections ── */}
                            <div className="space-y-6">

                                <SectionCard id="s1" number={1} title="Definitions" badge="Overview" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <p className="font-medium text-foreground dark:text-white">"Applicable Data Protection Laws"</p>
                                    <p>All laws applicable to the processing of Personal Data, including but not limited to:</p>
                                    <BulletList items={[
                                        "Digital Personal Data Protection Act, India (DPDP)",
                                        "General Data Protection Regulation (GDPR)",
                                        "UK GDPR",
                                        "CCPA/CPRA (where applicable)",
                                    ]} />
                                    <BulletList items={[
                                        '"Personal Data" — Any information relating to an identified or identifiable natural person.',
                                        '"Processing" — Any operation performed on Personal Data.',
                                        '"Sub-Processor" — Any third party engaged by Kuinbee to process Personal Data.',
                                    ]} />
                                </SectionCard>

                                <SectionCard id="s2" number={2} title="Role of Parties" badge="Structure" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                    <p>Where Kuinbee processes Customer Personal Data in connection with platform services, Kuinbee acts as a <strong className="text-foreground dark:text-white">Data Processor</strong>. Customer acts as the <strong className="text-foreground dark:text-white">Data Controller</strong>, determining the purpose and means of processing.</p>
                                    <BulletList items={[
                                        "Kuinbee does not act as a Controller for third-party Datasets uploaded by independent Suppliers unless explicitly agreed in writing.",
                                        "For Kuinbee's own corporate operations (billing, user accounts), Kuinbee acts as an independent Controller.",
                                    ]} />
                                </SectionCard>

                                <SectionCard id="s3" number={3} title="Subject Matter & Duration" badge="Scope" badgeColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                    <p><strong className="text-foreground dark:text-white">Subject Matter:</strong> Processing necessary to provide marketplace and data infrastructure services.</p>
                                    <p><strong className="text-foreground dark:text-white">Duration:</strong> For the term of the Agreement and until deletion or return of Personal Data.</p>
                                    <p className="font-medium text-foreground dark:text-white mt-1">Nature of Processing:</p>
                                    <BulletList items={["Hosting & storage", "Transmission", "Technical validation", "Platform-based analytics", "API-based data handling"]} />
                                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                                        <div className="p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                            <p className="text-xs font-bold text-foreground dark:text-white mb-1.5">Categories of Data Subjects</p>
                                            <p className="text-xs text-muted-foreground dark:text-white/60">Customer users · Business representatives · End-users (if applicable)</p>
                                        </div>
                                        <div className="p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                            <p className="text-xs font-bold text-foreground dark:text-white mb-1.5">Categories of Personal Data</p>
                                            <p className="text-xs text-muted-foreground dark:text-white/60">Account information · Business contact data · Uploaded structured datasets (if containing personal data)</p>
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard id="s4" number={4} title="Processor Obligations" badge="Obligations" badgeColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <p>Kuinbee shall:</p>
                                    <BulletList items={[
                                        "Process Personal Data only on documented instructions from Customer",
                                        "Ensure authorized persons are bound by confidentiality obligations",
                                        "Implement appropriate technical and organizational security measures",
                                        "Assist Customer in fulfilling data subject rights requests",
                                        "Notify Customer without undue delay upon becoming aware of a Personal Data breach",
                                        "Delete or return Personal Data upon termination, unless retention is required by law",
                                    ]} />
                                </SectionCard>

                                <SectionCard id="s5" number={5} title="Technical & Organizational Measures (TOMs)" badge="Security" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                                    <p>Kuinbee implements commercially reasonable safeguards including:</p>
                                    <BulletList items={[
                                        "Encryption in transit (TLS)",
                                        "Access control mechanisms",
                                        "Role-based permissions",
                                        "Secure cloud hosting",
                                        "Monitoring and logging",
                                        "Incident response planning",
                                        "Infrastructure redundancy",
                                    ]} />
                                    <p className="mt-2">Security measures are periodically reviewed and updated.</p>
                                </SectionCard>

                                <SectionCard id="s6" number={6} title="Sub-Processors" badge="Governance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                    <BulletList items={[
                                        "Customer authorizes Kuinbee to engage Sub-Processors",
                                        "Sub-Processors are bound by data protection obligations no less protective than this DPA",
                                        "A list of key Sub-Processors may be made available upon request",
                                        "Kuinbee remains responsible for Sub-Processor compliance with this DPA",
                                    ]} />
                                </SectionCard>

                                <SectionCard id="s7" number={7} title="International Data Transfers" badge="Compliance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                    <p>Where Personal Data is transferred outside the originating jurisdiction, Kuinbee shall ensure lawful transfer mechanisms:</p>
                                    <BulletList items={[
                                        "Standard Contractual Clauses (SCCs)",
                                        "Adequacy decisions",
                                        "Other legally recognized safeguards",
                                    ]} />
                                    <p className="mt-2">Customer acknowledges that cross-border hosting may occur where infrastructure is globally distributed.</p>
                                </SectionCard>

                                <SectionCard id="s8" number={8} title="Data Subject Rights" badge="Rights" badgeColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <p>Kuinbee shall assist Customer, where technically feasible, in responding to:</p>
                                    <BulletList items={[
                                        "Access requests",
                                        "Rectification requests",
                                        "Erasure requests",
                                        "Restriction requests",
                                        "Objection requests",
                                    ]} />
                                    <p className="mt-2">If Kuinbee receives a data subject request directly, it shall forward the request to Customer unless legally prohibited.</p>
                                </SectionCard>

                                <SectionCard id="s9" number={9} title="Personal Data Breach" badge="Security" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                    <p>Kuinbee shall notify Customer <strong className="text-foreground dark:text-white">without undue delay</strong> after becoming aware of a breach affecting Customer-controlled data.</p>
                                    <p className="font-medium text-foreground dark:text-white mt-1">Notification shall include, where available:</p>
                                    <BulletList items={[
                                        "Nature of the breach",
                                        "Categories of data affected",
                                        "Likely consequences",
                                        "Mitigation measures taken",
                                    ]} />
                                    <p className="mt-2">Kuinbee shall cooperate in investigation and mitigation.</p>
                                </SectionCard>

                                <SectionCard id="s10" number={10} title="Audit Rights" badge="Governance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                    <p>Upon reasonable notice, Customer may request information demonstrating compliance. Kuinbee may satisfy audit requirements through:</p>
                                    <BulletList items={[
                                        "Certifications",
                                        "Security documentation",
                                        "Third-party audit reports",
                                        "Written compliance confirmations",
                                    ]} />
                                    <p className="mt-2">Physical audits shall be subject to confidentiality safeguards and reasonable scheduling.</p>
                                </SectionCard>

                                <SectionCard id="s11" number={11} title="Data Retention & Deletion" badge="Lifecycle" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <p>Upon termination of services, Kuinbee shall:</p>
                                    <BulletList items={[
                                        "Delete Personal Data; or",
                                        "Return Personal Data to Customer",
                                    ]} />
                                    <p className="mt-2">unless retention is required by law. Backup deletion may occur in accordance with retention cycles.</p>
                                </SectionCard>

                                <SectionCard id="s12" number={12} title="Liability" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                                    <p>Each Party's liability under this DPA shall be subject to the liability limitations set out in the main Agreement. Nothing in this DPA limits liability where such limitation is prohibited by Applicable Data Protection Laws.</p>
                                </SectionCard>

                                <SectionCard id="s13" number={13} title="Supplier Data Disclaimer" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                                    <p>Where Datasets are uploaded by independent Suppliers:</p>
                                    <BulletList items={[
                                        "Kuinbee does not determine lawful basis for collection",
                                        "Supplier is responsible for consent and compliance",
                                        "Customer assumes responsibility for downstream processing",
                                    ]} />
                                    <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white">
                                        This DPA applies only to data processed by Kuinbee as Processor.
                                    </p>
                                </SectionCard>

                                <SectionCard id="s14" number={14} title="Governing Law" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                                    <p>This DPA shall be governed by the laws specified in the main Agreement.</p>
                                </SectionCard>

                                <SectionCard id="s15" number={15} title="Order of Precedence" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                                    <p>In the event of conflict:</p>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {["1. This DPA", "2. The Marketplace Agreement", "3. The Terms and Conditions"].map((item) => (
                                            <div key={item} className="flex items-center gap-2.5 p-2.5 bg-muted/40 dark:bg-white/5 rounded-lg border border-border dark:border-white/10">
                                                <span className="text-sm font-semibold text-foreground dark:text-white">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </div>

                            {/* ── Annexes ── */}
                            <div className="mt-10 mb-6">
                                <h3 className="text-lg font-bold text-foreground dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Annexes & Supplementary Frameworks
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 mt-1">Supporting documents incorporated by reference into this DPA.</p>
                            </div>

                            <div className="space-y-6">

                                <AnnexCard id="a1" title="Annex I — Description of Processing (EU Format)" badge="Annex" badgeColor="bg-primary/10 dark:bg-primary/20 text-primary">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                            <p className="text-xs font-bold text-foreground dark:text-white mb-1.5">Data Exporter (Controller)</p>
                                            <p className="text-xs text-muted-foreground dark:text-white/60">Enterprise Customer using Kuinbee services</p>
                                        </div>
                                        <div className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                            <p className="text-xs font-bold text-foreground dark:text-white mb-1.5">Data Importer (Processor)</p>
                                            <p className="text-xs text-muted-foreground dark:text-white/60">Kuinbee Information Services Pvt. Ltd., Pune, Maharashtra, India</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-foreground dark:text-white mt-3">Purpose of Processing:</p>
                                    <BulletList items={[
                                        "Marketplace operations & data licensing facilitation",
                                        "Dataset hosting, transmission, and API access",
                                        "AI pipeline infrastructure (if enabled)",
                                        "Dashboard, analytics, and platform functionality",
                                    ]} />
                                    <p className="font-medium text-foreground dark:text-white mt-2">Categories of Data Subjects:</p>
                                    <p>Customer representatives · Business users · Dataset data subjects (if personal data included) · API users</p>
                                    <p className="font-medium text-foreground dark:text-white mt-2">Sensitive Data Handling:</p>
                                    <p>Where special categories are processed: enhanced safeguards apply, encryption enforced, access strictly role-based, processing only under lawful basis.</p>
                                </AnnexCard>

                                <AnnexCard id="a2" title="Annex II — Technical & Organizational Measures" badge="Annex" badgeColor="bg-primary/10 dark:bg-primary/20 text-primary">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {[
                                            { title: "Access Control", items: ["Role-based restrictions", "Multi-factor authentication", "Least privilege principle", "Periodic access review"] },
                                            { title: "Data Transmission", items: ["TLS encryption in transit", "Secure API authentication", "Encrypted data channels"] },
                                            { title: "Data Storage", items: ["Encrypted storage (where supported)", "Segregated storage layers", "Backup redundancy"] },
                                            { title: "Infrastructure", items: ["Secure cloud hosting", "Firewall protections", "Network segmentation", "Monitoring and alerting"] },
                                            { title: "Incident Response", items: ["Escalation protocol", "Breach notification procedure", "Forensic investigation", "Mitigation strategy"] },
                                            { title: "Personnel & Sub-Processors", items: ["Confidentiality agreements", "Internal data protection training", "Sub-processor due diligence", "Ongoing oversight"] },
                                        ].map(({ title, items }) => (
                                            <div key={title} className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                                                <p className="text-xs font-bold text-foreground dark:text-white mb-2">{title}</p>
                                                {items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2 mb-1">
                                                        <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                                        <span className="text-xs text-muted-foreground dark:text-white/60">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </AnnexCard>

                                <AnnexCard id="a3" title="Standard Contractual Clauses (SCC) Integration" badge="Annex" badgeColor="bg-primary/10 dark:bg-primary/20 text-primary">
                                    <p>Where GDPR applies and transfers occur outside the EEA, Kuinbee supports:</p>
                                    <BulletList items={[
                                        "Controller-to-Processor module",
                                        "Processor-to-Processor module",
                                    ]} />
                                    <p className="font-medium text-foreground dark:text-white mt-2">Upon request, Kuinbee may:</p>
                                    <BulletList items={[
                                        "Execute EU Commission 2021 SCCs",
                                        "Incorporate UK Addendum",
                                        "Provide supplementary safeguards",
                                        "Conduct Transfer Impact Assessments",
                                    ]} />
                                    <p className="mt-2">SCCs may be incorporated by reference into the DPA.</p>
                                </AnnexCard>

                                <AnnexCard id="a4" title="HIPAA Business Associate Addendum (BAA)" badge="Annex" badgeColor="bg-primary/10 dark:bg-primary/20 text-primary">
                                    <p className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-amber-800 dark:text-amber-300 text-sm mb-2">
                                        ⚠️ This section applies <strong>only</strong> where Customer uploads or processes Protected Health Information (PHI).
                                    </p>
                                    <p>Kuinbee acts as a Business Associate solely for hosting or transmission functions, where applicable.</p>
                                    <p className="font-medium text-foreground dark:text-white mt-2">Kuinbee shall:</p>
                                    <BulletList items={[
                                        "Use PHI only to provide services",
                                        "Not disclose PHI except as permitted",
                                        "Implement safeguards required under HIPAA Security Rule",
                                        "Protect PHI confidentiality, limit access, encrypt transmissions",
                                        "Notify Customer without unreasonable delay following discovery of a breach of unsecured PHI",
                                    ]} />
                                    <p className="mt-2">Subcontractors handling PHI must agree to equivalent safeguards. If Kuinbee materially breaches HIPAA obligations and fails to cure, Customer may terminate.</p>
                                </AnnexCard>

                                <AnnexCard id="a5" title="AI Training Compliance Annex" badge="Annex" badgeColor="bg-primary/10 dark:bg-primary/20 text-primary">
                                    <p className="p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm mb-2">
                                        This annex applies where Datasets are used for machine learning or AI training.
                                    </p>
                                    <p className="font-medium text-foreground dark:text-white">Lawful Basis Requirements:</p>
                                    <BulletList items={[
                                        "Buyers must ensure lawful basis for training",
                                        "Consent where required",
                                        "Compliance with applicable AI regulation",
                                    ]} />
                                    <p className="font-medium text-foreground dark:text-white mt-2">Bias & Fairness Controls:</p>
                                    <BulletList items={[
                                        "Conduct bias assessments",
                                        "Maintain documentation",
                                        "Avoid discriminatory outcomes",
                                    ]} />
                                    <p className="font-medium text-foreground dark:text-white mt-2">Prohibited AI Uses:</p>
                                    <BulletList items={[
                                        "Unlawful biometric surveillance",
                                        "Social scoring prohibited by law",
                                        "Human rights violations",
                                        "Autonomous weapon systems",
                                    ]} />
                                    <p className="font-medium text-foreground dark:text-white mt-2">Regulatory Alignment:</p>
                                    <BulletList items={[
                                        "EU AI Act (where applicable)",
                                        "DPDP requirements",
                                        "Sectoral AI governance rules",
                                        "National AI safety regulations",
                                    ]} />
                                </AnnexCard>
                            </div>

                            {/* Contact Card */}
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.55, ease: "easeOut" }}
                                className="mt-8 p-6 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-2xl border border-primary/30 dark:border-primary/40 shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white mb-3">
                                            Request DPA Execution
                                        </h3>
                                        <p className="text-muted-foreground dark:text-white/70 leading-relaxed mb-5 text-sm md:text-base">
                                            Enterprise customers may request a signed copy of this DPA, SCC execution, or HIPAA BAA by contacting:
                                        </p>
                                        <a
                                            href="mailto:legal@kuinbee.com"
                                            className="inline-flex items-center gap-3 px-5 py-3 bg-background dark:bg-white/10 rounded-xl border border-border dark:border-white/10 hover:border-primary/40 transition-colors group"
                                        >
                                            <Mail className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground dark:text-white/50">Legal</p>
                                                <p className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">legal@kuinbee.com</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
