"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, Search, Wrench, X } from "lucide-react";
import { useSearchSuggestions } from "@/hooks/api/useSearchSuggestions";
import { cn } from "@/shared/utils/cn";
import { Input } from "./input";
import { MarketplaceTypeToggle } from "./marketplace-type-toggle";
import { SearchSuggestionDropdown } from "./search-suggestion-dropdown";

interface MarketplaceSearchProps {
  active: "datasets" | "services";
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  datasetsTotal?: number;
  servicesTotal?: number;
  className?: string;
}

export function MarketplaceSearch({
  active,
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  datasetsTotal,
  servicesTotal,
  className,
}: MarketplaceSearchProps) {
  const [debouncedValue, setDebouncedValue] = useState(value.trim());
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [value]);

  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedValue);

  return (
    <div
      data-marketplace-page-search
      className={cn("min-w-0 flex-1", className)}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#4e5a7e] dark:text-white/60"
            aria-hidden="true"
          />
          <Input
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value.slice(0, 200));
              setSuggestionsOpen(true);
            }}
            onFocus={() => value.trim().length >= 2 && setSuggestionsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSuggestionsOpen(false);
              if (event.key === "Enter") {
                setSuggestionsOpen(false);
                event.currentTarget.blur();
              }
            }}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className="h-11 rounded-xl border-[#1a2240]/20 bg-white/95 pl-11 pr-10 text-base text-[#1a2240] shadow-sm placeholder:text-sm placeholder:text-[#4e5a7e]/60 focus-visible:ring-[#1a2240]/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:ring-white/30"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onValueChange("");
                setSuggestionsOpen(false);
              }}
              className="absolute right-2.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#4e5a7e] transition-colors hover:bg-muted hover:text-foreground dark:text-white/60"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          {suggestionsOpen && (
            <SearchSuggestionDropdown
              datasets={suggestions?.datasets ?? []}
              services={suggestions?.services ?? []}
              isLoading={isLoading || debouncedValue !== value.trim()}
              query={debouncedValue}
              onClose={() => setSuggestionsOpen(false)}
              className="sm:mt-10"
            />
          )}
        </div>

        <MarketplaceTypeToggle
          active={active}
          query={value.trim() || undefined}
          datasetsTotal={datasetsTotal}
          servicesTotal={servicesTotal}
          className="w-full shrink-0 sm:w-auto sm:min-w-[250px]"
        />
      </div>

      {value.trim() && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Results in</span>
          <ResultPill
            href={`/datasets?q=${encodeURIComponent(value.trim())}`}
            icon={Database}
            label="Datasets"
            count={datasetsTotal}
            active={active === "datasets"}
          />
          <ResultPill
            href={`/data-request/services?q=${encodeURIComponent(value.trim())}`}
            icon={Wrench}
            label="Services"
            count={servicesTotal}
            active={active === "services"}
          />
        </div>
      )}
    </div>
  );
}

function ResultPill({
  href,
  icon: Icon,
  label,
  count,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px",
        active
          ? "border-[#1a2240]/25 bg-[#1a2240] text-white shadow-sm dark:border-white/25 dark:bg-white dark:text-[#1a2240]"
          : "border-[#1a2240]/15 bg-white/80 text-[#4e5a7e] hover:border-[#1a2240]/30 hover:text-[#1a2240] dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/30 dark:hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums leading-none",
          active
            ? "bg-white/15 dark:bg-[#1a2240]/10"
            : "bg-[#1a2240]/5 dark:bg-white/10"
        )}
      >
        {count == null ? "…" : count.toLocaleString()}
      </span>
    </Link>
  );
}
