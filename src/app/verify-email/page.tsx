"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConfirmEmailVerification } from "@/hooks/api/useAuth";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import type { ApiError } from "@/types";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmMutation = useConfirmEmailVerification();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const emailParam = searchParams.get("email");
      const tokenParam = searchParams.get("token");

      if (!emailParam || !tokenParam) {
        setStatus("error");
        setMessage("Missing email or verification token");
        return;
      }

      setEmail(emailParam);

      try {
        await confirmMutation.mutateAsync({
          email: emailParam,
          token: tokenParam,
        });
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (err) {
        const apiError = err as ApiError;
        setStatus("error");
        if (apiError.code === "TOKEN_INVALID") {
          setMessage("Invalid verification link. Please request a new one.");
        } else if (apiError.code === "TOKEN_EXPIRED") {
          setMessage("Verification link has expired. Please request a new one.");
        } else {
          setMessage(apiError.message || "Failed to verify email. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [searchParams, confirmMutation, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-white/10 p-4">
              {status === "success" && (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              )}
              {status === "error" && (
                <AlertCircle className="h-8 w-8 text-red-400" />
              )}
              {status === "loading" && (
                <Mail className="h-8 w-8 text-white/60 animate-pulse" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white text-center mb-2">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </h1>

          {/* Message */}
          <p className="text-center text-white/70 mb-6">{message}</p>

          {/* Email Display */}
          {email && (
            <div className="mb-6 rounded-lg border border-white/20 bg-white/5 px-4 py-3">
              <p className="text-xs text-white/50 mb-1">Email verified:</p>
              <p className="text-sm text-white font-medium break-all">{email}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {status === "success" && (
              <p className="text-center text-sm text-white/60">
                Redirecting to home page in 3 seconds...
              </p>
            )}
            {status === "error" && (
              <Button
                onClick={() => router.push("/")}
                className="w-full h-11 bg-white/20 text-white hover:bg-white/30 rounded-lg border border-white/30"
              >
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-white/10 p-4">
                <Mail className="h-8 w-8 text-white/60 animate-pulse" />
              </div>
            </div>
            <p className="text-white text-center">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
