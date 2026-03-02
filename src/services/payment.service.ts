/**
 * Payment service
 *
 * Handles Razorpay checkout creation, client-side confirmation,
 * and order polling.
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  RazorpayCheckoutCreateBody,
  RazorpayCheckoutCreateResponse,
  RazorpayConfirmBody,
  RazorpayConfirmResponse,
  PaymentOrderGetResponse,
} from "@/types";

export const paymentService = {
  /**
   * Create a checkout session — generates a backend Order + PaymentAttempt
   * and a Razorpay provider order.
   */
  createCheckout: (body: RazorpayCheckoutCreateBody) =>
    apiClient.post<RazorpayCheckoutCreateResponse>(
      API_ENDPOINTS.PAYMENTS.RAZORPAY.CHECKOUT,
      body,
    ),

  /**
   * Confirm client-side payment success. Verifies the Razorpay signature
   * on the server and marks the attempt as CLIENT_CONFIRMED.
   */
  confirmPayment: (body: RazorpayConfirmBody) =>
    apiClient.post<RazorpayConfirmResponse>(
      API_ENDPOINTS.PAYMENTS.RAZORPAY.CONFIRM,
      body,
    ),

  /**
   * Get order details — used for polling until webhook transitions
   * the order to COMPLETED / FAILED / REFUNDED.
   */
  getOrder: (orderId: string) =>
    apiClient.get<PaymentOrderGetResponse>(
      API_ENDPOINTS.PAYMENTS.ORDERS.GET(orderId),
    ),
};
