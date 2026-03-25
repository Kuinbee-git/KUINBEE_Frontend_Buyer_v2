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
  PaymentOrderListQuery,
  RazorpayCheckoutCreateBody,
  RazorpayConfirmBody,
  OrderStatus,
} from "@/types";

// ─── Query keys ──────────────────────────────────────────────────────

export const paymentKeys = {
  orders: (query?: PaymentOrderListQuery) => ["payment", "orders", query] as const,
  order: (orderId: string) => ["payment", "order", orderId] as const,
};

// ─── Order history ───────────────────────────────────────────────────

/**
 * Reads orders directly from backend via
 * GET /api/v1/user/payments/orders.
 */
export function useOrderHistory(query?: PaymentOrderListQuery) {
  const effectiveQuery = query ?? { page: 1, pageSize: 200 };

  const ordersQuery = useQuery({
    queryKey: paymentKeys.orders(effectiveQuery),
    queryFn: () => paymentService.listOrders(effectiveQuery),
    staleTime: 30_000,
  });

  const orders = ordersQuery.data?.items ?? [];
  const isLoading = ordersQuery.isLoading;
  const error = ordersQuery.error ?? null;
  const refetch = () => ordersQuery.refetch();

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
