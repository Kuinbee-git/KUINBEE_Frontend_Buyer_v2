"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DatasetCard } from "./dataset-card";
import { DatasetPreviewModal } from "./dataset-preview-modal";
import { DatasetSupplierTabs } from "./dataset-supplier-tabs";
import { 
  Dataset, 
  FilterState, 
  SortOption, 
  CATEGORIES, 
  LICENSES, 
  CURRENCIES,
  SORT_LABELS 
} from "./types";

// Mock datasets for demonstration
const mockDatasets: Dataset[] = [
  {
    id: "DS-2026-001",
    title: "Global Carbon Emissions by Sector",
    provider: "EcoMetrics",
    category: "Environment & Climate",
    license: "Commercial",
    pricing: { type: "paid", amount: 12500, currency: "USD" },
    lastUpdated: "2026-01-15",
    status: "published",
    description: "Comprehensive CO₂ emissions data across industrial sectors with monthly granularity.",
    coverage: "195 countries, 12 sectors",
    updateFrequency: "Monthly",
    records: 450000,
    quality: { completeness: 98, accuracy: 96, consistency: 99, timeliness: 85 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.9,
    reviewCount: 247,
  },
  {
    id: "DS-2026-002",
    title: "Global Energy Consumption Database",
    provider: "PowerMetrics",
    category: "Energy & Utilities",
    license: "Commercial",
    pricing: { type: "paid", amount: 8500, currency: "USD" },
    lastUpdated: "2026-01-10",
    status: "published",
    description: "Real-time energy consumption data across 85 countries with hourly granularity.",
    coverage: "85 countries, 15 energy types",
    updateFrequency: "Real-time",
    records: 2500000,
    quality: { completeness: 97, accuracy: 98, consistency: 96, timeliness: 99 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.8,
    reviewCount: 193,
  },
  {
    id: "DS-2026-003",
    title: "Agricultural Yield Forecasting Data",
    provider: "AgriTech Solutions",
    category: "Agriculture & Food",
    license: "Open Data",
    pricing: { type: "free", currency: "USD" },
    lastUpdated: "2026-01-12",
    status: "published",
    description: "Historical crop yield data with weather correlations across major agricultural regions.",
    coverage: "Global - 120 countries",
    updateFrequency: "Weekly",
    records: 2000000,
    quality: { completeness: 95, accuracy: 97, consistency: 98, timeliness: 92 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "DS-2026-004",
    title: "Global Trade Flow Analytics",
    provider: "TradeIQ",
    category: "Economics & Trade",
    license: "Commercial",
    pricing: { type: "paid", amount: 15200, currency: "EUR" },
    lastUpdated: "2026-01-18",
    status: "published",
    description: "Bilateral trade flows with tariff data covering 180+ countries and 5000+ product categories.",
    coverage: "Global - 180+ countries",
    updateFrequency: "Quarterly",
    records: 1500000,
    quality: { completeness: 100, accuracy: 99, consistency: 99, timeliness: 88 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.95,
    reviewCount: 512,
  },
  {
    id: "DS-2026-005",
    title: "Financial Markets Time Series Data",
    provider: "FinData Corp",
    category: "Finance & Markets",
    license: "Commercial",
    pricing: { type: "paid", amount: 18500, currency: "USD" },
    lastUpdated: "2026-01-14",
    status: "published",
    description: "Historical and real-time financial market data covering stocks, bonds, commodities.",
    coverage: "Global - 65 exchanges",
    updateFrequency: "Real-time",
    records: 8500000,
    quality: { completeness: 99, accuracy: 99, consistency: 98, timeliness: 99 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.9,
    reviewCount: 428,
  },
  {
    id: "DS-2026-006",
    title: "Renewable Energy Infrastructure Registry",
    provider: "GreenGrid Analytics",
    category: "Energy & Utilities",
    license: "Open Data",
    pricing: { type: "free", currency: "EUR" },
    lastUpdated: "2026-01-20",
    status: "published",
    description: "Comprehensive database of renewable energy installations including solar, wind, hydro facilities.",
    coverage: "Europe, North America, Asia",
    updateFrequency: "Monthly",
    records: 450000,
    quality: { completeness: 96, accuracy: 95, consistency: 97, timeliness: 90 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.6,
    reviewCount: 189,
  },
  {
    id: "DS-2026-007",
    title: "Commodity Price Index Historical Data",
    provider: "MarketWatch Analytics",
    category: "Economics & Trade",
    license: "Commercial",
    pricing: { type: "paid", amount: 5500, currency: "GBP" },
    lastUpdated: "2026-01-22",
    status: "published",
    description: "50 years of commodity price data across metals, agriculture, and energy sectors.",
    coverage: "Global - 200+ commodities",
    updateFrequency: "Daily",
    records: 3200000,
    quality: { completeness: 98, accuracy: 97, consistency: 99, timeliness: 95 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.85,
    reviewCount: 312,
  },
  {
    id: "DS-2026-008",
    title: "Climate Risk Assessment Database",
    provider: "EcoMetrics",
    category: "Environment & Climate",
    license: "Open Data",
    pricing: { type: "free", currency: "USD" },
    lastUpdated: "2026-01-25",
    status: "published",
    description: "Climate risk indicators including flood zones, drought susceptibility, and temperature anomalies.",
    coverage: "Global - 1km resolution",
    updateFrequency: "Quarterly",
    records: 5600000,
    quality: { completeness: 94, accuracy: 96, consistency: 95, timeliness: 88 },
    verification: { supplierVerified: true, datasetReviewed: true, published: true },
    rating: 4.75,
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
    licenses: [],
    sortOrder: "relevance",
    page: 1,
    pageSize: 10,
  });

  // Accordion states for filter sections
  const [accordionState, setAccordionState] = useState({
    sort: true,
    category: true,
    pricing: true,
    priceRange: true,
    license: true,
  });

  // Preview modal state
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"datasets" | "suppliers">("datasets");

  // Filter logic - backend aligned
  const filteredDatasets = useMemo(() => {
    let results = mockDatasets.filter((dataset) => {
      // 1. Keyword Search (q) - searches title, category, license
      const matchesSearch =
        filters.search === "" ||
        dataset.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        dataset.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        dataset.license.toLowerCase().includes(filters.search.toLowerCase());

      // 2. Category filter (categoryId)
      const matchesCategory = !filters.category || dataset.category === filters.category;

      // 3. Pricing type filter (isPaid)
      const matchesPricing =
        filters.pricingType === "all" ||
        (filters.pricingType === "free" && dataset.pricing.type === "free") ||
        (filters.pricingType === "paid" && dataset.pricing.type === "paid");

      // 4. Price range filter (minPrice, maxPrice) - only when pricingType="paid"
      let matchesPriceRange = true;
      if (filters.pricingType === "paid" && dataset.pricing.type === "paid" && dataset.pricing.amount) {
        const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        matchesPriceRange = dataset.pricing.amount >= min && dataset.pricing.amount <= max;
      }

      // 6. License filter (license)
      const matchesLicense =
        filters.licenses.length === 0 || filters.licenses.includes(dataset.license);

      return matchesSearch && matchesCategory && matchesPricing && matchesPriceRange && matchesLicense;
    });

    // 7. Sort order (sort)
    if (filters.sortOrder === "newest") {
      results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (filters.sortOrder === "oldest") {
      results.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
    } else if (filters.sortOrder === "price-low") {
      results.sort((a, b) => {
        const priceA = a.pricing.amount || 0;
        const priceB = b.pricing.amount || 0;
        return priceA - priceB;
      });
    } else if (filters.sortOrder === "price-high") {
      results.sort((a, b) => {
        const priceA = a.pricing.amount || 0;
        const priceB = b.pricing.amount || 0;
        return priceB - priceA;
      });
    }

    return results;
  }, [filters]);

  // 8. Pagination
  const totalPages = Math.ceil(filteredDatasets.length / filters.pageSize);
  const paginatedDatasets = filteredDatasets.slice(
    (filters.page - 1) * filters.pageSize,
    filters.page * filters.pageSize
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setFilters((prev: FilterState) => ({ ...prev, page: 1 }));
  }, [filters.search, filters.category, filters.pricingType, filters.priceRange, filters.licenses, filters.sortOrder]);

  // Filter update helper
  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters((prev: FilterState) => ({ ...prev, ...updates }));
  };

  // License toggle helper
  const toggleLicense = (license: "Open Data" | "Commercial") => {
    setFilters((prev: FilterState) => ({
      ...prev,
      licenses: prev.licenses.includes(license)
        ? prev.licenses.filter((l: typeof license) => l !== license)
        : [...prev.licenses, license],
    }));
  };

  // Accordion toggle helper
  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.category !== null ||
    filters.pricingType !== "all" ||
    filters.priceRange.min !== "" ||
    filters.priceRange.max !== "" ||
    filters.licenses.length > 0;

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: null,
      pricingType: "all",
      priceRange: { min: "", max: "" },
      currency: "USD",
      licenses: [],
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
              {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar - Canonical Filters */}
            <aside className="space-y-4 lg:space-y-6">
              {/* Mobile: Collapsible Filters */}
              <details className="lg:hidden bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-[#1a2240] dark:text-white">
                  <span>Filters {hasActiveFilters && `(${
                    (filters.category ? 1 : 0) +
                    (filters.pricingType !== "all" ? 1 : 0) +
                    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
                    filters.licenses.length
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
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                        {CATEGORIES.map((cat: string) => (
                          <button
                            key={cat}
                            onClick={() => updateFilter({ category: cat })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 truncate",
                              filters.category === cat
                                ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                                : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                            )}
                            title={cat}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Pricing Type */}
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                    <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
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
                              className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
                            />
                          </div>
                          
                          {/* 5. Currency */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">
                              Currency
                            </label>
                            <select
                              value={filters.currency}
                              onChange={(e) =>
                                updateFilter({ currency: e.target.value as FilterState["currency"] })
                              }
                              className="w-full h-9 rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
                            >
                              {CURRENCIES.map((cur: string) => (
                                <option key={cur} value={cur}>
                                  {cur}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. License Type */}
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("license")}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                        License Type
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                          accordionState.license && "rotate-180"
                        )}
                      />
                    </button>
                    {accordionState.license && (
                      <div className="px-4 pb-4 space-y-1">
                        {LICENSES.map((license: typeof LICENSES[number]) => (
                          <button
                            key={license}
                            onClick={() => toggleLicense(license)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              filters.licenses.includes(license)
                                ? "bg-gradient-to-r from-[#4e5a7e] to-[#5d6a8f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                                : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                            )}
                          >
                            {license}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Desktop: Always Visible Filters */}
              <div className="hidden lg:block space-y-6">
                {/* 7. Sort Order - Positioned First */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                      {CATEGORIES.map((cat: string) => (
                        <button
                          key={cat}
                          onClick={() => updateFilter({ category: cat })}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 truncate",
                            filters.category === cat
                              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                          title={cat}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Pricing Type */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
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
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
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
                            className="h-9 border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 pl-3 pr-3 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
                          />
                        </div>
                        
                        {/* 5. Currency */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-[#4e5a7e] dark:text-white/60">
                            Currency
                          </label>
                          <select
                            value={filters.currency}
                            onChange={(e) =>
                              updateFilter({ currency: e.target.value as FilterState["currency"] })
                            }
                            className="w-full h-9 rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 px-3 text-sm text-[#1a2240] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm"
                          >
                            {CURRENCIES.map((cur: string) => (
                              <option key={cur} value={cur}>
                                {cur}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. License Type */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion("license")}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xs font-semibold text-[#1a2240] dark:text-white uppercase tracking-wider">
                      License Type
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#4e5a7e] dark:text-white/60 transition-transform duration-200",
                        accordionState.license && "rotate-180"
                      )}
                    />
                  </button>
                  {accordionState.license && (
                    <div className="px-5 pb-5 space-y-1">
                      {LICENSES.map((license: typeof LICENSES[number]) => (
                        <button
                          key={license}
                          onClick={() => toggleLicense(license)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            filters.licenses.includes(license)
                              ? "bg-gradient-to-r from-[#4e5a7e] to-[#5d6a8f] dark:from-white/20 dark:to-white/15 text-white shadow-md font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          )}
                        >
                          {license}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Tabs and Search Container - Unified glassmorphic container */}
              <div className="mb-6 md:mb-8 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-3 md:p-4 shadow-sm">
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
                      className="h-10 border-[#1a2240]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 pl-9 md:pl-10 pr-3 md:pr-4 text-sm text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e]/60 dark:placeholder:text-white/40 focus-visible:ring-[#1a2240]/30 dark:focus-visible:ring-white/30 backdrop-blur-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Dataset List */}
              {paginatedDatasets.length > 0 ? (
                <div className="space-y-4">
                  {paginatedDatasets.map((dataset) => (
                    <DatasetCard
                      key={dataset.id}
                      dataset={dataset}
                      onPreview={(ds: Dataset) => {
                        setPreviewDataset(ds);
                        setIsPreviewOpen(true);
                      }}
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
                <div className="flex items-center justify-between mt-6 md:mt-8 p-3 md:p-4 bg-gradient-to-br from-white via-slate-50/50 to-white dark:bg-white/[0.08] dark:backdrop-blur-xl border border-border/40 dark:border-white/10 rounded-xl">
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
                      ({filteredDatasets.length} total)
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

      {/* Preview Modal */}
      <DatasetPreviewModal
        dataset={previewDataset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
