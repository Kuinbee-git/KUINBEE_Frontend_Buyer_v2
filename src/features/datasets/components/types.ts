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
  logoUrl?: string | null;
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

export type DatasetDiscountTargetSurface =
  | "DATASET_PRICING"
  | "SAMPLE_ACTUAL_PRICE";

export type DatasetDiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface DatasetDiscountUI {
  proposalId: string;
  type: DatasetDiscountType;
  value: string;
  amountOff: string;
  startsAt: string;
  endsAt: string;
}

export interface DatasetPriceSurfaceUI {
  surface: DatasetDiscountTargetSurface | null;
  baseAmount: string | null;
  finalAmount: string | null;
  currency: string | null;
  discount: DatasetDiscountUI | null;
  payable: boolean;
  visible: boolean;
}

export type DatasetAccessFlow = "FREE_CLAIM" | "PAID_CHECKOUT";

export type DatasetCommercialFlow =
  | "NONE"
  | "DIRECT_PLATFORM_PURCHASE"
  | "INQUIRY_FOR_FULL_DATASET";

export interface Dataset {
  id: string; // Internal ID (may not be used for API calls)
  datasetUniqueId?: string; // The actual unique ID used for API calls
  title: string;
  provider: string; // Source name
  supplierLogoUrl?: string | null;
  isPlatformDataset?: boolean;
  category: string; // Primary category name
  secondaryCategories: string[];
  license: string;
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency: string;
  };
  accessFlow?: DatasetAccessFlow;
  commercialFlow?: DatasetCommercialFlow;
  accessPrice?: DatasetPriceSurfaceUI | null;
  commercialPrice?: DatasetPriceSurfaceUI | null;
  lastUpdated: string;
  status: string;
  description: string;
  // Rich content from API
  aboutDataset: AboutDatasetUI | null;
  dataFormat: DataFormatUI | null;
  features: DatasetFeatureUI[];
  source: DatasetSourceUI | null;
  sourceLogos?: DatasetSourceUI[];
  location: DatasetLocationUI | null;
  tags: string[];
  isSample?: boolean;
  sampleFileAvailable?: boolean;
  sampleNotes?: {
    whySample?: string | null;
    actualDataSize?: string | null;
    completeness?: string | null;
    deliveryMechanism?: string | null;
    deliveryMechanismNotes?: string | null;
  } | null;
  actualPrice?: number | null;
  actualPriceCurrency?: string | null;
  isNegotiable?: boolean | null;
  buyInPartsAvailable?: boolean;
  // Stats
  downloadCount: number;
  viewCount: number;
  rating: number | null;
  kdtsScore?: string | null;
  searchScore?: number | null;
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
  categories: string[];
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
