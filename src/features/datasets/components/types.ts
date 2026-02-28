// Component-level types for V2 dataset discovery
// This is the enriched Dataset type for the discovery UI (not the API type)
export interface Dataset {
  id: string; // Internal ID (may not be used for API calls)
  datasetUniqueId?: string; // The actual unique ID used for API calls (e.g., D0000000015)
  title: string;
  provider: string;
  category: string;
  license: "Open Data" | "Commercial";
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency: string;
  };
  lastUpdated: string;
  status: "published" | "draft";
  description: string;
  coverage: string;
  updateFrequency: string;
  records: number;
  quality: {
    quality: number;
    legal: number;
    provenance: number;
    usability: number;
    freshness: number;
  };
  verification: {
    supplierVerified: boolean;
    datasetReviewed: boolean;
    published: boolean;
  };
  rating: number;
  reviewCount: number;
}

export interface FilterState {
  search: string;
  category: string | null;
  pricingType: "all" | "free" | "paid";
  priceRange: { min: string; max: string };
  currency: "USD" | "EUR" | "GBP";
  licenses: Array<"Open Data" | "Commercial">;
  sortOrder: SortOption;
  page: number;
  pageSize: number;
}

export type SortOption = "relevance" | "newest" | "oldest" | "price-low" | "price-high";

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Most Relevant",
  newest: "Newest First",
  oldest: "Oldest First",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
};

export const CATEGORIES = [
  "Environment & Climate",
  "Energy & Utilities",
  "Agriculture & Food",
  "Economics & Trade",
  "Finance & Markets",
  "Healthcare & Life Sciences",
  "Transportation & Logistics",
  "Urban Planning & Smart Cities",
  "Education & Research",
  "Government & Public Policy",
];

export const LICENSES = ["Open Data", "Commercial"] as const;

export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
