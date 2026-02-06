/**
 * Review types
 */

import { PaginationQuery } from "./api.types";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewResponse {
  review: Review;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string | null;
}

export type ReviewListQuery = PaginationQuery;
