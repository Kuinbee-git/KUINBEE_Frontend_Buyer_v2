/**
 * Authentication service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  SendEmailVerificationRequest,
  ConfirmEmailVerificationRequest,
  RequestPasswordResetRequest,
  ConfirmPasswordResetRequest,
  ChangePasswordRequest,
  MeResponse,
  OAuthStartQuery,
  OAuthStartResponse,
  SecurityOverviewResponse,
  LinkProviderRequest,
  SuccessResponse,
  OAuthProvider,
} from "@/types";

export const authService = {
  // Sign up
  signUp: (data: SignUpRequest) =>
    apiClient.post<SignUpResponse>(API_ENDPOINTS.AUTH.SIGNUP, data),

  // Login
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

  // Logout
  logout: () => apiClient.post<SuccessResponse>(API_ENDPOINTS.AUTH.LOGOUT),

  // Get current user
  me: () => apiClient.get<MeResponse>(API_ENDPOINTS.AUTH.ME),

  // Email verification
  sendEmailVerification: (data: SendEmailVerificationRequest) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL.SEND,
      data
    ),

  confirmEmailVerification: (data: ConfirmEmailVerificationRequest) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL.CONFIRM,
      data
    ),

  // Password reset
  requestPasswordReset: (data: RequestPasswordResetRequest) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.AUTH.PASSWORD.RESET.REQUEST,
      data
    ),

  confirmPasswordReset: (data: ConfirmPasswordResetRequest) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.AUTH.PASSWORD.RESET.CONFIRM,
      data
    ),

  // Change password
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<SuccessResponse>(API_ENDPOINTS.AUTH.PASSWORD.CHANGE, data),

  // OAuth - Google
  oauthGoogleStart: (query?: OAuthStartQuery) =>
    apiClient.get<OAuthStartResponse>(
      API_ENDPOINTS.AUTH.OAUTH.GOOGLE.START,
      query as Record<string, unknown>
    ),

  // OAuth - GitHub
  oauthGithubStart: (query?: OAuthStartQuery) =>
    apiClient.get<OAuthStartResponse>(
      API_ENDPOINTS.AUTH.OAUTH.GITHUB.START,
      query as Record<string, unknown>
    ),

  // Security
  getSecurityOverview: () =>
    apiClient.get<SecurityOverviewResponse>(API_ENDPOINTS.PROFILE.SECURITY),

  linkProvider: (provider: OAuthProvider, data: LinkProviderRequest) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.PROFILE.LINK_PROVIDER(provider),
      data
    ),

  unlinkProvider: (provider: OAuthProvider) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.PROFILE.UNLINK_PROVIDER(provider)
    ),
};
