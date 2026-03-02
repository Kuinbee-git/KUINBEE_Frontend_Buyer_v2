/**
 * Order History — localStorage persistence
 *
 * Since there is no backend list-orders endpoint, we store order IDs
 * locally after purchase and fetch each one individually via
 * GET /api/v1/user/payments/orders/:orderId.
 */

const STORAGE_KEY = "kb_order_ids";

/** Read stored order IDs (newest first). */
export function getStoredOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist a new order ID. No-ops if already present. */
export function addOrderId(orderId: string): void {
  if (typeof window === "undefined") return;
  const ids = getStoredOrderIds();
  if (ids.includes(orderId)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([orderId, ...ids]));
}
