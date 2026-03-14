"use client";

import { memo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/components/ui/select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { FilterState, SortOption, CURRENCIES, SORT_LABELS } from "./types";

type AccordionState = {
  sort: boolean;
  category: boolean;
  pricing: boolean;
  priceRange: boolean;
  location: boolean;
  tags: boolean;
  kdtsScore: boolean;
};

interface FilterSidebarProps {
  filters: FilterState;
  updateFilter: (updates: Partial<FilterState>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  categoryItems: { id: string; name: string }[];
  accordionState: AccordionState;
  toggleAccordion: (section: keyof AccordionState) => void;
}

export const FilterSidebar = memo(function FilterSidebar({
  filters,
  updateFilter,
  clearFilters,
  hasActiveFilters,
  categoryItems,
  accordionState,
  toggleAccordion,
}: FilterSidebarProps) {
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.pricingType !== "all" ? 1 : 0) +
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.minKdtsScore ? 1 : 0);

  const sortOptions = (["relevance", "newest", "oldest", "updated",
    "popular", "most-downloaded", "top-rated", "top-kdts",
    "price-low", "price-high"] as SortOption[]);

  return (
    <aside className="space-y-4 lg:space-y-6">
      {/* Mobile: Collapsible Filters */}
      <details className="lg:hidden bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
        <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-[#1a2240] dark:text-white">
          <span>Filters {hasActiveFilters && `(${activeCount} active)`}</span>
          <ChevronDown className="h-4 w-4 text-[#4e5a7e] dark:text-white/60" />
        </summary>
        <div className="px-4 pb-4 space-y-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full text-xs font-medium text-[#1a2240] dark:text-white/80 hover:text-[#4e5a7e] dark:hover:text-white underline text-center py-2"
            >
              Clear All Filters
            </button>
          )}
          <FilterAccordionSection title="Sort By" open={accordionState.sort} onToggle={() => toggleAccordion("sort")} compact>
            <div className="px-4 pb-4 space-y-1">
              {sortOptions.map((option) => (
                <button key={option} onClick={() => updateFilter({ sortOrder: option })}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    filters.sortOrder === option
                      ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                      : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                  {SORT_LABELS[option]}
                </button>
              ))}
            </div>
          </FilterAccordionSection>
          <FilterAccordionSection title="Category" open={accordionState.category} onToggle={() => toggleAccordion("category")} compact>
            <div className="px-4 pb-4 space-y-1">
              <button onClick={() => updateFilter({ category: null })}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  filters.category === null
                    ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                    : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                All Categories
              </button>
              {categoryItems.map((cat) => (
                <button key={cat.id} onClick={() => updateFilter({ category: cat.id })} title={cat.name}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 truncate",
                    filters.category === cat.id
                      ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                      : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                  {cat.name}
                </button>
              ))}
            </div>
          </FilterAccordionSection>
          <FilterAccordionSection title="Pricing Type" open={accordionState.pricing} onToggle={() => toggleAccordion("pricing")} compact>
            <div className="px-4 pb-4 space-y-1">
              {(["all", "free", "paid"] as const).map((type) => (
                <button key={type} onClick={() => updateFilter({ pricingType: type })}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 capitalize",
                    filters.pricingType === type
                      ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                      : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                  {type === "all" ? "All Pricing Types" : type}
                </button>
              ))}
            </div>
          </FilterAccordionSection>
          {filters.pricingType === "paid" && (
            <FilterAccordionSection title="Price Range" open={accordionState.priceRange} onToggle={() => toggleAccordion("priceRange")} compact>
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" value={filters.priceRange.min}
                    onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, min: e.target.value } })}
                    className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
                  <Input type="number" placeholder="Max" value={filters.priceRange.max}
                    onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, max: e.target.value } })}
                    className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">Currency</label>
                  <Select value={filters.currency} onValueChange={(value) => updateFilter({ currency: value as FilterState["currency"] })}>
                    <SelectTrigger className="h-9 rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1e2847] border-[#1a2240]/20 dark:border-white/20">
                      {CURRENCIES.map((cur: string) => (
                        <SelectItem key={cur} value={cur} className="text-[#1a2240] dark:text-white">{cur}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterAccordionSection>
          )}
          <FilterAccordionSection title="Location" open={accordionState.location} onToggle={() => toggleAccordion("location")} compact>
            <div className="px-4 pb-4 space-y-3">
              {(["country", "state", "city"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60 capitalize">{field}</label>
                  <Input placeholder={field === "country" ? "e.g. India" : field === "state" ? "e.g. Maharashtra" : "e.g. Mumbai"}
                    value={filters[field]}
                    onChange={(e) => updateFilter({ [field]: e.target.value })}
                    className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
                </div>
              ))}
            </div>
          </FilterAccordionSection>
          <FilterAccordionSection title="Tags" open={accordionState.tags} onToggle={() => toggleAccordion("tags")} compact>
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-[#4e5a7e] dark:text-white/50">Enter tags separated by commas</p>
              <Input placeholder="e.g. climate, finance" value={filters.tags.join(", ")}
                onChange={(e) => updateFilter({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {filters.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white">
                      {tag}
                      <button onClick={() => updateFilter({ tags: filters.tags.filter((t) => t !== tag) })}
                        className="hover:text-red-500 dark:hover:text-red-400 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FilterAccordionSection>
          <FilterAccordionSection title="Min KDTS Score" open={accordionState.kdtsScore} onToggle={() => toggleAccordion("kdtsScore")} compact>
            <div className="px-4 pb-4">
              <Input type="number" min="0" max="100" step="0.1" placeholder="e.g. 70.5" value={filters.minKdtsScore}
                onChange={(e) => updateFilter({ minKdtsScore: e.target.value })}
                className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
              <p className="mt-1.5 text-xs text-[#4e5a7e] dark:text-white/50">Score range: 0 – 100</p>
            </div>
          </FilterAccordionSection>
        </div>
      </details>

      {/* Desktop: Always Visible Filters */}
      <div className="hidden lg:block space-y-6">
        {hasActiveFilters && (
          <button onClick={clearFilters}
            className="w-full text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-xl py-2.5 px-4 transition-colors text-center">
            Clear All Filters
          </button>
        )}
        <FilterAccordionSection title="Sort By" open={accordionState.sort} onToggle={() => toggleAccordion("sort")}>
          <div className="px-5 pb-5 space-y-1">
            {sortOptions.map((option) => (
              <button key={option} onClick={() => updateFilter({ sortOrder: option })}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  filters.sortOrder === option
                    ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                    : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                {SORT_LABELS[option]}
              </button>
            ))}
          </div>
        </FilterAccordionSection>
        <FilterAccordionSection title="Category" open={accordionState.category} onToggle={() => toggleAccordion("category")}>
          <div className="px-5 pb-5 space-y-1">
            <button onClick={() => updateFilter({ category: null })}
              className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                filters.category === null
                  ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                  : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
              All Categories
            </button>
            {categoryItems.map((cat) => (
              <button key={cat.id} onClick={() => updateFilter({ category: cat.id })} title={cat.name}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 truncate",
                  filters.category === cat.id
                    ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                    : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                {cat.name}
              </button>
            ))}
          </div>
        </FilterAccordionSection>
        <FilterAccordionSection title="Pricing Type" open={accordionState.pricing} onToggle={() => toggleAccordion("pricing")}>
          <div className="px-5 pb-5 space-y-1">
            {(["all", "free", "paid"] as const).map((type) => (
              <button key={type} onClick={() => updateFilter({ pricingType: type })}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 capitalize",
                  filters.pricingType === type
                    ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                    : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white")}>
                {type === "all" ? "All Pricing Types" : type}
              </button>
            ))}
          </div>
        </FilterAccordionSection>
        {filters.pricingType === "paid" && (
          <FilterAccordionSection title="Price Range" open={accordionState.priceRange} onToggle={() => toggleAccordion("priceRange")}>
            <div className="px-5 pb-5 space-y-3">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" value={filters.priceRange.min}
                  onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, min: e.target.value } })}
                  className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
                <Input type="number" placeholder="Max" value={filters.priceRange.max}
                  onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, max: e.target.value } })}
                  className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">Currency</label>
                <Select value={filters.currency} onValueChange={(value) => updateFilter({ currency: value as FilterState["currency"] })}>
                  <SelectTrigger className="h-9 rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1e2847] border-[#1a2240]/20 dark:border-white/20">
                    {CURRENCIES.map((cur: string) => (
                      <SelectItem key={cur} value={cur} className="text-[#1a2240] dark:text-white">{cur}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterAccordionSection>
        )}
        <FilterAccordionSection title="Location" open={accordionState.location} onToggle={() => toggleAccordion("location")}>
          <div className="px-5 pb-5 space-y-3">
            {(["country", "state", "city"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60 capitalize">{field}</label>
                <Input placeholder={field === "country" ? "e.g. India" : field === "state" ? "e.g. Maharashtra" : "e.g. Mumbai"}
                  value={filters[field]}
                  onChange={(e) => updateFilter({ [field]: e.target.value })}
                  className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
              </div>
            ))}
          </div>
        </FilterAccordionSection>
        <FilterAccordionSection title="Tags" open={accordionState.tags} onToggle={() => toggleAccordion("tags")}>
          <div className="px-5 pb-5 space-y-3">
            <p className="text-xs text-[#4e5a7e] dark:text-white/50">Enter tags separated by commas</p>
            <Input placeholder="e.g. climate, finance" value={filters.tags.join(", ")}
              onChange={(e) => updateFilter({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
            {filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {filters.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white">
                    {tag}
                    <button onClick={() => updateFilter({ tags: filters.tags.filter((t) => t !== tag) })}
                      className="hover:text-red-500 dark:hover:text-red-400 transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FilterAccordionSection>
        <FilterAccordionSection title="Min KDTS Score" open={accordionState.kdtsScore} onToggle={() => toggleAccordion("kdtsScore")}>
          <div className="px-5 pb-5">
            <Input type="number" min="0" max="100" step="0.1" placeholder="e.g. 70.5" value={filters.minKdtsScore}
              onChange={(e) => updateFilter({ minKdtsScore: e.target.value })}
              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30" />
            <p className="mt-1.5 text-xs text-[#4e5a7e] dark:text-white/50">Score range: 0 – 100</p>
          </div>
        </FilterAccordionSection>
      </div>
    </aside>
  );
});

// ---------------------------------------------------------------------------
// Internal helper: shared accordion section wrapper
// ---------------------------------------------------------------------------
function FilterAccordionSection({
  title,
  open,
  onToggle,
  compact = false,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  compact?: boolean;
  children: React.ReactNode;
}) {
  const padding = compact ? "p-4" : "p-5";
  return (
    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
      <button onClick={onToggle}
        className={`w-full flex items-center justify-between ${padding} text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors`}>
        <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">{title}</h3>
        <ChevronDown className={cn("h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && children}
    </div>
  );
}
