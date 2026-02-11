"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useChangePassword, useSecurityOverview, useUnlinkProvider } from "@/hooks/api/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/api/useProfile";
import { AlertCircle, CheckCircle2, Loader2, Github } from "lucide-react";
import type { ApiError, OAuthProvider } from "@/types";

interface ProfileTabProps {
  section?: "personal" | "security" | "linked-accounts";
}

export function ProfileTab({ section = "personal" }: ProfileTabProps) {
  // Profile data
  const { data: profileResponse, isLoading: isLoadingProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const profile = profileResponse?.profile;

  // Security data
  const { data: securityResponse, isLoading: isLoadingSecurity } = useSecurityOverview();
  const unlinkProviderMutation = useUnlinkProvider();
  const securityData = securityResponse?.security;

  // Password change
  const changePasswordMutation = useChangePassword();
  
  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFirstName(profile.personalInfo?.firstName || "");
      setLastName(profile.personalInfo?.lastName || "");
      setPhone(profile.user.phone || "");
    }
  }, [profile]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    try {
      await updateProfileMutation.mutateAsync({
        phone: phone || null,
        personalInfo: {
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });
      setProfileSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setProfileError(apiError.message || "Failed to update profile");
    }
  };

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

  const handleUnlinkProvider = async (provider: "google" | "github") => {
    if (!confirm(`Are you sure you want to unlink your ${provider} account?`)) {
      return;
    }

    try {
      await unlinkProviderMutation.mutateAsync(provider);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "CANNOT_UNLINK_LAST_LOGIN_METHOD") {
        alert("You cannot unlink your last login method. Please add a password or link another account first.");
      } else {
        alert(apiError.message || `Failed to unlink ${provider}`);
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
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#1a2240] dark:text-white" />
            </div>
          ) : (
            <>
              {/* Success message */}
              {profileSuccess && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Profile updated successfully
                  </p>
                </div>
              )}

              {/* Error message */}
              {profileError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{profileError}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.user.email || ""}
                      disabled
                      className="bg-gray-50 dark:bg-[#0f1729]/50 border-border/40 dark:border-white/10 text-gray-500 dark:text-white/50"
                    />
                    <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10"
                    />
                  </div>
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
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
            {isLoadingSecurity ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#1a2240] dark:text-white" />
              </div>
            ) : securityData?.providers && securityData.providers.length > 0 ? (
              <div className="space-y-3">
                {securityData.providers.map((provider: { provider: OAuthProvider; linkedAt: string }) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      {provider.provider === "google" ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      ) : (
                        <Github className="h-5 w-5 text-[#1a2240] dark:text-white" />
                      )}
                      <div>
                        <p className="font-medium text-[#1a2240] dark:text-white capitalize">
                          {provider.provider}
                        </p>
                        <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                          Linked {new Date(provider.linkedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUnlinkProvider(provider.provider)}
                      disabled={unlinkProviderMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="border-red-400/30 dark:border-red-400/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/10"
                    >
                      {unlinkProviderMutation.isPending ? "Unlinking..." : "Unlink"}
                    </Button>
                  </div>
                ))}
                
                {/* Password info */}
                {securityData.hasPassword && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-400/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      ✓ Password login is enabled
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#4e5a7e] dark:text-white/60">
                No linked accounts yet. You can link Google or GitHub accounts for easier sign-in.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
