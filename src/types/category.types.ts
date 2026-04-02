/**
 * Category types
 */

import { PaginationQuery } from "./api.types";

export interface Category {
  id: string;
  name: string;
  datasetCount?: number;
}

export interface CategoryListQuery extends PaginationQuery {
  q?: string;
}
