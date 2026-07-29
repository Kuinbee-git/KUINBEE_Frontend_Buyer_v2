import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { generateMetadata as genMeta } from "@/core/config";
import { activeRequirements } from "@/features/active-requirements/active-requirements.data";
import { ActiveRequirementCard } from "@/features/active-requirements/ActiveRequirementCard";
import { DataOpportunityShell } from "@/features/data-request/DataOpportunityShell";

export const metadata: Metadata = genMeta({
  title: "Active Data Requirements",
  description:
    "Review active buyer data requirements and supplier opportunities on Kuinbee.",
  keywords: [
    "active data requirements",
    "buyer data requests",
    "supplier opportunities",
    "sell datasets",
  ],
  path: "/data-request/active-requirements",
});

export default function ActiveRequirementsPage() {
  return (
    <DataOpportunityShell>
      <section className="relative px-4 pb-24 pt-8 sm:px-6 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/data-request"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Sell data
          </Link>

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              Supplier Opportunities
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Active Requirements
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Explore current buyer needs and open any opportunity to review its
              complete data, licensing, format and delivery requirements.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-y border-border/60 py-4 md:mt-14">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {activeRequirements.length}
              </span>{" "}
              open requirements
            </p>
            <Link
              href="/supplier-resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75"
            >
              Be a supplier
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeRequirements.map((requirement) => (
              <ActiveRequirementCard
                key={requirement.id}
                requirement={requirement}
              />
            ))}
          </div>
        </div>
      </section>
    </DataOpportunityShell>
  );
}
