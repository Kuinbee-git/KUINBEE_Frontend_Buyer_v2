"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Database,
    FileText,
    Send,
    CheckCircle,
    Clock,
    Shield,
    Users,
    Zap,
    Globe,
    ArrowRight,
    Loader2,
    BarChart3,
    Briefcase,
    GraduationCap,
    Building2,
} from "lucide-react";
import { Button, Input, Label } from "@/shared/components/ui";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { toast } from "sonner";

const industries = [
    "Healthcare & Life Sciences",
    "Finance & Banking",
    "Retail & E-Commerce",
    "Technology & IT",
    "Education & Research",
    "Government & Public Sector",
    "Real Estate & Infrastructure",
    "Agriculture & Environment",
    "Manufacturing & Supply Chain",
    "Media & Entertainment",
    "Energy & Utilities",
    "Transportation & Logistics",
    "Other",
];

const dataFormats = [
    "CSV",
    "JSON",
    "Excel (XLSX)",
    "SQL Database Dump",
    "API Access",
    "Parquet",
    "XML",
    "No Preference",
];

const budgetRanges = [
    "Under $500",
    "$500 - $2,000",
    "$2,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
    "Not Sure / Need a Quote",
];

const timelineOptions = [
    "Within 1 week",
    "1 - 2 weeks",
    "2 - 4 weeks",
    "1 - 2 months",
    "3+ months",
    "Flexible / No Rush",
];

const howItWorks = [
    {
        icon: FileText,
        title: "Submit Your Request",
        description:
            "Tell us what data you need, the format, scope, and any specific requirements.",
    },
    {
        icon: Users,
        title: "Expert Review",
        description:
            "Our data sourcing team reviews your request and evaluates feasibility within 24 hours.",
    },
    {
        icon: Database,
        title: "Data Sourcing",
        description:
            "We source, validate, and structure the dataset to meet your specifications.",
    },
    {
        icon: CheckCircle,
        title: "Delivery",
        description:
            "Receive your verified, ready-to-use dataset in your preferred format.",
    },
];

const whyRequestData = [
    {
        icon: Shield,
        title: "Quality Assured",
        description:
            "Every dataset undergoes strict validation and compliance checks before delivery.",
    },
    {
        icon: Globe,
        title: "Global Coverage",
        description:
            "Access data from diverse geographies, markets, and industries worldwide.",
    },
    {
        icon: Zap,
        title: "Fast Turnaround",
        description:
            "Most standard requests are fulfilled within 1 to 2 weeks of submission.",
    },
    {
        icon: Briefcase,
        title: "Enterprise Ready",
        description:
            "Structured for immediate integration into your analytics and BI pipelines.",
    },
];

const useCases = [
    {
        icon: BarChart3,
        title: "Market Research",
        description: "Industry trends, competitor analysis, and consumer behavior data.",
    },
    {
        icon: GraduationCap,
        title: "Academic Research",
        description: "Structured datasets for theses, papers, and institutional studies.",
    },
    {
        icon: Building2,
        title: "Business Intelligence",
        description: "Custom data feeds for dashboards, forecasting, and strategic planning.",
    },
    {
        icon: Database,
        title: "AI & ML Training",
        description: "Labeled, cleaned datasets ready for machine learning model training.",
    },
];

interface FormData {
    fullName: string;
    email: string;
    organization: string;
    industry: string;
    dataDescription: string;
    dataFormat: string;
    budgetRange: string;
    timeline: string;
    additionalNotes: string;
}

const initialFormData: FormData = {
    fullName: "",
    email: "",
    organization: "",
    industry: "",
    dataDescription: "",
    dataFormat: "",
    budgetRange: "",
    timeline: "",
    additionalNotes: "",
};

