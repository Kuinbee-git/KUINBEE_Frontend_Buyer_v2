import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { generateMetadata as genMeta } from "@/core/config";
import { ActiveRequirementCard } from "@/features/active-requirements/ActiveRequirementCard";
import { DataOpportunityShell } from "@/features/data-request/DataOpportunityShell";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { listPublicDataRequirements } from "@/services/public-data-requirement.service";

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

type Props = {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
};

const sorts = ["NEWEST", "TITLE_ASC", "TITLE_DESC", "DELIVERY_DATE"] as const;

export default async function ActiveRequirementsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const q = (params.q || "").trim().slice(0, 200);
  const sort = sorts.includes(params.sort as (typeof sorts)[number])
    ? (params.sort as (typeof sorts)[number])
    : "NEWEST";
  let result: Awaited<ReturnType<typeof listPublicDataRequirements>> | null = null;
  try {
    result = await listPublicDataRequirements({ page, pageSize: 12, q: q || undefined, sort });
  } catch {
    // The page renders its user-facing unavailable state below.
  }
  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 0;
  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams();
    next.set("page", String(nextPage));
    if (q) next.set("q", q);
    if (sort !== "NEWEST") next.set("sort", sort);
    return `/data-request/active-requirements?${next}`;
  };

  return (
    <DataOpportunityShell>
      <section className="relative px-4 pb-24 pt-24 sm:px-6 md:pt-28">
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
                {result?.total ?? 0}
              </span>{" "}
              open requirements
            </p>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link
                href="/request-data#request-form"
                className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400"
              >
                Submit a requirement
              </Link>
              <Link
                href="/supplier-resources"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75"
              >
                Be a supplier
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <form className="active-requirements-filter mt-7 grid gap-3 rounded-xl border border-border/60 bg-card/70 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.035] sm:grid-cols-[minmax(0,1fr)_210px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search active requirements"
                className="pl-9 dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:placeholder:text-white/50 dark:focus-visible:border-white/35 dark:focus-visible:ring-white/15 dark:focus-visible:ring-offset-0"
              />
            </div>
            <Select
              name="sort"
              defaultValue={sort}
            >
              <SelectTrigger
                aria-label="Sort active requirements"
                className="h-10 dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:focus:border-white/35 dark:focus:ring-white/15"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="active-requirements-sort-content">
                <SelectItem value="NEWEST">Newest first</SelectItem>
                <SelectItem value="TITLE_ASC">Title A–Z</SelectItem>
                <SelectItem value="TITLE_DESC">Title Z–A</SelectItem>
                <SelectItem value="DELIVERY_DATE">Delivery date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              variant="outline"
              className="dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:hover:bg-white/[0.09]"
            >
              Apply
            </Button>
          </form>

          {!result ? (
            <div className="mt-8 rounded-xl border border-border/60 bg-card/80 px-6 py-12 text-center">
              <h2 className="font-semibold text-foreground">Requirements are temporarily unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">Please refresh the page in a moment.</p>
            </div>
          ) : result.items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-border/60 bg-card/80 px-6 py-12 text-center">
              <h2 className="font-semibold text-foreground">No active requirements found</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search or check back soon.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((requirement) => (
                <ActiveRequirementCard key={requirement.referenceCode} requirement={requirement} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mt-9 flex items-center justify-between border-t border-border/60 pt-5">
              <Button asChild variant="outline" className={page <= 1 ? "pointer-events-none opacity-50" : ""}>
                <Link href={pageHref(page - 1)}>Previous</Link>
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button asChild variant="outline" className={page >= totalPages ? "pointer-events-none opacity-50" : ""}>
                <Link href={pageHref(page + 1)}>Next</Link>
              </Button>
            </nav>
          ) : null}
        </div>
      </section>
    </DataOpportunityShell>
  );
}
