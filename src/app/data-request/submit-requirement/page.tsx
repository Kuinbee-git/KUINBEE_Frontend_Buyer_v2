import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { generateMetadata as genMeta } from "@/core/config";
import { DataRequirementSubmissionForm } from "@/features/active-requirements/DataRequirementSubmissionForm";
import { DataOpportunityShell } from "@/features/data-request/DataOpportunityShell";

export const metadata: Metadata = genMeta({
  title: "Submit a Data Requirement",
  description: "Submit a data requirement to the Kuinbee team for review.",
  path: "/data-request/submit-requirement",
});

export default function SubmitDataRequirementPage() {
  return (
    <DataOpportunityShell>
      <section className="px-4 pb-24 pt-24 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/data-request"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Sell data
          </Link>
          <div className="mb-10 mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              Data request
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Submit a data requirement
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Share the dataset you need. Kuinbee administrators will review the submission and decide whether to publish it as an active requirement.
            </p>
          </div>
          <DataRequirementSubmissionForm />
        </div>
      </section>
    </DataOpportunityShell>
  );
}
