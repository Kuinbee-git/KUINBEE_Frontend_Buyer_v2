"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { OAuthSection } from "@/features/auth/components/oauth-section";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";
import { useSignUp } from "@/hooks/api/useAuth";
import type { ApiError } from "@/types";

export function SignupModalContent() {
  const { openModal, closeModal } = useModal();
  const signupMutation = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreedToTerms) {
      setError("You must agree to the Terms of Service to create an account.");
      return;
    }

    try {
      await signupMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      // Store email for verification modal
      sessionStorage.setItem("pending_verification_email", formData.email);
      closeModal();
      // Show email verification modal
      openModal("verify-email");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "EMAIL_ALREADY_IN_USE") {
        setError("This email is already registered. Please log in instead.");
      } else if (apiError.code === "VALIDATION_ERROR") {
        setError(apiError.message || "Please check your input and try again.");
      } else {
        setError(apiError.message || "Unable to create account. Please try again.");
      }
    }
  };



  return (
    <>
      {/* Title and helper */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Create your account
        </h1>
        <p className="text-sm text-white/70">
          Join the governed data marketplace.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {/* Signup form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Organization name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="org-name"
            className="text-sm font-normal text-white/70"
          >
            Organization
          </Label>
          <Input
            id="org-name"
            type="text"
            placeholder="Acme Corporation"
            value={formData.organizationName}
            onChange={(e) =>
              setFormData({ ...formData, organizationName: e.target.value })
            }
            required
            className="h-10 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
          />
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-sm font-normal text-white/70"
          >
            Work Email
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
            className="h-10 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
          />
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-sm font-normal text-white/70"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="h-10 text-sm pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
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

        {/* Terms checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="terms"
            checked={formData.agreedToTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreedToTerms: checked as boolean })
            }
            className="mt-0.5 h-4 w-4 border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/40 data-[state=checked]:text-white"
          />
          <label
            htmlFor="terms"
            className="text-sm text-white/70 leading-relaxed"
          >
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              className="text-white underline hover:text-white/90"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-white underline hover:text-white/90"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={
            signupMutation.isPending ||
            !formData.organizationName ||
            !formData.email ||
            !formData.password ||
            !formData.agreedToTerms
          }
          className="w-full h-11 mt-5 text-sm bg-white/20 text-white hover:bg-white/30 transition-colors rounded-lg border border-white/30"
        >
          {signupMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* OAuth options */}
      <OAuthSection />

      {/* Sign in link */}
      <div className="mt-6 text-center text-sm text-white/70">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => openModal("login")}
          className="text-white font-medium hover:underline"
        >
          Sign in
        </button>
      </div>
    </>
  );
}
