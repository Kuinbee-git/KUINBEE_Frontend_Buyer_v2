"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Database, Search, Wrench } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type {
  SuggestionDataset,
  SuggestionService,
} from "@/hooks/api/useSearchSuggestions";

interface SearchSuggestionDropdownProps {
  datasets: SuggestionDataset[];
  services: SuggestionService[];
  isLoading: boolean;
  query: string;
  onClose: () => void;
  className?: string;
}

export function SearchSuggestionDropdown({
  datasets,
  services,
  isLoading,
  query,
  onClose,
  className,
}: SearchSuggestionDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const hasResults = datasets.length > 0 || services.length > 0;

  if (!query.trim() || query.trim().length < 2) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 right-0 top-full mt-1.5 z-50",
        "rounded-xl border border-[#1a2240]/20 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10",
        "origin-top overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150",
        className
      )}
      role="listbox"
      aria-label={`Suggestions for ${query}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Searching…
        </div>
      ) : !hasResults ? (
        <div>
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2240]/5 text-[#4e5a7e] dark:bg-white/10 dark:text-white/70">
              <Search className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                No quick title suggestions
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Full matches may still appear in the results below.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 border-t border-border/50 p-2 dark:border-white/10">
            <SearchAllLink
              href={`/datasets?q=${encodeURIComponent(query.trim())}`}
              label="Search datasets"
              onClick={onClose}
            />
            <SearchAllLink
              href={`/data-request/services?q=${encodeURIComponent(query.trim())}`}
              label="Search services"
              onClick={onClose}
              services
            />
          </div>
        </div>
      ) : (
        <>
          {datasets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <Database className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Datasets
                </span>
              </div>
              {datasets.map((d) => (
                <Link
                  key={d.id}
                  href={`/datasets/${d.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
                >
                  <span className="line-clamp-1 text-foreground">
                    {d.title}
                  </span>
                  {d.category && (
                    <span className="shrink-0 rounded-full bg-[#1a2240]/5 px-2 py-1 text-[11px] text-muted-foreground dark:bg-white/8">
                      {d.category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {services.length > 0 && (
            <div
              className={cn(datasets.length > 0 && "border-t border-border/40")}
            >
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <Wrench className="h-3.5 w-3.5 text-rose-500/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Custom Collection Services
                </span>
              </div>
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/data-request/services/${s.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
                >
                  <span className="line-clamp-1 text-foreground">
                    {s.title}
                  </span>
                  {s.category && (
                    <span className="shrink-0 rounded-full bg-[#1a2240]/5 px-2 py-1 text-[11px] text-muted-foreground dark:bg-white/8">
                      {s.category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-1 border-t border-border/40 p-2 sm:grid-cols-2">
            <Link
              href={`/datasets?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="inline-flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-xs font-medium text-[#2b61eb] transition-colors hover:bg-[#2b61eb]/5 dark:text-white"
            >
              <span>All datasets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/data-request/services?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="inline-flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/5 dark:text-rose-300"
            >
              <span>All services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function SearchAllLink({
  href,
  label,
  onClick,
  services = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  services?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
        services
          ? "text-rose-600 hover:bg-rose-500/5 dark:text-rose-300"
          : "text-[#2b61eb] hover:bg-[#2b61eb]/5 dark:text-white"
      )}
    >
      <span>{label}</span>
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}
