"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, MessageSquare, HelpCircle, Users } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingHeader, LandingFooter } from "@/features/landing";

const contactOptions = [
    {
        icon: Mail,
        title: "Email Support",
        description: "Send us a detailed message about your inquiry or issue",
        responseTime: "Response within 24 hours",
        action: "Send Email",
        href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com",
        external: true,
    },
    {
        icon: Phone,
        title: "Phone Support",
        description: "Speak directly with our support team",
        responseTime: "+44 7825600683 • +91 7796137098",
        action: "Call Us",
        href: "tel:+447825600683",
        external: false,
    },
];

const faqs = [
    {
        question: "How does Kuinbee ensure data security and accuracy?",
        answer: "Kuinbee follows strict protocols to guarantee data security and integrity. All datasets undergo verification, structured validation, and compliance checks before publication. Our platform uses encryption, role-based access controls, and continuous monitoring to ensure your data remains secure and reliable.",
    },
    {
        question: "Can businesses request private or industry-specific data?",
        answer: "Yes. Kuinbee allows businesses, researchers, and enterprises to request private, industry-specific, or custom datasets. Our team sources, structures, and delivers exactly what you need for informed decision-making, while ensuring compliance with all relevant security and regulatory standards.",
    },
    {
        question: "What payment methods does Kuinbee support?",
        answer: "Kuinbee supports multiple payment options, including credit/debit cards, UPI, bank transfers, and digital wallets. For enterprises and large-scale data projects, we also offer invoicing and subscription-based billing options tailored to your needs.",
    },
    {
        question: "How can I collaborate or partner with Kuinbee?",
        answer: "Kuinbee actively collaborates with data suppliers, researchers, freelancers, enterprises, and institutions. You can partner with us to provide datasets, sell your analytics, or co-develop projects. Simply reach out through our contact options to explore partnership opportunities.",
    },
];

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50">
                <LandingHeader />
            </div>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative pt-16 pb-16 overflow-hidden">
                <InstitutionalBackground />

                {/* Bottom gradient blend */}
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
                                            Support Available
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
                                Contact & Support
                                <br />
                                <span className="text-primary/70 dark:text-white/80">We&apos;re Here to Help</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="mt-4 md:mt-6 text-center mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0"
                            >
                                Are you a data supplier? Reach out to partner or list your datasets. For all other support, 
                                questions, or technical assistance, we&apos;re here to help.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Contact Options ─────────────────────────────────────── */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                {/* Background */}
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
                            <MessageSquare className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">Get in Touch</span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            How Can We Help?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Choose the best way to reach us for inquiries, technical support, or partnership opportunities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contactOptions.map((option, index) => (
                            <motion.div
                                key={option.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl border border-border hover:border-primary/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
                            >
                                <div className="p-8 flex flex-col h-full">
                                    <div className="w-14 h-14 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <option.icon className="w-7 h-7 text-primary dark:text-white" />
                                    </div>
                                    <h3 className="text-xl font-medium text-foreground dark:text-white mb-3">{option.title}</h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/60 mb-5 leading-relaxed">
                                        {option.description}
                                    </p>
                                    <div className="mb-6 px-3 py-2 rounded-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 w-fit">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-white/70">
                                            <Clock className="w-3 h-3" />
                                            {option.responseTime}
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <Button 
                                            asChild 
                                            className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                                        >
                                            {option.external ? (
                                                <a href={option.href} target="_blank" rel="noopener noreferrer">
                                                    {option.action}
                                                </a>
                                            ) : (
                                                <a href={option.href}>
                                                    {option.action}
                                                </a>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── FAQ Section ─────────────────────────────────────────── */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
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
                            <HelpCircle className="h-4 w-4 text-primary dark:text-white" />
                            <span className="text-sm font-medium text-primary dark:text-white">Quick Answers</span>
                        </div>
                        <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
                            Frequently Asked Questions
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground dark:text-white/60">
                            Find answers to commonly asked questions about Kuinbee&apos;s platform and services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-lg hover:border-primary/40 dark:hover:border-white/20 transition-all duration-300"
                            >
                                <h3 className="text-base font-medium text-foreground dark:text-white mb-3 leading-relaxed">
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
            </section>

            {/* ── CTA Section ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-16 md:py-24">
                <InstitutionalBackground />

                {/* Top gradient blend */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background dark:from-[#0a0f1e] to-transparent z-[1]" />

                <div className="relative mx-auto max-w-4xl px-6 text-center z-20">
                    <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white md:text-4xl">
                        Still Have Questions?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground dark:text-white/60">
                        Our team is always ready to help. Whether you&apos;re a data supplier looking to partner or 
                        a user needing technical support, we&apos;re here for you.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                        >
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com" target="_blank" rel="noopener noreferrer">
                                <Mail className="w-5 h-5 mr-2" />
                                Contact Support
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm px-8"
                        >
                            <a href="/careers">
                                <Users className="w-5 h-5 mr-2" />
                                Join Our Team
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
