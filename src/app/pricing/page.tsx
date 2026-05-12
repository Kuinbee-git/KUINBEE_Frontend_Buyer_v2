import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { Button } from "@/shared/components/ui";
import { Link } from "@/components/router/Link";
import { CheckCircle2, Building2, Users, ShieldCheck } from "lucide-react";

export const metadata: Metadata = genMeta({
  title: "Custom Dataset Pricing for Teams & Enterprise | Kuinbee",
  description:
    "Flexible pricing plans for data buyers. Get access to premium, verified datasets at scale. Contact us for enterprise pricing.",
  keywords: ["dataset pricing", "enterprise data pricing", "custom dataset plans", "verified datasets pricing"],
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main className="min-h-screen relative bg-white dark:bg-[#111827]">
      <div className="sticky top-0 z-50">
        <NotchNavigation />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      <section className="relative pt-24 md:pt-36 pb-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full border border-[#1a2240]/20 dark:border-white/15 bg-white/80 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a2240]/60 dark:text-white/50">
              Kuinbee Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a2240] dark:text-white tracking-tight leading-tight">
              Custom Dataset Pricing for Teams &amp; Enterprise
            </h1>
            <p className="mt-5 text-base md:text-lg text-[#4e5a7e] dark:text-white/70 leading-relaxed">
              Flexible pricing plans for data buyers. Get access to premium, verified datasets at scale with pricing tailored to your
              team, workflow, and compliance requirements.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] p-6">
              <div className="flex items-center gap-2 mb-4 text-[#1a2240] dark:text-white">
                <Users className="w-5 h-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Team</p>
              </div>
              <p className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3">For small to growing data teams</p>
              <ul className="space-y-2 text-sm text-[#4e5a7e] dark:text-white/70">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Single-project or multi-project access</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Flexible dataset bundles</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Fast onboarding support</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#4f6ef7]/35 dark:border-[#818cf8]/40 bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Building2 className="w-5 h-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Enterprise</p>
              </div>
              <p className="text-xl font-semibold text-white mb-3">For regulated, high-volume procurement</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />Custom commercial terms</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />Priority data request handling</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />Dedicated account guidance</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] p-6">
              <div className="flex items-center gap-2 mb-4 text-[#1a2240] dark:text-white">
                <ShieldCheck className="w-5 h-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Compliance</p>
              </div>
              <p className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3">For governance-first organizations</p>
              <ul className="space-y-2 text-sm text-[#4e5a7e] dark:text-white/70">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Verified data providers</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Transparent licensing terms</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Procurement-ready documentation</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#1a2240] dark:text-white">Get a tailored pricing proposal</h2>
            <p className="mt-3 text-sm md:text-base text-[#4e5a7e] dark:text-white/70 max-w-2xl mx-auto">
              Share your use case, target categories, and expected volume. Our team will recommend the best procurement model for your workflow.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 dark:bg-[#4f6ef7] dark:hover:bg-[#3b5bfb]"
                asChild
              >
                <Link href="/support">Contact Sales</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#1a2240]/20 text-[#1a2240] hover:bg-[#1a2240]/5 dark:border-white/25 dark:text-white/85 dark:hover:bg-white/10"
                asChild
              >
                <Link href="/datasets">Explore Datasets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
