"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { KeyRound, AlertCircle } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";

export function ForgotPasswordModalContent() {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call to POST /api/v1/user/auth/password/reset/request
    setTimeout(() => {
      setIsLoading(false);
      openModal("reset-email-sent");
    }, 1000);
  };

  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-white/10 p-4">
          <KeyRound className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Reset your password
        </h1>
        <p className="text-sm text-white/70">
          Enter your email to receive a password reset link
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
        <div className="space-y-1.5">
          <Label
            htmlFor="reset-email"
            className="text-sm font-normal text-white/70"
          >
            Email
          </Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 rounded-lg"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-6 text-sm bg-white/20 text-white hover:bg-white/30 transition-colors rounded-lg border border-white/30"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
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
