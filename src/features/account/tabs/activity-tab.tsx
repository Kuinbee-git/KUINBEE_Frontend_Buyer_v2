"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Bell, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/api/useNotifications";
import { useNotificationStore } from "@/core/store/notification.store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function ActivityTab() {
  const { data: notificationsData, isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const { decrementUnread, clearUnread } = useNotificationStore();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      decrementUnread();
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      clearUnread();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const notifications = notificationsData?.items || [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6 max-w-2xl">
        <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#1a2240] dark:text-white animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4 lg:space-y-6 max-w-2xl">
        <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#1a2240] dark:text-white mb-2">
                  Failed to load notifications
                </p>
                <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      {/* Notifications Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    {unreadCount} Unread
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-[#4e5a7e] dark:text-white/60">
                Recent activity and updates on your datasets.
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllReadMutation.isPending}
                className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    !notification.readAt
                      ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                      : "bg-muted/30 dark:bg-white/5 border-border/40 dark:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-[#1a2240] dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.readAt && (
                          <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#4e5a7e] dark:text-white/60">
                        {notification.body}
                      </p>
                      <p className="text-xs text-[#4e5a7e] dark:text-white/50 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.readAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markReadMutation.isPending}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center py-8">
              No notifications yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
