/**
 * Razorpay Checkout Flow
 *
 * Full-screen dialog that orchestrates:
 *   1. Create checkout (backend order + Razorpay order)
 *   2. Open Razorpay Checkout modal
 *   3. Confirm payment signature with backend
 *   4. Poll order status until COMPLETED / FAILED
 *
 * Usage:
 *   <RazorpayCheckoutFlow
 *     datasetId="ck..."
 *     datasetTitle="US Treasury Bond Yields"
 *     amount={199}
 *     currency="INR"
 *     open={showCheckout}
 *     onOpenChange={setShowCheckout}
 *     onComplete={(orderId) => router.push(`/order/${orderId}`)}
 *   />
 */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/core/providers/AuthProvider";
import {
  useCreateCheckout,
  useConfirmPayment,
  usePaymentOrder,
} from "@/hooks/api/usePayments";
import { useQueryClient } from "@tanstack/react-query";
import { addOrderId } from "@/lib/orderHistory";
import type {
  RazorpayCheckoutInfo,
  RazorpaySuccessResponse,
  OrderStatus,
} from "@/types";

// ─── Razorpay script loader ─────────────────────────────────────────

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Failed to load Razorpay checkout script"));
    };
    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
}

// ─── Step state machine ──────────────────────────────────────────────

type CheckoutStep =
  | "idle"
  | "creating" // POST /checkout
  | "paying" // Razorpay modal open
  | "confirming" // POST /confirm
  | "polling" // GET /orders/:id (waiting for webhook)
  | "timeout" // Webhook taking too long — let user navigate to order page
  | "completed"
  | "failed";

// ─── Props ───────────────────────────────────────────────────────────

