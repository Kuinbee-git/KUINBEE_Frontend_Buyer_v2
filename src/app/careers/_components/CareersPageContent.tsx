"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, Mail, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";

interface JobOpening {
    id: number;
    title: string;
    location: string;
    type: string;
    overview: string;
    about: string;
    responsibilities: string[];
    requirements: string[];
    gain?: string[];
    compensation?: string;
    jdLink?: string;
}

const jobOpenings: JobOpening[] = [
    {
        id: 1,
        title: "Marketing Intern",
        location: "Remote",
        type: "3–6 Months",
        overview: "Own rapid, execution-first marketing initiatives that create demand and distribution.",
        about: "Kuinbee (kuinbee.com) is building a data-on-demand ecosystem where businesses, researchers, and professionals can access, buy, and collaborate on high-quality datasets.",
        responsibilities: [
            "Plan and execute channel strategy across LinkedIn and priority platforms",
            "Create high-conversion content, campaigns, and positioning narratives",
            "Run and iterate growth experiments across organic and paid funnels",
            "Collaborate with sales and data teams to sharpen messaging",
            "Track campaign performance and optimize fast",
        ],
        requirements: [
            "Strong understanding of LinkedIn and digital marketing",
            "Ability to write sharp, conversion-focused copy",
            "Execution-driven mindset with fast iteration",
            "Basic understanding of startups/data industry is a plus",
        ],
        gain: [
            "Real ownership of end-to-end marketing initiatives",
            "Direct exposure to startup growth strategy",
            "High-performer pathway to full-time conversion",
        ],
    },
    {
        id: 3,
        title: "HR Intern",
        location: "Remote",
        type: "3–6 Months",
        overview: "Scale hiring and culture with high ownership and speed.",
        about: "Kuinbee (kuinbee.com) is building a strong execution-driven team across data, sales, and operations.",
        responsibilities: [
            "Manage end-to-end recruitment (sourcing to onboarding)",
            "Build talent pipelines for different roles",
            "Coordinate interviews and candidate communication with urgency and clarity",
            "Work on employer branding initiatives",
            "Support internal team processes and engagement",
        ],
        requirements: [
            "Strong communication and organizational skills",
            "Ability to identify talent beyond resumes",
            "Proactive, execution-driven mindset",
            "Interest in startup hiring and culture building",
        ],
        gain: [
            "Hands-on startup hiring experience",
            "Exposure to scaling teams from scratch",
            "Opportunity for long-term role based on performance",
        ],
    },
    {
        id: 4,
        title: "Sales Intern",
        location: "Remote",
        type: "3–6 Months | Paid + Commission Per Sale",
        overview: "High-intensity revenue role for people who want to sell, close, and earn.",
        about: "Kuinbee (kuinbee.com) is building a data-on-demand ecosystem where businesses can access ready datasets or request custom data solutions.",
        responsibilities: [
            "Prospect and outreach to B2B decision-makers via LinkedIn, email, and cold channels",
            "Generate, qualify, and convert leads into paying customers",
            "Pitch Kuinbee’s datasets and custom data solutions",
            "Close deals independently and manage post-sale relationships",
            "Work closely with founders on sales strategy and feedback loops",
        ],
        requirements: [
            "Strong communication and persuasion skills",
            "High ownership and result-driven mindset",
            "Comfort with cold outreach and follow-ups",
            "Resilience to rejection and consistency in follow-through",
            "Prior sales experience is a plus, not mandatory",
        ],
        compensation: "Fixed stipend (paid) + uncapped commission on every sale closed",
        gain: [
            "Real B2B sales experience with ownership",
            "Direct exposure to revenue building and deal closing",
            "High earning potential through commissions",
            "High-performer pathway to full-time conversion",
        ],
    },
    {
        id: 5,
        title: "Full Stack Developer",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        overview: "Ship reliable product experiences across frontend, backend, and platform systems.",
        about: "Kuinbee is building trustworthy data commerce infrastructure with startup speed and ownership.",
        responsibilities: [
            "Develop and maintain marketplace, community, and analytics features",
            "Ship scalable systems across frontend, backend, and APIs with tight release cycles",
        ],
        requirements: ["2–5 years full-stack experience", "JavaScript/TypeScript, React, Node.js, Python", "SQL/NoSQL databases", "Cloud platforms (AWS/GCP)"],
        jdLink: "https://drive.google.com/drive/folders/1G3cnOK5S2NS67slNsD7Wq75UD0-R9LYW?usp=drive_link"
    },
    {
        id: 6,
        title: "Data Engineer",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        overview: "Design and scale data pipelines, warehousing, and processing infrastructure fast.",
        about: "You’ll build the core data foundation that powers analytics and marketplace reliability at scale.",
        responsibilities: [
            "Design and maintain ETL and ingestion pipelines",
            "Build resilient warehouse and data processing systems",
        ],
        requirements: ["2–4 years of data engineering experience", "SQL, Python, Spark/Hadoop", "AWS/GCP/Azure", "APIs and streaming tools (Kafka/Flink)"],
        jdLink: "https://drive.google.com/drive/folders/1EIy6H52kzf-t_8L_N20sSrYvwHjgLHsq?usp=drive_link"
    },
    {
        id: 7,
        title: "Data Visualization Specialist",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        overview: "Turn complex datasets into decision-ready dashboards and narratives, quickly.",
        about: "You’ll bridge analysis and storytelling so teams can make faster, better decisions.",
        responsibilities: [
            "Build dashboards and BI experiences for internal and external stakeholders",
            "Drive data storytelling that improves execution speed",
        ],
        requirements: ["1–3 years of data visualization/BI experience", "Tableau/Power BI", "Strong design and storytelling sense", "SQL and Python (bonus)"],
        jdLink: "https://drive.google.com/drive/folders/1kEADz9oQG_XAzRDYfCEsxXDyXztBo5xW?usp=drive_link"
    },
    {
        id: 8,
        title: "Data Collection Specialist",
        location: "Pune / Remote",
        type: "Full-time / Contract",
        overview: "Source and structure high-quality datasets with rigorous validation standards.",
        about: "You’ll own data acquisition workflows and quality checks for marketplace-ready assets.",
        responsibilities: [
            "Source, verify, and validate datasets from diverse domains",
            "Prepare structured, analysis-ready datasets for publishing",
        ],
        requirements: ["Strong research and analytical skills", "Excel/Google Sheets and SQL basics", "Web scraping tools (BeautifulSoup, Scrapy, Selenium)", "High attention to data quality and accuracy"],
        jdLink: "https://drive.google.com/drive/folders/1V9KPgH9lwPNtOh4CJuF1FVSa01hjKMdi?usp=drive_link"
    },
    {
        id: 9,
        title: "AI Developer",
        location: "Pune / Remote",
        type: "Full-time",
        overview: "Build and deploy practical ML/AI systems for analytics, forecasting, and automation at speed.",
        about: "You’ll shape applied AI capabilities across structured and unstructured data products with direct product impact.",
        responsibilities: [
            "Develop, evaluate, and productionize ML/AI models",
            "Deliver NLP and predictive analytics use cases end-to-end",
        ],
        requirements: ["2–5 years of ML/AI experience", "Python, TensorFlow/PyTorch, scikit-learn", "NLP and predictive modeling", "Cloud ML tooling (AWS SageMaker, GCP Vertex AI)"],
        jdLink: "https://drive.google.com/drive/folders/1C2Ge50dKvsupTBZNE6QrExIh5YnYEFSz?usp=drive_link"
    }
];

