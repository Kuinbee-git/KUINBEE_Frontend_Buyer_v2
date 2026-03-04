"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/components/ui/select";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DatasetCard } from "./dataset-card";
import { DatasetSupplierTabs } from "./dataset-supplier-tabs";
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

// Mock datasets for demonstration (fallback)
const mockDatasets: Dataset[] = [
  {
    id: "DS-2026-001",
    title: "Global Carbon Emissions by Sector",
    provider: "EcoMetrics",
    category: "Environment & Climate",
    secondaryCategories: [],
    license: "Commercial",
    pricing: { type: "paid", amount: 12500, currency: "USD" },
    lastUpdated: "2026-01-15",
    status: "published",
    description: "Comprehensive CO₂ emissions data across industrial sectors with monthly granularity.",
    coverage: "195 countries, 12 sectors",
    records: 450000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.9, kdtsScore: null,
    quality: { quality: 98, legal: 96, provenance: 99, usability: 85, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 247,
  },
  {
    id: "DS-2026-002",
    title: "Global Energy Consumption Database",
    provider: "PowerMetrics",
    category: "Energy & Utilities",
    secondaryCategories: [],
    license: "Commercial",
    pricing: { type: "paid", amount: 8500, currency: "USD" },
    lastUpdated: "2026-01-10",
    status: "published",
    description: "Real-time energy consumption data across 85 countries with hourly granularity.",
    coverage: "85 countries, 15 energy types",
    records: 2500000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.8, kdtsScore: null,
    quality: { quality: 97, legal: 98, provenance: 96, usability: 99, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 193,
  },
  {
    id: "DS-2026-003",
    title: "Agricultural Yield Forecasting Data",
    provider: "AgriTech Solutions",
    category: "Agriculture & Food",
    secondaryCategories: [],
    license: "Open Data",
    pricing: { type: "free", currency: "USD" },
    lastUpdated: "2026-01-12",
    status: "published",
    description: "Historical crop yield data with weather correlations across major agricultural regions.",
    coverage: "Global - 120 countries",
    records: 2000000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.7, kdtsScore: null,
    quality: { quality: 95, legal: 97, provenance: 98, usability: 92, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 156,
  },
  {
    id: "DS-2026-004",
    title: "Global Trade Flow Analytics",
    provider: "TradeIQ",
    category: "Economics & Trade",
    secondaryCategories: [],
    license: "Commercial",
    pricing: { type: "paid", amount: 15200, currency: "EUR" },
    lastUpdated: "2026-01-18",
    status: "published",
    description: "Bilateral trade flows with tariff data covering 180+ countries and 5000+ product categories.",
    coverage: "Global - 180+ countries",
    records: 1500000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.95, kdtsScore: null,
    quality: { quality: 100, legal: 99, provenance: 99, usability: 88, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 512,
  },
  {
    id: "DS-2026-005",
    title: "Financial Markets Time Series Data",
    provider: "FinData Corp",
    category: "Finance & Markets",
    secondaryCategories: [],
    license: "Commercial",
    pricing: { type: "paid", amount: 18500, currency: "USD" },
    lastUpdated: "2026-01-14",
    status: "published",
    description: "Historical and real-time financial market data covering stocks, bonds, commodities.",
    coverage: "Global - 65 exchanges",
    records: 8500000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.9, kdtsScore: null,
    quality: { quality: 99, legal: 99, provenance: 98, usability: 99, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 428,
  },
  {
    id: "DS-2026-006",
    title: "Renewable Energy Infrastructure Registry",
    provider: "GreenGrid Analytics",
    category: "Energy & Utilities",
    secondaryCategories: [],
    license: "Open Data",
    pricing: { type: "free", currency: "EUR" },
    lastUpdated: "2026-01-20",
    status: "published",
    description: "Comprehensive database of renewable energy installations including solar, wind, hydro facilities.",
    coverage: "Europe, North America, Asia",
    records: 450000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.6, kdtsScore: null,
    quality: { quality: 96, legal: 95, provenance: 97, usability: 90, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 189,
  },
  {
    id: "DS-2026-007",
    title: "Commodity Price Index Historical Data",
    provider: "MarketWatch Analytics",
    category: "Economics & Trade",
    secondaryCategories: [],
    license: "Commercial",
    pricing: { type: "paid", amount: 5500, currency: "GBP" },
    lastUpdated: "2026-01-22",
    status: "published",
    description: "50 years of commodity price data across metals, agriculture, and energy sectors.",
    coverage: "Global - 200+ commodities",
    records: 3200000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.85, kdtsScore: null,
    quality: { quality: 98, legal: 97, provenance: 99, usability: 95, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 312,
  },
  {
    id: "DS-2026-008",
    title: "Climate Risk Assessment Database",
    provider: "EcoMetrics",
    category: "Environment & Climate",
    secondaryCategories: [],
    license: "Open Data",
    pricing: { type: "free", currency: "USD" },
    lastUpdated: "2026-01-25",
    status: "published",
    description: "Climate risk indicators including flood zones, drought susceptibility, and temperature anomalies.",
    coverage: "Global - 1km resolution",
    records: 5600000,
    aboutDataset: null, dataFormat: null, features: [], source: null, location: null, tags: [],
    downloadCount: 0, viewCount: 0, rating: 4.75, kdtsScore: null,
    quality: { quality: 94, legal: 96, provenance: 95, usability: 88, freshness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    reviewCount: 267,
  },
];

export function DatasetDiscoveryV2() {
  // Canonical filter state - backend aligned
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: null,
    pricingType: "all",
    priceRange: { min: "", max: "" },
    currency: "USD",
    sortOrder: "relevance",
    page: 1,
    pageSize: 10,
  });

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
    minPrice: filters.pricingType === "paid" && filters.priceRange.min ? filters.priceRange.min : undefined,
    maxPrice: filters.pricingType === "paid" && filters.priceRange.max ? filters.priceRange.max : undefined,
    currency: filters.pricingType === "paid" && (filters.priceRange.min || filters.priceRange.max) ? filters.currency as Currency : undefined,
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

  // Get category items for display
  const categoryItems = useMemo(() => {
    return Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }));
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
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<"datasets">("datasets");

  // Reset to page 1 when filters change
  useEffect(() => {
    setFilters((prev: FilterState) => ({ ...prev, page: 1 }));
  }, [filters.search, filters.category, filters.pricingType, filters.priceRange, filters.sortOrder]);

  // Filter update helper
  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters((prev: FilterState) => ({ ...prev, ...updates }));
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
    filters.priceRange.max !== "";

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: null,
      pricingType: "all",
      priceRange: { min: "", max: "" },
      currency: "USD",
      sortOrder: "relevance",
      page: 1,
      pageSize: 10,
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="relative z-50">
        <NotchNavigation />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {/* Main Content */}
      <div className="relative pt-20 md:pt-32 pb-12">
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
                    (filters.priceRange.min || filters.priceRange.max ? 1 : 0)
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
                        {(["relevance", "newest", "oldest", "price-low", "price-high"] as SortOption[]).map((option) => (
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
                              "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 truncate",
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
                      {(["relevance", "newest", "oldest", "price-low", "price-high"] as SortOption[]).map((option) => (
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
                            "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 truncate",
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
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
