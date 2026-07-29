import Link from "next/link";
import { ArrowUpRight, CalendarDays, PackageOpen } from "lucide-react";
import type { ActiveRequirement } from "./active-requirements.data";
import { RequirementIcon } from "./RequirementIcon";

export function ActiveRequirementCard({
  requirement,
}: {
  requirement: ActiveRequirement;
}) {
  return (
    <Link
      href={`/data-request/active-requirements/${requirement.slug}`}
      aria-label={`View details for ${requirement.title}`}
      className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_45px_-28px_rgb(15_23_42/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 dark:bg-white/[0.045] dark:hover:border-white/20 sm:p-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary/60 transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
        <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
          {requirement.id}
        </span>
      </div>

      <span className="mt-7 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.08] text-primary transition-transform duration-300 group-hover:scale-105 dark:bg-white/[0.08] dark:text-white">
        <RequirementIcon kind={requirement.kind} className="h-5 w-5" />
      </span>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/70 dark:text-white/55">
          {requirement.type}
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-foreground">
          {requirement.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {requirement.summary}
        </p>
      </div>

      <div className="mt-auto space-y-2 border-t border-border/60 pt-5">
        <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <PackageOpen
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>{requirement.volume?.[0] ?? "Volume not specified"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {requirement.deliveryDate ?? "Delivery date not specified"}
          </span>
        </div>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
        View requirement
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
