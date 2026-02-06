/**
 * Constants for user application
 */

export const APP_NAME = "Kuinbee Marketplace";
export const APP_DESCRIPTION = "Discover and purchase premium datasets";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Query stale times (in milliseconds)
export const STALE_TIME = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 60 * 1000, // 1 minute
  LONG: 5 * 60 * 1000, // 5 minutes
} as const;

// API retry configuration
export const API_RETRY_COUNT = 1;

// Toast durations (in milliseconds)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;
