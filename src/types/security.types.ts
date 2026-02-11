/**
 * Security types
 */

export type OAuthProvider = "google" | "github";

export interface LinkedProvider {
  provider: OAuthProvider;
  linkedAt: string; // ISO date string
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

export interface LinkProviderResponse {
  success: true;
}

export interface UnlinkProviderResponse {
  success: true;
}
