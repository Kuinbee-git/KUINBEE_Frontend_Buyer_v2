/**
 * Payment React Query hooks
 *
 * - useCreateCheckout  — mutation: POST checkout
 * - useConfirmPayment  — mutation: POST confirm
 * - usePaymentOrder    — query with polling for order status
 * - useRazorpayCheckout — orchestrates the full Razorpay flow
 */

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import { getStoredOrderIds } from "@/lib/orderHistory";
import type {
  RazorpayCheckoutCreateBody,
  RazorpayConfirmBody,
  OrderStatus,
} from "@/types";

// ─── Query keys ──────────────────────────────────────────────────────

export const paymentKeys = {
  order: (orderId: string) => ["payment", "order", orderId] as const,
};

// ─── Order history (localStorage-backed) ────────────────────────────

/**
 * Reads order IDs persisted in localStorage after purchase and fetches
 * each one in parallel via GET /api/v1/user/payments/orders/:orderId.
 * Sorted newest-first by createdAt.
 */
export function useOrderHistory() {
  const ids = getStoredOrderIds();

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: paymentKeys.order(id),
      queryFn: () => paymentService.getOrder(id),
      staleTime: 30_000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading && !q.data);
  const error = queries.find((q) => q.isError)?.error ?? null;

  const orders = queries
    .filter((q) => !!q.data)
    .map((q) => q.data!.order)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const refetch = () => Promise.all(queries.map((q) => q.refetch()));

  return { orders, isLoading, error, refetch, isEmpty: !isLoading && orders.length === 0 };
}

// ─── Mutations ───────────────────────────────────────────────────────

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
