"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";
import { useSendEmailVerification } from "@/hooks/api/useAuth";
import type { ApiError } from "@/types";

export function VerifyEmailModalContent() {
  const { openModal } = useModal();
  const sendVerificationMutation = useSendEmailVerification();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get email from sessionStorage (set by login modal or signup modal)
    const pendingEmail = sessionStorage.getItem("pending_verification_email");
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const handleResend = async () => {
    setResendSuccess(false);
    setError(null);

    if (!email) {
      setError("Email address not found. Please try signing up again.");
      return;
    }

    try {
      await sendVerificationMutation.mutateAsync({ email });
      setResendSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to resend verification email. Please try again.");
    }
  };

  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-white/10 p-4">
          <Mail className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Check your email
        </h1>
        <p className="text-sm text-white/70">
          We've sent you a verification link
        </p>
      </div>

      {/* Instructions */}
      <div className="space-y-3 mb-6">
        <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3">
          <p className="text-sm text-white/70 leading-relaxed">
            Click the verification link in your email to activate your account.
            Link expires in 24 hours.
          </p>
          {email && (
            <p className="text-xs text-white/50 mt-2">
              Sending to: {email}
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5">
            <AlertCircle className="h-4 w-4 text-red-200 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {resendSuccess && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-200 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-100">
              Email sent successfully. Check your inbox.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleResend}
          disabled={sendVerificationMutation.isPending || !email}
          variant="outline"
          className="w-full h-11 text-sm border-white/20 bg-white/10 text-white hover:bg-white/15 rounded-lg"
        >
          {sendVerificationMutation.isPending ? "Sending..." : "Resend Email"}
        </Button>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => openModal("login")}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Return to sign in
          </button>
        </div>
      </div>

      {/* Additional help */}
      <div className="mt-6 pt-5 border-t border-white/15">
        <p className="text-sm text-center text-white/60">
          Check spam folder or contact support.
        </p>
      </div>
    </>
  );
}
