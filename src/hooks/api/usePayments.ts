/**
 * Payment React Query hooks
 *
 * - useCreateCheckout  — mutation: POST checkout
 * - useConfirmPayment  — mutation: POST confirm
 * - usePaymentOrder    — query with polling for order status
 * - useRazorpayCheckout — orchestrates the full Razorpay flow
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import type {
  RazorpayCheckoutCreateBody,
  RazorpayConfirmBody,
  PaymentOrderListQuery,
  OrderStatus,
} from "@/types";

// ─── Query keys ──────────────────────────────────────────────────────

export const paymentKeys = {
  orders: (query?: PaymentOrderListQuery) => ["payment", "orders", query] as const,
  order: (orderId: string) => ["payment", "order", orderId] as const,
};

// ─── Mutations ───────────────────────────────────────────────────────

/** List user's payment orders. */
export const usePaymentOrders = (query?: PaymentOrderListQuery) => {
  return useQuery({
    queryKey: paymentKeys.orders(query),
    queryFn: () => paymentService.listOrders(query),
  });
};

/** Create a Razorpay checkout (order + payment attempt on the backend). */
export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (body: RazorpayCheckoutCreateBody) =>
      paymentService.createCheckout(body),
  });
};

/** Confirm a client-side Razorpay success with the backend. */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RazorpayConfirmBody) =>
      paymentService.confirmPayment(body),
    onSuccess: (_data, variables) => {
      // Invalidate any cached order queries so the poll picks up the new state
      queryClient.invalidateQueries({
        queryKey: ["payment", "order"],
      });
    },
  });
};

// ─── Polling query ───────────────────────────────────────────────────

const TERMINAL_STATUSES: OrderStatus[] = ["COMPLETED", "FAILED", "REFUNDED"];
const POLL_INTERVAL_MS = 2_000; // 2 seconds

/**
 * Poll an order until it reaches a terminal status.
 *
 * @param orderId  — the internal order id
 * @param enabled  — set to true once `confirmPayment` succeeds
 */
export const usePaymentOrder = (orderId: string | null, enabled = false) => {
  return useQuery({
    queryKey: paymentKeys.order(orderId ?? ""),
    queryFn: () => paymentService.getOrder(orderId!),
    enabled: enabled && !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.order?.status;
      if (status && TERMINAL_STATUSES.includes(status)) {
        return false; // Stop polling — side-effects handled in component useEffect
      }
      return POLL_INTERVAL_MS;
    },
    staleTime: 0, // Always fetch fresh during polling
  });
};
