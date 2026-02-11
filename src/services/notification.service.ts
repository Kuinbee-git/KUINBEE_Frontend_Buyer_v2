/**
 * Notification service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  Notification,
  NotificationListQuery,
  PaginatedResponse,
  SuccessResponse,
  ApiResponse,
} from "@/types";

export const notificationService = {
  // List notifications
  listNotifications: (query?: NotificationListQuery) =>
    apiClient.get<PaginatedResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.BASE,
      query as Record<string, unknown>
    ),

  // Mark notification as read
  markRead: (id: string) =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    ),

  // Mark all notifications as read
  markAllRead: () =>
    apiClient.post<SuccessResponse>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    ),
};
