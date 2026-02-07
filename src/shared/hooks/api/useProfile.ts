/**
 * Profile React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services";
import type { UpdateProfileRequest } from "@/types";

// Query keys
export const profileKeys = {
  profile: ["profile"] as const,
};

// Get profile
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: profileService.getProfile,
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile });
    },
  });
};

// Delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
