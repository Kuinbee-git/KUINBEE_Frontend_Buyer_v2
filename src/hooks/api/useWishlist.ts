/**
 * Wishlist React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services";

// Query keys
export const wishlistKeys = {
  wishlist: ["wishlist"] as const,
};

// List wishlist — only fetch when authenticated (avoids 401s for guests)
export const useWishlist = (enabled = true) => {
  return useQuery({
    queryKey: wishlistKeys.wishlist,
    queryFn: wishlistService.listWishlist,
    enabled,
    staleTime:  60_000, // 2 min — wishlist rarely changes mid-session
  });
};

// Add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datasetId: string) => wishlistService.addToWishlist(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.wishlist });
    },
  });
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datasetId: string) =>
      wishlistService.removeFromWishlist(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.wishlist });
    },
  });
};
