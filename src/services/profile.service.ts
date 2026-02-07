/**
 * Profile service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  ProfileResponse,
  UpdateProfileRequest,
  SuccessResponse,
} from "@/types";

export const profileService = {
  // Get profile
  getProfile: () =>
    apiClient.get<ProfileResponse>(API_ENDPOINTS.PROFILE.BASE),

  // Update profile
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ProfileResponse>(API_ENDPOINTS.PROFILE.BASE, data),

  // Delete account
  deleteAccount: () =>
    apiClient.delete<SuccessResponse>(API_ENDPOINTS.PROFILE.DELETE),
};
