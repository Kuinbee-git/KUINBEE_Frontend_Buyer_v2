/**
 * Notification React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import type { NotificationListQuery } from "@/types";

// Query keys
export const notificationKeys = {
  notifications: (query?: NotificationListQuery) =>
    ["notifications", query] as const,
};

// List notifications
export const useNotifications = (query?: NotificationListQuery) => {
  return useQuery({
    queryKey: notificationKeys.notifications(query),
    queryFn: () => notificationService.listNotifications(query),
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
