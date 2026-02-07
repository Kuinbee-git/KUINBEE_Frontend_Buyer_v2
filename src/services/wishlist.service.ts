/**
 * Wishlist service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type { WishlistResponse, SuccessResponse } from "@/types";

export const wishlistService = {
  // List wishlist
  listWishlist: () =>
    apiClient.get<WishlistResponse>(API_ENDPOINTS.WISHLIST.BASE),

  // Add to wishlist
  addToWishlist: (datasetId: string) =>
    apiClient.post<SuccessResponse>(API_ENDPOINTS.WISHLIST.ITEM(datasetId)),

  // Remove from wishlist
  removeFromWishlist: (datasetId: string) =>
    apiClient.delete<SuccessResponse>(API_ENDPOINTS.WISHLIST.ITEM(datasetId)),
};
