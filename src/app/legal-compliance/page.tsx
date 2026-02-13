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
  Shield,
  Building2,
  Users,
  BookOpen,
  Lock,
  Scale,
  CheckCircle2,
  Eye,
  Globe,
  Award,
} from "lucide-react";

export default function LegalCompliancePage() {
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
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  const sections = [
    { id: "governance", title: "Corporate Governance", icon: Building2 },
    { id: "startup", title: "Startup Recognition", icon: Award },
    { id: "licensing", title: "Data Licensing", icon: BookOpen },
    { id: "intellectual", title: "Intellectual Property", icon: Shield },
    { id: "privacy", title: "Data Protection", icon: Lock },
    { id: "labour", title: "Labour Law", icon: Users },
    { id: "policies", title: "Platform Policies", icon: FileText },
    { id: "transparency", title: "Transparency", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-background">
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
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary">Legal Framework</span>
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
                Legal &{" "}
                <span className="font-medium bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Compliance
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
                Comprehensive legal and regulatory compliance framework for Kuinbee Information Services Pvt Ltd's data marketplace operations.
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 dark:text-white/50 leading-relaxed max-w-2xl mx-auto">
                Demonstrating our commitment to operating within all applicable laws while maintaining the highest standards of data governance.
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
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    September 13, 2025
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">
                    Framework Type
                  </p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    Compliance Document
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground/60 dark:text-white/40 font-medium">
                    Jurisdiction
                  </p>
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
              <div className="sticky top-24 space-y-1">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4 px-3">
                    Table of Contents
                  </h3>
                </div>
                <nav className="space-y-1">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                          activeSection === section.id
                            ? "bg-primary/10 dark:bg-primary/20 text-primary"
                            : "text-muted-foreground dark:text-white/60 hover:bg-muted/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium truncate flex-1">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content Column */}
            <div className="space-y-8">
              {/* Overview Section */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent dark:from-primary/10 dark:via-primary/10 dark:to-transparent border border-primary/20 dark:border-primary/30 rounded-2xl shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white mb-4">
                      Compliance Framework Overview
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-muted-foreground dark:text-white/70 leading-relaxed">
                        This document outlines the comprehensive legal and regulatory compliance
                        framework of Kuinbee Information Services Pvt Ltd, demonstrating our
                        commitment to operating within all applicable laws and regulations while
                        maintaining the highest standards of data governance and corporate
                        responsibility.
                      </p>
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
                className="lg:hidden p-6 bg-muted/30 dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm bg-background dark:bg-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 border border-border dark:border-white/10 transition-colors"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 dark:bg-white/10 text-primary dark:text-white/80 text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground dark:text-white/70 truncate">
                        {section.title}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Compliance Content */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Section 1 */}
                <div
                  id="governance"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Compliance</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Corporate Incorporation and Governance
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      Kuinbee Information Services Pvt Ltd was incorporated on 16 July 2025 under
                      the Companies Act, 2013 and is registered with the Registrar of Companies,
                      Pune. As a private company limited by shares, Kuinbee maintains statutory
                      registers, files annual returns and audited statements, and conducts
                      governance in conformity with the requirements of Indian company law.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div
                  id="startup"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Compliance</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Startup Recognition and Regulatory Incentives
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      Kuinbee qualifies for Startup India and DPIIT recognition, being less than
                      ten years from incorporation and operating with a turnover well below the
                      prescribed threshold. Such recognition entitles the company to tax exemptions,
                      procedural relaxations, and access to procurement and funding benefits.
                      Kuinbee intends to leverage these benefits in strict conformity with
                      statutory norms.
                    </p>
                  </div>
                </div>

                {/* Section 3 */}
                <div
                  id="licensing"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Data Licensing and Source Integrity
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      The foundation of Kuinbee's marketplace rests upon the lawful use of
                      datasets. Open data sources, including those licensed under GODL-India,
                      Creative Commons regimes, or public domain frameworks, are lawfully used with
                      appropriate attribution. Restricted datasets from regulators and government
                      bodies are accessed only after obtaining express permissions or licenses.
                      Commercial or subscription datasets are acquired under formal licensing
                      arrangements. Kuinbee does not employ data deemed confidential, exempt under
                      Section 8 of the RTI Act, 2005, or otherwise inaccessible.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div
                  id="intellectual"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Intellectual Property Compliance
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      Kuinbee respects intellectual property rights and safeguards them through
                      proper attribution, avoidance of unauthorized use of trademarks, and execution
                      of contributor agreements ensuring lawful title and originality of datasets.
                      These practices insulate the company and its users from potential infringement
                      claims.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div
                  id="privacy"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Privacy</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Data Protection and Privacy
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      In alignment with the Digital Personal Data Protection Act, 2023 and the
                      Information Technology Act, 2000, Kuinbee ensures that personal data, if
                      processed, is handled lawfully and transparently. Users are granted rights of
                      access, correction, and erasure. Security measures, including encryption,
                      access controls, and breach-notification protocols, are maintained. A
                      Grievance Officer is appointed in compliance with statutory mandates.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div
                  id="labour"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Compliance</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Employment and Labour Law Compliance
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      Kuinbee complies with the Shops and Establishments Act, Maharashtra, and
                      undertakes to adhere to central labour statutes such as the EPF Act and ESI
                      Act upon reaching statutory thresholds. Employment and internship engagements
                      are documented through contracts incorporating confidentiality and IP
                      protection.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div
                  id="policies"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full">Legal</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Contractual and Platform Policies
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      The company maintains a framework of terms of service, privacy policy, and
                      licensing policy governing platform use. These specify permissible uses,
                      restrict redistribution of data, and provide liability disclaimers. Vendor and
                      client arrangements are also governed by formal agreements.
                    </p>
                  </div>
                </div>

                {/* Section 8 */}
                <div
                  id="transparency"
                  className="group scroll-mt-24 relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-white/[0.02] dark:to-white/[0.01] border border-border dark:border-white/10 rounded-2xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Compliance</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                        Transparency and Accountability
                      </h2>
                    </div>
                  </div>
                  <div className="text-muted-foreground dark:text-white/70 leading-relaxed space-y-4 pl-0 md:pl-14">
                    <p>
                      Kuinbee commits to publishing an annual compliance and transparency report,
                      setting out its data sources, licensing permissions, security measures, and
                      grievance statistics. This ensures accountability to regulators, investors,
                      and platform users.
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
                      Questions About Our Compliance Framework?
                    </h3>
                    <p className="text-muted-foreground dark:text-white/70 leading-relaxed mb-6">
                      If you have any questions about our legal and compliance framework, please
                      contact us at:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background dark:bg-white/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-white/50 mb-0.5">
                            Email
                          </p>
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
                          <p className="text-xs text-muted-foreground dark:text-white/50 mb-0.5">
                            Support
                          </p>
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
