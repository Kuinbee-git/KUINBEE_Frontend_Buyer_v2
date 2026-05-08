"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/shared/components/ui/use-mobile";
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
  const isMobile = useIsMobile();

  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [tagsPickerOpen, setTagsPickerOpen] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [categoryDraft, setCategoryDraft] = useState<string[]>(filters.categories);

  const [locationDraft, setLocationDraft] = useState({
    country: filters.country,
    state: filters.state,
    city: filters.city,
  });

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.pricingType !== "all" ? 1 : 0) +
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.minKdtsScore ? 1 : 0);

  const sortOptions = [
    "relevance",
    "newest",
    "oldest",
    "updated",
    "popular",
    "most-downloaded",
    "top-rated",
    "top-kdts",
    "price-low",
    "price-high",
  ] as SortOption[];

  const filteredCategoryItems = useMemo(
    () =>
      categoryItems.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      ),
    [categoryItems, categorySearch]
  );

  const selectedCategoryItems = useMemo(
    () => categoryItems.filter((cat) => filters.categories.includes(cat.id)),
    [categoryItems, filters.categories]
  );

  const locationSummary = [filters.country, filters.state, filters.city]
    .filter(Boolean)
    .join(" • ");

  const pickerTriggerClass =
    "w-full h-10 rounded-lg border border-[#1a2240]/20 dark:border-white/15 bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/10 dark:hover:bg-white/10 transition-colors";

  const modalInputClass =
    "h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg";

  const modalSecondaryButtonClass =
    "h-10 border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white";

  const modalPrimaryButtonClass =
    "h-10 bg-white/20 text-white border border-white/30 hover:bg-white/30";

  const filterScrollClass =
    "kuinbee-filter-scroll overscroll-contain overflow-y-auto";

  const optionButtonClass = (active: boolean) =>
    cn(
      "w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-sm border transition-all duration-150",
      active
        ? "border-[#1a2240]/30 dark:border-white/20 bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white"
        : "border-transparent text-[#4e5a7e] dark:text-white/75 hover:border-[#1a2240]/15 dark:hover:border-white/10 hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
    );

  const addTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;
    if (filters.tags.includes(normalized)) {
      setTagInput("");
      return;
    }
    updateFilter({ tags: [...filters.tags, normalized] });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateFilter({ tags: filters.tags.filter((item) => item !== tag) });
  };

  const toggleCategoryDraft = (categoryId: string) => {
    setCategoryDraft((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const applyCategoryDraft = () => {
    updateFilter({ categories: Array.from(new Set(categoryDraft)) });
    setCategoryPickerOpen(false);
  };

  const applyLocationDraft = () => {
    updateFilter({
      country: locationDraft.country.trim(),
      state: locationDraft.state.trim(),
      city: locationDraft.city.trim(),
    });
    setLocationPickerOpen(false);
  };

  const syncLocationDraftFromFilters = () => {
    setLocationDraft({
      country: filters.country,
      state: filters.state,
      city: filters.city,
    });
  };

  const filterSections = (
    <>
      <FilterAccordionSection title={`Sort: ${SORT_LABELS[filters.sortOrder]}`} open={accordionState.sort} onToggle={() => toggleAccordion("sort")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5")}>
          <div className="flex flex-col gap-1">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  updateFilter({ sortOrder: option });
                  if (accordionState.sort) toggleAccordion("sort");
                }}
                className={optionButtonClass(filters.sortOrder === option)}
              >
                {SORT_LABELS[option]}
                {filters.sortOrder === option && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection title="Category" open={accordionState.category} onToggle={() => toggleAccordion("category")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5", "space-y-4")}>
          <div className="flex flex-wrap gap-2 pt-1">
            {Array.from(new Set([...selectedCategoryItems, ...categoryItems.slice(0, 10)]))
              .slice(0, Math.max(8, selectedCategoryItems.length))
              .map((cat) => {
                const isSelected = filters.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                        const nextCategories = isSelected
                          ? filters.categories.filter((id) => id !== cat.id)
                          : [...filters.categories, cat.id];
                        updateFilter({ categories: nextCategories });
                    }}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
                      isSelected
                        ? "border-[#1a2240] bg-[#1a2240] text-white shadow-[0_2px_8px_-2px_rgba(26,34,64,0.3)] dark:border-white dark:bg-white dark:text-[#1a2240] dark:shadow-[0_2px_8px_-2px_rgba(255,255,255,0.3)] ring-1 ring-offset-1 ring-[#1a2240]/10 dark:ring-white/10 dark:ring-offset-[#1e2847]"
                        : "border-[#1a2240]/15 bg-transparent text-[#4e5a7e] hover:border-[#1a2240]/30 hover:bg-[#1a2240]/5 dark:border-white/15 dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/5"
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>
          <button
            onClick={() => {
              setCategorySearch("");
              setCategoryDraft(filters.categories);
              setCategoryPickerOpen(true);
            }}
            className="group flex w-full items-center justify-between rounded-lg border border-[#1a2240]/10 dark:border-white/10 bg-[#1a2240]/[0.02] dark:bg-white/[0.02] px-3 py-2.5 text-left text-xs font-medium text-[#1a2240] dark:text-white transition-all hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
          >
            <span>Browse all {categoryItems.length} categories</span>
            <span className="text-[#4e5a7e] dark:text-white/50 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection title="Pricing Type" open={accordionState.pricing} onToggle={() => toggleAccordion("pricing")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5", "space-y-1")}>
          {(["all", "free", "paid"] as const).map((type) => (
            <button
              key={type}
              onClick={() => updateFilter({ pricingType: type })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 capitalize",
                filters.pricingType === type
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
              )}
            >
              {type === "all" ? "All Pricing Types" : type}
            </button>
          ))}
        </div>
      </FilterAccordionSection>

      {filters.pricingType === "paid" && (
        <FilterAccordionSection title="Price Range" open={accordionState.priceRange} onToggle={() => toggleAccordion("priceRange")} compact={isMobile}>
          <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5", "space-y-3")}>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, min: e.target.value } })}
                className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updateFilter({ priceRange: { ...filters.priceRange, max: e.target.value } })}
                className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">Currency</label>
              <Select value={filters.currency} onValueChange={(value) => updateFilter({ currency: value as FilterState["currency"] })}>
                <SelectTrigger className="h-9 rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1e2847] border-[#1a2240]/20 dark:border-white/20">
                  {CURRENCIES.map((cur: string) => (
                    <SelectItem key={cur} value={cur} className="text-[#1a2240] dark:text-white">
                      {cur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterAccordionSection>
      )}

      <FilterAccordionSection title="Location" open={accordionState.location} onToggle={() => toggleAccordion("location")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5", "space-y-3")}>
          {locationSummary && (
            <div className="rounded-lg border border-[#1a2240]/15 dark:border-white/10 bg-[#1a2240]/5 dark:bg-white/5 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#4e5a7e] dark:text-white/50">Selected location</p>
              <p className="mt-1 text-sm font-medium text-[#1a2240] dark:text-white">{locationSummary}</p>
            </div>
          )}
          <Button
            size="sm"
            className={cn("justify-center", pickerTriggerClass)}
            onClick={() => {
              syncLocationDraftFromFilters();
              setLocationPickerOpen(true);
            }}
          >
            Edit Location
          </Button>
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection title="Tags" open={accordionState.tags} onToggle={() => toggleAccordion("tags")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5", "space-y-3")}>
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-[#1a2240]/15 dark:border-white/10 bg-[#1a2240]/5 dark:bg-white/5 p-2.5 min-h-10">
            {filters.tags.length > 0 ? (
              filters.tags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#1a2240]/15 dark:border-white/15 px-2 py-0.5 text-xs text-[#1a2240] dark:text-white hover:bg-[#1a2240]/10 dark:hover:bg-white/10"
                >
                  {tag}
                  <span className="text-[#4e5a7e] dark:text-white/60">×</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-[#4e5a7e] dark:text-white/50">No tags selected</p>
            )}
            {filters.tags.length > 6 && <Chip>+{filters.tags.length - 6} more</Chip>}
          </div>
          <Button size="sm" className={cn("justify-center", pickerTriggerClass)} onClick={() => setTagsPickerOpen(true)}>
            Edit Tags
          </Button>
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection title="Min KDTS Score" open={accordionState.kdtsScore} onToggle={() => toggleAccordion("kdtsScore")} compact={isMobile}>
        <div className={cn(isMobile ? "px-4 pb-4" : "px-5 pb-5")}>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="e.g. 70.5"
            value={filters.minKdtsScore}
            onChange={(e) => updateFilter({ minKdtsScore: e.target.value })}
            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
          />
          <p className="mt-1.5 text-xs text-[#4e5a7e] dark:text-white/50">Score range: 0 – 100</p>
        </div>
      </FilterAccordionSection>
    </>
  );

  return (
    <>
      <aside className="space-y-4 lg:space-y-6 lg:sticky lg:top-24 self-start">
        <details className="lg:hidden bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
          <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-[#1a2240] dark:text-white">
            <span>Filters {hasActiveFilters && `(${activeCount} active)`}</span>
            <ChevronDown className="h-4 w-4 text-[#4e5a7e] dark:text-white/60" />
          </summary>
          <div
            data-lenis-prevent
            className={cn("px-4 pb-4 space-y-4 max-h-[70vh]", filterScrollClass)}
          >
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full text-xs font-medium text-[#1a2240] dark:text-white/80 hover:text-[#4e5a7e] dark:hover:text-white underline text-center py-2"
              >
                Clear All Filters
              </button>
            )}
            {filterSections}
          </div>
        </details>

        <div
          data-lenis-prevent
          className={cn(
            "hidden lg:block space-y-6 max-h-[calc(100vh-7.5rem)]",
            filterScrollClass
          )}
        >
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-xl py-2.5 px-4 transition-colors text-center"
            >
              Clear All Filters
            </button>
          )}
          {filterSections}
        </div>
      </aside>

      <ResponsivePicker
        isMobile={isMobile}
        open={categoryPickerOpen}
        onOpenChange={setCategoryPickerOpen}
        title="Choose Category"
        description="Search and select a category"
        dialogClassName="max-w-5xl"
        animateOnOpen
        footer={
          <>
            <Button
              variant="outline"
              className={modalSecondaryButtonClass}
              onClick={() => {
                setCategoryDraft([]);
                updateFilter({ categories: [] });
              }}
            >
              Clear Selection
            </Button>
            <Button
              className={modalPrimaryButtonClass}
              onClick={applyCategoryDraft}
            >
              Apply
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            placeholder="Search categories"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className={modalInputClass}
          />
          <div
            data-lenis-prevent
            className="kuinbee-filter-scroll max-h-[520px] overflow-y-auto overscroll-contain rounded-lg border border-white/20 bg-white/5 p-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategoryDraft([])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCategoryDraft([]);
                  }
                }}
                className={cn(
                  "group flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  categoryDraft.length === 0
                    ? "border-white/35 bg-white/20"
                    : "border-white/15 hover:bg-white/10"
                )}
              >
                <Checkbox
                  checked={categoryDraft.length === 0}
                  className="pointer-events-none border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#1a2240]"
                />
                <span className="text-sm font-medium text-white">All Categories</span>
              </div>
              {filteredCategoryItems.map((cat) => (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCategoryDraft(cat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleCategoryDraft(cat.id);
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    categoryDraft.includes(cat.id)
                      ? "border-white/35 bg-white/20"
                      : "border-white/15 hover:bg-white/10"
                  )}
                >
                  <Checkbox
                    checked={categoryDraft.includes(cat.id)}
                    className="pointer-events-none border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#1a2240]"
                  />
                  <span className="text-sm text-white/90 line-clamp-2">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResponsivePicker>

      <ResponsivePicker
        isMobile={isMobile}
        open={locationPickerOpen}
        onOpenChange={(open) => {
          if (open) syncLocationDraftFromFilters();
          setLocationPickerOpen(open);
        }}
        title="Edit Location"
        description="Apply country, state, and city filters"
        animateOnOpen
        footer={
          <>
            <Button
              variant="outline"
              className={modalSecondaryButtonClass}
              onClick={() => {
                setLocationPickerOpen(false);
                syncLocationDraftFromFilters();
              }}
            >
              Cancel
            </Button>
            <Button className={modalPrimaryButtonClass} onClick={applyLocationDraft}>Apply</Button>
          </>
        }
      >
        <div className="space-y-3">
          {(["country", "state", "city"] as const).map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60 capitalize">{field}</label>
              <Input
                placeholder={field === "country" ? "e.g. India" : field === "state" ? "e.g. Maharashtra" : "e.g. Mumbai"}
                value={locationDraft[field]}
                className={modalInputClass}
                onChange={(e) =>
                  setLocationDraft((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </ResponsivePicker>

      <ResponsivePicker
        isMobile={isMobile}
        open={tagsPickerOpen}
        onOpenChange={setTagsPickerOpen}
        title="Edit Tags"
        description="Add tags one by one and remove existing tags"
        animateOnOpen
        footer={
          <>
            <Button variant="outline" className={modalSecondaryButtonClass} onClick={() => updateFilter({ tags: [] })}>
              Clear Tags
            </Button>
            <Button className={modalPrimaryButtonClass} onClick={() => setTagsPickerOpen(false)}>Done</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type tag and press Enter"
              value={tagInput}
              className={modalInputClass}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" className={modalSecondaryButtonClass} onClick={addTag}>
              Add
            </Button>
          </div>
          <div
            data-lenis-prevent
            className="kuinbee-filter-scroll max-h-[240px] overflow-y-auto overscroll-contain rounded-lg border border-[#1a2240]/15 dark:border-white/10 bg-[#1a2240]/[0.03] dark:bg-white/[0.03] p-3"
          >
            {filters.tags.length === 0 ? (
              <p className="text-xs text-[#4e5a7e] dark:text-white/50">No tags selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {filters.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => removeTag(tag)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white"
                  >
                    {tag}
                    <span className="hover:text-red-500 dark:hover:text-red-400">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ResponsivePicker>
    </>
  );
});

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
        active
          ? "border-[#1a2240]/25 bg-[#1a2240]/10 text-[#1a2240] dark:border-white/20 dark:bg-white/10 dark:text-white"
          : "border-[#1a2240]/15 text-[#4e5a7e] dark:border-white/15 dark:text-white/70"
      )}
    >
      {children}
    </span>
  );
}

function ResponsivePicker({
  isMobile,
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dialogClassName,
  animateOnOpen = false,
}: {
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dialogClassName?: string;
  animateOnOpen?: boolean;
}) {
  const [entered, setEntered] = useState(!animateOnOpen);

  useEffect(() => {
    if (!animateOnOpen) return;
    const frame = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(frame);
  }, [open, animateOnOpen]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] border-[#1a2240]/20 dark:border-white/10 bg-white dark:bg-[#0f1729]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div
            data-lenis-prevent
            className="kuinbee-filter-scroll px-4 pb-2 overflow-y-auto overscroll-contain"
          >
            {children}
          </div>
          {footer && <DrawerFooter className="pt-2">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      <div
        className={cn(
          "absolute inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm transition-opacity duration-200",
          entered ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className={cn(
        "kuinbee-filter-scroll relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain transition-all duration-200 ease-out",
        animateOnOpen && (entered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-2"),
        dialogClassName
      )}>
        <div className="relative overflow-hidden rounded-lg border border-primary/30 dark:border-white/30 bg-[#1a2240] dark:bg-[#0f1729] shadow-xl p-6 sm:p-8 text-white">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-4 pr-12">
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>

          <div data-lenis-prevent className="overflow-y-auto overscroll-contain">{children}</div>

          {footer && <div className="mt-6 pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${padding} text-left hover:bg-[#1a2240]/4 dark:hover:bg-white/5 transition-colors`}
      >
        <h3 className="text-[11px] font-semibold text-[#1a2240] dark:text-white uppercase tracking-[0.14em]">{title}</h3>
        <ChevronDown className={cn("h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300 ease-in-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
