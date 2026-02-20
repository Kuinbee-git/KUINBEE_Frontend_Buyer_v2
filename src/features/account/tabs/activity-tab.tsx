"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Bell, Loader2, AlertCircle } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/api/useNotifications";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function ActivityTab() {
  const { data: notificationsData, isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const notifications = notificationsData?.items || [];

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
          <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Recent activity and updates on your datasets.
          </CardDescription>
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
                        className="text-xs text-[#4e5a7e] dark:text-white/60 hover:text-[#1a2240] dark:hover:text-white"
                      >
                        Mark as read
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
          {notifications.some((n) => !n.readAt) && (
            <div className="mt-4 pt-4 border-t border-border/40 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
              >
                Mark All as Read
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
