"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useTransition,
  lazy,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  getErrorMessage,
  isMaintenanceError,
} from "@/shared/utils/error.utils";
import { DatasetCard, DatasetCardSkeleton } from "./dataset-card";

// Lazy load footer for better performance
const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((mod) => ({
    default: mod.LandingFooter,
  }))
);
const FilterSidebar = dynamic(
  () => import("./FilterSidebar").then((mod) => mod.FilterSidebar),
  {
    ssr: false,
    loading: () => (
      <div className="hidden lg:block rounded-lg border border-border bg-card p-5 h-[620px]">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-24 rounded-sm bg-muted" />
          <div className="space-y-2">
            <div className="h-9 w-full rounded-md bg-muted" />
            <div className="h-9 w-full rounded-md bg-muted" />
            <div className="h-9 w-full rounded-md bg-muted" />
          </div>
          <div className="h-px bg-border" />
          <div className="h-4 w-28 rounded-sm bg-muted" />
          <div className="space-y-2">
            <div className="h-9 w-full rounded-md bg-muted" />
            <div className="h-9 w-full rounded-md bg-muted" />
          </div>
          <div className="h-px bg-border" />
          <div className="h-4 w-20 rounded-sm bg-muted" />
          <div className="h-20 w-full rounded-md bg-muted" />
        </div>
      </div>
    ),
  }
);
import {
  Dataset,
  DatasetPriceSurfaceUI,
  FilterState,
  SortOption,
} from "./types";
import {
  useDatasets,
  useCategories,
  prefetchDatasets,
} from "@/hooks/api/useMarketplace";
import { useCustomCollectionServices } from "@/hooks/api/useCustomCollection";
import { useWishlist } from "@/hooks/api/useWishlist";
import { useAuth } from "@/core/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { MarketplaceSearch } from "@/shared/components/ui/marketplace-search";
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
  owner?: { id?: string; name?: string; logoUrl?: string | null };
  category?: { name?: string };
  source?: {
    id?: string;
    name?: string;
    description?: string | null;
    websiteUrl?: string | null;
    isVerified?: boolean;
    logoUrl?: string | null;
  } | null;
  sources?: Array<{
    id?: string;
    name?: string;
    description?: string | null;
    websiteUrl?: string | null;
    isVerified?: boolean;
    logoUrl?: string | null;
  }>;
  isPlatformDataset?: boolean;
  license?: string;
  isPaid?: boolean;
  price?: string | number | null;
  currency?: string;
  accessFlow?: Dataset["accessFlow"];
  commercialFlow?: Dataset["commercialFlow"];
  accessPrice?: DatasetPriceSurfaceUI | null;
  commercialPrice?: DatasetPriceSurfaceUI | null;
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
  searchScore?: number | null;
  isSample?: boolean;
  sampleFileAvailable?: boolean;
  sampleNotes?: {
    whySample?: string | null;
    actualDataSize?: string | null;
    completeness?: string | null;
    deliveryMechanism?: string | null;
    deliveryMechanismNotes?: string | null;
  } | null;
  actualPrice?: string | number | null;
  actualPriceCurrency?: string | null;
  buyInPartsAvailable?: boolean;
};

const toNullableNumber = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isKnownPlatformProvider = (provider?: string | null): boolean => {
  const normalized = provider?.trim().toLowerCase();
  return (
    normalized === "kuinbee information services pvt. ltd." ||
    normalized === "kuinbee information services private limited"
  );
};

const mapSourceToUI = (
  source: NonNullable<DatasetApiItem["source"]>
): NonNullable<Dataset["source"]> => ({
  id: source.id ?? source.name ?? "source",
  name: source.name ?? "Unknown source",
  description: source.description ?? null,
  websiteUrl: source.websiteUrl ?? null,
  isVerified: source.isVerified ?? false,
  logoUrl: source.logoUrl ?? null,
});

