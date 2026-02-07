"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { OAuthSection } from "@/features/auth/components/oauth-section";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";
import { useAuth } from "@/core/providers/AuthProvider";

export function LoginModalContent() {
  const { openModal, closeModal } = useModal();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // TEMPORARY BYPASS: Accept any credentials
      await login(formData.email, formData.password);
      closeModal(); // Close modal on successful login
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthGoogle = () => {
    // Redirect to OAuth start endpoint
    window.location.href = "/api/v1/user/auth/oauth/google/start";
  };

  const handleOAuthGitHub = () => {
    // Redirect to OAuth start endpoint
    window.location.href = "/api/v1/user/auth/oauth/github/start";
  };

  return (
    <>
      {/* Title and helper */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Sign in to Kuinbee
        </h1>
        <p className="text-sm text-white/70">
          Access the governed data registry.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-sm font-normal text-white/70"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="h-11 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
          />
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-normal text-white/70"
            >
              Password
            </Label>
            <button
              type="button"
              onClick={() => openModal("forgot-password")}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
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

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-6 text-sm bg-white/20 text-white hover:bg-white/30 transition-colors rounded-lg border border-white/30"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* OAuth options */}
      <OAuthSection
        onGoogleClick={handleOAuthGoogle}
        onGitHubClick={handleOAuthGitHub}
      />

      {/* Sign up link */}
      <div className="mt-6 text-center text-sm text-white/70">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => openModal("signup")}
          className="text-white font-medium hover:underline"
        >
          Create one
        </button>
      </div>
    </>
  );
}
