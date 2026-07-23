"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { useCustomCollectionServices } from "@/hooks/api/useCustomCollection";
import { useCategories } from "@/hooks/api/useMarketplace";
import {
  COLLECTION_METHODS,
  FORMATS,
  GEOGRAPHIES,
  INDUSTRIES,
  LANGUAGES,
  optionLabel,
} from "@/features/custom-collection/customCollection.utils";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/utils/cn";
import type {
  CustomCollectionService,
  CustomCollectionSort,
} from "@/types/custom-collection.types";

const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((mod) => ({
    default: mod.LandingFooter,
  }))
);

const PAGE_SIZE = 9;

type Filters = {
  search: string;
  categoryId: string;
  collectionMethods: string[];
  industries: string[];
  geographies: string[];
  supportedFormats: string[];
  languages: string[];
  sort: CustomCollectionSort;
  page: number;
};

const emptyFilters: Filters = {
  search: "",
  categoryId: "ALL",
  collectionMethods: [],
  industries: [],
  geographies: [],
  supportedFormats: [],
  languages: [],
  sort: "NEWEST",
  page: 1,
};

const sortLabels: Record<CustomCollectionSort, string> = {
  NEWEST: "Newest",
  TITLE_ASC: "Title A–Z",
  TITLE_DESC: "Title Z–A",
};

const readList = (params: URLSearchParams, key: string) =>
  params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

