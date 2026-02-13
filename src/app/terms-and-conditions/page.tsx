"use client";

import { useState, useEffect } from "react";
import { Link } from "@/components/router/Link";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { motion } from "framer-motion";
import { 
  FileText, 
  AlertCircle, 
  Calendar, 
  Mail, 
  ArrowLeft,
  BookOpen,
  Scale,
  Shield,
  CreditCard,
  Lock,
  FileCheck,
  Users,
  Globe
} from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function TermsAndConditionsPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  const sections = [
    { id: "definitions", title: "Definitions", icon: BookOpen, group: "General" },
    { id: "acceptance", title: "Acceptance and Scope", icon: FileCheck, group: "General" },
    { id: "delivery", title: "Dataset Delivery", icon: Globe, group: "Services" },
    { id: "sourcing", title: "Sourcing and Accuracy", icon: Shield, group: "Services" },
    { id: "license", title: "License & Usage", icon: FileText, group: "Rights" },
    { id: "privacy", title: "Privacy & Data Protection", icon: Lock, group: "Privacy" },
    { id: "compliance", title: "Intermediary Status", icon: Scale, group: "Compliance" },
    { id: "payment", title: "Payment Terms", icon: CreditCard, group: "Financial" },
    { id: "confidentiality", title: "Confidentiality", icon: Lock, group: "Security" },
    { id: "warranties", title: "Warranties", icon: FileCheck, group: "Legal" },
    { id: "liability", title: "Limitation of Liability", icon: Shield, group: "Legal" },
    { id: "termination", title: "Termination", icon: AlertCircle, group: "Legal" },
    { id: "indemnification", title: "Indemnification", icon: Users, group: "Legal" },
    { id: "governing", title: "Governing Law", icon: Scale, group: "Legal" },
    { id: "amendments", title: "Amendments", icon: FileText, group: "General" },
    { id: "miscellaneous", title: "Miscellaneous", icon: FileCheck, group: "General" },
  ];

  const sectionGroups = [
    { name: "General", color: "blue" },
    { name: "Services", color: "green" },
    { name: "Rights", color: "purple" },
    { name: "Privacy", color: "red" },
    { name: "Compliance", color: "yellow" },
    { name: "Financial", color: "emerald" },
    { name: "Security", color: "indigo" },
    { name: "Legal", color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-28 lg:pb-36 overflow-hidden">
        <InstitutionalBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:opacity-85"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(26, 34, 64, 0.5) 0%, rgba(45, 58, 95, 0.35) 35%, rgba(26, 34, 64, 0.2) 55%, transparent 75%)"
                : "radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(71, 85, 105, 0.05) 35%, rgba(51, 65, 85, 0.02) 55%, transparent 75%)",
            }}
          />

          <div
            className="absolute top-1/3 -left-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(78, 90, 126, 0.45) 0%, rgba(45, 58, 95, 0.3) 40%, rgba(36, 47, 82, 0.18) 60%, transparent 80%)"
                : "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, rgba(51, 65, 85, 0.04) 40%, rgba(30, 41, 59, 0.02) 60%, transparent 80%)",
            }}
          />

          <div
            className="absolute top-1/3 -right-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(45, 58, 95, 0.45) 0%, rgba(78, 90, 126, 0.3) 40%, rgba(26, 34, 64, 0.18) 60%, transparent 80%)"
                : "radial-gradient(circle, rgba(100, 116, 139, 0.06) 0%, rgba(71, 85, 105, 0.04) 40%, rgba(51, 65, 85, 0.02) 60%, transparent 80%)",
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
          {/* Back Navigation */}
          <motion.button
            onClick={handleGoBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white transition-colors duration-200 group mb-10 md:mb-12"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center space-y-8 md:space-y-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 rounded-full border border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/5">
                <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary">Legal Information</span>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-foreground dark:text-white leading-[1.1] tracking-tight">
                Terms &{" "}
                <span className="font-medium bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Conditions
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              <p className="text-xl md:text-2xl text-muted-foreground dark:text-white/70 leading-relaxed font-light">
                This Terms and Conditions Agreement governs all sales, deliveries, and use of
                curated datasets provided by Kuinbee Information Services Pvt. Ltd.
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 dark:text-white/50 leading-relaxed max-w-2xl mx-auto">
                Please read these terms carefully before using our services. By accessing or using our platform, you agree to be bound by these terms.
              </p>
            </motion.div>

            {/* Metadata Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-4"
            >
              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">Last Updated</p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">August 27, 2025</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">Document Type</p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">Legal Agreement</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">Jurisdiction</p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">India</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-8 md:py-12 lg:py-16 pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            
            {/* Sticky Table of Contents - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent border border-primary/10 dark:border-primary/20 rounded-xl">
                  <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Table of Contents
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-white/50">
                    {sections.length} sections
                  </p>
                </div>
                
                <div className="bg-background/50 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-3 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative ${
                          isActive
                            ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm"
                            : "text-muted-foreground dark:text-white/60 hover:bg-muted/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSection"
                            className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg"
                            initial={false}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-xs font-bold flex-shrink-0 shadow-sm">
                          {index + 1}
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

            {/* Main Content Column */}
            <div className="space-y-8">
              
          {/* Agreement Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative p-6 md:p-8 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/10 dark:to-transparent border-2 border-primary/30 dark:border-primary/40 rounded-2xl shadow-lg shadow-primary/5 dark:shadow-primary/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="flex items-start gap-4 md:gap-5">
              <div className="flex-shrink-0 mt-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                  <AlertCircle className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                    Agreement Overview
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full uppercase">Important</span>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground dark:text-white/70 leading-relaxed text-sm md:text-base">
                    This Terms and Conditions Agreement ("Agreement") is entered into by and between
                    <span className="font-semibold text-foreground dark:text-white"> Kuinbee Information Services Pvt. Ltd.</span>, a company incorporated under the Companies
                    Act, 2013, having its registered office in India (hereinafter referred to as
                    "Kuinbee", "Company", "We", "Us", or "Our") and the client purchasing datasets
                    (hereinafter referred to as "Client", "You" or "Your").
                  </p>
                  <div className="p-4 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                    <p className="text-muted-foreground dark:text-white/70 leading-relaxed text-sm">
                      <strong className="text-foreground dark:text-white">⚠️ Important:</strong> By placing an order or receiving a dataset, you acknowledge that you have read,
                      understood, and agreed to be bound by this Agreement. This Agreement applies to all
                      current and future orders unless superseded by a new written agreement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Table of Contents */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:hidden p-5 md:p-6 bg-gradient-to-br from-muted/50 to-transparent dark:from-white/5 dark:to-transparent border border-border dark:border-white/10 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Quick Navigation
              </h3>
              <div className="text-xs text-muted-foreground dark:text-white/50 font-medium px-2.5 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
                {sections.length}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm bg-background dark:bg-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 border border-border dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/30 transition-all hover:shadow-sm"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white font-medium block truncate transition-colors">{section.title}</span>
                    <span className="text-[10px] text-muted-foreground/50 dark:text-white/30">{section.group}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Terms Content */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Section 1 */}
            <div id="definitions" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white pt-1">
                    Definitions
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">General</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pl-0 md:pl-16">
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  <strong className="text-foreground dark:text-white font-semibold">1.1 Dataset</strong> – Any virtual collection of structured data curated
                  by Kuinbee, including ready-made or custom datasets, validated, encrypted, and
                  delivered as per this Agreement.
                </p>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  <strong className="text-foreground dark:text-white font-semibold">1.2 Service</strong> – The provision of curated datasets and associated
                  services by Kuinbee.
                </p>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  <strong className="text-foreground dark:text-white font-semibold">1.3 Official Sources</strong> – Publicly accessible data repositories
                  maintained by statutory or regulatory authorities (e.g., data.gov.in), or websites
                  of government/statutory origin.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="acceptance" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white pt-1">
                    Acceptance and Scope
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">General</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pl-0 md:pl-16">
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  By placing an order or receiving a dataset, you acknowledge that you have read,
                  understood, and agreed to be bound by this Agreement.
                </p>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  This Agreement applies to all current and future orders unless superseded by a new
                  written agreement.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div id="delivery" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white pt-1">
                    Dataset Delivery and Customisation
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">Services</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pl-0 md:pl-16">
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  Kuinbee maintains a repository of regularly updated datasets for purchase and
                  download.
                </p>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  On request, Kuinbee may collect, compile, curate, visualize, and deliver bespoke
                  datasets tailored to your specifications, subject to feasibility and commercial
                  agreement.
                </p>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                  Datasets are delivered in standard formats (CSV, JSON, Excel, etc.) via secure
                  digital means, unless otherwise agreed.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="sourcing" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">4</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white pt-1">
                    Sourcing and Accuracy
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">Services</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pl-0 md:pl-16">
                <p>
                  All datasets are derived from publicly available and officially recognized sources
                  or legally permissible empirical data collection.
                </p>
                <p>
                  Kuinbee ensures integrity and accuracy but does not guarantee absolute correctness
                  or completeness.
                </p>
                <p>
                  Kuinbee disclaims representation or affiliation with statutory/regulatory
                  authorities or third-party respondents.
                </p>
                <p>
                  Empirical data may involve estimation or variability; Kuinbee is not liable for
                  decisions based solely on such data.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div id="license" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">5</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white pt-1">
                    License and Usage Restrictions
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">Rights</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pl-0 md:pl-16">
                <p>
                  Upon full payment, you receive a non-exclusive, non-transferable, limited license
                  for internal business, research, or analytical purposes.
                </p>
                <p>
                  Redistribution, resale, sublicensing, or publication without Kuinbee's consent is
                  prohibited.
                </p>
                <p>
                  Re-identifying anonymized data, reverse-engineering, or unlawful usage is strictly
                  prohibited.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div id="privacy" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">6</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Privacy</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    User Privacy and Data Protection
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee does not collect or process personal data without explicit consent.
                </p>
                <p>
                  Personally Identifiable Information (PII) will never be sold, leased, or
                  transferred except where legally mandated.
                </p>
                <p>
                  The website may track anonymized usage metrics for security and analytics.
                </p>
                <p>
                  Industry-standard security protocols are applied.
                </p>
                <p>
                  Any sensitive information shared will be treated as confidential.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div id="compliance" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">7</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Compliance</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Intermediary Status and Compliance
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee operates as a digital platform facilitating lawful interactions and
                  dataset exchanges.
                </p>
                <p>
                  Under Section 79 of the IT Act, 2000, Kuinbee functions as an intermediary and is
                  not liable for third-party data/content.
                </p>
                <p>
                  Kuinbee complies with IT (Intermediary Guidelines & Digital Media Ethics Code)
                  Rules, 2021.
                </p>
                <p>
                  Kuinbee reserves the right to remove unlawful/prohibited content.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div id="payment" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">8</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">Financial</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Payment Terms
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Prices are as agreed at order confirmation.
                </p>
                <p>
                  Custom dataset costs depend on complexity and delivery timelines.
                </p>
                <p>
                  Invoices must be paid within 30 days; delays incur 2% weekly interest.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div id="confidentiality" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">9</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">Security</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Confidentiality and Data Security
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Both parties agree to maintain confidentiality of proprietary information.
                </p>
                <p>
                  Kuinbee encrypts, stores, and transmits datasets securely.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div id="warranties" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">10</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Warranties and Disclaimers
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee warrants that it has lawful rights to compile and distribute datasets.
                </p>
                <p>
                  Datasets are provided "AS IS", with no warranties of merchantability, fitness, or
                  completeness.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div id="liability" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">11</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Limitation of Liability
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee's liability shall not exceed the fees paid for the dataset in question.
                </p>
                <p>
                  Kuinbee is not liable for indirect, incidental, or consequential damages (loss of
                  profit, corruption, disruption, etc.).
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div id="termination" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">12</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Termination
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee may terminate the Agreement if you breach any provision.
                </p>
                <p>
                  Upon termination, you must cease dataset usage and delete all copies.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div id="indemnification" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">13</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Indemnification
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  You agree to indemnify and hold Kuinbee harmless from any claims arising from
                  misuse, breach, or unlawful actions.
                </p>
              </div>
            </div>

            {/* Section 14 */}
            <div id="governing" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">14</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Governing Law and Disputes
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Governed by the laws of India.
                </p>
                <p>
                  Disputes fall under jurisdiction of competent Indian courts.
                </p>
              </div>
            </div>

            {/* Section 15 */}
            <div id="amendments" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">15</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Amendments
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  Kuinbee may amend these Terms at any time.
                </p>
                <p>
                  Continued use of services after changes constitutes acceptance.
                </p>
              </div>
            </div>

            {/* Section 16 */}
            <div id="miscellaneous" className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <span className="text-lg font-bold text-primary">16</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    Miscellaneous
                  </h2>
                </div>
              </div>
              <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                <p>
                  If any clause is unenforceable, the rest remain valid.
                </p>
                <p>
                  No waiver of a breach shall be deemed a waiver of future breaches.
                </p>
                <p>
                  Any changes must be in writing and signed by both parties.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 p-6 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-2xl border border-primary/30 dark:border-primary/40 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed mb-6">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background dark:bg-white/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground dark:text-white/50 mb-0.5">Email</p>
                      <a 
                        href="mailto:legal@kuinbee.com" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        legal@kuinbee.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background dark:bg-white/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground dark:text-white/50 mb-0.5">Support</p>
                      <a 
                        href="https://kuinbee.com/support" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        kuinbee.com/support
                      </a>
                    </div>
                  </div>
                </div>
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
