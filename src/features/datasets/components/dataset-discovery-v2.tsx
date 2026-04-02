"use client";

import { useState, useEffect, useMemo, useRef, useCallback, useTransition, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/shared/components/ui/input";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DatasetCard, DatasetCardSkeleton } from "./dataset-card";
import { DatasetSupplierTabs } from "./dataset-supplier-tabs";

// Lazy load footer for better performance
const LandingFooter = lazy(() => import("@/features/landing/components/LandingFooter").then(mod => ({ default: mod.LandingFooter })));
const FilterSidebar = dynamic(
  () => import("./FilterSidebar").then((mod) => mod.FilterSidebar),
  {
    ssr: false,
    loading: () => (
      <div className="hidden lg:block rounded-xl border border-border/40 dark:border-white/10 bg-white dark:bg-[#1e2847] h-[620px] animate-pulse" />
    ),
  }
);
import {
  Dataset,
  FilterState,
  SortOption,
} from "./types";
import { useDatasets, useCategories, prefetchDatasets } from "@/hooks/api/useMarketplace";
import { useWishlist } from "@/hooks/api/useWishlist";
import { useAuth } from "@/core/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
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

type DatasetApiItem = {
  id: string;
  datasetUniqueId: string;
  title: string;
  owner?: { name?: string };
  category?: { name?: string };
  license?: string;
  isPaid?: boolean;
  price?: string | number | null;
  currency?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  dataFormatInfo?: {
    fileFormat?: string;
    rows?: number;
    cols?: number;
    fileSize?: string;
  };
  tags?: string[];
  downloadCount?: number;
  viewCount?: number;
  rating?: number | null;
  reviewCount?: number;
  kdtsScore?: number | null;
  isSample?: boolean;
  actualPrice?: string | number | null;
  actualPriceCurrency?: string | null;
};

const toNullableNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// Map API dataset to UI format
const mapDatasetToUI = (apiDataset: DatasetApiItem): Dataset => ({
  id: apiDataset.id,
  datasetUniqueId: apiDataset.datasetUniqueId,
  title: apiDataset.title,
  provider: apiDataset.owner?.name || "Unknown",
  category: apiDataset.category?.name || "Uncategorized",
  secondaryCategories: [],
  license: apiDataset.license || "Unknown",
  pricing: {
    type: apiDataset.isPaid ? "paid" : "free",
    amount: apiDataset.price != null ? Number(apiDataset.price) : undefined,
    currency: apiDataset.currency || "INR",
  },
  lastUpdated: new Date(apiDataset.updatedAt ?? apiDataset.createdAt ?? Date.now()).toLocaleDateString("en-US", {
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
    fileFormat: apiDataset.dataFormatInfo.fileFormat ?? "UNKNOWN",
    rows: apiDataset.dataFormatInfo.rows ?? 0,
    cols: apiDataset.dataFormatInfo.cols ?? 0,
    fileSize: apiDataset.dataFormatInfo.fileSize ?? "N/A",
    compressionType: "NONE",
    encoding: "UTF-8",
    updatedAt: apiDataset.updatedAt ?? apiDataset.createdAt ?? new Date().toISOString(),
  } : null,
  features: [],
  source: null,
  location: apiDataset.location ? {
    region: null,
    country: apiDataset.location.country ?? null,
    state: apiDataset.location.state ?? null,
    city: apiDataset.location.city ?? null,
    coordinates: null,
    coverage: null,
  } : null,
  tags: apiDataset.tags || [],
  isSample: apiDataset.isSample ?? false,
  actualPrice: toNullableNumber(apiDataset.actualPrice),
  actualPriceCurrency: apiDataset.actualPriceCurrency ?? null,
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
  kdtsScore: apiDataset.kdtsScore != null ? String(apiDataset.kdtsScore) : null,
});



export function DatasetDiscoveryV2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const getCategoriesFromSearchParams = useCallback(() => {
    const repeated = searchParams.getAll("category");
    const single = searchParams.get("category");
    const raw = repeated.length > 0
      ? repeated
      : single
        ? single.split(",")
        : [];
    return Array.from(new Set(raw.map((item) => item.trim()).filter(Boolean)));
  }, [searchParams]);

  // Lift wishlist up so cards don't individually re-fetch/subscribe
  const { data: wishlistData } = useWishlist(isAuthenticated);
  const wishlistDatasetIds = useMemo(() => {
    return new Set(wishlistData?.items?.map(item => item.datasetId) || []);
  }, [wishlistData]);

  // Canonical filter state - backend aligned, initialized from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("q") || "",
    categories: (() => {
      const repeated = searchParams.getAll("category");
      const single = searchParams.get("category");
      const raw = repeated.length > 0
        ? repeated
        : single
          ? single.split(",")
          : [];
      return Array.from(new Set(raw.map((item) => item.trim()).filter(Boolean)));
    })(),
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
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.search) params.set("q", filters.search);
      if (filters.categories.length > 0) {
        filters.categories.forEach((categoryId) => params.append("category", categoryId));
      }
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
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Sync filters.search when URL ?q= changes externally (e.g. from nav bar search)
  useEffect(() => {
    const urlSearch = searchParams.get("q") || "";
    if (urlSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: urlSearch, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("q")]);

  // Sync filters.categories when URL ?category= changes externally (e.g. from nav bar links)
  useEffect(() => {
    const urlCategories = getCategoriesFromSearchParams();
    const sameLength = urlCategories.length === filters.categories.length;
    const sameValues = sameLength && urlCategories.every((value) => filters.categories.includes(value));
    if (!sameValues) {
      setFilters((prev) => ({ ...prev, categories: urlCategories, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCategoriesFromSearchParams]);

  // Debounce search to avoid hammering the API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Build API query from filter state - memoized to stabilize object identity
  // so downstream useEffects (prefetching) don't fire on every render.
  const apiQuery = useMemo<DatasetListQuery>(() => {
    // Only send categoryIds if they look like IDs (CUIDs are typically 25 chars, ObjectIDs 24, UUIDs 36).
    const validCategoryIds = filters.categories
      .filter((value) => value.length >= 20);

    return {
      q: debouncedSearch || undefined,
      categoryIds: validCategoryIds.length > 0 ? validCategoryIds : undefined,
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
  }, [
    debouncedSearch, filters.categories, filters.pricingType, filters.currency,
    filters.priceRange.min, filters.priceRange.max, filters.country,
    filters.state, filters.city, filters.tags, filters.minKdtsScore,
    filters.sortOrder, filters.page, filters.pageSize,
  ]);

  // Fetch datasets from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    error
  } = useDatasets(apiQuery);

  // Pagination from API response (calculated early for prefetching)
  const totalPagesRaw = apiResponse ? Math.ceil(apiResponse.total / apiResponse.pageSize) : 1;

  // Prefetch adjacent pages
  useEffect(() => {
    if (apiResponse && filters.page < totalPagesRaw) {
      prefetchDatasets(queryClient, { ...apiQuery, page: filters.page + 1 });
    }
    if (apiResponse && filters.page > 1) {
      prefetchDatasets(queryClient, { ...apiQuery, page: filters.page - 1 });
    }
  }, [apiResponse, filters.page, totalPagesRaw, queryClient, apiQuery]);

  // Ref for scrolling to top of dataset list on page change
  const datasetListRef = useRef<HTMLDivElement>(null);

  // Scroll to top of dataset list when page changes
  const scrollToDatasetList = useCallback(() => {
    datasetListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Trigger scroll when page changes (but not on initial load)
  const prevPage = useRef(filters.page);
  useEffect(() => {
    if (prevPage.current !== filters.page) {
      scrollToDatasetList();
      prevPage.current = filters.page;
    }
  }, [filters.page, scrollToDatasetList]);

  // Fetch categories from API
  const { data: categoriesResponse } = useCategories({ pageSize: 100 });

  // Create category mapping (id -> name) and list
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    if (categoriesResponse?.items) {
      categoriesResponse.items.forEach(cat => {
        const displayName = (cat.datasetCount && cat.datasetCount > 0) 
          ? `${cat.name} (${cat.datasetCount})` 
          : cat.name;
        map.set(cat.id, displayName);
      });
    }
    return map;
  }, [categoriesResponse]);

  // Resolve category slugs to UUIDs (for navbar / landing page links)
  useEffect(() => {
    if (!categoriesResponse?.items || filters.categories.length === 0) return;

    const searchTerms: Record<string, string> = {
      finance: "finance",
      energy: "energy",
      agriculture: "agriculture",
      environment: "environment",
      economics: "economic",
      realestate: "real estate",
    };

    const resolved = filters.categories.map((value) => {
      if (categoryMap.has(value)) return value;
      const slug = value.toLowerCase();
      const searchTerm = searchTerms[slug] || slug;
      const matchedCategory = categoriesResponse.items.find((c) => c.name.toLowerCase().includes(searchTerm));
      return matchedCategory?.id ?? value;
    });

    const deduped = Array.from(new Set(resolved));
    const changed = deduped.length !== filters.categories.length
      || deduped.some((value) => !filters.categories.includes(value));

    if (changed) {
      setFilters((prev) => ({ ...prev, categories: deduped, page: 1 }));
    }
  }, [filters.categories, categoriesResponse, categoryMap]);

  // Get category items for display (exclude test categories)
  const categoryItems = useMemo(() => {
    return Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .filter(({ name }) => !name.toLowerCase().includes("test"));
  }, [categoryMap]);

  // Map API response to UI format
  const allDatasets: Dataset[] = useMemo(() => {
    if (!apiResponse?.items) return [];
    return (apiResponse.items as unknown as DatasetApiItem[]).map(mapDatasetToUI);
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

  // useTransition keeps the UI responsive while React processes filter state updates.
  // Input fields remain interactive even while the dataset list re-renders.
  const [isFilterPending, startFilterTransition] = useTransition();

  // Filter update helper — auto-resets page to 1 when non-page filters change
  // (keeps page intact when explicitly changing page, e.g. pagination controls)
  const updateFilter = useCallback((updates: Partial<FilterState>) => {
    startFilterTransition(() => {
      setFilters((prev: FilterState) => ({
        ...prev,
        ...updates,
        // Reset to page 1 unless the update is explicitly changing the page
        page: 'page' in updates ? updates.page! : 1,
      }));
    });
  }, []);

  // Accordion toggle — useCallback prevents FilterSidebar from re-rendering when
  // unrelated state (dataset list, fetching) changes.
  const toggleAccordion = useCallback((section: keyof typeof accordionState) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Check if filters are active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.pricingType !== "all" ||
    filters.priceRange.min !== "" ||
    filters.priceRange.max !== "" ||
    filters.country !== "" ||
    filters.state !== "" ||
    filters.city !== "" ||
    filters.tags.length > 0 ||
    filters.minKdtsScore !== "";

  const isUpdatingResults = isFetching || isFilterPending;

  // Clear all filters — useCallback prevents FilterSidebar re-render on unrelated state changes
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      categories: [],
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
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      <div className="sticky top-0 z-50">
        <NotchNavigation lite />
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
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              categoryItems={categoryItems}
              accordionState={accordionState}
              toggleAccordion={toggleAccordion}
            />

            {/* Main Content Column */}
            <div ref={datasetListRef}>
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

              {/* Dataset List — min-height prevents layout collapse during loading */}
              <div className="min-h-[400px]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}>
                {isLoading ? (
                  /* Initial load: skeleton cards to hold space */
                  <div className="space-y-4">
                    {Array.from({ length: filters.pageSize }).map((_, i) => (
                      <DatasetCardSkeleton key={i} />
                    ))}
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
                  isUpdatingResults ? (
                    <div className="space-y-4">
                      {Array.from({ length: Math.max(6, Math.min(filters.pageSize, paginatedDatasets.length || filters.pageSize)) }).map((_, i) => (
                        <DatasetCardSkeleton key={`updating-${i}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 transition-opacity duration-200">
                      {paginatedDatasets.map((dataset) => (
                        <DatasetCard
                          key={dataset.id}
                          dataset={dataset}
                          isInWishlist={wishlistDatasetIds.has(dataset.id)}
                        />
                      ))}
                    </div>
                  )
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
              </div>

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
