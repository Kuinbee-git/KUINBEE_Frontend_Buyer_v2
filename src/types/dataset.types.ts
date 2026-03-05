/**
 * Dataset types for marketplace
 */

import { PaginationQuery } from "./api.types";
import { Currency } from "./preferences.types";

export type DatasetStatus = "PUBLISHED";

export type DatasetSortOption =
  | "relevance"
  | "createdAt:desc"
  | "createdAt:asc"
  | "updatedAt:desc"
  | "price:asc"
  | "price:desc"
  | "viewCount:desc"
  | "downloadCount:desc"
  | "rating:desc"
  | "kdtsScore:desc";

export interface DatasetOwner {
  id: string;
  name: string;
}

export interface DatasetCategory {
  name: string;
}

export interface DatasetListLocation {
  country: string | null;
  state: string | null;
  city: string | null;
}

export interface DatasetListFormatInfo {
  fileFormat: string;
  rows: number;
  cols: number;
  fileSize: string;
}

export interface Dataset {
  id: string;
  datasetUniqueId: string;
  title: string;
  status: DatasetStatus;
  license: string;
  owner: DatasetOwner;
  category: DatasetCategory;
  location: DatasetListLocation | null;
  dataFormatInfo: DatasetListFormatInfo | null;
  tags: string[];
  isPaid: boolean;
  price: string | null;
  currency: string;
  viewCount: number;
  downloadCount: number;
  reviewCount: number;
  rating: number | null;
  kdtsScore: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetDetails {
  id: string;
  datasetUniqueId: string;
  title: string;
  description?: string | null;
  status: DatasetStatus;
  visibility: string;
  superType: string;
  isPaid: boolean;
  price: string | null;
  currency: string;
  license: string;
  downloadCount: number;
  viewCount: number;
  rating: number | null;
  kdtsScore: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetPrimaryCategory {
  name: string;
}

export interface DatasetSecondaryCategory {
  name: string;
}

export interface AboutDatasetInfo {
  overview: string;
  description: string;
  dataQuality: string;
  useCases: string;
  limitations: string;
  methodology: string;
  updatedAt: string;
}

export interface DataFormatInfo {
  fileFormat: string;
  rows: number;
  cols: number;
  fileSize: string;
  compressionType: string;
  encoding: string;
  updatedAt: string;
}

export interface DatasetFeature {
  id: string;
  name: string;
  dataType: string;
  description: string;
  isNullable: boolean;
}

export interface DatasetSource {
  id: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  isVerified: boolean;
}

export interface DatasetLocationInfo {
  region: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  coordinates: string | null;
  coverage: string | null;
}

export interface DatasetDetailsResponse {
  dataset: DatasetDetails;
  primaryCategory: DatasetPrimaryCategory;
  secondaryCategories: DatasetSecondaryCategory[];
  aboutDatasetInfo: AboutDatasetInfo | null;
  dataFormatInfo: DataFormatInfo | null;
  features: DatasetFeature[];
  source: DatasetSource | null;
  locationInfo: DatasetLocationInfo | null;
  tags: string[];
}

export interface DatasetListQuery extends PaginationQuery {
  q?: string;
  search?: string;
  categoryId?: string;
  isPaid?: boolean;
  currency?: Currency;
  minPrice?: string;
  maxPrice?: string;
  country?: string;
  state?: string;
  city?: string;
  tags?: string[];
  minKdtsScore?: string;
  sort?: DatasetSortOption;
}
