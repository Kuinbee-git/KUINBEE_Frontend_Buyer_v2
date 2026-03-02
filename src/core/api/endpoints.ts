/**
 * API endpoint constants
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: "/api/v1/user/auth/signup",
    LOGIN: "/api/v1/user/auth/login",
    LOGOUT: "/api/v1/user/auth/logout",
    ME: "/api/v1/user/auth/me",
    VERIFY_EMAIL: {
      SEND: "/api/v1/user/auth/verify-email/send",
      CONFIRM: "/api/v1/user/auth/verify-email/confirm",
    },
    PASSWORD: {
      RESET: {
        REQUEST: "/api/v1/user/auth/password/reset/request",
        CONFIRM: "/api/v1/user/auth/password/reset/confirm",
      },
      CHANGE: "/api/v1/user/auth/password/change",
    },
    OAUTH: {
      GOOGLE: {
        START: "/api/v1/user/auth/oauth/google/start",
        CALLBACK: "/api/v1/user/auth/oauth/google/callback",
      },
      GITHUB: {
        START: "/api/v1/user/auth/oauth/github/start",
        CALLBACK: "/api/v1/user/auth/oauth/github/callback",
      },
    },
  },

  // Profile
  PROFILE: {
    BASE: "/api/v1/user/me/profile",
    DELETE: "/api/v1/user/me",
    SECURITY: "/api/v1/user/me/security",
    LINK_PROVIDER: (provider: string) =>
      `/api/v1/user/me/security/link/${provider}`,
    UNLINK_PROVIDER: (provider: string) =>
      `/api/v1/user/me/security/unlink/${provider}`,
  },

  // Preferences
  PREFERENCES: "/api/v1/user/me/preferences",

  // Marketplace
  MARKETPLACE: {
    DATASETS: "/api/v1/marketplace/datasets",
    DATASET_DETAILS: (datasetId: string) =>
      `/api/v1/marketplace/datasets/${datasetId}`,
    CATEGORIES: "/api/v1/marketplace/categories",
    REVIEWS: (datasetId: string) =>
      `/api/v1/marketplace/datasets/${datasetId}/reviews`,
    REVIEW: (reviewId: string) => `/api/v1/marketplace/reviews/${reviewId}`,
    QUESTIONS: (datasetId: string) =>
      `/api/v1/marketplace/datasets/${datasetId}/questions`,
    KDTS: (datasetId: string) => `/api/v1/datasets/${datasetId}/kdts`,
  },

  // Library
  LIBRARY: {
    BASE: "/api/v1/user/library",
    ITEM: (datasetId: string) => `/api/v1/user/library/${datasetId}`,
    DOWNLOAD_URL: (datasetId: string) =>
      `/api/v1/user/library/${datasetId}/download-url`,
    CLAIM: (datasetId: string) => `/api/v1/user/library/${datasetId}/claim`,
  },

  // Entitlements
  ENTITLEMENTS: {
    BASE: "/api/v1/user/entitlements",
    CHECK: (datasetId: string) =>
      `/api/v1/user/entitlements/${datasetId}/check`,
  },

  // Wishlist
  WISHLIST: {
    BASE: "/api/v1/user/wishlist",
    ITEM: (datasetId: string) => `/api/v1/user/wishlist/${datasetId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: "/api/v1/user/notifications",
    MARK_READ: (id: string) => `/api/v1/user/notifications/${id}/read`,
    MARK_ALL_READ: "/api/v1/user/notifications/read-all",
  },

  // Support
  SUPPORT: {
    TICKETS: "/api/v1/user/support/tickets",
    TICKET: (ticketId: string) => `/api/v1/user/support/tickets/${ticketId}`,
  },

  // Payments
  PAYMENTS: {
    RAZORPAY: {
      CHECKOUT: "/api/v1/user/payments/razorpay/checkout",
      CONFIRM: "/api/v1/user/payments/razorpay/confirm",
    },
    ORDERS: {
      LIST: "/api/v1/user/payments/orders",
      GET: (orderId: string) => `/api/v1/user/payments/orders/${orderId}`,
    },
  },
} as const;

export { API_BASE_URL };
