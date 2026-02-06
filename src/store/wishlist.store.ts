/**
 * Wishlist store
 */

import { create } from "zustand";

interface WishlistState {
  wishlistDatasetIds: Set<string>;
  addToWishlist: (datasetId: string) => void;
  removeFromWishlist: (datasetId: string) => void;
  isInWishlist: (datasetId: string) => boolean;
  setWishlistIds: (ids: string[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistDatasetIds: new Set<string>(),

  addToWishlist: (datasetId) =>
    set((state) => {
      const newSet = new Set(state.wishlistDatasetIds);
      newSet.add(datasetId);
      return { wishlistDatasetIds: newSet };
    }),

  removeFromWishlist: (datasetId) =>
    set((state) => {
      const newSet = new Set(state.wishlistDatasetIds);
      newSet.delete(datasetId);
      return { wishlistDatasetIds: newSet };
    }),

  isInWishlist: (datasetId) => get().wishlistDatasetIds.has(datasetId),

  setWishlistIds: (ids) =>
    set({
      wishlistDatasetIds: new Set(ids),
    }),

  clearWishlist: () =>
    set({
      wishlistDatasetIds: new Set<string>(),
    }),
}));