interface RazorpayCheckoutFlowProps {
  /** The dataset id to purchase */
  datasetId: string;
  /** Human-readable dataset title (for display inside the dialog) */
  datasetTitle: string;
  /** Display price (e.g. 199) */
  amount?: number;
  /** Currency code (e.g. "INR") */
  currency?: string;
  /** Dialog visibility */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when payment is fully completed (webhook confirmed) */
  onComplete?: (orderId: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export function RazorpayCheckoutFlow({
  datasetId,
  datasetTitle,
  amount,
  currency = "INR",
  open,
  onOpenChange,
  onComplete,
}: RazorpayCheckoutFlowProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // ── Local state ──
  const [step, setStep] = useState<CheckoutStep>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<RazorpayCheckoutInfo | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pollEnabled, setPollEnabled] = useState(false);

  // ── Mutations ──
  const createCheckout = useCreateCheckout();
  const confirmPayment = useConfirmPayment();

  // ── Polling ──
  const { data: orderData } = usePaymentOrder(orderId, pollEnabled);

  // Track whether onComplete was already fired
  const completedRef = useRef(false);

  // Track polling start time for timeout
  const pollStartRef = useRef<number | null>(null);

  // ── Reset state when dialog closes ──
  useEffect(() => {
    if (!open) {
      // Allow a short delay so exit animations play
      const t = setTimeout(() => {
        setStep("idle");
        setErrorMessage(null);
        setCheckoutInfo(null);
        setOrderId(null);
        setPollEnabled(false);
        completedRef.current = false;
        pollStartRef.current = null;
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ── Start polling timeout timer ──
  useEffect(() => {
    if (step !== "polling") return;
    pollStartRef.current = Date.now();
    const timer = setTimeout(() => {
      // If still polling after 45s, show timeout state
      setPollEnabled(false);
      setStep("timeout");
    }, 45_000);
    return () => clearTimeout(timer);
  }, [step]);

  // ── Watch order status during polling ──
  useEffect(() => {
    if (!orderData) return;

    const status: OrderStatus = orderData.order.status;

    if (status === "COMPLETED") {
      setStep("completed");
      setPollEnabled(false);
      if (!completedRef.current) {
        completedRef.current = true;
        toast.success("Payment successful! Dataset access granted.");
        // Persist this order ID so the Orders page can display it
        addOrderId(orderData.order.id);
        // Refresh entitlements & library so the dataset shows as owned
        queryClient.invalidateQueries({ queryKey: ["entitlements"] });
        queryClient.invalidateQueries({ queryKey: ["library"] });
        onComplete?.(orderData.order.id);
      }
    } else if (status === "FAILED") {
      setStep("failed");
      setPollEnabled(false);
      setErrorMessage("Payment failed. Please try again.");
    } else if (status === "REFUNDED") {
      setStep("failed");
      setPollEnabled(false);
      setErrorMessage("Payment was refunded.");
    }
  }, [orderData, onComplete]);

  // ── Start the checkout flow ──
  const handleStartCheckout = useCallback(async () => {
    try {
      setStep("creating");
      setErrorMessage(null);

      // 1. Load Razorpay script
      await loadRazorpayScript();

      // 2. Create checkout on backend
      const response = await createCheckout.mutateAsync({
        items: [{ datasetId }],
      });

      const checkout = response.checkout;
      setCheckoutInfo(checkout);
      setOrderId(checkout.orderId);

      // 3. Open Razorpay Checkout
      setStep("paying");

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const rzp = new window.Razorpay({
        key: checkout.razorpay.keyId,
        amount: checkout.amountPaise,
        currency: checkout.currency,
        name: "Kuinbee",
        description: datasetTitle,
        order_id: checkout.razorpay.orderId,
        handler: async (response: RazorpaySuccessResponse) => {
          // 4. Confirm with backend
          try {
            setStep("confirming");

            await confirmPayment.mutateAsync({
              paymentAttemptId: checkout.paymentAttemptId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // 5. Start polling for webhook confirmation
            setStep("polling");
            setPollEnabled(true);
          } catch (err: any) {
            setStep("failed");
            setErrorMessage(
              err?.message || "Failed to confirm payment. Contact support if money was deducted."
            );
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#1a2240",
        },
        modal: {
          ondismiss: () => {
            // User closed Razorpay modal without paying
            setStep("idle");
            toast.info("Payment cancelled");
          },
          escape: true,
          confirm_close: true,
        },
      });

      rzp.on("payment.failed", () => {
        setStep("failed");
        setErrorMessage("Payment failed. Please try again with a different payment method.");
      });

      rzp.open();
    } catch (err: any) {
      setStep("failed");
      setErrorMessage(err?.message || "Could not initiate checkout. Please try again.");
    }
  }, [datasetId, datasetTitle, user, createCheckout, confirmPayment]);

  // ── Retry ──
  const handleRetry = () => {
    setStep("idle");
    setErrorMessage(null);
    setCheckoutInfo(null);
    setOrderId(null);
    setPollEnabled(false);
    completedRef.current = false;
  };

  // ── Currency symbol helper ──
  const getCurrencySymbol = (c: string) => {
    switch (c) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return c;
    }
  };

  // ── Prevent closing during active payment ──
  const canClose = step === "idle" || step === "completed" || step === "failed";

  // Hide our dialog while Razorpay's modal is on screen so users can interact with it
  const dialogVisible = open && step !== "paying";

  return (
    <Dialog
      open={dialogVisible}
      onOpenChange={(v) => {
        if (!v && !canClose) {
          toast.info("Please wait while payment is being processed");
          return;
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#1e2847] border-border/50 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {step === "completed" ? "Payment Complete" : "Purchase Dataset"}
          </DialogTitle>
          <DialogDescription className="text-[#4e5a7e] dark:text-white/60">
            {step === "completed"
              ? "Your access has been granted"
              : "Secure payment via Razorpay"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ── Idle / Pre-checkout ── */}
          {step === "idle" && (
            <>
              {/* Dataset summary */}
              <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                    Dataset
                  </p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    {datasetTitle}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                    Price
                  </span>
                  <span className="text-lg font-bold text-foreground dark:text-white">
                    {amount != null
                      ? `${getCurrencySymbol(currency)}${amount.toLocaleString()}`
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>256-bit encrypted &middot; Instant access after payment</span>
              </div>

              {/* CTA */}
              <Button
                className="w-full bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] h-11"
                onClick={handleStartCheckout}
              >
                Pay {amount != null ? `${getCurrencySymbol(currency)}${amount.toLocaleString()}` : ""}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {/* ── Creating checkout ── */}
          {step === "creating" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="w-10 h-10 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-sm text-muted-foreground dark:text-white/60">
                Preparing your order…
              </p>
            </div>
          )}

          {/* ── Paying (Razorpay modal is open) ── */}
          {step === "paying" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <CreditCard className="w-10 h-10 text-[#1a2240] dark:text-white animate-pulse" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground dark:text-white">
                  Complete payment in the Razorpay window
                </p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  Do not close this page
                </p>
              </div>
            </div>
          )}

          {/* ── Confirming ── */}
          {step === "confirming" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="w-10 h-10 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-sm text-muted-foreground dark:text-white/60">
                Verifying payment…
              </p>
            </div>
          )}

          {/* ── Polling (waiting for webhook) ── */}
          {step === "polling" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground dark:text-white">
                  Payment received
                </p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  Confirming your access — this usually takes a few seconds…
                </p>
              </div>
              {checkoutInfo && (
                <Badge
                  variant="outline"
                  className="text-xs font-mono text-muted-foreground border-border/50"
                >
                  Order {checkoutInfo.orderNumber}
                </Badge>
              )}
            </div>
          )}

          {/* ── Timeout (webhook delayed > 45s) ── */}
          {step === "timeout" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground dark:text-white">
                  Payment Received
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/60 mt-1 max-w-xs">
                  Your payment was successful, but access confirmation is taking
                  longer than usual. This may take a minute — check your order
                  page for updates.
                </p>
              </div>
              {orderId && (
                <Button
                  onClick={() => {
                    onOpenChange?.(false);
                    router.push(`/order/${orderId}`);
                  }}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View Order Status
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {checkoutInfo && (
                <Badge
                  variant="outline"
                  className="text-xs font-mono text-muted-foreground border-border/50"
                >
                  Order {checkoutInfo.orderNumber}
                </Badge>
              )}
            </div>
          )}

          {/* ── Completed ── */}
          {step === "completed" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground dark:text-white">
                  Access Granted!
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/60 mt-1">
                  Your dataset is now available in your library.
                </p>
              </div>
              {checkoutInfo && (
                <Badge
                  variant="outline"
                  className="text-xs font-mono text-muted-foreground border-border/50"
                >
                  Order {checkoutInfo.orderNumber}
                </Badge>
              )}
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-border/50 dark:border-white/20"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                  onClick={() => {
                    onOpenChange(false);
                    if (orderId) {
                      window.location.href = `/order/${orderId}`;
                    }
                  }}
                >
                  View Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Failed ── */}
          {step === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground dark:text-white">
                  Payment Failed
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/60 mt-1">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              </div>
              {checkoutInfo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>If money was deducted, it will be refunded within 5-7 business days.</span>
                </div>
              )}
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-border/50 dark:border-white/20"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleRetry}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
