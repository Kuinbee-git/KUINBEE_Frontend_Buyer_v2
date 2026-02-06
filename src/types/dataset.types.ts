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
  | "price:asc"
  | "price:desc";

export interface Dataset {
  id: string;
  datasetUniqueId: string;
  title: string;
  status: DatasetStatus;
  primaryCategoryId: string;
  isPaid: boolean;
  price: string | null;
  currency: string;
  license: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetDetails {
  id: string;
  datasetUniqueId: string;
  title: string;
  description?: string | null;
  primaryCategoryId: string;
  license: string;
  isPaid: boolean;
  price: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetDetailsResponse {
  dataset: DatasetDetails;
}

export interface DatasetListQuery extends PaginationQuery {
  q?: string;
  categoryId?: string;
  isPaid?: boolean;
  minPrice?: string;
  maxPrice?: string;
  currency?: Currency;
  sort?: DatasetSortOption;
}
