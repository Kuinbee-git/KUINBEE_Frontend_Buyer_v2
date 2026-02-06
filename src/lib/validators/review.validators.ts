/**
 * Review validation schemas
 */

import { z } from "zod";

// Create review schema
export const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters").optional().nullable(),
});

// Update review schema
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5")
    .optional(),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters").optional().nullable(),
});

// Export types
export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>;
