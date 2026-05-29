/**
 * Utility to format API error messages for display
 */

import type { ApiError } from "@/types";

export function isApiError(error: unknown): error is ApiError {
  return !!error && typeof error === "object" && "code" in error;
}

export function isMaintenanceError(error: unknown): boolean {
  if (!isApiError(error)) return false;

  const prismaCode = typeof error.details?.prismaCode === "string"
    ? error.details.prismaCode
    : undefined;

  return (
    (typeof error.status === "number" && error.status >= 500) ||
    error.code === "NETWORK_ERROR" ||
    error.code === "TIMEOUT" ||
    prismaCode === "P2021" ||
    prismaCode === "P2022" ||
    prismaCode === "P1001"
  );
}

export function getErrorMessage(error: unknown): string {
  // Handle API errors
  if (isApiError(error)) {
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      // Auth errors
      VALIDATION_ERROR: "Please check your input and try again.",
      EMAIL_ALREADY_IN_USE: "This email is already registered.",
      INVALID_CREDENTIALS: "Invalid email or password.",
      EMAIL_NOT_VERIFIED: "Please verify your email before logging in.",
      FORBIDDEN: "You don't have permission to access this resource.",
      TOKEN_INVALID: "Invalid or expired token.",
      TOKEN_EXPIRED: "Your token has expired. Please request a new one.",
      
      // Resource errors
      NOT_FOUND: "The requested resource was not found.",
      ALREADY_OWNED: "You already have access to this dataset.",
      NOT_FREE: "This dataset is not free.",
      ALREADY_REVIEWED: "You have already reviewed this dataset.",
      
      // System errors
      RATE_LIMITED: "Too many requests. Please try again later.",
      NETWORK_ERROR: "Network error. Please check your connection.",
      UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    };

    return errorMessages[error.code] || error.message;
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
