/**
 * Notification React Query hooks
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { notificationService } from "@/services";
import type { NotificationListQuery, PaginatedResponse, Notification } from "@/types";

// Query keys
export const notificationKeys = {
  notifications: (query?: NotificationListQuery) =>
    ["notifications", query] as const,
};

// List notifications
export const useNotifications = (
  query?: NotificationListQuery,
  options?: Omit<UseQueryOptions<PaginatedResponse<Notification>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: notificationKeys.notifications(query),
    queryFn: () => notificationService.listNotifications(query),
    ...options,
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
