/**
 * Review React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewListQuery,
} from "@/types";

// Query keys
export const reviewKeys = {
  reviews: (datasetId: string, query?: ReviewListQuery) =>
    ["reviews", datasetId, query] as const,
};

// List reviews
export const useReviews = (datasetId: string, query?: ReviewListQuery) => {
  return useQuery({
    queryKey: reviewKeys.reviews(datasetId, query),
    queryFn: () => reviewService.listReviews(datasetId, query),
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      datasetId,
      data,
    }: {
      datasetId: string;
      data: CreateReviewRequest;
    }) => reviewService.createReview(datasetId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.datasetId],
      });
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: UpdateReviewRequest;
    }) => reviewService.updateReview(reviewId, data),
    onSuccess: () => {
      // Note: datasetId would be needed here to invalidate specific dataset reviews
      // For now, invalidate all reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      reviewService.deleteReview(reviewId),
    onSuccess: () => {
      // Note: datasetId would be needed here to invalidate specific dataset reviews
      // For now, invalidate all reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};
