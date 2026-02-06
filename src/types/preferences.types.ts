/**
 * User preferences types
 */

export type Currency = "INR" | "USD" | "EUR" | "GBP";

export interface Preferences {
  currency: Currency;
  marketingEmails: boolean;
  productEmails: boolean;
}

export interface PreferencesResponse {
  preferences: Preferences;
}

export interface UpdatePreferencesRequest {
  currency?: Currency;
  marketingEmails?: boolean;
  productEmails?: boolean;
}
