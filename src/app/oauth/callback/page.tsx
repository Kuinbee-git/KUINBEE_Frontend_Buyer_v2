"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { API_BASE_URL } from "@/core/api";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get the mode parameter to distinguish between login and linking flows
      const mode = searchParams.get("mode") || "login";
      
      // Check for OAuth provider errors from Google/GitHub
      const oauthError = searchParams.get("error");
      const oauthErrorDescription = searchParams.get("error_description");
      
      // Check for backend errors (passed as URL parameters)
      const backendError = searchParams.get("error_code");
      const backendErrorMessage = searchParams.get("error_message");
      
      // Check for authorization code
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // Handle OAuth provider errors (from Google/GitHub)
      if (oauthError) {
        setStatus("error");
        setErrorCode(oauthError);
        if (oauthError === "access_denied") {
          setMessage(mode === "link" ? "You cancelled the account linking. Please try again." : "You cancelled the OAuth login. Please try again.");
        } else if (oauthError === "invalid_scope") {
          setMessage("Invalid permission scope requested.");
        } else {
          setMessage(
            oauthErrorDescription || `OAuth error: ${oauthError}. Please try again.`
          );
        }
        return;
      }

      // Handle backend errors (from our API)
      if (backendError) {
        setStatus("error");
        setErrorCode(backendError);
        const errorMessages: Record<string, string> = {
          OAUTH_STATE_INVALID: "Invalid OAuth session. Please try signing in again.",
          OAUTH_CODE_INVALID: "Invalid authorization code. Please try signing in again.",
          OAUTH_TOKEN_EXCHANGE_FAILED: "Failed to exchange authorization code. Please try again.",
          USER_CREATION_FAILED: "Failed to create user account. Please try again.",
          EMAIL_ALREADY_IN_USE: "This email is already registered. Please log in instead.",
          ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact support.",
          PROVIDER_ALREADY_LINKED: "This provider account is already linked to another user account.",
        };
        
        const message = errorMessages[backendError] || backendErrorMessage || "Authentication failed. Please try again.";
        setMessage(message);
        return;
      }

      // If no code/state, backend already handled OAuth and set session
      // The backend redirects here AFTER successful authentication
      if (!code && !state) {
        // Verify authentication by checking session
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/user/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Auth verified:", data);
            setStatus("success");
            
            // Determine redirect based on mode
            const redirectMessage = mode === "link" ? "Account linked successfully! Redirecting..." : "Successfully authenticated! Redirecting...";
            setMessage(redirectMessage);
            
            const redirectUrl = mode === "link" ? "/account/linked-accounts" : "/";
            
            setTimeout(() => {
              router.push(redirectUrl);
            }, 1500);
            return;
          } else {
            const errorData = await response.json();
            console.error("Auth verification failed:", errorData);
            setStatus("error");
            setErrorCode("AUTH_VERIFICATION_FAILED");
            setMessage("Authentication session not found. Please try signing in again.");
            return;
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setStatus("error");
          setErrorCode("NETWORK_ERROR");
          setMessage("Failed to verify authentication. Please check your connection and try again.");
          return;
        }
      }

      try {
        // If we have code and state, backend still needs to process them
        // (shouldn't happen with current flow, but keep as fallback)
        setStatus("success");
        
        const redirectMessage = mode === "link" ? "Account linked successfully! Redirecting..." : "Successfully authenticated! Redirecting...";
        setMessage(redirectMessage);
        
        const redirectUrl = mode === "link" ? "/account/linked-accounts" : "/";
        
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      } catch (err) {
        setStatus("error");
        setErrorCode("UNKNOWN");
        setMessage("Failed to complete authentication. Please try again.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-white/10 p-4">
              {status === "loading" && (
                <Loader className="h-8 w-8 text-blue-400 animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              )}
              {status === "error" && (
                <AlertCircle className="h-8 w-8 text-red-400" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white text-center mb-2">
            {status === "loading" && "Signing In"}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
          </h1>

          {/* Message */}
          <p className="text-center text-white/70 mb-4">{message}</p>

          {/* Error Code */}
          {errorCode && (
            <p className="text-center text-xs text-white/50 mb-6 font-mono bg-white/5 rounded px-3 py-2">
              Code: {errorCode}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {status === "loading" && (
              <p className="text-center text-sm text-white/60">
                Please wait while we complete your authentication...
              </p>
            )}
            {status === "success" && (
              <p className="text-center text-sm text-white/60">
                Redirecting to home page...
              </p>
            )}
            {status === "error" && (
              <>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full h-11 bg-white/20 text-white hover:bg-white/30 rounded-lg border border-white/30"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => router.push("/?auth=login")}
                  variant="outline"
                  className="w-full h-11 border-white/30 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>

          {/* Help text */}
          {status === "error" && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-center text-white/50">
                If you continue to experience issues, please contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-white/10 p-4">
                <Loader className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
            </div>
            <p className="text-white text-center">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
