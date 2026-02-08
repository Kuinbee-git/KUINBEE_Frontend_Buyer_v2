"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";
import { useConfirmPasswordReset } from "@/hooks/api/useAuth";
import { useSearchParams } from "next/navigation";
import type { ApiError } from "@/types";

export function ResetPasswordModalContent() {
  const { openModal } = useModal();
  const searchParams = useSearchParams();
  const resetMutation = useConfirmPasswordReset();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Get token and email from URL params
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
    setFormData((prev) => ({ ...prev, token, email }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetMutation.mutateAsync({
        email: formData.email,
        token: formData.token,
        newPassword: formData.password,
      });
      openModal("reset-password-success");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "TOKEN_INVALID") {
        setError("Invalid reset link. Please request a new one.");
      } else if (apiError.code === "TOKEN_EXPIRED") {
        setError("Reset link has expired. Please request a new one.");
      } else {
        setError(apiError.message || "Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-white/10 p-4">
          <Lock className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Create new password
        </h1>
        <p className="text-sm text-white/70">
          Enter a strong password for your account
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {/* Password field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="new-password"
            className="text-sm font-normal text-white/70"
          >
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="h-11 text-sm pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirm-password"
            className="text-sm font-normal text-white/70"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="h-11 text-sm pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password requirements */}
        <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3">
          <p className="text-xs text-white/60 leading-relaxed">
            Password must be at least 8 characters and include uppercase, lowercase, and numbers.
          </p>
        </div>

        <Button
          type="submit"
          disabled={resetMutation.isPending || !formData.password || !formData.confirmPassword}
          className="w-full h-11 mt-6 text-sm bg-white/20 text-white hover:bg-white/30 transition-colors rounded-lg border border-white/30"
        >
          {resetMutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {/* Back to sign in */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => openModal("login")}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Back to sign in
        </button>
      </div>
    </>
  );
}
