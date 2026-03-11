"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/components/ui/select";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DatasetCard } from "./dataset-card";
import { DatasetSupplierTabs } from "./dataset-supplier-tabs";

// Lazy load footer for better performance
const LandingFooter = lazy(() => import("@/features/landing/components/LandingFooter").then(mod => ({ default: mod.LandingFooter })));
import {
  Dataset,
  FilterState,
  SortOption,
  CATEGORIES,
  CURRENCIES,
  SORT_LABELS
} from "./types";
import { useDatasets, useCategories } from "@/hooks/api/useMarketplace";
import type { DatasetSortOption, DatasetListQuery, Currency } from "@/types";

// Map UI sort options to API sort format
const mapSortToAPI = (sort: SortOption): DatasetSortOption => {
  const mapping: Record<SortOption, DatasetSortOption> = {
    relevance: "relevance",
    newest: "createdAt:desc",
    oldest: "createdAt:asc",
    updated: "updatedAt:desc",
    popular: "viewCount:desc",
    "most-downloaded": "downloadCount:desc",
    "top-rated": "rating:desc",
    "top-kdts": "kdtsScore:desc",
    "price-low": "price:asc",
    "price-high": "price:desc",
  };
  return mapping[sort];
};

// Map API dataset to UI format
const mapDatasetToUI = (apiDataset: any): Dataset => ({
  id: apiDataset.id,
  datasetUniqueId: apiDataset.datasetUniqueId,
  title: apiDataset.title,
  provider: apiDataset.owner?.name || "Unknown",
  category: apiDataset.category?.name || "Uncategorized",
  secondaryCategories: [],
  license: apiDataset.license || "Unknown",
  pricing: {
    type: apiDataset.isPaid ? "paid" : "free",
    amount: apiDataset.price ? parseFloat(apiDataset.price) : undefined,
    currency: apiDataset.currency || "INR",
  },
  lastUpdated: new Date(apiDataset.updatedAt || apiDataset.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  status: apiDataset.status?.toLowerCase() || "published",
  description: apiDataset.title,
  coverage: apiDataset.location?.country || "N/A",
  records: apiDataset.dataFormatInfo?.rows || 0,
  aboutDataset: null,
  dataFormat: apiDataset.dataFormatInfo ? {
    fileFormat: apiDataset.dataFormatInfo.fileFormat,
    rows: apiDataset.dataFormatInfo.rows,
    cols: apiDataset.dataFormatInfo.cols,
    fileSize: apiDataset.dataFormatInfo.fileSize,
    compressionType: "NONE",
    encoding: "UTF-8",
    updatedAt: apiDataset.updatedAt,
  } : null,
  features: [],
  source: null,
  location: apiDataset.location ? {
    region: null,
    country: apiDataset.location.country,
    state: apiDataset.location.state,
    city: apiDataset.location.city,
    coordinates: null,
    coverage: null,
  } : null,
  tags: apiDataset.tags || [],
  downloadCount: apiDataset.downloadCount || 0,
  viewCount: apiDataset.viewCount || 0,
  rating: apiDataset.rating ?? null,
  quality: { quality: 0, legal: 0, provenance: 0, usability: 0, freshness: 0 },
  verification: {
    supplierVerified: true,
    datasetReviewed: true,
    published: apiDataset.status === "PUBLISHED",
  },
  reviewCount: apiDataset.reviewCount || 0,
  kdtsScore: apiDataset.kdtsScore || null,
});



export function DatasetDiscoveryV2() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Canonical filter state - backend aligned, initialized from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || null,
    pricingType: (searchParams.get("pricingType") as FilterState["pricingType"]) || "all",
    priceRange: {
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    },
    currency: (searchParams.get("currency") as FilterState["currency"]) || "INR",
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    tags: searchParams.get("tags") ? searchParams.get("tags")!.split(",") : [],
    minKdtsScore: searchParams.get("minKdtsScore") || "",
    sortOrder: (searchParams.get("sort") as SortOption) || "relevance",
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
  }));

  // Sync filter state to URL so browser back/forward restores the view
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.pricingType !== "all") params.set("pricingType", filters.pricingType);
    if (filters.priceRange.min) params.set("minPrice", filters.priceRange.min);
    if (filters.priceRange.max) params.set("maxPrice", filters.priceRange.max);
    if (filters.currency !== "INR") params.set("currency", filters.currency);
    if (filters.country) params.set("country", filters.country);
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
    if (filters.minKdtsScore) params.set("minKdtsScore", filters.minKdtsScore);
    if (filters.sortOrder !== "relevance") params.set("sort", filters.sortOrder);
    if (filters.page > 1) params.set("page", String(filters.page));
    if (filters.pageSize !== 10) params.set("pageSize", String(filters.pageSize));
    const query = params.toString();
    router.replace(`/datasets${query ? `?${query}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Debounce search to avoid hammering the API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Build API query from filter state - all supported backend parameters
  const apiQuery: DatasetListQuery = {
    q: debouncedSearch || undefined,
    categoryId: filters.category || undefined,
    ...(filters.pricingType !== "all" && { isPaid: filters.pricingType === "paid" }),
    currency: filters.pricingType === "paid" ? filters.currency as Currency : undefined,
    minPrice: filters.pricingType === "paid" && filters.priceRange.min ? filters.priceRange.min : undefined,
    maxPrice: filters.pricingType === "paid" && filters.priceRange.max ? filters.priceRange.max : undefined,
    country: filters.country || undefined,
    state: filters.state || undefined,
    city: filters.city || undefined,
    tags: filters.tags.length > 0 ? filters.tags : undefined,
    minKdtsScore: filters.minKdtsScore || undefined,
    sort: mapSortToAPI(filters.sortOrder),
    page: filters.page,
    pageSize: filters.pageSize,
  };

  // Fetch datasets from API
  const {
    data: apiResponse,
    isLoading,
    error
  } = useDatasets(apiQuery);

  // Fetch categories from API
  const { data: categoriesResponse } = useCategories({ pageSize: 100 });

  // Create category mapping (id -> name) and list
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    if (categoriesResponse?.items) {
      categoriesResponse.items.forEach(cat => {
        map.set(cat.id, cat.name);
      });
    }
    return map;
  }, [categoriesResponse]);

  // Get category items for display (exclude test categories)
  const categoryItems = useMemo(() => {
    return Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .filter(({ name }) => !name.toLowerCase().includes("test"));
  }, [categoryMap]);

  // Map API response to UI format
  const allDatasets: Dataset[] = useMemo(() => {
    if (!apiResponse?.items) return [];
    return apiResponse.items.map(mapDatasetToUI);
  }, [apiResponse]);

  // Pagination from API response
  const totalPages = apiResponse ? Math.ceil(apiResponse.total / apiResponse.pageSize) : Math.ceil(allDatasets.length / filters.pageSize);
  const totalCount = apiResponse?.total || allDatasets.length;

  // Use API response directly (already paginated), or paginate mock data
  const paginatedDatasets = apiResponse?.items
    ? allDatasets // API response is already paginated
    : allDatasets.slice(
      (filters.page - 1) * filters.pageSize,
      filters.page * filters.pageSize
    );


  // Accordion states for filter sections
  const [accordionState, setAccordionState] = useState({
    sort: true,
    category: true,
    pricing: true,
    priceRange: true,
    location: false,
    tags: false,
    kdtsScore: false,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<"datasets">("datasets");

  // Filter update helper — auto-resets page to 1 when non-page filters change
  // (keeps page intact when explicitly changing page, e.g. pagination controls)
  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      ...updates,
      // Reset to page 1 unless the update is explicitly changing the page
      page: 'page' in updates ? updates.page! : 1,
    }));
  };

  // Accordion toggle helper
  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== null ||
    filters.pricingType !== "all" ||
    filters.priceRange.min !== "" ||
    filters.priceRange.max !== "" ||
    filters.country !== "" ||
    filters.state !== "" ||
    filters.city !== "" ||
    filters.tags.length > 0 ||
    filters.minKdtsScore !== "";

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: null,
      pricingType: "all",
      priceRange: { min: "", max: "" },
      currency: "INR",
      country: "",
      state: "",
      city: "",
      tags: [],
      minKdtsScore: "",
      sortOrder: "relevance",
      page: 1,
      pageSize: 10,
    });
  };

  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      <div className="sticky top-0 z-50">
        <NotchNavigation />
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
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2240] dark:text-white mb-2 md:mb-3">
              Governed Dataset Marketplace
            </h1>
            <p className="text-sm md:text-base text-[#4e5a7e] dark:text-white/70 mb-2">
              Discover and evaluate verified datasets from approved suppliers. Every dataset is reviewed before publication and listed with explicit pricing and access conditions.
            </p>
            <p className="text-xs md:text-sm font-medium text-[#1a2240]/70 dark:text-white/60">
              {isLoading ? "Loading..." : `${totalCount} dataset${totalCount !== 1 ? "s" : ""} available`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar - Canonical Filters */}
            <aside className="space-y-4 lg:space-y-6">
              {/* Mobile: Collapsible Filters */}
              <details className="lg:hidden bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-[#1a2240] dark:text-white">
                  <span>Filters {hasActiveFilters && `(${(filters.search ? 1 : 0) +
                    (filters.category ? 1 : 0) +
                    (filters.pricingType !== "all" ? 1 : 0) +
                    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
                    (filters.country ? 1 : 0) +
                    (filters.state ? 1 : 0) +
                    (filters.city ? 1 : 0) +
                    (filters.tags.length > 0 ? 1 : 0) +
                    (filters.minKdtsScore ? 1 : 0)
                    } active)`}</span>
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

                  {/* 7. Sort Order - Positioned First */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("sort")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Sort By
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.sort && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.sort && (
                      <div className="px-4 pb-4 space-y-1">
                        {([
                          "relevance", "newest", "oldest", "updated",
                          "popular", "most-downloaded", "top-rated", "top-kdts",
                          "price-low", "price-high",
                        ] as SortOption[]).map((option) => (
                          <button
                            key={option}
                            onClick={() => updateFilter({ sortOrder: option })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              filters.sortOrder === option
                                ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                                : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                            )}
                          >
                            {SORT_LABELS[option]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Category */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("category")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Category
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.category && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.category && (
                      <div className="px-4 pb-4 space-y-1">
                        <button
                          onClick={() => updateFilter({ category: null })}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            filters.category === null
                              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                        >
                          All Categories
                        </button>
                        {categoryItems.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => updateFilter({ category: cat.id })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 truncate",
                              filters.category === cat.id
                                ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                                : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                            )}
                            title={cat.name}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Pricing Type */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("pricing")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Pricing Type
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.pricing && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.pricing && (
                      <div className="px-4 pb-4 space-y-1">
                        {(["all", "free", "paid"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateFilter({ pricingType: type })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 capitalize",
                              filters.pricingType === type
                                ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                                : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                            )}
                          >
                            {type === "all" ? "All Pricing Types" : type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Price Range - Conditional on pricingType="paid" */}
                  {filters.pricingType === "paid" && (
                    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleAccordion("priceRange")}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                          Price Range
                        </h3>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                            accordionState.priceRange && "rotate-180"
                          )}
                        />
                      </button>
                      {accordionState.priceRange && (
                        <div className="px-4 pb-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.priceRange.min}
                              onChange={(e) =>
                                updateFilter({
                                  priceRange: { ...filters.priceRange, min: e.target.value },
                                })
                              }
                              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.priceRange.max}
                              onChange={(e) =>
                                updateFilter({
                                  priceRange: { ...filters.priceRange, max: e.target.value },
                                })
                              }
                              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                            />
                          </div>

                          {/* 5. Currency */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">
                              Currency
                            </label>
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
                      )}
                    </div>
                  )}

                  {/* 6. Location Filters */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("location")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Location
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.location && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.location && (
                      <div className="px-4 pb-4 space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">Country</label>
                          <Input
                            placeholder="e.g. India"
                            value={filters.country}
                            onChange={(e) => updateFilter({ country: e.target.value })}
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">State</label>
                          <Input
                            placeholder="e.g. Maharashtra"
                            value={filters.state}
                            onChange={(e) => updateFilter({ state: e.target.value })}
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">City</label>
                          <Input
                            placeholder="e.g. Mumbai"
                            value={filters.city}
                            onChange={(e) => updateFilter({ city: e.target.value })}
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 7. Tags Filter */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("tags")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Tags
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.tags && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.tags && (
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-xs text-[#4e5a7e] dark:text-white/50">Enter tags separated by commas</p>
                        <Input
                          placeholder="e.g. climate, finance"
                          value={filters.tags.join(", ")}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const parsed = raw
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            updateFilter({ tags: parsed });
                          }}
                          className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                        />
                        {filters.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {filters.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white"
                              >
                                {tag}
                                <button
                                  onClick={() => updateFilter({ tags: filters.tags.filter((t) => t !== tag) })}
                                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 8. Min KDTS Score */}
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("kdtsScore")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Min KDTS Score
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.kdtsScore && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.kdtsScore && (
                      <div className="px-4 pb-4">
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
                    )}
                  </div>

                </div>
              </details>

              {/* Desktop: Always Visible Filters */}
              <div className="hidden lg:block space-y-6">
                {/* Clear All */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-xl py-2.5 px-4 transition-colors text-center"
                  >
                    Clear All Filters
                  </button>
                )}

                {/* 7. Sort Order - Positioned First */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("sort")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Sort By
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.sort && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.sort && (
                    <div className="px-5 pb-5 space-y-1">
                      {([
                        "relevance", "newest", "oldest", "updated",
                        "popular", "most-downloaded", "top-rated", "top-kdts",
                        "price-low", "price-high",
                      ] as SortOption[]).map((option) => (
                        <button
                          key={option}
                          onClick={() => updateFilter({ sortOrder: option })}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            filters.sortOrder === option
                              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                        >
                          {SORT_LABELS[option]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Category */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("category")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Category
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.category && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.category && (
                    <div className="px-5 pb-5 space-y-1">
                      <button
                        onClick={() => updateFilter({ category: null })}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          filters.category === null
                            ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                            : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                        )}
                      >
                        All Categories
                      </button>
                      {categoryItems.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => updateFilter({ category: cat.id })}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 truncate",
                            filters.category === cat.id
                              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                          title={cat.name}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Pricing Type */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("pricing")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Pricing Type
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.pricing && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.pricing && (
                    <div className="px-5 pb-5 space-y-1">
                      {(["all", "free", "paid"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFilter({ pricingType: type })}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 capitalize",
                            filters.pricingType === type
                              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                        >
                          {type === "all" ? "All Pricing Types" : type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Price Range - Conditional on pricingType="paid" */}
                {filters.pricingType === "paid" && (
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("priceRange")}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        Price Range
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.priceRange && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.priceRange && (
                      <div className="px-5 pb-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange.min}
                            onChange={(e) =>
                              updateFilter({
                                priceRange: { ...filters.priceRange, min: e.target.value },
                              })
                            }
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange.max}
                            onChange={(e) =>
                              updateFilter({
                                priceRange: { ...filters.priceRange, max: e.target.value },
                              })
                            }
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                          />
                        </div>

                        {/* 5. Currency */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">
                            Currency
                          </label>
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
                    )}
                  </div>
                )}

                {/* 6. Location Filters */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("location")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Location
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.location && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.location && (
                    <div className="px-5 pb-5 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">Country</label>
                        <Input
                          placeholder="e.g. India"
                          value={filters.country}
                          onChange={(e) => updateFilter({ country: e.target.value })}
                          className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">State</label>
                        <Input
                          placeholder="e.g. Maharashtra"
                          value={filters.state}
                          onChange={(e) => updateFilter({ state: e.target.value })}
                          className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">City</label>
                        <Input
                          placeholder="e.g. Mumbai"
                          value={filters.city}
                          onChange={(e) => updateFilter({ city: e.target.value })}
                          className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Tags Filter */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("tags")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Tags
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.tags && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.tags && (
                    <div className="px-5 pb-5 space-y-3">
                      <p className="text-xs text-[#4e5a7e] dark:text-white/50">Enter tags separated by commas</p>
                      <Input
                        placeholder="e.g. climate, finance"
                        value={filters.tags.join(", ")}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = raw
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean);
                          updateFilter({ tags: parsed });
                        }}
                        className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30"
                      />
                      {filters.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {filters.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white"
                            >
                              {tag}
                              <button
                                onClick={() => updateFilter({ tags: filters.tags.filter((t) => t !== tag) })}
                                className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 8. Min KDTS Score */}
                <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("kdtsScore")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      Min KDTS Score
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.kdtsScore && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.kdtsScore && (
                    <div className="px-5 pb-5">
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
                  )}
                </div>

              </div>
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Tabs and Search Container - Unified glassmorphic container */}
              <div className="mb-6 md:mb-8 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl p-3 md:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-6">
                  {/* Datasets/Suppliers Tabs */}
                  <DatasetSupplierTabs activeTab={activeTab} onTabChange={setActiveTab} />

                  {/* Search Bar */}
                  <div className="flex-1 sm:max-w-md relative">
                    <Search className="absolute left-3 md:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4e5a7e]/50 dark:text-white/40" />
                    <Input
                      placeholder="Search datasets..."
                      value={filters.search}
                      onChange={(e) => updateFilter({ search: e.target.value })}
                      className="h-10 border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 pl-9 md:pl-10 pr-3 md:pr-4 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Dataset List */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                  <p className="text-muted-foreground dark:text-white/70">Loading datasets...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                    Failed to load datasets
                  </h3>
                  <p className="text-muted-foreground dark:text-white/70 text-center max-w-sm">
                    {error instanceof Error ? error.message : "An error occurred"}
                  </p>
                </div>
              ) : paginatedDatasets.length > 0 ? (
                <div className="space-y-4">
                  {paginatedDatasets.map((dataset) => (
                    <DatasetCard
                      key={dataset.id}
                      dataset={dataset}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <Search className="w-16 h-16 text-muted-foreground/30 dark:text-white/20 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                    No datasets found
                  </h3>
                  <p className="text-muted-foreground dark:text-white/70 text-center max-w-sm">
                    Try adjusting your search terms or filters to discover more datasets
                  </p>
                </div>
              )}

              {/* 8. Pagination - Explicit controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 md:mt-8 p-3 md:p-4 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
                  <button
                    onClick={() => updateFilter({ page: Math.max(filters.page - 1, 1) })}
                    disabled={filters.page === 1}
                    className={cn(
                      "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all duration-200 rounded-lg",
                      filters.page === 1
                        ? "text-[#4e5a7e]/40 dark:text-white/30 cursor-not-allowed"
                        : "text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
                    )}
                  >
                    <ChevronLeft className="h-3.5 md:h-4 w-3.5 md:w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
                    <span className="text-xs md:text-sm text-[#4e5a7e] dark:text-white/60 whitespace-nowrap">
                      Page {filters.page} of {totalPages}
                    </span>
                    <span className="text-[10px] md:text-xs text-[#4e5a7e]/70 dark:text-white/50 whitespace-nowrap">
                      ({totalCount} total)
                    </span>
                  </div>

                  <button
                    onClick={() => updateFilter({ page: Math.min(filters.page + 1, totalPages) })}
                    disabled={filters.page === totalPages}
                    className={cn(
                      "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all duration-200 rounded-lg",
                      filters.page === totalPages
                        ? "text-[#4e5a7e]/40 dark:text-white/30 cursor-not-allowed"
                        : "text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
                    )}
                  >
                    Next
                    <ChevronRight className="h-3.5 md:h-4 w-3.5 md:w-4" />
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
    </main>
  );
}