export default function DataRequestPage() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.industry) newErrors.industry = "Please select an industry";
        if (!formData.dataDescription.trim()) {
            newErrors.dataDescription = "Please describe the data you need";
        } else if (formData.dataDescription.trim().length < 30) {
            newErrors.dataDescription = "Please provide at least 30 characters of detail";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Build mailto link with form details
        const subject = `Data Request: ${formData.industry} - ${formData.fullName}`;
        const body = [
            `Name: ${formData.fullName}`,
            `Email: ${formData.email}`,
            `Organization: ${formData.organization || "N/A"}`,
            `Industry: ${formData.industry}`,
            ``,
            `Data Description:`,
            formData.dataDescription,
            ``,
            `Preferred Format: ${formData.dataFormat || "No preference"}`,
            `Budget Range: ${formData.budgetRange || "Not specified"}`,
            `Timeline: ${formData.timeline || "Not specified"}`,
            ``,
            `Additional Notes:`,
            formData.additionalNotes || "None",
        ].join("\n");

        // Simulate brief processing
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Open Gmail compose in a new tab
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");

        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("Your data request has been prepared. Complete sending it in your email.");
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
        setIsSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50">
                <LandingHeader />
            </div>

            {/* ── Hero ────────────────────────────────────────────────── */}
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
                                    <Database className="h-3.5 w-3.5 text-white" />
                                    <span className="text-xs md:text-sm font-medium text-white">
                                        Custom Data Sourcing
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl font-medium leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
                            >
                                Request the Data
                                <br />
                                <span className="text-primary/70 dark:text-white/80">
                                    You Need
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0"
                            >
                                Can't find the dataset you're looking for? Tell us what you need
                                and our sourcing team will find, verify, and deliver it to you.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="flex justify-center pt-2"
                            >
                                <Button
                                    size="lg"
                                    className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 px-8"
                                    asChild
                                >
                                    <a href="#request-form">
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit a Request
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ────────────────────────────────────────── */}
            <section className="relative py-14 md:py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,34,64,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                            <Zap className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                Simple Process
                            </span>
                        </div>
                        <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            How It Works
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            From request to delivery in four straightforward steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 group relative"
                            >
                                {/* Step number */}
                                <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground/40 dark:text-white/20">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <step.icon className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-base font-medium text-foreground dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Use Cases ───────────────────────────────────────────── */}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 backdrop-blur-sm shadow-sm">
                                <Database className="h-4 w-4 text-primary dark:text-white" />
                                <span className="text-sm font-medium text-primary dark:text-white">
                                    Use Cases
                                </span>
                            </div>

                            <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                                What Kind of Data
                                <br />
                                <span className="text-primary/70 dark:text-white/70">
                                    Can You Request?
                                </span>
                            </h2>

                            <p className="text-muted-foreground dark:text-white/60 leading-relaxed">
                                Whether you need market intelligence, training data for AI
                                models, or structured datasets for academic research, our team
                                has you covered. We source data across industries, geographies,
                                and formats.
                            </p>
                        </motion.div>

                        {/* Right - Use case cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {useCases.map((useCase, index) => (
                                <div
                                    key={index}
                                    className="bg-card rounded-2xl border border-border p-5 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 bg-primary/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <useCase.icon className="w-5 h-5 text-primary dark:text-white" />
                                    </div>
                                    <h3 className="text-sm font-medium text-foreground dark:text-white mb-1.5">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── Request Form ────────────────────────────────────────── */}
            <section id="request-form" className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.015] dark:opacity-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
                            backgroundSize: "64px 64px",
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                            <Send className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                Request Form
                            </span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Tell Us What You Need
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Fill out the form below with as much detail as possible so we can
                            serve you better.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {isSubmitted ? (
                            /* ── Success state ─────────────────────────── */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center shadow-sm"
                            >
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-medium text-foreground dark:text-white mb-3">
                                    Request Prepared
                                </h3>
                                <p className="text-muted-foreground dark:text-white/60 mb-2 leading-relaxed max-w-lg mx-auto">
                                    Your data request details have been composed in a new email
                                    window. Please review and hit send to complete your
                                    submission.
                                </p>
                                <p className="text-sm text-muted-foreground dark:text-white/50 mb-8">
                                    Our team typically responds within 24 hours.
                                </p>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10"
                                >
                                    Submit Another Request
                                </Button>
                            </motion.div>
                        ) : (
                            /* ── Form ──────────────────────────────────── */
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                onSubmit={handleSubmit}
                                className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-sm space-y-8"
                            >
                                {/* Contact Details */}
                                <div>
                                    <h3 className="text-lg font-medium text-foreground dark:text-white mb-1">
                                        Contact Details
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/50 mb-6">
                                        How should we reach you about this request?
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Full Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                placeholder="Your full name"
                                                value={formData.fullName}
                                                onChange={(e) => handleChange("fullName", e.target.value)}
                                                className={errors.fullName ? "border-destructive" : ""}
                                            />
                                            {errors.fullName && (
                                                <p className="text-destructive text-sm">{errors.fullName}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Email Address <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                type="email"
                                                placeholder="you@company.com"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                className={errors.email ? "border-destructive" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-destructive text-sm">{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Organization
                                            </Label>
                                            <Input
                                                placeholder="Company or institution name"
                                                value={formData.organization}
                                                onChange={(e) => handleChange("organization", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Industry <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={formData.industry}
                                                onValueChange={(val) => handleChange("industry", val)}
                                            >
                                                <SelectTrigger className={`h-10 ${errors.industry ? "border-destructive" : ""}`}>
                                                    <SelectValue placeholder="Select your industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map((ind) => (
                                                        <SelectItem key={ind} value={ind}>
                                                            {ind}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.industry && (
                                                <p className="text-destructive text-sm">{errors.industry}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-border" />

                                {/* Data Requirements */}
                                <div>
                                    <h3 className="text-lg font-medium text-foreground dark:text-white mb-1">
                                        Data Requirements
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/50 mb-6">
                                        Be as specific as possible to help us understand your needs.
                                    </p>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Describe the Data You Need{" "}
                                                <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                placeholder="E.g. I need a dataset of all active SaaS companies in North America with 50-500 employees, including company name, website, revenue range, employee count, funding stage, and key technologies used. The data should be from the last 12 months."
                                                value={formData.dataDescription}
                                                onChange={(e) =>
                                                    handleChange("dataDescription", e.target.value)
                                                }
                                                className={`min-h-[140px] ${errors.dataDescription ? "border-destructive" : ""}`}
                                            />
                                            {errors.dataDescription && (
                                                <p className="text-destructive text-sm">
                                                    {errors.dataDescription}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-foreground dark:text-white">
                                                    Preferred Format
                                                </Label>
                                                <Select
                                                    value={formData.dataFormat}
                                                    onValueChange={(val) =>
                                                        handleChange("dataFormat", val)
                                                    }
                                                >
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Select format" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dataFormats.map((fmt) => (
                                                            <SelectItem key={fmt} value={fmt}>
                                                                {fmt}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-foreground dark:text-white">
                                                    Budget Range
                                                </Label>
                                                <Select
                                                    value={formData.budgetRange}
                                                    onValueChange={(val) =>
                                                        handleChange("budgetRange", val)
                                                    }
                                                >
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Select range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {budgetRanges.map((range) => (
                                                            <SelectItem key={range} value={range}>
                                                                {range}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-foreground dark:text-white">
                                                    Timeline
                                                </Label>
                                                <Select
                                                    value={formData.timeline}
                                                    onValueChange={(val) =>
                                                        handleChange("timeline", val)
                                                    }
                                                >
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Select timeline" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timelineOptions.map((opt) => (
                                                            <SelectItem key={opt} value={opt}>
                                                                {opt}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-foreground dark:text-white">
                                                Additional Notes
                                            </Label>
                                            <Textarea
                                                placeholder="Any other details, compliance requirements, or special instructions..."
                                                value={formData.additionalNotes}
                                                onChange={(e) =>
                                                    handleChange("additionalNotes", e.target.value)
                                                }
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                    <p className="text-xs text-muted-foreground dark:text-white/40 max-w-sm">
                                        By submitting, you agree to our privacy policy. We'll never
                                        share your information with third parties.
                                    </p>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 px-10"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Submit Request
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── Why Request Through Kuinbee ─────────────────────────── */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
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
                            <Shield className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                Why Kuinbee
                            </span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Why Request Through Us
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            We handle the hard work so you can focus on what matters most.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyRequestData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-base font-medium text-foreground dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────── */}
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
                        <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white md:text-4xl lg:text-5xl">
                            Have Questions First?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground dark:text-white/60">
                            Not sure where to start? Our team is happy to discuss your data
                            needs before you submit a formal request.
                        </p>

                        <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                            >
                                <a href="/support">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Contact Support
                                </a>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm px-8"
                            >
                                <a href="/datasets">
                                    <Database className="w-5 h-5 mr-2" />
                                    Browse Datasets
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
