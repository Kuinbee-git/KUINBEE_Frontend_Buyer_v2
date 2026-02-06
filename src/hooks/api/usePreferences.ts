/**
 * Preferences React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preferencesService } from "@/services";
import type { UpdatePreferencesRequest } from "@/types";

// Query keys
export const preferencesKeys = {
  preferences: ["preferences"] as const,
};

// Get preferences
export const usePreferences = () => {
  return useQuery({
    queryKey: preferencesKeys.preferences,
    queryFn: preferencesService.getPreferences,
  });
};

// Update preferences
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) =>
      preferencesService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preferencesKeys.preferences });
    },
  });
};
