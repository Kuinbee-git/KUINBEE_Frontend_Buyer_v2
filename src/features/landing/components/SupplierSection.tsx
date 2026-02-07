"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/router/Link";
import { ValueBadge } from "./value-badge";
import { WorkflowStep } from "./workflow-step";
import { CTABox } from "./cta-box";
import {
  Shield,
  Lock,
  Eye,
  Activity,
  Package,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

const valueProps = [
  {
    icon: Shield,
    title: "Governed Distribution",
    description: "Your datasets are distributed through a controlled, audited marketplace with clear governance rules and verified buyers only.",
    borderColor: "border-l-4 border-l-blue-500",
    iconBgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Lock,
    title: "Clear Ownership & Control",
    description: "You retain full ownership and control of your datasets with explicit licensing terms and access rules that are enforced by the platform.",
    borderColor: "border-l-4 border-l-purple-500",
    iconBgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Eye,
    title: "Credible Buyer Surface",
    description: "Reach verified, institutional-grade buyers who are serious about data procurement and governance compliance.",
    borderColor: "border-l-4 border-l-emerald-500",
    iconBgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Activity,
    title: "Operational Confidence",
    description: "Track usage, monitor compliance, and manage your data products with full visibility and operational controls.",
    borderColor: "border-l-4 border-l-amber-500",
    iconBgColor: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
];

const workflowSteps = [
  {
    stepNumber: "01",
    title: "Verify Your Organization",
    description:
      "Supplier identity, ownership, and publishing authority are reviewed before access is granted.",
    icon: ShieldCheck,
    iconColor: "text-blue-400",
    iconBgColor: "bg-blue-400/10",
  },
  {
    stepNumber: "02",
    title: "Submit & Review Datasets",
    description:
      "Datasets are submitted with required metadata and reviewed for quality, compliance, and completeness.",
    icon: FileCheck,
    iconColor: "text-purple-400",
    iconBgColor: "bg-purple-400/10",
  },
  {
    stepNumber: "03",
    title: "Publish with Defined Terms",
    description:
      "Approved datasets are listed with explicit pricing and access rules. Buyer access is enforced by the platform.",
    icon: Lock,
    iconColor: "text-emerald-400",
    iconBgColor: "bg-emerald-400/10",
  },
];

export function SupplierSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="suppliers"
      className={`relative py-16 md:py-24 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background - Consistent with other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
            <Package className="h-4 w-4 text-primary dark:text-white" />
            <span className="text-sm font-medium text-primary dark:text-white">
              For Suppliers
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
            Built for Serious
            <br />
            <span className="text-muted-foreground">Data Suppliers</span>
          </h2>
          <div className="mt-6 max-w-3xl space-y-4">
            <p className="text-lg text-muted-foreground dark:text-white/70">
              Kuinbee is designed for suppliers who want control, credibility, and compliance — not a free-for-all.
            </p>
            <p className="text-muted-foreground dark:text-white/60">
              If you&apos;re looking for a governed distribution channel with verified buyers and clear rules, this is the platform for you.
            </p>
          </div>
        </div>

        {/* Why Suppliers Choose Kuinbee - Using ValueBadge component */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-6">
            Why Suppliers Choose Kuinbee
          </h3>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {valueProps.map((prop) => (
              <ValueBadge
                key={prop.title}
                icon={prop.icon}
                title={prop.title}
                description={prop.description}
                borderColor={prop.borderColor}
                iconBgColor={prop.iconBgColor}
                iconColor={prop.iconColor}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground dark:text-white/60 italic">
            This is about control and credibility, not volume.
          </p>
        </div>

        {/* Supplier Workflow - Using WorkflowStep component */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">
            Supplier Workflow
          </h3>
          <p className="text-sm text-muted-foreground dark:text-white/60 mb-8">
            This is a deliberate process by design.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <WorkflowStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                icon={step.icon}
                title={step.title}
                description={step.description}
                iconColor={step.iconColor}
                iconBgColor={step.iconBgColor}
              />
            ))}
          </div>
        </div>

        {/* CTA - Using CTABox component */}
        <CTABox
          title="Ready to Publish Datasets?"
          description="Apply to become a verified supplier on the Kuinbee platform."
          primaryCTA={{
            label: "Supplier Application",
            href: "/supplier/apply",
          }}
          secondaryCTA={{
            label: "Supplier Documentation",
            href: "/supplier/docs",
          }}
          centered={true}
        />
      </div>
    </section>
  );
}
