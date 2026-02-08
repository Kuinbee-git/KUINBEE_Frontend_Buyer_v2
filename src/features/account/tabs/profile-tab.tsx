"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useChangePassword } from "@/hooks/api/useAuth";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ApiError } from "@/types";

interface ProfileTabProps {
  section?: "personal" | "security" | "linked-accounts";
}

export function ProfileTab({ section = "personal" }: ProfileTabProps) {
  const changePasswordMutation = useChangePassword();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validation
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "INVALID_CREDENTIALS") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError(apiError.message || "Failed to update password");
      }
    }
  };
  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      {/* Personal Information Card */}
      {section === "personal" && (
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Personal Information</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Update your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                defaultValue="John"
                className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                defaultValue="Doe"
                className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="john.doe@example.com"
              className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              defaultValue="Acme Corp"
              className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
            />
          </div>
          <div className="pt-4">
            <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Security Card */}
      {section === "security" && (
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Security</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Manage your password and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success message */}
          {passwordSuccess && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Password updated successfully
              </p>
            </div>
          )}

          {/* Error message */}
          {passwordError && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{passwordError}</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                required
              />
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                disabled={
                  changePasswordMutation.isPending ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                variant="outline"
                className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
              >
                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}

      {/* Linked Accounts Card */}
      {section === "linked-accounts" && (
        <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-[#1a2240] dark:text-white">Linked Accounts</CardTitle>
            <CardDescription className="text-[#4e5a7e] dark:text-white/60">
              Connect external accounts for easier access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4e5a7e] dark:text-white/60">
              No linked accounts yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
