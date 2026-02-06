/**
 * Wishlist types
 */

export interface WishlistItem {
  datasetId: string;
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
}
