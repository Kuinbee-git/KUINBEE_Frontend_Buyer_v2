"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePreferences, useUpdatePreferences } from "@/hooks/api/usePreferences";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ApiError, Currency } from "@/types";

export function PreferencesTab() {
  // Fetch preferences
  const { data: preferencesResponse, isLoading } = usePreferences();
  const updatePreferencesMutation = useUpdatePreferences();
  const preferences = preferencesResponse?.preferences;

  // Form state
  const [currency, setCurrency] = useState<Currency>("USD");
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productEmails, setProductEmails] = useState(false);

  // Feedback state
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial values
  useEffect(() => {
    if (preferences) {
      setCurrency(preferences.currency);
      setMarketingEmails(preferences.marketingEmails);
      setProductEmails(preferences.productEmails);
    }
  }, [preferences]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await updatePreferencesMutation.mutateAsync({
        currency,
        marketingEmails,
        productEmails,
      });
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to update preferences");
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      {/* Success Message */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Preferences updated successfully
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Email Preferences Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Email Preferences</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Control what email notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#1a2240] dark:text-white" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Product Emails</Label>
                  <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                    Updates about new features and improvements to the platform
                  </p>
                </div>
                <Switch
                  checked={productEmails}
                  onCheckedChange={setProductEmails}
                  disabled={updatePreferencesMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Marketing Emails</Label>
                  <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                    Promotional offers and feature announcements
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                  disabled={updatePreferencesMutation.isPending}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={updatePreferencesMutation.isPending}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                >
                  {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Currency Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Currency</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Set your preferred currency for pricing displays.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#1a2240] dark:text-white" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as Currency)}
                  disabled={updatePreferencesMutation.isPending}
                >
                  <SelectTrigger
                    id="currency"
                    className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($) - United States Dollar</SelectItem>
                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                    <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                    <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                  All prices will be displayed in your selected currency
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={updatePreferencesMutation.isPending}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                >
                  {updatePreferencesMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
