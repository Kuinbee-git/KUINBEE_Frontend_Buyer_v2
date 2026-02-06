/**
 * Authentication React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import type {
  SignUpRequest,
  LoginRequest,
  SendEmailVerificationRequest,
  ConfirmEmailVerificationRequest,
  RequestPasswordResetRequest,
  ConfirmPasswordResetRequest,
  ChangePasswordRequest,
  OAuthProvider,
  LinkProviderRequest,
  OAuthStartQuery,
} from "@/types";

// Query keys
export const authKeys = {
  me: ["auth", "me"] as const,
  security: ["auth", "security"] as const,
};

// Get current user
export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.me,
    retry: false,
  });
};

// Sign up
export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
  });
};

// Login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      // Invalidate user data to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};

// Email verification
export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: (data: SendEmailVerificationRequest) =>
      authService.sendEmailVerification(data),
  });
};

export const useConfirmEmailVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmEmailVerificationRequest) =>
      authService.confirmEmailVerification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
};

// Password reset
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (data: RequestPasswordResetRequest) =>
      authService.requestPasswordReset(data),
  });
};

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: (data: ConfirmPasswordResetRequest) =>
      authService.confirmPasswordReset(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
  });
};

// OAuth
export const useOAuthGoogleStart = () => {
  return useMutation({
    mutationFn: (query?: OAuthStartQuery) => authService.oauthGoogleStart(query),
  });
};

export const useOAuthGithubStart = () => {
  return useMutation({
    mutationFn: (query?: OAuthStartQuery) => authService.oauthGithubStart(query),
  });
};

// Security
export const useSecurityOverview = () => {
  return useQuery({
    queryKey: authKeys.security,
    queryFn: authService.getSecurityOverview,
  });
};

export const useLinkProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      provider,
      data,
    }: {
      provider: OAuthProvider;
      data: LinkProviderRequest;
    }) => authService.linkProvider(provider, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.security });
    },
  });
};

export const useUnlinkProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: OAuthProvider) =>
      authService.unlinkProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.security });
    },
  });
};
