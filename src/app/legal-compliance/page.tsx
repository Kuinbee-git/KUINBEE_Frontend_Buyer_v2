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
  Building2,
  Users,
  BookOpen,
  Lock,
  Scale,
  Globe,
  ChevronRight,
  CreditCard,
  Zap,
  Eye,
  Download,
  Server,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  number: number;
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

// ─── Sections metadata ────────────────────────────────────────────────────────
const sections = [
  { id: "s1", title: "Marketplace Intermediary Status", group: "Structure" },
  { id: "s2", title: "Data Protection & Privacy Framework", group: "Privacy" },
  { id: "s3", title: "Data Processing Addendum (DPA)", group: "Privacy" },
  { id: "s4", title: "Data Credibility Check (DCC)", group: "Operations" },
  { id: "s5", title: "Responsible AI & Ethical Use", group: "Ethics" },
  { id: "s6", title: "Export Control & Sanctions", group: "Compliance" },
  { id: "s7", title: "IP Protection & Takedown Policy", group: "IP" },
  { id: "s8", title: "Security & Infrastructure", group: "Security" },
  { id: "s9", title: "Breach Notification Framework", group: "Security" },
  { id: "s10", title: "Payment, AML & Fraud Compliance", group: "Financial" },
  { id: "s11", title: "Regulatory Cooperation", group: "Compliance" },
  { id: "s12", title: "Risk Allocation Framework", group: "Compliance" },
  { id: "s13", title: "Limitation of Liability", group: "Legal" },
  { id: "s14", title: "Survival of Obligations", group: "Legal" },
  { id: "s15", title: "Governing Law", group: "Legal" },
  { id: "s16", title: "Modifications", group: "General" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LegalCompliancePage() {
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
                <span className="text-sm font-semibold text-primary">Trust, Legal & Regulatory Framework</span>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground dark:text-white leading-[1.1] tracking-tight">
                Legalities &{" "}
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
              className="max-w-2xl mx-auto"
            >
              <p className="text-lg md:text-xl text-muted-foreground dark:text-white/70 leading-relaxed font-light">
                Kuinbee's legal position, regulatory posture, risk allocation architecture, and compliance standards — built for enterprise trust at global scale.
              </p>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
            >
              {[
                { Icon: Calendar, label: "Last Updated", value: "March 2026" },
                { Icon: Scale, label: "Framework Type", value: "Compliance Document" },
                { Icon: Globe, label: "Jurisdiction", value: "India (Pune, MH)" },
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

            {/* Desktop Sidebar TOC */}
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
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${isActive
                          ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm"
                          : "text-muted-foreground dark:text-white/60 hover:bg-muted/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                          }`}
                      >
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
                        Compliance Framework Overview
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full uppercase">Important</span>
                    </div>
                    <div className="space-y-3 text-sm md:text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                      <p>
                        Kuinbee Information Services Private Limited operates a technology-enabled global data marketplace and AI data infrastructure platform via kuinbee.com. This framework explains Kuinbee's legal position, regulatory posture, risk allocation architecture, and compliance standards.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {[
                          "Protects Kuinbee legally",
                          "Infrastructure-grade positioning",
                          "Reduces regulatory exposure",
                          "Increases enterprise trust",
                          "Supports global expansion",
                          "Investor-ready compliance",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2 p-2 bg-background/60 dark:bg-white/5 rounded-lg border border-border dark:border-white/10">
                            <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="text-xs font-medium text-foreground dark:text-white">{item}</span>
                          </div>
                        ))}
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
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white font-medium truncate transition-colors">
                        {section.title}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* ── Sections ── */}
              <div className="space-y-6">

                <SectionCard id="s1" number={1} title="Marketplace Intermediary Status" badge="Structure" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <p>Kuinbee operates as a <strong className="text-foreground dark:text-white">technology intermediary and marketplace facilitator</strong>. Kuinbee does not create, generate, or independently determine the purpose or means of processing of third-party Datasets listed by Suppliers.</p>
                  <p>Suppliers act as independent data controllers or data providers (as applicable under relevant law) for the Datasets they upload. Buyers act as independent data controllers or processors for downstream usage.</p>
                  <p className="font-medium text-foreground dark:text-white">Kuinbee does not assume liability for:</p>
                  <BulletList items={[
                    "The accuracy of third-party datasets",
                    "The legality of Supplier data collection",
                    "Buyer's downstream processing decisions",
                  ]} />
                </SectionCard>

                <SectionCard id="s2" number={2} title="Data Protection & Privacy Framework" badge="Privacy" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <p className="font-medium text-foreground dark:text-white">Applicable Regulatory Coverage</p>
                  <p>Kuinbee is structured to operate in alignment with applicable data protection and privacy laws including, where relevant:</p>
                  <BulletList items={[
                    "Digital Personal Data Protection Act, India (DPDP)",
                    "General Data Protection Regulation (GDPR)",
                    "California Consumer Privacy Act (CCPA/CPRA)",
                    "HIPAA (if healthcare-related data is involved)",
                    "Sector-specific financial, telecom, or regulatory frameworks",
                    "Cross-border data transfer laws",
                  ]} />
                  <p className="font-medium text-foreground dark:text-white mt-2">Role Classification</p>
                  <div className="grid md:grid-cols-3 gap-3 mt-2">
                    {[
                      { role: "As Data Controller", items: ["Platform user accounts", "Payment & billing data", "Internal analytics", "Corporate operations"] },
                      { role: "As Data Processor", items: ["Where Kuinbee processes data on behalf of users within its SaaS infrastructure"] },
                      { role: "Not a Controller", items: ["For third-party datasets uploaded by Suppliers", "Supplier determines lawful basis", "Buyer determines downstream purpose"] },
                    ].map(({ role, items }) => (
                      <div key={role} className="p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                        <p className="text-xs font-bold text-foreground dark:text-white mb-2">{role}</p>
                        {items.map((item, i) => (
                          <p key={i} className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">{item}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard id="s3" number={3} title="Data Processing Addendum (DPA)" badge="Privacy" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <p>Kuinbee maintains a Data Processing Addendum framework covering:</p>
                  <BulletList items={[
                    "Standard Contractual Clauses (SCCs)",
                    "Cross-border transfer mechanisms",
                    "Sub-processor oversight",
                    "Security safeguards",
                    "Breach notification standards",
                    "Data subject rights coordination",
                  ]} />
                  <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white">
                    Enterprise customers may request a DPA by contacting{" "}
                    <a href="mailto:legal@kuinbee.com" className="text-primary hover:underline">legal@kuinbee.com</a>.
                  </p>
                </SectionCard>

                <SectionCard id="s4" number={4} title="Data Credibility Check (DCC) Framework" badge="Operations" badgeColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <p>Kuinbee conducts an internal Data Credibility Check (DCC) process to assess:</p>
                  <BulletList items={[
                    "Technical structure and format quality",
                    "Metadata completeness",
                    "Source traceability",
                    "Licensing consistency",
                    "Internal quality benchmarks",
                  ]} />
                  <p className="mt-2 font-medium text-foreground dark:text-white">DCC and KDTS do not constitute:</p>
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
                    ⚠️ Certification · Legal validation · Accuracy guarantee · Regulatory approval · Commercial assurance. <strong>They are internal screening mechanisms only.</strong>
                  </div>
                </SectionCard>

                <SectionCard id="s5" number={5} title="Responsible AI & Ethical Use Policy" badge="Ethics" badgeColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <p className="font-medium text-foreground dark:text-white">Kuinbee prohibits use of Datasets for:</p>
                  <BulletList items={[
                    "Unlawful surveillance",
                    "Discriminatory profiling",
                    "Human rights violations",
                    "Biometric misuse without lawful authority",
                    "Malicious AI deployment",
                    "Autonomous weaponization",
                    "Social scoring systems prohibited by law",
                  ]} />
                  <p className="font-medium text-foreground dark:text-white mt-2">Buyers using Datasets for AI training must:</p>
                  <BulletList items={[
                    "Ensure lawful basis for training data",
                    "Implement bias mitigation controls",
                    "Maintain auditability of AI outputs",
                    "Comply with applicable AI governance regulations",
                  ]} />
                  <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm">
                    Kuinbee reserves the right to <strong className="text-foreground dark:text-white">suspend users</strong> engaged in harmful AI use.
                  </p>
                </SectionCard>

                <SectionCard id="s6" number={6} title="Export Control & Sanctions Compliance" badge="Compliance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  <p>Users must comply with:</p>
                  <BulletList items={[
                    "International sanctions laws",
                    "Export control regulations",
                    "Trade restriction regimes",
                  ]} />
                  <p className="mt-2">Kuinbee may restrict access to certain jurisdictions. Users represent they are not sanctioned entities, listed under prohibited trade lists, or acting on behalf of restricted parties.</p>
                </SectionCard>

                <SectionCard id="s7" number={7} title="Intellectual Property Protection & Takedown Policy" badge="IP" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <p>Kuinbee respects intellectual property rights. If a party believes a Dataset infringes IP rights, a formal takedown notice may be submitted.</p>
                  <p className="font-medium text-foreground dark:text-white">Upon receiving a credible notice, Kuinbee may:</p>
                  <BulletList items={[
                    "Suspend the listing pending investigation",
                    "Investigate the claim",
                    "Request supporting documentation",
                    "Permanently delist content",
                  ]} />
                  <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white">
                    Repeat infringers may be permanently banned from the Platform.
                  </p>
                </SectionCard>

                <SectionCard id="s8" number={8} title="Security & Infrastructure Safeguards" badge="Security" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                  <p>Kuinbee implements commercially reasonable security measures including:</p>
                  <BulletList items={[
                    "Encrypted data transmission (TLS/HTTPS)",
                    "Access control protocols",
                    "Role-based permissions",
                    "Secure cloud infrastructure",
                    "Continuous monitoring",
                    "Incident response planning",
                    "Internal audit mechanisms",
                  ]} />
                  <p className="mt-2">Security measures are reviewed periodically and updated to align with industry standards.</p>
                </SectionCard>

                <SectionCard id="s9" number={9} title="Breach Notification Framework" badge="Security" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                  <p className="font-medium text-foreground dark:text-white">In case of a security incident affecting Platform-controlled data, Kuinbee will:</p>
                  <BulletList items={[
                    "Investigate promptly",
                    "Notify affected users as required by applicable law",
                    "Coordinate mitigation steps",
                  ]} />
                  <p className="font-medium text-foreground dark:text-white mt-2">Suppliers must notify Kuinbee within <strong>48 hours</strong> of:</p>
                  <BulletList items={[
                    "Any dataset-related data breach",
                    "Regulatory investigation initiated against a listed Dataset",
                    "Legal challenge or notice involving a Dataset",
                  ]} />
                </SectionCard>

                <SectionCard id="s10" number={10} title="Payment, AML & Fraud Compliance" badge="Financial" badgeColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <p>Kuinbee implements fraud monitoring systems. Kuinbee may:</p>
                  <BulletList items={[
                    "Withhold payouts pending investigation",
                    "Suspend accounts suspected of fraud",
                    "Reverse transactions where fraud is detected",
                    "Report suspicious activity to relevant authorities",
                  ]} />
                  <p className="mt-2">Users are responsible for their own tax compliance including GST, VAT, or other applicable taxes. Kuinbee does not act as a tax agent for any user.</p>
                </SectionCard>

                <SectionCard id="s11" number={11} title="Regulatory Cooperation" badge="Compliance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  <p>Kuinbee reserves the right to:</p>
                  <BulletList items={[
                    "Cooperate with lawful government requests and subpoenas",
                    "Provide information when legally required",
                    "Suspend or remove content posing regulatory risk",
                  ]} />
                </SectionCard>

                <SectionCard id="s12" number={12} title="Risk Allocation Framework" badge="Compliance" badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Supplier Responsibility",
                        color: "border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10",
                        titleColor: "text-red-700 dark:text-red-400",
                        items: ["Dataset legality", "Lawful collection", "Consent validity", "IP clearance", "Regulatory compliance", "Refund liability"],
                      },
                      {
                        title: "Buyer Responsibility",
                        color: "border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/10",
                        titleColor: "text-blue-700 dark:text-blue-400",
                        items: ["Downstream use compliance", "Regulatory obligations", "AI deployment decisions", "Commercial decisions", "Integration risks"],
                      },
                      {
                        title: "Kuinbee Responsibility",
                        color: "border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/10",
                        titleColor: "text-green-700 dark:text-green-400",
                        items: ["Operating marketplace infrastructure", "Conducting internal screening", "Facilitating transactions"],
                      },
                    ].map(({ title, color, titleColor, items }) => (
                      <div key={title} className={`p-4 rounded-xl border ${color}`}>
                        <p className={`text-sm font-bold mb-3 ${titleColor}`}>{title}</p>
                        {items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-current opacity-70 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-muted-foreground dark:text-white/70">{item}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard id="s13" number={13} title="Limitation of Liability" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                  <p>To the maximum extent permitted by law, Kuinbee shall not be liable for:</p>
                  <BulletList items={[
                    "Dataset inaccuracies from third-party Suppliers",
                    "Commercial losses or lost profits",
                    "Regulatory penalties arising from user non-compliance",
                    "Indirect or consequential damages",
                    "Buyer–Supplier disputes",
                  ]} />
                  <p className="mt-2">Aggregate liability is limited as stated in the Terms & Conditions.</p>
                </SectionCard>

                <SectionCard id="s14" number={14} title="Survival of Obligations" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                  <p>The following obligations survive termination of any agreement with Kuinbee:</p>
                  <BulletList items={[
                    "Indemnity obligations",
                    "Refund liability",
                    "IP ownership rights",
                    "Confidentiality obligations",
                    "Financial recovery rights",
                    "Regulatory cooperation clauses",
                  ]} />
                </SectionCard>

                <SectionCard id="s15" number={15} title="Governing Law" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
                  <p>This Legal Framework is governed by the <strong className="text-foreground dark:text-white">laws of India</strong>. Courts at <strong className="text-foreground dark:text-white">Pune, Maharashtra</strong> have exclusive jurisdiction unless otherwise agreed in writing.</p>
                </SectionCard>

                <SectionCard id="s16" number={16} title="Modifications" badge="General" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <p>Kuinbee may update this Legalities & Compliance Framework periodically. Continued use of the Platform constitutes acceptance of revisions.</p>
                </SectionCard>

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
                      Questions About Our Compliance Framework?
                    </h3>
                    <p className="text-muted-foreground dark:text-white/70 leading-relaxed mb-5 text-sm md:text-base">
                      Enterprise DPA requests, regulatory queries, IP takedown notices, and compliance questions can be directed to:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="mailto:legal@kuinbee.com"
                        className="flex items-center gap-3 px-4 py-2.5 bg-background dark:bg-white/10 rounded-xl border border-border dark:border-white/10 hover:border-primary/40 transition-colors group"
                      >
                        <Mail className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-white/50">Legal</p>
                          <p className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">legal@kuinbee.com</p>
                        </div>
                      </a>
                      <a
                        href="https://kuinbee.com/support"
                        className="flex items-center gap-3 px-4 py-2.5 bg-background dark:bg-white/10 rounded-xl border border-border dark:border-white/10 hover:border-primary/40 transition-colors group"
                      >
                        <Globe className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-white/50">Support</p>
                          <p className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">kuinbee.com/support</p>
                        </div>
                      </a>
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
