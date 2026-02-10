/**
 * API client configuration
 */

import { API_BASE_URL } from "./endpoints";
import type { ApiError } from "@/types";

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important for session cookies
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (like redirects)
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        if (response.ok) {
          return {} as T;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: data.code || "UNKNOWN_ERROR",
          message: data.message || "An error occurred",
          details: data.details,
        };
        throw error;
      }

      // Unwrap the response if it has success and data properties
      if (data && typeof data === "object" && "success" in data && "data" in data) {
        return data.data as T;
      }

      return data;
    } catch (error) {
      // Re-throw API errors
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw {
          code: "NETWORK_ERROR",
          message: "Network error. Please check your connection.",
        } as ApiError;
      }

      // Handle other errors
      throw {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "An error occurred",
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const queryString = params ? `?${this.buildQueryString(params)}` : "";
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
