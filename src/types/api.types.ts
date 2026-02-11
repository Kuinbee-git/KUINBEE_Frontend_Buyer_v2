/**
 * Common API types and interfaces
 */

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

// Backend API wraps paginated responses in a data wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SuccessResponse {
  success: true;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
