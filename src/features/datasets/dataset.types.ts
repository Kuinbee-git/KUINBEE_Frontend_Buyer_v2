// Re-export existing types from central types directory
import type { DatasetSortOption } from "@/types/dataset.types";
export type { Dataset, DatasetDetails, DatasetDetailsResponse, DatasetListQuery, DatasetSortOption } from "@/types/dataset.types";
export type { Category } from "@/types/category.types";

// UI-specific types for dataset feature
export type ViewMode = "grid" | "list";
export type TabView = "explore" | "trending" | "browse";

// Category data for category browse (UI enriched)
export interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  datasetCount: number;
  trending?: boolean;
}

// Legacy/Mock Dataset type (for mock data only - remove when API is integrated)
export interface LegacyDataset {
  id: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  records: number;
  updateFrequency: string;
  coverage: string;
  lastUpdated: string;
  license: "Open Data" | "Commercial";
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: "INR" | "USD" | "EUR" | "GBP";
  };
  quality: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
  };
  verification: {
    supplierVerified: boolean;
    datasetReviewed: boolean;
    published: boolean;
  };
  rating: number;
  reviewCount: number;
  verified?: boolean;
  trending?: boolean;
  status: "published" | "draft";
}

// UI Filter State
export interface FilterState {
  search: string;
  category: string | null;
  pricingType: "all" | "free" | "paid";
  priceRange: {
    min: string;
    max: string;
  };
  currency: "INR" | "USD" | "EUR" | "GBP";
  licenses: ("Open Data" | "Commercial")[];
  sortOrder: DatasetSortOption;
  page: number;
  pageSize: number;
  verified: boolean;
  trending: boolean;
  recentlyUpdated: boolean;
  industries: string[];
  useCases: string[];
  dataTypes: string[];
}

// Sort option labels
export const SORT_LABELS: Record<DatasetSortOption, string> = {
  relevance: "Relevance",
  "createdAt:desc": "Newest First",
  "createdAt:asc": "Oldest First",
  "price:asc": "Price: Low → High",
  "price:desc": "Price: High → Low",
};
