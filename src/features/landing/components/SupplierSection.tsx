"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Lock, Users, BarChart3 } from "lucide-react";
import { ValueBadge } from "./value-badge";
import { WorkflowStep } from "./workflow-step";
import { CTABox } from "./cta-box";

const valueProps = [
  {
    title: "Governed Distribution",
    description: "Your datasets are distributed through a controlled, audited marketplace with clear governance rules and verified buyers only.",
    icon: ShieldCheck,
  },
  {
    title: "Clear Ownership & Control",
    description: "You retain full ownership and control of your datasets with explicit licensing terms and access rules that are enforced by the platform.",
    icon: Lock,
  },
  {
    title: "Credible Buyer Surface",
    description: "Reach verified, institutional-grade buyers who are serious about data procurement and governance compliance.",
    icon: Users,
  },
  {
    title: "Operational Confidence",
    description: "Track usage, monitor compliance, and manage your data products with full visibility and operational controls.",
    icon: BarChart3,
  },
];

const workflowSteps: { stepNumber: string; title: string; description: string; progress: "one" | "two" | "three" }[] = [
  {
    stepNumber: "01",
    title: "Verify Your Organization",
    description: "Supplier identity, ownership, and publishing authority are reviewed before access is granted.",
    progress: "one",
  },
  {
    stepNumber: "02",
    title: "Submit & Review Datasets",
    description: "Datasets are submitted with required metadata and reviewed for quality, compliance, and completeness.",
    progress: "two",
  },
  {
    stepNumber: "03",
    title: "Publish with Defined Terms",
    description: "Approved datasets are listed with explicit pricing and access rules. Buyer access is enforced by the platform.",
    progress: "three",
  },
];

export function SupplierSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="suppliers"
      className={`relative py-20 md:py-32 overflow-hidden transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.06] dark:opacity-[0.10] pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 30%, rgba(26,34,64,1) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40">
              For Suppliers
            </span>
          </div>
          <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl leading-[1.15]">
            Built for Serious{" "}
            <span className="text-muted-foreground">Data Suppliers</span>
          </h2>
          <div className="mt-5 space-y-3">
            <p className="text-lg text-muted-foreground dark:text-white/65 leading-relaxed">
              Kuinbee is designed for suppliers who want control, credibility, and compliance — not a free-for-all.
            </p>
            <p className="text-sm text-muted-foreground dark:text-white/45">
              If you&apos;re looking for a governed distribution channel with verified buyers and clear rules, this is the platform for you.
            </p>
          </div>
        </div>

        {/* Why Suppliers Choose Kuinbee */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-semibold text-foreground dark:text-white/80 uppercase tracking-widest text-xs">
              Why Suppliers Choose Kuinbee
            </h3>
            <span className="h-px flex-1 ml-6 bg-primary/8 dark:bg-white/8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valueProps.map((prop) => (
              <ValueBadge
                key={prop.title}
                title={prop.title}
                description={prop.description}
                icon={prop.icon}
              />
            ))}
          </div>

          <p className="mt-5 text-xs text-muted-foreground dark:text-white/35 italic">
            This is about control and credibility, not volume.
          </p>
        </div>

        {/* Supplier Workflow */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-semibold text-foreground dark:text-white/80 uppercase tracking-widest">
              Supplier Workflow
            </h3>
            <span className="h-px flex-1 ml-6 bg-primary/8 dark:bg-white/8" />
          </div>
          <p className="text-sm text-muted-foreground dark:text-white/50 mb-8 -mt-4">
            A deliberate process by design.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <WorkflowStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                progress={step.progress}
              />
            ))}
          </div>
        </div>

        <CTABox
          title="Ready to Publish Datasets?"
          description="Learn more about becoming a verified supplier on the Kuinbee platform."
          primaryCTA={{
            label: "Explore Supplier Resources",
            href: "/supplier-resources",
          }}
          secondaryCTA={{
            label: "Supplier Documentation",
            href: "/supplier-resources",
          }}
          centered={true}
        />
      </div>
    </section>
  );
}
