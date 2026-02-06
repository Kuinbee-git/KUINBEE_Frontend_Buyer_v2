/**
 * Library and entitlement types
 */

import { PaginationQuery } from "./api.types";

export type AccessType = "FREE_CLAIM" | "PURCHASE";

export interface LibraryItem {
  datasetId: string;
  datasetUniqueId: string;
  title: string;
  accessType: AccessType;
  grantedAt: string;
}

export interface LibraryItemDetails {
  datasetId: string;
  accessType: AccessType;
  grantedAt: string;
}

export interface LibraryItemDetailsResponse {
  item: LibraryItemDetails;
}

export interface LibraryListQuery extends PaginationQuery {
  q?: string;
}

export interface DownloadUrlResponse {
  url: string;
  expiresAt: string;
}

export interface Entitlement {
  datasetId: string;
  accessType: AccessType;
  grantedAt: string;
}

export interface EntitlementsResponse {
  items: Entitlement[];
}

export interface EntitlementCheckResponse {
  entitled: boolean;
  reason?: string;
}
