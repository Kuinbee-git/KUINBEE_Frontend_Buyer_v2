import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Database,
  PackageOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { generateMetadata as genMeta } from "@/core/config";
import { DataOpportunityShell } from "@/features/data-request/DataOpportunityShell";
import { getPublicDataRequirement } from "@/services/public-data-requirement.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let requirement;
  try {
    requirement = await getPublicDataRequirement(slug);
  } catch {
    return {};
  }

  return genMeta({
    title: `${requirement.title} | Active Requirement`,
    description: requirement.summary,
    keywords: [
      "active data requirement",
      "supplier opportunity",
      requirement.dataType,
      requirement.title,
    ],
    path: `/data-request/active-requirements/${requirement.slug}`,
  });
}

export default async function ActiveRequirementDetailPage({ params }: Props) {
  const { slug } = await params;
  let requirement;
  try {
    requirement = await getPublicDataRequirement(slug);
  } catch {
    notFound();
  }

  return (
    <DataOpportunityShell>
      <section className="relative px-4 pb-24 pt-24 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/data-request/active-requirements"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All active requirements
          </Link>

          <article className="mt-7 overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_16px_45px_-34px_rgb(15_23_42/0.45)] backdrop-blur-md dark:bg-white/[0.045]">
            <header className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
                <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                  {requirement.referenceCode}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {requirement.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                {requirement.summary}
              </p>
            </header>

            <dl className="grid border-y border-border/70 bg-muted/20 sm:grid-cols-3 sm:divide-x sm:divide-x-border/70">
              <OverviewItem icon={Database} label="Data type">
                {requirement.dataType}
              </OverviewItem>
              <OverviewItem icon={PackageOpen} label="Volume">
                {requirement.volume.map((volume) => (
                  <span key={volume} className="block">
                    {volume}
                  </span>
                ))}
                {!requirement.volume.length ? (
                  <span className="text-muted-foreground">Not specified</span>
                ) : null}
              </OverviewItem>
              <OverviewItem icon={CalendarDays} label="Delivery date">
                {requirement.deliveryDate ? (
                  new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(requirement.deliveryDate))
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </OverviewItem>
            </dl>

            <div className="divide-y divide-border/70 px-6 sm:px-10">
              <section className="py-8 sm:py-10">
                <SectionHeading
                  eyebrow="Requirement brief"
                  title="Specific requirements"
                />
                <ul className="mt-6 space-y-4">
                  {requirement.specifications.map((specification) => (
                    <li
                      key={specification}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground sm:text-base"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span>{specification}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {requirement.coverage.length > 0 && (
                <section className="py-8 sm:py-10">
                  <SectionHeading
                    eyebrow="Coverage"
                    title="Required coverage"
                  />
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {requirement.coverage.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="py-8 sm:py-10">
                <div className="flex flex-col gap-5 rounded-xl border border-border/60 bg-muted/25 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h2 className="font-semibold text-foreground">
                      Interested in this requirement?
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Review the supplier process and prepare your capabilities.
                    </p>
                  </div>
                  <Link
                    href={`/supplier-resources?requirement=${encodeURIComponent(requirement.referenceCode)}#supplier-enquiry`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  >
                    Be a supplier
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>
    </DataOpportunityShell>
  );
}

function OverviewItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border/70 px-6 py-5 first:border-t-0 sm:border-t-0 sm:px-7">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium leading-6 text-foreground">
        {children}
      </dd>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/70">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
    </>
  );
}
