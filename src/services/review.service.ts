/**
 * Review service
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type {
  Review,
  ReviewResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewListQuery,
  PaginatedResponse,
  SuccessResponse,
} from "@/types";

export const reviewService = {
  // List reviews for a dataset
  listReviews: (datasetId: string, query?: ReviewListQuery) =>
    apiClient.get<PaginatedResponse<Review>>(
      API_ENDPOINTS.MARKETPLACE.REVIEWS(datasetId),
      query as Record<string, unknown>
    ),

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
