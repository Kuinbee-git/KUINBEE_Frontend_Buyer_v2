// Component-level types for V2 dataset discovery
// This is the enriched Dataset type for the discovery UI (not the API type)

export interface DatasetFeatureUI {
  id: string;
  name: string;
  dataType: string;
  description: string;
  isNullable: boolean;
}

export interface DatasetSourceUI {
  id: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  isVerified: boolean;
}

export interface DatasetLocationUI {
  region: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  coordinates: string | null;
  coverage: string | null;
}

export interface AboutDatasetUI {
  overview: string;
  description: string;
  dataQuality: string;
  useCases: string;
  limitations: string;
  methodology: string;
  updatedAt: string;
}

export interface DataFormatUI {
  fileFormat: string;
  rows: number;
  cols: number;
  fileSize: string;
  compressionType: string;
  encoding: string;
  updatedAt: string;
}

export interface Dataset {
  id: string; // Internal ID (may not be used for API calls)
  datasetUniqueId?: string; // The actual unique ID used for API calls
  title: string;
  provider: string; // Source name
  category: string; // Primary category name
  secondaryCategories: string[];
  license: string;
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency: string;
  };
  lastUpdated: string;
  status: string;
  description: string;
  // Rich content from API
  aboutDataset: AboutDatasetUI | null;
  dataFormat: DataFormatUI | null;
  features: DatasetFeatureUI[];
  source: DatasetSourceUI | null;
  location: DatasetLocationUI | null;
  tags: string[];
  // Stats
  downloadCount: number;
  viewCount: number;
  rating: number | null;
  kdtsScore?: string | null;
  // Legacy fields (kept for compatibility, derived from new data)
  coverage: string;
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
  reviewCount: number;
}

export interface FilterState {
  search: string;
  category: string | null;
  pricingType: "all" | "free" | "paid";
  priceRange: { min: string; max: string };
  currency: "INR" | "USD" | "EUR" | "GBP";
  country: string;
  state: string;
  city: string;
  tags: string[];
  minKdtsScore: string;
  sortOrder: SortOption;
  page: number;
  pageSize: number;
}

export type SortOption =
  | "relevance"
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "updated"
  | "popular"
  | "most-downloaded"
  | "top-rated"
  | "top-kdts";

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Most Relevant",
  newest: "Newest First",
  oldest: "Oldest First",
  updated: "Recently Updated",
  popular: "Most Viewed",
  "most-downloaded": "Most Downloaded",
  "top-rated": "Top Rated",
  "top-kdts": "Top KDTS Score",
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

export const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;
