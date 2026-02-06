/**
 * Authentication types
 */

export type UserType = "USER";

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION"
  | "DELETED";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
}

// Sign Up
export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  user: User;
  verification: {
    sent: true;
  };
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

// Email Verification
export interface SendEmailVerificationRequest {
  email: string;
}

export interface ConfirmEmailVerificationRequest {
  email: string;
  token: string;
}

// Password Reset
export interface RequestPasswordResetRequest {
  email: string;
}

export interface ConfirmPasswordResetRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// OAuth
export type OAuthProvider = "google" | "github";

export interface OAuthStartQuery {
  redirectTo?: string;
}

export interface OAuthStartResponse {
  url: string;
}

export interface OAuthCallbackQuery {
  code: string;
  state: string;
}

// Me
export interface MeResponse {
  user: User;
}

// Security
export interface LinkedProvider {
  provider: OAuthProvider;
  linkedAt: string;
}

export interface SecurityOverview {
  hasPassword: boolean;
  providers: LinkedProvider[];
  lastLoginAt: string | null;
}

export interface SecurityOverviewResponse {
  security: SecurityOverview;
}

export interface LinkProviderRequest {
  code: string;
  state?: string;
}
