/**
 * Review service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  Review,
  ReviewResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewListQuery,
  PaginatedResponse,
  SuccessResponse,
  ApiResponse,
} from "@/types";

export const reviewService = {
  // List reviews for a dataset with pagination support
  listReviews: (datasetId: string, query?: ReviewListQuery) => {
    const params = query ? (query as Record<string, unknown>) : {};
    return apiClient.get<PaginatedResponse<Review>>(
      API_ENDPOINTS.MARKETPLACE.REVIEWS(datasetId),
      params
    );
  },

  // Create review
  createReview: (datasetId: string, data: CreateReviewRequest) =>
    apiClient.post<ReviewResponse>(
      API_ENDPOINTS.MARKETPLACE.REVIEWS(datasetId),
      data
    ),

  // Update review
  updateReview: (reviewId: string, data: UpdateReviewRequest) =>
    apiClient.patch<ReviewResponse>(
      API_ENDPOINTS.MARKETPLACE.REVIEW(reviewId),
      data
    ),

  // Delete review
  deleteReview: (reviewId: string) =>
    apiClient.delete<SuccessResponse>(
      API_ENDPOINTS.MARKETPLACE.REVIEW(reviewId)
    ),
};
