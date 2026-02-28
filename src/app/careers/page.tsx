"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users, Briefcase, Zap, Globe, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";

interface JobOpening {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    jdLink?: string;
}

const jobOpenings: JobOpening[] = [
    {
        id: 1,
        title: "Full Stack Developer",
        department: "Engineering",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        description: "Build and maintain Kuinbee’s platform, including marketplace, community, and analytics features with scalable front-end and back-end systems.",
        requirements: ["2–5 yrs full-stack exp", "JS/TS, React, Node.js, Python", "SQL/NoSQL databases", "Cloud (AWS/GCP)"],
        jdLink: "https://drive.google.com/drive/folders/1G3cnOK5S2NS67slNsD7Wq75UD0-R9LYW?usp=drive_link"
    },
    {
        id: 2,
        title: "Data Engineer",
        department: "Engineering",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        description: "Design and manage ETL pipelines, databases, and data warehouses to ensure scalable and reliable data systems.",
        requirements: ["2–4 yrs data engineering exp", "SQL, Python, Spark/Hadoop", "AWS/GCP/Azure", "APIs & streaming (Kafka/Flink)"],
        jdLink: "https://drive.google.com/drive/folders/1EIy6H52kzf-t_8L_N20sSrYvwHjgLHsq?usp=drive_link"
    },
    {
        id: 3,
        title: "Data Visualization Specialist",
        department: "Data Operations",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        description: "Create intuitive dashboards and reports using Tableau, Power BI, or D3.js to turn complex datasets into clear insights.",
        requirements: ["1–3 yrs data viz/BI exp", "Tableau/Power BI", "Design & storytelling sense", "SQL & Python (bonus)"],
        jdLink: "https://drive.google.com/drive/folders/1kEADz9oQG_XAzRDYfCEsxXDyXztBo5xW?usp=drive_link"
    },
    {
        id: 4,
        title: "Data Collection Specialist",
        department: "Data Operations",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        description: "Source, verify, and structure datasets across industries while ensuring accuracy, privacy compliance, and readiness for analysis.",
        requirements: ["Research & analytical skills", "Excel/Sheets & SQL basics", "Web scraping tools (BeautifulSoup, Scrapy, Selenium)", "Attention to data accuracy"],
        jdLink: "https://drive.google.com/drive/folders/1V9KPgH9lwPNtOh4CJuF1FVSa01hjKMdi?usp=drive_link"
    },
    {
        id: 5,
        title: "AI Developer",
        department: "Engineering / AI",
        location: "Pune / Remote",
        type: "Full-time",
        description: "Develop and deploy ML/AI models for analytics, forecasting, and automation across structured and unstructured datasets.",
        requirements: ["2–5 yrs ML/AI exp", "Python, TensorFlow/PyTorch, scikit-learn", "NLP & predictive modeling", "Cloud ML (AWS Sagemaker, GCP Vertex AI)"],
        jdLink: "https://drive.google.com/drive/folders/1C2Ge50dKvsupTBZNE6QrExIh5YnYEFSz?usp=drive_link"
    }
];

const benefits = [
    {
        icon: Briefcase,
        title: "Impact & Ownership",
        description: "Take real ownership of projects that shape the future of data.",
    },
    {
        icon: Zap,
        title: "Growth & Learning",
        description: "Learning stipend, conference attendance, and continuous skill development",
    },
    {
        icon: Globe,
        title: "Remote First",
        description: "Work from anywhere with flexible hours and async-friendly culture",
    },
    {
        icon: Users,
        title: "Amazing Team",
        description: "Collaborate with world-class talent in a supportive, inclusive environment",
    },
];

