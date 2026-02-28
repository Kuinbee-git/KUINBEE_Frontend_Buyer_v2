"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Users,
    Shield,
    Lightbulb,
    MessageCircle,
    Globe,
    Target,
    Zap,
    Phone,
    ExternalLink,
    CheckCircle,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";

const mentalHealthStats = [
    { number: "1 in 4", label: "people experience mental health issues" },
    { number: "40%", label: "of employees report workplace stress" },
    { number: "76%", label: "say mental health affects their work" },
    { number: "60%", label: "want workplace mental health support" },
];

const features = [
    {
        icon: MessageCircle,
        title: "Interactive Webinars",
        description:
            "Expert-led sessions on stress management, emotional wellbeing, and resilience building.",
    },
    {
        icon: Users,
        title: "Virtual Support Circles",
        description:
            "Safe spaces for peer support and sharing experiences in a judgment-free environment.",
    },
    {
        icon: Lightbulb,
        title: "Awareness Campaigns",
        description:
            "Educational initiatives to destigmatize mental health conversations in the workplace.",
    },
    {
        icon: Shield,
        title: "Professional Resources",
        description:
            "Access to qualified mental health professionals and crisis support systems.",
    },
    {
        icon: Globe,
        title: "Remote-Friendly Design",
        description:
            "Accessible support regardless of location, perfect for distributed teams.",
    },
    {
        icon: Target,
        title: "Personalised Tools",
        description:
            "Customised stress management and wellbeing tools tailored to individual needs.",
    },
];

const benefits = [
    "Reduced workplace stress and burnout",
    "Improved employee engagement and productivity",
    "Enhanced emotional resilience",
    "Stronger team connections and peer support",
    "Stigma-free mental health conversations",
    "Better work-life balance",
];

const additionalResources = [
    {
        href: "https://www.nimhans.ac.in/",
        icon: Shield,
        name: "NIMHANS",
        tagline: "National Institute of Mental Health",
    },
    {
        href: "https://manastha.com/",
        icon: Globe,
        name: "Manastha",
        tagline: "Online Mental Health Platform",
    },
    {
        href: "https://www.thelivelovelaughfoundation.org/",
        icon: Heart,
        name: "Live Love Laugh",
        tagline: "Mental Health Awareness Foundation",
    },
];

