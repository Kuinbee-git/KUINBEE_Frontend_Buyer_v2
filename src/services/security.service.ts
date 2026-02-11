/**
 * Security service
 */

import { apiClient } from "@/core/api";
import type {
  SecurityOverviewResponse,
  LinkProviderRequest,
  LinkProviderResponse,
  UnlinkProviderResponse,
  OAuthProvider,
} from "@/types/security.types";

const API_BASE = "/api/v1/user/me/security";

export const securityService = {
  // Get security overview
  getSecurityOverview: () =>
    apiClient.get<SecurityOverviewResponse>(API_BASE),

  // Link OAuth provider
  linkGoogle: (data: LinkProviderRequest) =>
    apiClient.post<LinkProviderResponse>(`${API_BASE}/link/google`, data),

  linkGithub: (data: LinkProviderRequest) =>
    apiClient.post<LinkProviderResponse>(`${API_BASE}/link/github`, data),

  // Unlink OAuth provider
  unlinkProvider: (provider: OAuthProvider) =>
    apiClient.post<UnlinkProviderResponse>(`${API_BASE}/unlink/${provider}`),
};