export default function CareersPage() {

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50">
                <LandingHeader />
            </div>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative pt-16 pb-16 overflow-hidden">
                <InstitutionalBackground />

                {/* Bottom gradient blend — only bleeds into edge, not into content */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

                <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-20 lg:py-28 z-20">
                    <div className="mx-auto max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-4 md:mb-6 flex justify-center"
                            >
                                <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-lg border border-primary/30 dark:border-white/30 bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10 px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-xl shadow-lg">
                                    <span className="text-xs md:text-sm font-medium text-white flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                            We&apos;re Hiring
                                        </span>
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-center text-4xl font-medium leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
                            >
                                Build the Future
                                <br />
                                <span className="text-primary/70 dark:text-white/80">of Data Commerce</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="mt-4 md:mt-6 text-center mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0"
                            >
                                Join a team building the governed marketplace where verified data meets responsible commerce.
                                We&apos;re growing fast, and we&apos;re looking for people who care about getting it right.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Benefits ────────────────────────────────────────────── */}
            <section
                className="relative py-16 md:py-24 overflow-hidden"
            >
                {/* Background – absolute layers for seamless blending */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
                    {/* Subtle dot pattern */}
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
                            <Users className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">Why Kuinbee</span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Why Work With Us
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            We&apos;re early enough that your work matters, and structured enough that it ships.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-lg hover:border-primary/40 dark:hover:border-white/20 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-6 h-6 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-base font-medium text-foreground dark:text-white mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── Open Positions ──────────────────────────────────────── */}
            <section
                className="relative py-16 md:py-24 overflow-hidden"
            >
                {/* Background – absolute layers for seamless blending */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
                    {/* Subtle grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.015] dark:opacity-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
                            backgroundSize: '64px 64px'
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
                            <Briefcase className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">Open Roles</span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Open Positions
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            All roles are based in Pune / Remote. We move fast, but we hire deliberately.
                        </p>
                    </div>

                    {jobOpenings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="bg-card rounded-3xl border border-border p-10 md:p-14 max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-primary/10 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Briefcase className="w-8 h-8 text-primary dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium tracking-tight text-primary dark:text-white mb-4">
                                    No Open Positions Right Now
                                </h3>
                                <p className="text-muted-foreground dark:text-white/60 mb-8 leading-relaxed">
                                    We don&apos;t have open roles right now, but we&apos;re always interested in talented people
                                    who care about data governance and marketplace integrity.
                                </p>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email Your Resume
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {jobOpenings.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.08 * index }}
                                    viewport={{ once: true }}
                                    className="bg-card rounded-2xl border border-border hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
                                >
                                    <div className="p-6 md:p-8 flex flex-col h-full">
                                        {/* Title + meta */}
                                        <div className="mb-5">
                                            <h3 className="text-xl font-medium text-foreground dark:text-white mb-3">{job.title}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/8 dark:bg-white/8 border border-primary/15 dark:border-white/15 text-primary dark:text-white/80">
                                                    <Briefcase className="w-3 h-3" />
                                                    {job.department}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/8 dark:bg-white/8 border border-primary/15 dark:border-white/15 text-primary dark:text-white/80">
                                                    <MapPin className="w-3 h-3" />
                                                    {job.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/8 dark:bg-white/8 border border-primary/15 dark:border-white/15 text-primary dark:text-white/80">
                                                    <Clock className="w-3 h-3" />
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground dark:text-white/60 mb-5 leading-relaxed">
                                            {job.description}
                                        </p>

                                        <div className="mb-6">
                                            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-white/40 mb-3">Requirements</h4>
                                            <ul className="space-y-1.5">
                                                {job.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground dark:text-white/60">
                                                        <div className="w-1.5 h-1.5 bg-primary/60 dark:bg-white/40 rounded-full mt-2 flex-shrink-0" />
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-auto pt-5 border-t border-border/50 flex gap-3">
                                            {job.jdLink ? (
                                                <Button asChild variant="outline" className="flex-1 border-primary/20 dark:border-white/20 hover:bg-primary/5 dark:hover:bg-white/5 text-primary dark:text-white">
                                                    <a href={job.jdLink} target="_blank" rel="noopener noreferrer">
                                                        Job Description
                                                    </a>
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="flex-1" disabled>
                                                    Job Description
                                                </Button>
                                            )}
                                            <Button asChild className="flex-1 bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90">
                                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com" target="_blank" rel="noopener noreferrer">
                                                    Apply Now
                                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── CTA bottom ──────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden py-16 md:py-24"
            >
                <InstitutionalBackground />

                {/* Top gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background dark:from-[#0a0f1e] to-transparent z-[1]" />

                <div className="relative mx-auto max-w-4xl px-6 text-center z-20">
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white md:text-4xl">
                        Don&apos;t See Your Role?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground dark:text-white/60">
                        We&apos;re always looking for exceptional people who care about data governance and building
                        trustworthy infrastructure. Tell us who you are and how you&apos;d contribute.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                        >
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com" target="_blank" rel="noopener noreferrer">
                                <Mail className="w-5 h-5 mr-2" />
                                Contact Us
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