const readInitialFilters = (params: URLSearchParams): Filters => {
  const requestedSort = params.get("sort");
  const requestedPage = Number(params.get("page"));

  return {
    search: params.get("q")?.trim() ?? "",
    categoryId: params.get("categoryId") ?? "ALL",
    collectionMethods: readList(params, "collectionMethods"),
    industries: readList(params, "industries"),
    geographies: readList(params, "geographies"),
    supportedFormats: readList(params, "supportedFormats"),
    languages: readList(params, "languages"),
    sort:
      requestedSort === "TITLE_ASC" || requestedSort === "TITLE_DESC"
        ? requestedSort
        : "NEWEST",
    page:
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
};

export function CustomCollectionMarketplacePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() =>
    readInitialFilters(new URLSearchParams(searchParams.toString()))
  );
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerClosing, setBannerClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBannerVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseBanner = () => {
    setBannerClosing(true);
    setTimeout(() => {
      setBannerVisible(false);
      setBannerClosing(false);
    }, 400);
  };

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(filters.search.trim()),
      350
    );
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search.trim()) params.set("q", filters.search.trim());
    if (filters.categoryId !== "ALL")
      params.set("categoryId", filters.categoryId);
    filters.collectionMethods.forEach((value) =>
      params.append("collectionMethods", value)
    );
    filters.industries.forEach((value) => params.append("industries", value));
    filters.geographies.forEach((value) => params.append("geographies", value));
    filters.supportedFormats.forEach((value) =>
      params.append("supportedFormats", value)
    );
    filters.languages.forEach((value) => params.append("languages", value));
    if (filters.sort !== "NEWEST") params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", String(filters.page));

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const queryInput = useMemo(
    () => ({
      page: filters.page,
      pageSize: PAGE_SIZE,
      q: debouncedSearch || undefined,
      categoryId: filters.categoryId === "ALL" ? undefined : filters.categoryId,
      collectionMethods:
        filters.collectionMethods.length > 0
          ? filters.collectionMethods
          : undefined,
      industries:
        filters.industries.length > 0 ? filters.industries : undefined,
      geographies:
        filters.geographies.length > 0 ? filters.geographies : undefined,
      supportedFormats:
        filters.supportedFormats.length > 0
          ? filters.supportedFormats
          : undefined,
      languages: filters.languages.length > 0 ? filters.languages : undefined,
      sort: filters.sort,
    }),
    [debouncedSearch, filters]
  );

  const servicesQuery = useCustomCollectionServices(queryInput);
  const categoriesQuery = useCategories({ page: 1, pageSize: 100 });
  const services = servicesQuery.data?.items ?? [];
  const total = servicesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categories = categoriesQuery.data?.items ?? [];

  const activeFilterCount =
    (filters.categoryId !== "ALL" ? 1 : 0) +
    (filters.collectionMethods.length > 0 ? 1 : 0) +
    (filters.industries.length > 0 ? 1 : 0) +
    (filters.geographies.length > 0 ? 1 : 0) +
    (filters.supportedFormats.length > 0 ? 1 : 0) +
    (filters.languages.length > 0 ? 1 : 0);

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    activeFilterCount > 0 ||
    filters.sort !== "NEWEST";

  const updateFilters = (updates: Partial<Filters>) =>
    setFilters((current) => ({
      ...current,
      ...updates,
      page: Object.prototype.hasOwnProperty.call(updates, "page")
        ? (updates.page ?? current.page)
        : 1,
    }));

  const clearFilters = () => {
    setFilters(emptyFilters);
    setMobileFiltersOpen(false);
  };

  return (
    <main className="min-h-screen relative">
      {/* Sticky Header Group */}
      <div className="sticky top-0 z-50 flex flex-col w-full">
        {/* Top Dismissible Banner */}
        <div
          className={cn(
            "grid transition-all duration-400 ease-in-out origin-top",
            bannerVisible && !bannerClosing
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="relative isolate flex items-center justify-center gap-x-6 bg-rose-600 px-6 py-2.5 sm:px-3.5 shadow-sm border-b border-rose-700 dark:bg-white/[0.02] dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_4px_24px_-8px_rgba(255,255,255,0.1)]">
              <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.white/0.1),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.white/0.05),transparent)]"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-white/90">
                  <strong className="font-semibold tracking-wide text-white">
                    Governed Dataset Marketplace
                  </strong>
                  <svg
                    viewBox="0 0 2 2"
                    className="mx-2 hidden md:inline h-0.5 w-0.5 fill-current text-white/50"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <span className="hidden md:inline">
                    Looking for ready-to-use datasets?{" "}
                  </span>
                  Browse verified datasets from approved suppliers.
                </p>
                <Link
                  href="/datasets"
                  className="inline-flex items-center gap-1.5 flex-none rounded-md bg-white px-3.5 py-1 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white/[0.04] dark:backdrop-blur-md dark:border dark:border-white/10 dark:text-white/90 dark:hover:bg-white/[0.08] dark:hover:border-white/20"
                >
                  <span>Browse Datasets</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-1 justify-end absolute right-0 pr-4 sm:pr-6">
                <button
                  type="button"
                  onClick={handleCloseBanner}
                  className="-m-3 p-3 focus-visible:outline-offset-[-4px] hover:bg-white/10 rounded-full transition-colors"
                >
                  <span className="sr-only">Dismiss</span>
                  <X
                    className="h-5 w-5 text-white/80 hover:text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full z-40 bg-background/80 backdrop-blur-lg border-b border-border/40">
          <NotchNavigation lite />
        </div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {/* Main Content */}
      <section className="relative pt-20 md:pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Custom Data Collection Services
            </h1>
            <p className="text-sm text-muted-foreground mb-2 max-w-3xl">
              Compare approved services from verified suppliers, review their
              methods and coverage, and send Kuinbee a scoped project request.
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {servicesQuery.isLoading
                ? "Loading…"
                : `${total} service${total === 1 ? "" : "s"} available`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block self-start sticky top-24">
              <FilterPanel
                filters={filters}
                categories={categories}
                updateFilters={updateFilters}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </aside>

            {/* Main Content Column */}
            <div id="service-results" className="scroll-mt-28">
              {/* Search + Sort Container */}
              <div className="mb-6 md:mb-8 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4e5a7e] dark:text-white/60" />
                    <Input
                      value={filters.search}
                      onChange={(event) =>
                        updateFilters({ search: event.target.value })
                      }
                      placeholder="Search services, methods, suppliers, or industries"
                      aria-label="Search custom collection services"
                      className="h-11 pl-11 pr-10 text-base rounded-xl border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 placeholder:text-sm focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 shadow-sm"
                    />
                    {filters.search && (
                      <button
                        type="button"
                        onClick={() => updateFilters({ search: "" })}
                        className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#4e5a7e] dark:text-white/60 transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Clear search"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="inline-flex items-center gap-2 h-11 px-4 flex-1 text-sm font-medium rounded-xl border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors lg:hidden"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="rounded-full bg-[#1a2240] dark:bg-white px-1.5 py-0.5 text-[10px] leading-none text-white dark:text-[#1a2240]">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                    <Select
                      value={filters.sort}
                      onValueChange={(value) =>
                        updateFilters({ sort: value as CustomCollectionSort })
                      }
                    >
                      <SelectTrigger className="h-11 min-w-[140px] flex-1 rounded-xl border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white lg:flex-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(sortLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Service Grid — min-height prevents layout collapse during loading */}
              <div className="min-h-[400px]">
                {servicesQuery.isLoading ? (
                  <ServiceGridSkeleton />
                ) : servicesQuery.isError ? (
                  <ErrorState onRetry={() => servicesQuery.refetch()} />
                ) : services.length === 0 ? (
                  <EmptyState
                    hasActiveFilters={hasActiveFilters}
                    onClear={clearFilters}
                  />
                ) : (
                  <div
                    className={cn(
                      "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
                      servicesQuery.isFetching && "opacity-70 transition-opacity"
                    )}
                  >
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                    <CustomRequestCallout />
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!servicesQuery.isError && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 p-4 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
                  <button
                    onClick={() => {
                      updateFilters({ page: Math.max(1, filters.page - 1) });
                      document
                        .getElementById("service-results")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={filters.page <= 1 || servicesQuery.isFetching}
                    className={cn(
                      "inline-flex items-center gap-2 h-8 px-3 text-sm font-medium rounded-lg border transition-colors",
                      filters.page <= 1 || servicesQuery.isFetching
                        ? "border-border/40 dark:border-white/10 text-[#4e5a7e]/50 dark:text-white/40 cursor-not-allowed"
                        : "border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white bg-white/95 dark:bg-white/10 hover:bg-[#1a2240]/5 dark:hover:bg-white/20"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-sm text-[#1a2240] dark:text-white">
                      {filters.page}
                      <span className="text-[#4e5a7e] dark:text-white/70">
                        {" "}
                        / {totalPages}
                      </span>
                    </span>
                    <span className="hidden sm:inline text-xs text-[#4e5a7e] dark:text-white/70">
                      · {total} total
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      updateFilters({
                        page: Math.min(totalPages, filters.page + 1),
                      });
                      document
                        .getElementById("service-results")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={
                      filters.page >= totalPages || servicesQuery.isFetching
                    }
                    className={cn(
                      "inline-flex items-center gap-2 h-8 px-3 text-sm font-medium rounded-lg border transition-colors",
                      filters.page >= totalPages || servicesQuery.isFetching
                        ? "border-border/40 dark:border-white/10 text-[#4e5a7e]/50 dark:text-white/40 cursor-not-allowed"
                        : "border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white bg-white/95 dark:bg-white/10 hover:bg-[#1a2240]/5 dark:hover:bg-white/20"
                    )}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Suspense fallback={<div className="bg-[#0f1729] h-32" />}>
        <LandingFooter />
      </Suspense>

      {/* Mobile Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="left"
          className="w-[92vw] overflow-y-auto border-border/40 bg-background p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border/40 px-5 py-5 text-left">
            <SheetTitle>Filter services</SheetTitle>
            <SheetDescription>
              Narrow the marketplace by capability and coverage.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 py-4">
            <FilterPanel
              filters={filters}
              categories={categories}
              updateFilters={updateFilters}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
          <div className="sticky bottom-0 flex gap-3 border-t border-border/40 bg-background/95 p-4 backdrop-blur">
            <button
              onClick={clearFilters}
              className="inline-flex flex-1 items-center justify-center h-9 px-4 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="inline-flex flex-1 items-center justify-center h-9 px-4 text-sm font-medium rounded-lg bg-[#1a2240] dark:bg-white text-white dark:text-[#1a2240] hover:bg-[#1a2240]/90 dark:hover:bg-white/90 transition-colors"
            >
              Show {total} result{total === 1 ? "" : "s"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

// How many checkboxes to show inline before "Show all" button
const CHECKBOX_INLINE_MAX = 5;

function FilterPanel({
  filters,
  categories,
  updateFilters,
  clearFilters,
  activeFilterCount,
}: {
  filters: Filters;
  categories: Array<{ id: string; name: string }>;
  updateFilters: (updates: Partial<Filters>) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    method: true,
    industry: true,
    geography: false,
    format: false,
    language: false,
  });
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);
  const [catSearch, setCatSearch] = useState("");

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const selectedCat = categories.find((c) => c.id === filters.categoryId);

  return (
    <>
      <div className="space-y-4">
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-xl py-2.5 px-4 transition-colors text-center"
          >
            Clear All Filters
          </button>
        )}

        {/* Category — selected chip + browse dialog */}
        <FilterSection
          title="Category"
          open={openSections.category}
          onToggle={() => toggle("category")}
          badge={filters.categoryId !== "ALL" ? 1 : 0}
        >
          <div className="px-5 pb-5 space-y-3">
            {selectedCat && (
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a2240] bg-[#1a2240] text-white px-3 py-1.5 text-xs font-medium dark:border-white dark:bg-white dark:text-[#1a2240]">
                  {selectedCat.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFilters({ categoryId: "ALL" });
                    }}
                    className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Remove category"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            <button
              onClick={() => setPickerOpen("category")}
              className="group flex w-full items-center justify-between rounded-lg border border-[#1a2240]/10 dark:border-white/10 bg-[#1a2240]/[0.02] dark:bg-white/[0.02] px-3 py-2.5 text-left text-xs font-medium text-[#1a2240] dark:text-white transition-all hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
            >
              <span>
                {selectedCat ? "Change category" : `Browse all ${categories.length} categories`}
              </span>
              <span className="text-[#4e5a7e] dark:text-white/50 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </FilterSection>

        <FilterCheckboxSection
          title="Collection Method"
          open={openSections.method}
          onToggle={() => toggle("method")}
          options={COLLECTION_METHODS}
          selected={filters.collectionMethods}
          setSelected={(collectionMethods) => updateFilters({ collectionMethods })}
          onBrowseAll={() => setPickerOpen("method")}
        />

        <FilterCheckboxSection
          title="Industry"
          open={openSections.industry}
          onToggle={() => toggle("industry")}
          options={INDUSTRIES}
          selected={filters.industries}
          setSelected={(industries) => updateFilters({ industries })}
          onBrowseAll={() => setPickerOpen("industry")}
        />

        <FilterCheckboxSection
          title="Geography"
          open={openSections.geography}
          onToggle={() => toggle("geography")}
          options={GEOGRAPHIES}
          selected={filters.geographies}
          setSelected={(geographies) => updateFilters({ geographies })}
          onBrowseAll={() => setPickerOpen("geography")}
        />

        <FilterCheckboxSection
          title="Delivery Format"
          open={openSections.format}
          onToggle={() => toggle("format")}
          options={FORMATS}
          selected={filters.supportedFormats}
          setSelected={(supportedFormats) => updateFilters({ supportedFormats })}
          onBrowseAll={() => setPickerOpen("format")}
        />

        <FilterCheckboxSection
          title="Language"
          open={openSections.language}
          onToggle={() => toggle("language")}
          options={LANGUAGES}
          selected={filters.languages}
          setSelected={(languages) => updateFilters({ languages })}
          onBrowseAll={() => setPickerOpen("language")}
        />
      </div>

      {/* Category picker — large dark modal matching datasets ResponsivePicker */}
      <FilterPickerDialog
        open={pickerOpen === "category"}
        onClose={() => { setPickerOpen(null); setCatSearch(""); }}
        title="Choose Category"
        description="Search and select a category"
        onClear={filters.categoryId !== "ALL" ? () => updateFilters({ categoryId: "ALL" }) : undefined}
        clearLabel="Clear Selection"
        applyLabel="Apply"
        onApply={() => { setPickerOpen(null); setCatSearch(""); }}
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              placeholder="Search categories"
              className="h-11 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div className="max-h-[480px] overflow-y-auto overscroll-contain rounded-lg border border-white/20 bg-white/5 p-3" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[{ id: "ALL", name: "All Categories" }, ...categories]
                .filter((cat) => cat.name.toLowerCase().includes(catSearch.toLowerCase()))
                .map((cat) => {
                  const isSelected = filters.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        updateFilters({ categoryId: cat.id });
                        setPickerOpen(null);
                        setCatSearch("");
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        isSelected
                          ? "border-white/35 bg-white/20 text-white font-medium"
                          : "border-white/15 text-white/80 hover:bg-white/10"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#1a2240]"
                      />
                      <span className="line-clamp-2">{cat.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </FilterPickerDialog>

      {/* Checkbox picker dialogs — large dark modal */}
      {(
        [
          { key: "method", title: "Collection Method", description: "Filter by data collection method", options: COLLECTION_METHODS, selected: filters.collectionMethods, setSelected: (v: string[]) => updateFilters({ collectionMethods: v }) },
          { key: "industry", title: "Industry", description: "Filter by target industry", options: INDUSTRIES, selected: filters.industries, setSelected: (v: string[]) => updateFilters({ industries: v }) },
          { key: "geography", title: "Geography", description: "Filter by coverage region", options: GEOGRAPHIES, selected: filters.geographies, setSelected: (v: string[]) => updateFilters({ geographies: v }) },
          { key: "format", title: "Delivery Format", description: "Filter by output format", options: FORMATS, selected: filters.supportedFormats, setSelected: (v: string[]) => updateFilters({ supportedFormats: v }) },
          { key: "language", title: "Language", description: "Filter by supported language", options: LANGUAGES, selected: filters.languages, setSelected: (v: string[]) => updateFilters({ languages: v }) },
        ] as const
      ).map(({ key, title, description, options, selected, setSelected }) => (
        <FilterPickerDialog
          key={key}
          open={pickerOpen === key}
          onClose={() => setPickerOpen(null)}
          title={title}
          description={description}
          onClear={selected.length > 0 ? () => setSelected([]) : undefined}
          clearLabel="Clear Selection"
          applyLabel="Done"
          onApply={() => setPickerOpen(null)}
          selectedCount={selected.length}
        >
          <div className="max-h-[480px] overflow-y-auto overscroll-contain rounded-lg border border-white/20 bg-white/5 p-3" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {options.map((option) => {
                const checked = selected.includes(option);
                const id = `picker-${key}-${option}`;
                return (
                  <div
                    key={option}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSelected(
                        checked
                          ? selected.filter((item) => item !== option)
                          : [...selected, option]
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(
                          checked
                            ? selected.filter((item) => item !== option)
                            : [...selected, option]
                        );
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm cursor-pointer transition-colors",
                      checked
                        ? "border-white/35 bg-white/20 text-white font-medium"
                        : "border-white/15 text-white/80 hover:bg-white/10"
                    )}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      className="pointer-events-none border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#1a2240]"
                    />
                    <span>{optionLabel(option)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </FilterPickerDialog>
      ))}
    </>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  badge,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/4 dark:hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-[#1a2240] dark:text-white uppercase tracking-[0.14em]">
            {title}
          </h3>
          {badge != null && badge > 0 && (
            <span className="rounded-full bg-[#1a2240]/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-[#1a2240] dark:text-white">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function FilterCheckboxSection({
  title,
  open,
  onToggle,
  options,
  selected,
  setSelected,
  onBrowseAll,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  options: readonly string[];
  selected: string[];
  setSelected: (values: string[]) => void;
  onBrowseAll: () => void;
}) {
  const visibleOptions = options.slice(0, CHECKBOX_INLINE_MAX);
  const hasMore = options.length > CHECKBOX_INLINE_MAX;

  return (
    <FilterSection
      title={title}
      open={open}
      onToggle={onToggle}
      badge={selected.length}
    >
      <div className="px-5 pb-5 space-y-0.5">
        {visibleOptions.map((option) => {
          const checked = selected.includes(option);
          const id = `inline-${title}-${option}`;
          return (
            <label
              key={option}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#4e5a7e] dark:text-white/75 transition-colors hover:bg-[#1a2240]/5 dark:hover:bg-white/5 hover:text-[#1a2240] dark:hover:text-white"
            >
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(next) =>
                  setSelected(
                    next
                      ? [...selected, option]
                      : selected.filter((item) => item !== option)
                  )
                }
              />
              <span>{optionLabel(option)}</span>
            </label>
          );
        })}
        {hasMore && (
          <button
            onClick={onBrowseAll}
            className="group mt-1 flex w-full items-center justify-between rounded-lg border border-[#1a2240]/10 dark:border-white/10 bg-[#1a2240]/[0.02] dark:bg-white/[0.02] px-3 py-2.5 text-left text-xs font-medium text-[#1a2240] dark:text-white transition-all hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
          >
            <span>
              Show all {options.length}
              {selected.length > 0 ? ` · ${selected.length} selected` : ""}
            </span>
            <span className="text-[#4e5a7e] dark:text-white/50 transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        )}
      </div>
    </FilterSection>
  );
}

function FilterPickerDialog({
  open,
  onClose,
  title,
  description,
  onClear,
  clearLabel = "Clear Selection",
  applyLabel = "Done",
  onApply,
  selectedCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onClear?: () => void;
  clearLabel?: string;
  applyLabel?: string;
  onApply?: () => void;
  selectedCount?: number;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 sm:px-0">
      <div
        className={cn(
          "absolute inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm transition-opacity duration-200",
          entered ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] transition-all duration-200 ease-out",
          entered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-2"
        )}
      >
        <div className="relative overflow-hidden rounded-lg border border-primary/30 dark:border-white/30 bg-[#1a2240] dark:bg-[#0f1729] shadow-xl p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-4 pr-12">
            <h3 className="text-2xl font-semibold text-white">
              {title}
              {selectedCount != null && selectedCount > 0 && (
                <span className="ml-2.5 rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-medium text-white/80 align-middle">
                  {selectedCount}
                </span>
              )}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-white/70">{description}</p>
            )}
          </div>
          <div className="overflow-y-auto overscroll-contain" style={{ scrollbarWidth: "none" }}>
            {children}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {onClear && (
              <button
                onClick={onClear}
                className="h-10 px-4 rounded-md border border-white/30 bg-white/5 text-sm text-white hover:bg-white/10 transition-colors"
              >
                {clearLabel}
              </button>
            )}
            <button
              onClick={onApply ?? onClose}
              className="h-10 px-4 rounded-md border border-white/30 bg-white/20 text-sm font-medium text-white hover:bg-white/30 transition-colors"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

function ServiceCard({ service }: { service: CustomCollectionService }) {
  const revision = service.publishedRevision;
  const methods = revision.collectionMethods.slice(0, 2);
  const initials = service.supplier.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/data-request/services/${service.slug}`}
      className="group flex min-h-[440px] flex-col overflow-hidden rounded-xl border border-border/40 dark:border-white/10 bg-white dark:bg-[#1e2847] shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#1a2240]/30 dark:hover:border-white/20 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border/40 dark:border-white/10 bg-muted/50">
        {revision.coverImage ? (
          <Image
            src={revision.coverImage.url}
            alt={`${revision.title} service cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(72,96,158,0.18),transparent_45%),linear-gradient(145deg,rgba(26,34,64,0.04),rgba(26,34,64,0.11))] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(93,121,194,0.2),transparent_45%),linear-gradient(145deg,rgba(255,255,255,0.025),rgba(255,255,255,0.08))]">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-[#1a2240]/20 dark:text-white/30">
              {initials || "KS"}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/50 bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-[#111a31]/90">
          Kuinbee reviewed
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-[#1a2240]/60 dark:text-white/60">
            {revision.primaryCategory.name}
          </p>
          <span className="shrink-0 text-[11px] text-[#4e5a7e] dark:text-white/50">
            v{revision.version}
          </span>
        </div>
        <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-[#1a2240] dark:text-white transition-colors group-hover:text-[#2b61eb] dark:group-hover:text-white/90">
          {revision.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4e5a7e] dark:text-white/70">
          {revision.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {methods.map((method) => (
            <span
              key={method}
              className="rounded-md border border-[#1a2240]/15 dark:border-white/15 bg-[#1a2240]/5 dark:bg-white/5 px-2 py-1 text-[11px] text-[#4e5a7e] dark:text-white/60"
            >
              {optionLabel(method)}
            </span>
          ))}
          {revision.collectionMethods.length > methods.length && (
            <span className="rounded-md border border-[#1a2240]/15 dark:border-white/15 bg-[#1a2240]/5 dark:bg-white/5 px-2 py-1 text-[11px] text-[#4e5a7e] dark:text-white/60">
              +{revision.collectionMethods.length - methods.length}
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border/40 dark:border-white/10 pt-4 text-xs text-[#4e5a7e] dark:text-white/60">
          <span>
            {revision.estimatedTurnaroundMinDays}–
            {revision.estimatedTurnaroundMaxDays} days
          </span>
          <span className="truncate text-right">
            {revision.geographies.length === 1
              ? optionLabel(revision.geographies[0])
              : `${revision.geographies.length} regions`}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <SupplierMark
              name={service.supplier.displayName}
              logoUrl={service.supplier.logoUrl}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#1a2240] dark:text-white">
                {service.supplier.displayName}
              </p>
              <p className="text-[10px] text-[#4e5a7e] dark:text-white/50">
                Verified supplier
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-[#2b61eb] dark:text-white">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

function CustomRequestCallout() {
  return (
    <Link
      href="/data-request#request-form"
      className="group relative overflow-hidden rounded-xl border border-[#1a2240]/15 bg-white p-6 shadow-sm transition-[border-color,box-shadow] hover:border-[#1a2240]/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e2847] dark:hover:border-white/20 sm:col-span-2 xl:col-span-3"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-[#1a2240] dark:bg-white" />
      <div className="grid gap-4 pl-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#4e5a7e] dark:text-white/50">
            Custom sourcing
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#1a2240] dark:text-white">
            None of these services quite fit?
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#4e5a7e] dark:text-white/70">
            Share the exact data, coverage, and delivery you need. Kuinbee will
            review the brief and source the right supplier.
          </p>
        </div>
        <span className="w-fit border-b border-[#1a2240]/35 pb-0.5 text-sm font-semibold text-[#1a2240] transition-colors group-hover:border-[#1a2240] dark:border-white/35 dark:text-white dark:group-hover:border-white">
          Start a custom brief
        </span>
      </div>
    </Link>
  );
}

function SupplierMark({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/40 dark:border-white/10 bg-muted/50 text-[10px] font-semibold text-[#1a2240] dark:text-white">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          fill
          sizes="32px"
          className="object-contain p-1"
          unoptimized
        />
      ) : (
        initials || "S"
      )}
    </span>
  );
}

function ServiceGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border/40 dark:border-white/10 bg-white dark:bg-[#1e2847]"
        >
          <div className="animate-pulse">
            <div className="aspect-[16/10] bg-muted/70 dark:bg-white/[0.06]" />
            <div className="space-y-4 p-5">
              <div className="h-3 w-24 rounded-sm bg-muted dark:bg-white/[0.06]" />
              <div className="h-6 w-4/5 rounded-sm bg-muted dark:bg-white/[0.06]" />
              <div className="h-16 w-full rounded-sm bg-muted dark:bg-white/[0.06]" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-md bg-muted dark:bg-white/[0.06]" />
                <div className="h-6 w-24 rounded-md bg-muted dark:bg-white/[0.06]" />
              </div>
              <div className="h-10 w-full rounded-md bg-muted dark:bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-8">
      <p className="font-mono text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
        ERROR
      </p>
      <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-1">
        Failed to load services
      </h3>
      <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-4">
        We could not reach the service catalogue. Your filters are still here,
        so you can retry safely.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-8">
      <p className="font-mono text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
        NO RESULTS
      </p>
      <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-1">
        {hasActiveFilters
          ? "No services match these filters"
          : "No services are published yet"}
      </h3>
      <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-4">
        {hasActiveFilters
          ? "Try broadening the capability, coverage, or search terms."
          : "You can still send Kuinbee an open brief and we will source suitable suppliers."}
      </p>
      <div className="flex flex-wrap gap-3">
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
          >
            Clear filters
          </button>
        )}
        <Link
          href="/data-request#request-form"
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
        >
          Request custom data
        </Link>
      </div>
    </div>
  );
}
