"use client";

import { useState, useEffect } from "react";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  AlertCircle,
  Calendar,
  ArrowLeft,
  BookOpen,
  Scale,
  Shield,
  CreditCard,
  Lock,
  FileCheck,
  Users,
  Globe,
  Store,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "customer" | "supplier";

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  group: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const customerSections: Section[] = [
  { id: "c-nature", title: "Nature of the Platform", icon: Globe, group: "Overview" },
  { id: "c-definitions", title: "Definitions", icon: BookOpen, group: "Overview" },
  { id: "c-account", title: "Account Registration", icon: Users, group: "Account" },
  { id: "c-marketplace", title: "Marketplace Terms", icon: Store, group: "Marketplace" },
  { id: "c-license", title: "License Grant", icon: FileCheck, group: "Buyer Rights" },
  { id: "c-permitted", title: "Permitted Use", icon: Shield, group: "Buyer Rights" },
  { id: "c-prohibited", title: "Prohibited Use", icon: AlertCircle, group: "Buyer Rights" },
  { id: "c-responsibility", title: "Buyer Responsibility", icon: FileText, group: "Buyer Rights" },
  { id: "c-refund", title: "Refund Policy", icon: CreditCard, group: "Financial" },
  { id: "c-ip", title: "Intellectual Property", icon: Lock, group: "Legal" },
  { id: "c-disclaimer", title: "Disclaimer of Warranties", icon: Shield, group: "Legal" },
  { id: "c-liability", title: "Limitation of Liability", icon: Scale, group: "Legal" },
  { id: "c-indemnification", title: "Indemnification", icon: Users, group: "Legal" },
  { id: "c-dataprotection", title: "Data Protection", icon: Lock, group: "Legal" },
  { id: "c-termination", title: "Termination", icon: AlertCircle, group: "Legal" },
  { id: "c-governing", title: "Governing Law", icon: Scale, group: "Legal" },
  { id: "c-modifications", title: "Modifications", icon: FileText, group: "General" },
];

const supplierSections: Section[] = [
  { id: "s-nature", title: "Nature of the Platform", icon: Globe, group: "Overview" },
  { id: "s-definitions", title: "Definitions", icon: BookOpen, group: "Overview" },
  { id: "s-account", title: "Account Registration", icon: Users, group: "Account" },
  { id: "s-marketplace", title: "Marketplace Terms", icon: Store, group: "Marketplace" },
  { id: "s-ownership", title: "Ownership & License to Kuinbee", icon: FileCheck, group: "Supplier Rights" },
  { id: "s-warranties", title: "Representations & Warranties", icon: Shield, group: "Supplier Rights" },
  { id: "s-compliance", title: "Compliance & Documentation", icon: FileText, group: "Supplier Rights" },
  { id: "s-financial", title: "Refund & Financial Liability", icon: CreditCard, group: "Financial" },
  { id: "s-ip", title: "Intellectual Property", icon: Lock, group: "Legal" },
  { id: "s-disclaimer", title: "Disclaimer of Warranties", icon: Shield, group: "Legal" },
  { id: "s-liability", title: "Limitation of Liability", icon: Scale, group: "Legal" },
  { id: "s-indemnification", title: "Indemnification", icon: Users, group: "Legal" },
  { id: "s-dataprotection", title: "Data Protection", icon: Lock, group: "Legal" },
  { id: "s-termination", title: "Termination", icon: AlertCircle, group: "Legal" },
  { id: "s-governing", title: "Governing Law", icon: Scale, group: "Legal" },
  { id: "s-modifications", title: "Modifications", icon: FileText, group: "General" },
];

