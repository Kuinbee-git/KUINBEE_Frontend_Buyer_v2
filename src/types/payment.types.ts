/**
 * Payment & Order types
 *
 * Maps to the backend Razorpay payment gateway routes.
 */

// ─── Checkout ────────────────────────────────────────────────────────

export interface RazorpayCheckoutItem {
  datasetId: string;
}

export interface RazorpayCheckoutCreateBody {
  items: RazorpayCheckoutItem[];
}

export interface RazorpayCheckoutInfo {
  orderId: string;
  orderNumber: string;
  currency: string;
  amount: string;
  amountPaise: number;
  paymentAttemptId: string;
  razorpay: {
    keyId: string;
    orderId: string;
  };
}

export interface RazorpayCheckoutCreateResponse {
  checkout: RazorpayCheckoutInfo;
}

// ─── Confirm ─────────────────────────────────────────────────────────

export interface RazorpayConfirmBody {
  paymentAttemptId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RazorpayConfirmResponse {
  ok: boolean;
  order: {
    id: string;
    status: OrderStatus;
  };
}

// ─── Order ───────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export type PaymentAttemptStatus =
  | "INITIATED"
  | "CLIENT_CONFIRMED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "RAZORPAY";

export interface PaymentOrderItem {
  datasetId: string;
  price: string;
  currency: string;
}

export interface PaymentAttempt {
  id: string;
  provider: PaymentMethod;
  status: PaymentAttemptStatus;
  providerOrderId: string;
  providerPaymentId: string | null;
  createdAt: string;
  capturedAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
}

export interface PaymentOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: string;
  currency: string;
  createdAt: string;
  completedAt: string | null;
}

export interface PaymentOrderGetResponse {
  order: PaymentOrder;
  items: PaymentOrderItem[];
  paymentAttempts: PaymentAttempt[];
}

// ─── Order List ──────────────────────────────────────────────────────

export interface PaymentOrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: string;
  currency: string;
  createdAt: string;
  completedAt: string | null;
  /** Number of items in the order */
  itemCount: number;
}

export interface PaymentOrderListQuery {
  page?: number;
  pageSize?: number;
}

// ─── Razorpay SDK ────────────────────────────────────────────────────

/** Shape of the Razorpay Checkout `handler` success callback argument */
export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Options passed to `new Razorpay(options)` */
export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
}

/** Global `Razorpay` constructor injected by the checkout.js script */
export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}
