/**
 * Utility to format API error messages for display
 */

import type { ApiError } from "@/types";

export function getErrorMessage(error: unknown): string {
  // Handle API errors
  if (error && typeof error === "object" && "code" in error) {
    const apiError = error as ApiError;

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

    return errorMessages[apiError.code] || apiError.message;
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
