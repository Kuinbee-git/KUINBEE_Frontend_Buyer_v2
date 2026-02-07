/**
 * Preferences service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  PreferencesResponse,
  UpdatePreferencesRequest,
} from "@/types";

export const preferencesService = {
  // Get preferences
  getPreferences: () =>
    apiClient.get<PreferencesResponse>(API_ENDPOINTS.PREFERENCES),

  // Update preferences
  updatePreferences: (data: UpdatePreferencesRequest) =>
    apiClient.put<PreferencesResponse>(API_ENDPOINTS.PREFERENCES, data),
};