// ─── Reusable Section Card ────────────────────────────────────────────────────
function SectionCard({
  id,
  number,
  title,
  badge,
  badgeColor,
  children,
}: {
  id: string;
  number: string | number;
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

// ─── Sidebar TOC ──────────────────────────────────────────────────────────────
function SidebarTOC({
  sections,
  activeSection,
  scrollToSection,
}: {
  sections: Section[];
  activeSection: string | null;
  scrollToSection: (id: string) => void;
}) {
  return (
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
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative ${isActive
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
  );
}

// ─── Customer Content ─────────────────────────────────────────────────────────
function CustomerContent() {
  return (
    <div className="space-y-6">
      <SectionCard id="c-nature" number={1} title="Nature of the Platform" badge="Overview" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <p>Kuinbee operates as a data marketplace intermediary facilitating the discovery, evaluation, licensing, and controlled commercialization of datasets supplied by independent third-party suppliers.</p>
        <p>Kuinbee does not create, own, generate, independently audit, or certify third-party datasets unless expressly stated.</p>
        <p className="font-medium text-foreground dark:text-white">Kuinbee provides:</p>
        <BulletList items={[
          "Supplier onboarding and verification",
          "Administrative and technical screening",
          "Data Credibility Check (DCC)",
          "Kuinbee Dataset Test Score (KDTS)",
          "Marketplace listing & payment facilitation",
          "Licensing infrastructure",
        ]} />
        <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm">
          Kuinbee acts solely as a <strong className="text-foreground dark:text-white">technology intermediary and marketplace facilitator</strong>.
        </p>
      </SectionCard>

      <SectionCard id="c-definitions" number={2} title="Definitions" badge="Overview" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <BulletList items={[
          '"Dataset" – Structured or unstructured data, databases, compilations, metadata, documentation, or related materials listed on the Platform.',
          '"Supplier" – Any entity or individual listing Datasets on the Platform.',
          '"Buyer" – Any entity or individual purchasing or licensing Datasets.',
          '"DCC" – Kuinbee\'s internal technical and compliance screening framework.',
          '"KDTS" – The internal rating assigned following DCC evaluation.',
        ]} />
      </SectionCard>

      <SectionCard id="c-account" number={3} title="Account Registration" badge="Account" badgeColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
        <p>Users must provide accurate and complete information during registration. You are responsible for maintaining confidentiality of your login credentials.</p>
        <p className="font-medium text-foreground dark:text-white mt-2">Kuinbee may suspend or terminate accounts for:</p>
        <BulletList items={[
          "False or misleading information",
          "Regulatory risk",
          "Fraudulent activity",
          "Breach of these Terms",
        ]} />
      </SectionCard>

      <SectionCard id="c-marketplace" number={4} title="Marketplace Terms" badge="Marketplace" badgeColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
        <p>All Datasets are listed by independent Suppliers. Kuinbee performs screening through DCC and assigns KDTS; however:</p>
        <p className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
          ⚠️ DCC and KDTS do <strong>not</strong> constitute certification, warranty, guarantee, or validation of dataset accuracy, legality, or fitness.
        </p>
        <p>Final pricing of Datasets is determined by Suppliers. Kuinbee may approve, reject, suspend, or delist any Dataset at its sole discretion.</p>
      </SectionCard>

      <SectionCard id="c-license" number={5} title="License Grant" badge="Buyer Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Upon purchase, Buyers receive a <strong className="text-foreground dark:text-white">limited, non-exclusive, non-transferable, revocable license</strong> to use the Dataset in accordance with:</p>
        <BulletList items={[
          "The license scope selected at checkout",
          "Listing-specific terms set by the Supplier",
          "Applicable laws and regulations",
          "These Terms and Conditions",
        ]} />
        <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white">
          Datasets are licensed, not sold.
        </p>
      </SectionCard>

      <SectionCard id="c-permitted" number={6} title="Permitted Use" badge="Buyer Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Buyers may use Datasets only as permitted under the selected license, including:</p>
        <BulletList items={[
          "Internal business use",
          "Research and analysis",
          "Analytics and reporting",
          "AI training where expressly permitted by the Supplier",
        ]} />
      </SectionCard>

      <SectionCard id="c-prohibited" number={7} title="Prohibited Use" badge="Buyer Rights" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
        <p>Buyers shall not:</p>
        <BulletList items={[
          "Resell or redistribute Datasets unless explicitly permitted",
          "Share raw datasets publicly",
          "Remove ownership or attribution notices",
          "Use Datasets for unlawful purposes",
          "Use Datasets for discriminatory profiling",
          "Misrepresent the source of a Dataset",
          "Reverse engineer proprietary structures",
        ]} />
      </SectionCard>

      <SectionCard id="c-responsibility" number={8} title="Buyer Responsibility" badge="Buyer Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Buyers acknowledge and agree that:</p>
        <BulletList items={[
          "Reliance on any Dataset is at their own risk",
          "Independent validation of Datasets is required before use in production",
          "Regulatory compliance arising from Dataset usage is the Buyer's sole responsibility",
        ]} />
      </SectionCard>

      <SectionCard id="c-refund" number={9} title="Refund Policy" badge="Financial" badgeColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
        <p>Refund requests must be raised within <strong className="text-foreground dark:text-white">30 days of purchase</strong>.</p>
        <p>Kuinbee may, at its sole discretion:</p>
        <BulletList items={[
          "Investigate complaints and seek Supplier clarification",
          "Grant a full refund, partial refund, or platform credit",
          "Reject unsubstantiated claims",
        ]} />
      </SectionCard>

      <SectionCard id="c-ip" number={10} title="Intellectual Property" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Dataset intellectual property remains with the Supplier. Platform IP, DCC methodology, KDTS framework, software, and infrastructure remain exclusively owned by Kuinbee.</p>
      </SectionCard>

      <SectionCard id="c-disclaimer" number={11} title="Disclaimer of Warranties" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>The Platform and all Datasets are provided <strong className="text-foreground dark:text-white">"as is"</strong> and <strong className="text-foreground dark:text-white">"as available"</strong>.</p>
        <p>Kuinbee expressly disclaims all warranties, including warranties of:</p>
        <BulletList items={[
          "Accuracy and completeness",
          "Timeliness and freshness",
          "Fitness for a particular purpose",
          "Merchantability",
          "Regulatory suitability",
          "Commercial outcomes",
        ]} />
      </SectionCard>

      <SectionCard id="c-liability" number={12} title="Limitation of Liability" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>To the maximum extent permitted by law, Kuinbee shall not be liable for:</p>
        <BulletList items={[
          "Indirect or consequential damages",
          "Business losses or lost profits",
          "Regulatory penalties",
          "Data inaccuracies from third-party Suppliers",
          "Buyer–Supplier disputes",
        ]} />
        <p className="mt-2">Aggregate liability shall not exceed the <strong className="text-foreground dark:text-white">lesser of</strong> the amount paid for the relevant Dataset or the total commission earned by Kuinbee from that transaction.</p>
      </SectionCard>

      <SectionCard id="c-indemnification" number={13} title="Indemnification" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Buyers agree to indemnify and hold harmless Kuinbee from claims arising from:</p>
        <BulletList items={[
          "Misuse of Datasets",
          "Regulatory violations",
          "Intellectual property infringement",
          "Privacy violations",
          "Legal non-compliance",
        ]} />
      </SectionCard>

      <SectionCard id="c-dataprotection" number={14} title="Data Protection & Legal Compliance" badge="Legal" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
        <p>Buyers must comply with applicable data protection laws including, where applicable:</p>
        <BulletList items={[
          "Digital Personal Data Protection Act (India)",
          "General Data Protection Regulation (GDPR)",
          "HIPAA (if health data is involved)",
          "Sector-specific regulations",
        ]} />
        <p className="mt-2">Kuinbee does not act as data controller for third-party dataset content.</p>
      </SectionCard>

      <SectionCard id="c-termination" number={15} title="Termination" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Kuinbee may suspend or terminate your access if:</p>
        <BulletList items={[
          "These Terms are breached",
          "Fraud or illegal activity is detected",
          "Regulatory risk arises",
        ]} />
        <p>Existing licenses may survive termination as applicable.</p>
      </SectionCard>

      <SectionCard id="c-governing" number={16} title="Governing Law & Jurisdiction" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>These Terms are governed by the <strong className="text-foreground dark:text-white">laws of India</strong>. Courts at <strong className="text-foreground dark:text-white">Pune, Maharashtra</strong> shall have exclusive jurisdiction.</p>
      </SectionCard>

      <SectionCard id="c-modifications" number={17} title="Modifications" badge="General" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <p>Kuinbee may modify these Terms at any time. Continued use of the Platform constitutes acceptance of the updated Terms.</p>
        <p>Additional clauses — Force Majeure, Severability, Waiver, and Electronic Communications — apply and are incorporated herein by reference.</p>
      </SectionCard>
    </div>
  );
}

// ─── Supplier Content ─────────────────────────────────────────────────────────
function SupplierContent() {
  return (
    <div className="space-y-6">
      <SectionCard id="s-nature" number={1} title="Nature of the Platform" badge="Overview" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <p>Kuinbee operates as a data marketplace intermediary facilitating the discovery, evaluation, licensing, and controlled commercialization of datasets supplied by independent third-party suppliers.</p>
        <p>Kuinbee acts solely as a <strong className="text-foreground dark:text-white">technology intermediary and marketplace facilitator</strong> — it does not create, own, independently audit, or certify Supplier datasets unless expressly stated.</p>
        <p className="font-medium text-foreground dark:text-white">Kuinbee provides Suppliers with:</p>
        <BulletList items={[
          "Onboarding and verification support",
          "Administrative and technical screening (DCC)",
          "Kuinbee Dataset Test Score (KDTS)",
          "Marketplace listing and discoverability",
          "Payment facilitation and licensing infrastructure",
        ]} />
      </SectionCard>

      <SectionCard id="s-definitions" number={2} title="Definitions" badge="Overview" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <BulletList items={[
          '"Dataset" – Structured or unstructured data, databases, compilations, metadata, documentation, or related materials listed on the Platform.',
          '"Supplier" – Any entity or individual listing Datasets on the Platform.',
          '"Buyer" – Any entity or individual purchasing or licensing Datasets.',
          '"DCC" – Kuinbee\'s internal technical and compliance screening framework.',
          '"KDTS" – The internal rating assigned following DCC evaluation.',
        ]} />
      </SectionCard>

      <SectionCard id="s-account" number={3} title="Account Registration" badge="Account" badgeColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
        <p>Suppliers must provide accurate and complete information during onboarding. You are responsible for maintaining confidentiality of your credentials.</p>
        <p className="font-medium text-foreground dark:text-white mt-2">Kuinbee may suspend or terminate Supplier accounts for:</p>
        <BulletList items={[
          "False or misleading information",
          "Regulatory risk or non-compliance",
          "Fraudulent activity",
          "Breach of these Terms",
        ]} />
      </SectionCard>

      <SectionCard id="s-marketplace" number={4} title="Marketplace Terms" badge="Marketplace" badgeColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
        <p>Suppliers set the final pricing of their Datasets. Kuinbee performs screening through DCC and assigns KDTS; however:</p>
        <p className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
          ⚠️ DCC and KDTS do <strong>not</strong> constitute certification, warranty, or validation of dataset accuracy, legality, or fitness.
        </p>
        <p>Kuinbee may approve, reject, suspend, or delist any Dataset at its sole discretion.</p>
      </SectionCard>

      <SectionCard id="s-ownership" number={5} title="Ownership & License to Kuinbee" badge="Supplier Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Suppliers retain <strong className="text-foreground dark:text-white">full intellectual property ownership</strong> of their Datasets.</p>
        <p>By listing on the Platform, Suppliers grant Kuinbee a <strong className="text-foreground dark:text-white">limited, non-exclusive, revocable license</strong> to:</p>
        <BulletList items={[
          "Host and catalogue the Dataset",
          "Review for compliance screening (DCC/KDTS)",
          "Market and promote to potential Buyers",
          "Facilitate licensing transactions",
        ]} />
      </SectionCard>

      <SectionCard id="s-warranties" number={6} title="Representations & Warranties" badge="Supplier Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Suppliers represent and warrant that:</p>
        <BulletList items={[
          "They have full authority to license the Dataset",
          "The Dataset is lawfully collected",
          "Personal data has a valid consent or other lawful basis",
          "The Dataset does not infringe third-party intellectual property rights",
          "All metadata and descriptions are accurate and not misleading",
          "The Dataset complies with applicable laws in all relevant jurisdictions",
        ]} />
      </SectionCard>

      <SectionCard id="s-compliance" number={7} title="Compliance & Documentation" badge="Supplier Rights" badgeColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <p>Suppliers must maintain throughout the listing period:</p>
        <BulletList items={[
          "Consent records for any personal data",
          "Data source documentation",
          "Processing records",
          "Adequate security safeguards",
        ]} />
        <p className="mt-2 font-medium text-foreground dark:text-white">Suppliers must notify Kuinbee within <strong>48 hours</strong> of:</p>
        <BulletList items={[
          "Any data breach affecting listed Datasets",
          "Regulatory inquiry related to a Dataset",
          "Legal notice or claim involving a Dataset",
        ]} />
      </SectionCard>

      <SectionCard id="s-financial" number={8} title="Refund & Financial Liability" badge="Financial" badgeColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
        <p>Suppliers bear <strong className="text-foreground dark:text-white">sole financial responsibility</strong> for:</p>
        <BulletList items={[
          "Dataset inaccuracies or misrepresentations",
          "Regulatory non-compliance",
          "Valid Buyer refund claims arising from Supplier error",
          "Chargebacks initiated by Buyers",
        ]} />
        <p className="mt-2 font-medium text-foreground dark:text-white">Kuinbee may:</p>
        <BulletList items={[
          "Deduct losses from Supplier payouts",
          "Set off balances against future earnings",
          "Suspend payouts pending investigation",
          "Recover any financial exposure from the Supplier",
        ]} />
        <p className="mt-2 p-3 bg-muted/40 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white">
          These rights survive termination of this agreement.
        </p>
      </SectionCard>

      <SectionCard id="s-ip" number={9} title="Intellectual Property" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Dataset IP remains with the Supplier. Platform IP, DCC methodology, KDTS framework, software, and infrastructure remain exclusively owned by Kuinbee.</p>
      </SectionCard>

      <SectionCard id="s-disclaimer" number={10} title="Disclaimer of Warranties" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>The Platform is provided <strong className="text-foreground dark:text-white">"as is"</strong> and <strong className="text-foreground dark:text-white">"as available"</strong>. Kuinbee disclaims all warranties regarding Platform uptime, discoverability, or commercial outcomes for Suppliers. Kuinbee does not guarantee dataset sales or earnings.</p>
      </SectionCard>

      <SectionCard id="s-liability" number={11} title="Limitation of Liability" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>To the maximum extent permitted by law, Kuinbee shall not be liable to Suppliers for:</p>
        <BulletList items={[
          "Indirect or consequential damages",
          "Loss of revenue or business opportunities",
          "Regulatory penalties arising from Supplier non-compliance",
          "Buyer–Supplier disputes",
        ]} />
        <p className="mt-2">Aggregate liability shall not exceed the total commission earned by Kuinbee from the relevant transaction.</p>
      </SectionCard>

      <SectionCard id="s-indemnification" number={12} title="Indemnification" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Suppliers agree to indemnify and hold harmless Kuinbee from claims arising from:</p>
        <BulletList items={[
          "Dataset inaccuracies or misrepresentation",
          "Regulatory violations",
          "Intellectual property infringement by a listed Dataset",
          "Privacy violations from unlawful data collection",
          "Any legal non-compliance by the Supplier",
        ]} />
      </SectionCard>

      <SectionCard id="s-dataprotection" number={13} title="Data Protection & Legal Compliance" badge="Legal" badgeColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
        <p>Suppliers must ensure their Datasets comply with all applicable data protection laws, including:</p>
        <BulletList items={[
          "Digital Personal Data Protection Act (India)",
          "General Data Protection Regulation (GDPR)",
          "HIPAA (if health data is involved)",
          "Sector-specific regulations and standards",
        ]} />
        <p className="mt-2">Kuinbee does not act as data controller for third-party dataset content. Suppliers remain the data controller and are solely responsible for lawful basis and consent.</p>
      </SectionCard>

      <SectionCard id="s-termination" number={14} title="Termination" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>Kuinbee may suspend or terminate Supplier access if:</p>
        <BulletList items={[
          "These Terms are breached",
          "Fraud or illegal activity is detected",
          "Regulatory risk arises",
        ]} />
        <p>Existing licenses granted to Buyers may survive termination. Financial liabilities and indemnification obligations survive termination.</p>
      </SectionCard>

      <SectionCard id="s-governing" number={15} title="Governing Law & Jurisdiction" badge="Legal" badgeColor="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400">
        <p>These Terms are governed by the <strong className="text-foreground dark:text-white">laws of India</strong>. Courts at <strong className="text-foreground dark:text-white">Pune, Maharashtra</strong> shall have exclusive jurisdiction.</p>
      </SectionCard>

      <SectionCard id="s-modifications" number={16} title="Modifications" badge="General" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <p>Kuinbee may modify these Terms at any time. Continued listing of Datasets on the Platform constitutes acceptance of the updated Terms.</p>
        <p>Additional clauses — Force Majeure, Severability, Waiver, and Electronic Communications — apply and are incorporated herein by reference.</p>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TermsAndConditionsPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("customer");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const updateDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    updateDark();
    const observer = new MutationObserver(updateDark);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const sections = activeTab === "customer" ? customerSections : supplierSections;

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary">Legal Information</span>
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
              className="max-w-2xl mx-auto"
            >
              <p className="text-lg md:text-xl text-muted-foreground dark:text-white/70 leading-relaxed font-light">
                These Terms govern all access and interactions on the Kuinbee Platform. Select your role below to read the terms applicable to you.
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
                { Icon: FileText, label: "Document Type", value: "Legal Agreement" },
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

      {/* ── Tab Selector (no strip) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleTabChange("customer")}
            className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "customer"
                ? "text-foreground dark:text-white"
                : "text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-white/5"
              }`}
          >
            {activeTab === "customer" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20 dark:border-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <ShoppingCart className="relative w-4 h-4" />
            <span className="relative">For Customers (Buyers)</span>
          </button>

          <button
            onClick={() => handleTabChange("supplier")}
            className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "supplier"
                ? "text-foreground dark:text-white"
                : "text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-white/5"
              }`}
          >
            {activeTab === "supplier" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20 dark:border-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Store className="relative w-4 h-4" />
            <span className="relative">For Suppliers</span>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="relative py-10 md:py-14 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">

            {/* Desktop Sidebar TOC */}
            <SidebarTOC
              sections={sections}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            />

            {/* Main Column */}
            <div>
              {/* Agreement Overview Banner */}
              <motion.div
                key={activeTab + "-banner"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mb-6 p-6 md:p-8 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/10 dark:to-transparent border-2 border-primary/30 dark:border-primary/40 rounded-2xl shadow-lg shadow-primary/5 dark:shadow-primary/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                      {activeTab === "customer" ? (
                        <ShoppingCart className="w-6 h-6 text-primary" />
                      ) : (
                        <Store className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                        {activeTab === "customer" ? "Customer (Buyer) Terms" : "Supplier Terms"}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full uppercase">Important</span>
                    </div>
                    <div className="space-y-3 text-sm md:text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                      {activeTab === "customer" ? (
                        <>
                          <p>
                            These terms apply to any entity or individual purchasing or licensing Datasets on the Kuinbee Platform ("Buyer"). By placing an order or downloading a Dataset, you acknowledge you have read, understood, and agreed to be bound by these terms.
                          </p>
                          <div className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                            <p className="text-sm">
                              <strong className="text-foreground dark:text-white">⚠️ Important:</strong> Kuinbee is a marketplace intermediary. Datasets are supplied by independent third parties. Kuinbee's screening (DCC/KDTS) is not a warranty or certification of accuracy.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            These terms apply to any entity or individual listing Datasets on the Kuinbee Platform ("Supplier"). By submitting a Dataset for listing, you acknowledge you have read, understood, and agreed to be bound by these terms.
                          </p>
                          <div className="p-3 bg-background/50 dark:bg-white/5 rounded-xl border border-border dark:border-white/10">
                            <p className="text-sm">
                              <strong className="text-foreground dark:text-white">⚠️ Important:</strong> Suppliers bear full responsibility for the lawfulness, accuracy, and compliance of their Datasets. Financial liability for Buyer refunds and regulatory breaches rests solely with Suppliers.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile TOC */}
              <motion.div
                key={activeTab + "-mobile-toc"}
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

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  {activeTab === "customer" ? <CustomerContent /> : <SupplierContent />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