// Map API dataset to UI format
const mapDatasetToUI = (apiDataset: DatasetApiItem): Dataset => {
  const provider = apiDataset.owner?.name || "Unknown";
  const source = apiDataset.source ? mapSourceToUI(apiDataset.source) : null;
  const sourceLogos = apiDataset.sources?.length
    ? apiDataset.sources.map(mapSourceToUI)
    : source
      ? [source]
      : [];

  return {
    id: apiDataset.id,
    datasetUniqueId: apiDataset.datasetUniqueId,
    title: apiDataset.title,
    provider,
    supplierLogoUrl: apiDataset.owner?.logoUrl ?? null,
    isPlatformDataset:
      apiDataset.isPlatformDataset ?? isKnownPlatformProvider(provider),
    category: apiDataset.category?.name || "Uncategorized",
    secondaryCategories: [],
    license: apiDataset.license || "Unknown",
    pricing: {
      type: apiDataset.isPaid ? "paid" : "free",
      amount: apiDataset.price != null ? Number(apiDataset.price) : undefined,
      currency: apiDataset.currency || "INR",
    },
    accessFlow: apiDataset.accessFlow,
    commercialFlow: apiDataset.commercialFlow,
    accessPrice: apiDataset.accessPrice ?? null,
    commercialPrice: apiDataset.commercialPrice ?? null,
    lastUpdated: new Date(
      apiDataset.updatedAt ?? apiDataset.createdAt ?? Date.now()
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: apiDataset.status?.toLowerCase() || "published",
    description: apiDataset.title,
    coverage: apiDataset.location?.country || "N/A",
    records: apiDataset.dataFormatInfo?.rows || 0,
    aboutDataset: null,
    dataFormat: apiDataset.dataFormatInfo
      ? {
          fileFormat: apiDataset.dataFormatInfo.fileFormat ?? "UNKNOWN",
          rows: apiDataset.dataFormatInfo.rows ?? 0,
          cols: apiDataset.dataFormatInfo.cols ?? 0,
          fileSize: apiDataset.dataFormatInfo.fileSize ?? "N/A",
          compressionType: "NONE",
          encoding: "UTF-8",
          updatedAt:
            apiDataset.updatedAt ??
            apiDataset.createdAt ??
            new Date().toISOString(),
        }
      : null,
    features: [],
    source,
    sourceLogos,
    location: apiDataset.location
      ? {
          region: null,
          country: apiDataset.location.country ?? null,
          state: apiDataset.location.state ?? null,
          city: apiDataset.location.city ?? null,
          coordinates: null,
          coverage: null,
        }
      : null,
    tags: apiDataset.tags || [],
    isSample: apiDataset.isSample ?? false,
    sampleFileAvailable: apiDataset.sampleFileAvailable ?? false,
    sampleNotes: apiDataset.sampleNotes ?? null,
    actualPrice: toNullableNumber(apiDataset.actualPrice),
    actualPriceCurrency: apiDataset.actualPriceCurrency ?? null,
    buyInPartsAvailable: apiDataset.buyInPartsAvailable ?? false,
    downloadCount: apiDataset.downloadCount || 0,
    viewCount: apiDataset.viewCount || 0,
    rating: apiDataset.rating ?? null,
    quality: {
      quality: 0,
      legal: 0,
      provenance: 0,
      usability: 0,
      freshness: 0,
    },
    verification: {
      supplierVerified: true,
      datasetReviewed: true,
      published: apiDataset.status === "PUBLISHED",
    },
    reviewCount: apiDataset.reviewCount || 0,
    kdtsScore:
      apiDataset.kdtsScore != null ? String(apiDataset.kdtsScore) : null,
    searchScore: apiDataset.searchScore ?? null,
  };
};

export function DatasetDiscoveryV2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Banner state sequence: Wait hidden -> Animate open -> Can be closed -> Animate closed
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerClosing, setBannerClosing] = useState(false);

  useEffect(() => {
    // Appear smoothly after 2 seconds
    const timer = setTimeout(() => {
      setBannerVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseBanner = () => {
    setBannerClosing(true);
    // After animation duration, remove from DOM
    setTimeout(() => {
      setBannerVisible(false);
      setBannerClosing(false);
    }, 400); // 400ms defined in css transition
  };

  const getCategoriesFromSearchParams = useCallback(() => {
    const repeated = searchParams.getAll("category");
    const single = searchParams.get("category");
    const raw =
      repeated.length > 0 ? repeated : single ? single.split(",") : [];
    return Array.from(new Set(raw.map((item) => item.trim()).filter(Boolean)));
  }, [searchParams]);

  // Lift wishlist up so cards don't individually re-fetch/subscribe
  const { data: wishlistData } = useWishlist(isAuthenticated);
  const wishlistDatasetIds = useMemo(() => {
    return new Set(wishlistData?.items?.map((item) => item.datasetId) || []);
  }, [wishlistData]);

  // Canonical filter state - backend aligned, initialized from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("q") || "",
    categories: (() => {
      const repeated = searchParams.getAll("category");
      const single = searchParams.get("category");
      const raw =
        repeated.length > 0 ? repeated : single ? single.split(",") : [];
      return Array.from(
        new Set(raw.map((item) => item.trim()).filter(Boolean))
      );
    })(),
    pricingType:
      (searchParams.get("pricingType") as FilterState["pricingType"]) || "all",
    priceRange: {
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    },
    currency:
      (searchParams.get("currency") as FilterState["currency"]) || "INR",
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
        filters.categories.forEach((categoryId) =>
          params.append("category", categoryId)
        );
      }
      if (filters.pricingType !== "all")
        params.set("pricingType", filters.pricingType);
      if (filters.priceRange.min)
        params.set("minPrice", filters.priceRange.min);
      if (filters.priceRange.max)
        params.set("maxPrice", filters.priceRange.max);
      if (filters.currency !== "INR") params.set("currency", filters.currency);
      if (filters.country) params.set("country", filters.country);
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
      if (filters.minKdtsScore)
        params.set("minKdtsScore", filters.minKdtsScore);
      if (filters.sortOrder !== "relevance")
        params.set("sort", filters.sortOrder);
      if (filters.page > 1) params.set("page", String(filters.page));
      if (filters.pageSize !== 10)
        params.set("pageSize", String(filters.pageSize));
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
    const sameValues =
      sameLength &&
      urlCategories.every((value) => filters.categories.includes(value));
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
    const validCategoryIds = filters.categories.filter(
      (value) => value.length >= 20
    );

    return {
      q: debouncedSearch || undefined,
      categoryIds: validCategoryIds.length > 0 ? validCategoryIds : undefined,
      ...(filters.pricingType !== "all" && {
        isPaid: filters.pricingType === "paid",
      }),
      currency:
        filters.pricingType === "paid"
          ? (filters.currency as Currency)
          : undefined,
      minPrice:
        filters.pricingType === "paid" && filters.priceRange.min
          ? filters.priceRange.min
          : undefined,
      maxPrice:
        filters.pricingType === "paid" && filters.priceRange.max
          ? filters.priceRange.max
          : undefined,
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
    debouncedSearch,
    filters.categories,
    filters.pricingType,
    filters.currency,
    filters.priceRange.min,
    filters.priceRange.max,
    filters.country,
    filters.state,
    filters.city,
    filters.tags,
    filters.minKdtsScore,
    filters.sortOrder,
    filters.page,
    filters.pageSize,
  ]);

  // Fetch datasets from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    error,
  } = useDatasets(apiQuery);

  // Lightweight services count for the toggle pill — only fires when there's an active search
  const { data: serviceCountData } = useCustomCollectionServices(
    { q: debouncedSearch || undefined, page: 1, pageSize: 1 },
    Boolean(debouncedSearch)
  );

  const showMaintenanceState = isMaintenanceError(error);

  useEffect(() => {
    if (!showMaintenanceState) return;

    const from = `${window.location.pathname}${window.location.search}`;
    router.replace(`/maintenance?from=${encodeURIComponent(from)}`);
  }, [router, showMaintenanceState]);

  // Pagination from API response (calculated early for prefetching)
  const totalPagesRaw = apiResponse
    ? Math.ceil(apiResponse.total / apiResponse.pageSize)
    : 1;

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
    datasetListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
      categoriesResponse.items.forEach((cat) => {
        const displayName =
          cat.datasetCount && cat.datasetCount > 0
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
      const matchedCategory = categoriesResponse.items.find((c) =>
        c.name.toLowerCase().includes(searchTerm)
      );
      return matchedCategory?.id ?? value;
    });

    const deduped = Array.from(new Set(resolved));
    const changed =
      deduped.length !== filters.categories.length ||
      deduped.some((value) => !filters.categories.includes(value));

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
    return (apiResponse.items as unknown as DatasetApiItem[]).map(
      mapDatasetToUI
    );
  }, [apiResponse]);

  // Pagination from API response
  const totalPages = apiResponse
    ? Math.ceil(apiResponse.total / apiResponse.pageSize)
    : Math.ceil(allDatasets.length / filters.pageSize);
  const totalCount = apiResponse?.total || allDatasets.length;

  // Use API response directly (already paginated), or paginate mock data
  const paginatedDatasets = apiResponse?.items
    ? allDatasets // API response is already paginated
    : allDatasets.slice(
        (filters.page - 1) * filters.pageSize,
        filters.page * filters.pageSize
      );

  // Split results into strong hits and weak/related suggestions.
  // Only applies when a search query is active AND the backend returned searchScores.
  // RRF scores from hybrid search: FTS-anchored results score ~0.025+, semantic-only ~0.015 or below.
  const WEAK_SCORE_THRESHOLD = 0.022;
  const hasSearchScores =
    debouncedSearch && paginatedDatasets.some((d) => d.searchScore != null);
  const strongDatasets = hasSearchScores
    ? paginatedDatasets.filter(
        (d) => d.searchScore == null || d.searchScore >= WEAK_SCORE_THRESHOLD
      )
    : paginatedDatasets;
  const relatedDatasets = hasSearchScores
    ? paginatedDatasets.filter(
        (d) => d.searchScore != null && d.searchScore < WEAK_SCORE_THRESHOLD
      )
    : [];

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
        page: "page" in updates ? updates.page! : 1,
      }));
    });
  }, []);

  // Accordion toggle — useCallback prevents FilterSidebar from re-rendering when
  // unrelated state (dataset list, fetching) changes.
  const toggleAccordion = useCallback(
    (section: keyof typeof accordionState) => {
      setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    []
  );

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
            <div className="relative isolate flex items-center justify-center gap-x-6 bg-[#2b61eb] px-6 py-2.5 sm:px-3.5 shadow-sm border-b border-[#2b61eb]/80 dark:bg-white/[0.02] dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_4px_24px_-8px_rgba(255,255,255,0.1)]">
              <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.white/0.1),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.white/0.05),transparent)]"
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-white/90">
                  <strong className="font-semibold tracking-wide text-white">
                    Custom Data Sourcing
                  </strong>
                  <svg
                    viewBox="0 0 2 2"
                    className="mx-2 hidden md:inline h-0.5 w-0.5 fill-current text-white/50"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <span className="hidden md:inline">
                    Can&apos;t find the right dataset?{" "}
                  </span>
                  Let our sourcing experts find it for you.
                </p>
                <Link
                  href="/data-request"
                  className="inline-flex items-center gap-1.5 flex-none rounded-md bg-white px-3.5 py-1 text-sm font-semibold text-[#2b61eb] shadow-sm hover:bg-blue-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white/[0.04] dark:backdrop-blur-md dark:border dark:border-white/10 dark:text-white/90 dark:hover:bg-white/[0.08] dark:hover:border-white/20"
                >
                  <span>Submit Request</span>
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

        {/* Navigation */}
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
              Governed Dataset Marketplace
            </h1>
            <p className="text-sm text-muted-foreground mb-2 max-w-3xl">
              Discover and evaluate verified datasets from approved suppliers.
              Every dataset is reviewed before publication and listed with
              explicit pricing and access conditions.
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${totalCount} dataset${totalCount !== 1 ? "s" : ""} available`}
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
              {/* Search Container */}
              <div className="mb-6 md:mb-8 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-4">
                <MarketplaceSearch
                  active="datasets"
                  value={filters.search}
                  onValueChange={(search) => updateFilter({ search })}
                  placeholder="Search datasets and collection services…"
                  ariaLabel="Search the Kuinbee marketplace"
                  datasetsTotal={totalCount}
                  servicesTotal={serviceCountData?.total}
                />
              </div>

              {/* Dataset List — min-height prevents layout collapse during loading */}
              <div
                className="min-h-[400px]"
                style={{
                  contentVisibility: "auto",
                  containIntrinsicSize: "0 600px",
                }}
              >
                {isLoading ? (
                  /* Initial load: skeleton cards to hold space */
                  <div className="space-y-4">
                    {Array.from({ length: filters.pageSize }).map((_, i) => (
                      <DatasetCardSkeleton key={i} />
                    ))}
                  </div>
                ) : showMaintenanceState ? (
                  <div className="space-y-4">
                    {Array.from({ length: Math.min(3, filters.pageSize) }).map(
                      (_, i) => (
                        <DatasetCardSkeleton
                          key={`maintenance-redirect-${i}`}
                        />
                      )
                    )}
                  </div>
                ) : error ? (
                  <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-8">
                    <p className="font-mono text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
                      ERROR
                    </p>
                    <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-1">
                      Failed to load datasets
                    </h3>
                    <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                      {getErrorMessage(error)}
                    </p>
                  </div>
                ) : paginatedDatasets.length > 0 ? (
                  isUpdatingResults ? (
                    <div className="space-y-4">
                      {Array.from({
                        length: Math.max(
                          6,
                          Math.min(
                            filters.pageSize,
                            paginatedDatasets.length || filters.pageSize
                          )
                        ),
                      }).map((_, i) => (
                        <DatasetCardSkeleton key={`updating-${i}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 transition-opacity duration-200">
                      {strongDatasets.map((dataset) => (
                        <DatasetCard
                          key={dataset.id}
                          dataset={dataset}
                          isInWishlist={wishlistDatasetIds.has(dataset.id)}
                        />
                      ))}
                      {relatedDatasets.length > 0 && (
                        <>
                          <div className="flex items-center gap-3 pt-2">
                            <div className="flex-1 h-px bg-border/60 dark:bg-white/10" />
                            <span className="text-xs font-medium text-[#4e5a7e] dark:text-white/50 whitespace-nowrap">
                              You might also be interested in
                            </span>
                            <div className="flex-1 h-px bg-border/60 dark:bg-white/10" />
                          </div>
                          {relatedDatasets.map((dataset) => (
                            <DatasetCard
                              key={dataset.id}
                              dataset={dataset}
                              isInWishlist={wishlistDatasetIds.has(dataset.id)}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-8">
                      <p className="font-mono text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
                        NO RESULTS
                      </p>
                      <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-1">
                        {filters.search
                          ? `No datasets match "${filters.search}"`
                          : "No datasets match the current filters"}
                      </h3>
                      <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-4">
                        Try removing filters or browsing all datasets.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    {/* Commission CTA — shown whenever the marketplace returns no results */}
                    <div className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div>
                        <p className="font-mono text-xs text-[#4e5a7e] dark:text-white/60 mb-2 uppercase tracking-[0.12em]">
                          Can&apos;t find it?
                        </p>
                        <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-1">
                          Commission a custom dataset
                        </h3>
                        <p className="text-sm text-[#4e5a7e] dark:text-white/70 max-w-md">
                          Browse verified collection services or submit an open
                          brief — Kuinbee will source and deliver exactly what
                          you need.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <Link
                          href="/data-request/services"
                          className="inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-lg border border-[#1a2240]/20 dark:border-white/20 bg-white/95 dark:bg-white/10 text-[#1a2240] dark:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/20 transition-colors"
                        >
                          Browse services
                        </Link>
                        <Link
                          href="/data-request#request-form"
                          className="inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-lg bg-[#1a2240] dark:bg-white text-white dark:text-[#1a2240] hover:bg-[#1a2240]/90 dark:hover:bg-white/90 transition-colors"
                        >
                          Submit a brief
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 p-4 bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm">
                  <button
                    onClick={() =>
                      updateFilter({ page: Math.max(filters.page - 1, 1) })
                    }
                    disabled={filters.page === 1}
                    className={cn(
                      "inline-flex items-center gap-2 h-8 px-3 text-sm font-medium rounded-lg border transition-colors",
                      filters.page === 1
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
                      · {totalCount} total
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      updateFilter({
                        page: Math.min(filters.page + 1, totalPages),
                      })
                    }
                    disabled={filters.page === totalPages}
                    className={cn(
                      "inline-flex items-center gap-2 h-8 px-3 text-sm font-medium rounded-lg border transition-colors",
                      filters.page === totalPages
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
    </main>
  );
}
