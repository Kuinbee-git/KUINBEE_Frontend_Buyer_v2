"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";

export function VerifyEmailModalContent() {
  const { openModal } = useModal();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);

    // Simulate API call to POST /api/v1/user/auth/verify-email/send
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
    }, 1000);
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
        </div>

        {resendSuccess && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-200 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-100">
              Email sent successfully.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          variant="outline"
          className="w-full h-11 text-sm border-white/20 bg-white/10 text-white hover:bg-white/15 rounded-lg"
        >
          {isResending ? "Sending..." : "Resend Email"}
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