export default function ProjectSiddhiPage() {
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
                                    <Heart className="h-3.5 w-3.5 text-white" />
                                    <span className="text-xs md:text-sm font-medium text-white">
                                        Mental Health Initiative
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl font-medium leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
                            >
                                Project{" "}
                                <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/90 dark:from-white dark:via-white/80 dark:to-white bg-clip-text text-transparent">
                                    Siddhi
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0"
                            >
                                Building safe, supportive, and resilient workplaces through
                                comprehensive mental health and wellbeing support. Because mental
                                health is as essential as physical health.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                            >
                                <Button
                                    size="lg"
                                    className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 px-8"
                                    asChild
                                >
                                    <a href="#get-involved">
                                        <Users className="w-5 h-5 mr-2" />
                                        Join Our Community
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm px-8"
                                    asChild
                                >
                                    <a href="#resources">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Get Resources
                                    </a>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Mental Health Stats ─────────────────────────────────── */}
            <section className="relative py-14 md:py-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,34,64,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                            <Sparkles className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                The Reality
                            </span>
                        </div>
                        <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Mental Health at Work
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Understanding the scope helps us build better, more compassionate
                            solutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {mentalHealthStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border p-6 md:p-8 text-center hover:border-primary/40 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="text-3xl md:text-4xl font-medium text-primary dark:text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── What We Offer ───────────────────────────────────────── */}
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
                                Our Offering
                            </span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            How We Support You
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            A comprehensive suite of tools, resources, and communities designed
                            around your wellbeing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
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

            {/* ── Mission & Benefits ──────────────────────────────────── */}
            <section className="relative py-16 md:py-24 overflow-hidden">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 backdrop-blur-sm shadow-sm">
                                <Target className="h-4 w-4 text-primary dark:text-white" />
                                <span className="text-sm font-medium text-primary dark:text-white">
                                    Our Mission
                                </span>
                            </div>

                            <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                                More Than a Program:
                                <br />
                                <span className="text-primary/70 dark:text-white/70">
                                    A Movement
                                </span>
                            </h2>

                            <div className="space-y-4 text-muted-foreground dark:text-white/60 leading-relaxed">
                                <p>
                                    Project Siddhi was created with the belief that mental health is
                                    as essential as physical health, and that every individual
                                    deserves access to care, awareness, and hope.
                                </p>
                                <p>
                                    We envision a future where employees are empowered to thrive,
                                    companies embrace holistic wellbeing, and hope is carried forward
                                    into every corner of professional life.
                                </p>
                                <p>
                                    Our remote-friendly design ensures that support, awareness, and
                                    community are accessible to all, regardless of location.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10">
                                <div className="p-2.5 bg-primary/10 dark:bg-white/10 rounded-lg flex-shrink-0">
                                    <Zap className="w-5 h-5 text-primary dark:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground dark:text-white">
                                        Not Just a Program
                                    </p>
                                    <p className="text-sm text-muted-foreground dark:text-white/60">
                                        A movement towards healthier workplaces and societies
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right — Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                                <h3 className="text-xl font-medium text-foreground dark:text-white mb-6">
                                    Benefits You&apos;ll Experience
                                </h3>
                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.05 * index }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle className="w-5 h-5 text-primary dark:text-white flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground dark:text-white/70">
                                                {benefit}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Helplines ───────────────────────────────────────────── */}
            <section id="resources" className="relative py-16 md:py-24 overflow-hidden">
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
                            <Phone className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">
                                Immediate Support
                            </span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Need Help Right Now?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground dark:text-white/60">
                            If you or someone you know is struggling, help is always available.
                            You are not alone, and reaching out is a sign of strength.
                        </p>
                    </div>

                    {/* Government Helplines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Tele-MANAS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl border border-border p-7 md:p-8 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-foreground dark:text-white">
                                        Tele-MANAS
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/60">
                                        National Tele Mental Health Programme
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-5">
                                <a
                                    href="tel:14416"
                                    className="block text-3xl font-medium text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80 transition-colors"
                                >
                                    14416
                                </a>
                                <p className="text-sm text-muted-foreground dark:text-white/50">or</p>
                                <a
                                    href="tel:+918009144416"
                                    className="block text-xl font-medium text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80 transition-colors"
                                >
                                    1800-891-4416
                                </a>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    24/7 mental health counselling & support
                                    <br />
                                    Available in multiple Indian languages
                                    <br />
                                    Ministry of Health & Family Welfare
                                </p>
                            </div>
                        </motion.div>

                        {/* KIRAN */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl border border-border p-7 md:p-8 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-foreground dark:text-white">
                                        KIRAN Helpline
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/60">
                                        National Mental Health Programme
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-5">
                                <a
                                    href="tel:+918005990019"
                                    className="block text-3xl font-medium text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80 transition-colors"
                                >
                                    1800-599-0019
                                </a>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    Nationwide coverage, 24/7 support
                                    <br />
                                    Mental health rehabilitation services
                                    <br />
                                    Early screening & psychological support
                                    <br />
                                    Crisis management & intervention
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Crisis Text Line */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-card rounded-2xl border border-border p-6 text-center mb-10 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl mb-4">
                            <MessageCircle className="w-6 h-6 text-primary dark:text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground dark:text-white mb-1">
                            Crisis Text Line
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-white/60 mb-2">
                            Text{" "}
                            <span className="font-medium text-primary dark:text-white">
                                "HELLO"
                            </span>{" "}
                            to
                        </p>
                        <p className="text-2xl font-medium text-primary dark:text-white">741741</p>
                    </motion.div>

                    {/* Additional Resources */}
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-medium text-primary dark:text-white">
                            Additional Resources
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {additionalResources.map((res, index) => (
                            <motion.a
                                key={index}
                                href={res.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border p-5 hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 group flex flex-col gap-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-primary/10 dark:bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <res.icon className="w-5 h-5 text-primary dark:text-white" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground dark:text-white/40 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground dark:text-white text-sm">
                                        {res.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-white/50 mt-0.5">
                                        {res.tagline}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── Inspirational Quote ─────────────────────────────────── */}
            <section className="relative py-10 md:py-12 overflow-hidden">
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-card rounded-2xl border border-border p-8 md:p-10 text-center shadow-sm"
                    >
                        <p className="text-lg md:text-xl text-foreground dark:text-white/90 italic leading-relaxed">
                            "Mental health is not a destination, but a process. It's
                            about how you drive, not where you're going."
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-white/50 mt-4">
                            It's okay to not be okay. Seeking help is brave.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────── */}
            <section id="get-involved" className="relative overflow-hidden py-16 md:py-24">
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
                            Ready to Build a Healthier Workplace?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground dark:text-white/60">
                            Join Project Siddhi and be part of a movement that transforms how organizations approach mental health and employee wellbeing.
                        </p>

                        <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                            >
                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Get Involved
                                </a>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm px-8"
                            >
                                <a href="/support">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Contact Us
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
