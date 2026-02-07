"use client";

import { Button } from "@/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useModal } from "@/core/providers/ModalProvider";

export function ResetPasswordSuccessModalContent() {
  const { openModal } = useModal();

  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-emerald-500/20 p-4">
          <CheckCircle2 className="h-6 w-6 text-emerald-200" />
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Password reset successful
        </h1>
        <p className="text-sm text-white/70">
          Your password has been changed successfully
        </p>
      </div>

      {/* Success message */}
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 mb-6">
        <p className="text-sm text-emerald-100 leading-relaxed">
          You can now sign in with your new password.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={() => openModal("login")}
          className="w-full h-11 text-sm bg-white/20 text-white hover:bg-white/30 transition-colors rounded-lg border border-white/30"
        >
          Continue to Sign In
        </Button>
      </div>
    </>
  );
}