export function CareersPageContent() {
    const [openJobId, setOpenJobId] = useState<number | null>(jobOpenings[0]?.id ?? null);

    const toggleJob = (jobId: number) => {
        setOpenJobId((prev) => (prev === jobId ? null : jobId));
    };

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
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 dark:from-white dark:to-white/60 drop-shadow-[0_0_8px_rgba(26,34,64,0.3)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                        We're Hiring
                                    </span>
                                    <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
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
                                Join a fast-moving team building the governed marketplace where verified data meets real business outcomes.
                                We value ownership over titles and execution over theory.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
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
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 dark:from-white dark:to-white/60 drop-shadow-[0_0_8px_rgba(26,34,64,0.3)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                Open Roles
                            </span>
                            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Open Positions
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Fast pace · High ownership · Remote-first · High performers may get full-time offers.
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
                                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email Your Resume
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="max-w-5xl mx-auto space-y-4 md:space-y-5">
                            {jobOpenings.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-card rounded-2xl border border-border hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6 md:p-8">
                                        <button
                                            type="button"
                                            onClick={() => toggleJob(job.id)}
                                            className="w-full flex items-start justify-between gap-4 text-left"
                                            aria-expanded={openJobId === job.id}
                                        >
                                            <div className="text-left w-full pr-2">
                                                <h3 className="text-xl font-medium text-foreground dark:text-white mb-3">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground dark:text-white/60 mb-4 leading-relaxed">
                                                    {job.overview}
                                                </p>
                                            <div className="flex flex-wrap gap-2">
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

                                            <div className="pt-1 text-muted-foreground dark:text-white/60">
                                                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", openJobId === job.id && "rotate-180")} />
                                            </div>
                                        </button>

                                        <div className={cn("grid transition-all duration-300 ease-in-out", openJobId === job.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                                            <div className="overflow-hidden">
                                                <div className="pt-5 space-y-5">
                                                    <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                                        <span className="font-medium text-foreground dark:text-white">About Kuinbee:</span> {job.about}
                                                    </p>

                                                    <div>
                                                        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-white/40 mb-3">Key Responsibilities</h4>
                                                        <ul className="space-y-1.5">
                                                            {job.responsibilities.map((item, idx) => (
                                                                <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground dark:text-white/60">
                                                                    <div className="w-1.5 h-1.5 bg-primary/60 dark:bg-white/40 rounded-full mt-2 flex-shrink-0" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-white/40 mb-3">What We&apos;re Looking For</h4>
                                                        <ul className="space-y-1.5">
                                                            {job.requirements.map((req, idx) => (
                                                                <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground dark:text-white/60">
                                                                    <div className="w-1.5 h-1.5 bg-primary/60 dark:bg-white/40 rounded-full mt-2 flex-shrink-0" />
                                                                    {req}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {job.compensation ? (
                                                        <p className="text-sm text-muted-foreground dark:text-white/60">
                                                            <span className="font-medium text-foreground dark:text-white">Compensation:</span> {job.compensation}
                                                        </p>
                                                    ) : null}

                                                    {job.gain?.length ? (
                                                        <div>
                                                            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-white/40 mb-3">What You&apos;ll Gain</h4>
                                                            <ul className="space-y-1.5">
                                                                {job.gain.map((item, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground dark:text-white/60">
                                                                        <div className="w-1.5 h-1.5 bg-primary/60 dark:bg-white/40 rounded-full mt-2 flex-shrink-0" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : null}

                                                    <div className="pt-5 border-t border-border/50 flex gap-3">
                                                        {job.jdLink ? (
                                                            <Button asChild variant="outline" className="flex-1 border-border hover:bg-accent text-foreground">
                                                                <a href={job.jdLink} target="_blank" rel="noopener noreferrer">
                                                                    Job Description
                                                                </a>
                                                            </Button>
                                                        ) : null}
                                                        <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                                                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com" target="_blank" rel="noopener noreferrer">
                                                                Apply Now
                                                                <ArrowRight className="w-4 h-4 ml-1.5" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
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
