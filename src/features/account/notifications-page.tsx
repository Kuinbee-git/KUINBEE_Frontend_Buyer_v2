"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Bell, CheckCircle2, Trash2, Settings, Loader2, AlertCircle } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/api/useNotifications";
import { useNotificationStore } from "@/core/store/notification.store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { data: notificationsData, isLoading, error } = useNotifications(
    activeTab === "unread" 
      ? { unreadOnly: true, page, pageSize } 
      : { page, pageSize }
  );
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const { decrementUnread, clearUnread } = useNotificationStore();

  // Reset to page 1 when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "unread");
    setPage(1);
  };

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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      update: "🔄",
      purchase: "💳",
      access: "🔓",
      alert: "🔔",
      system: "⚙️",
    };
    return icons[type] || "📢";
  };

  const notifications = notificationsData?.items || [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const totalPages = notificationsData ? Math.ceil(notificationsData.total / pageSize) : 1;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-[#4e5a7e] dark:text-white/60">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl">
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Failed to Load Notifications
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  {error instanceof Error ? error.message : "An error occurred while loading notifications."}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#1a2240] dark:text-white" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 mt-1"
                  >
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
            Stay updated with your latest activities and alerts
          </p>
        </div>

        <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1a2240] dark:text-white">
                All Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 mb-6 bg-muted/30 dark:bg-white/5">
                <TabsTrigger value="all" className="text-sm">
                  All Notifications
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-sm">
                  Unread Only
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => {
                      const isUnread = !notification.readAt;
                      const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
                      
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            isUnread
                              ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                              : "bg-muted/30 dark:bg-white/5 border-border/40 dark:border-white/10"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-2xl flex-shrink-0">
                              {getTypeIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-[#1a2240] dark:text-white">
                                  {notification.title}
                                </h4>
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
                                {notification.body}
                              </p>
                              <span className="text-xs text-[#4e5a7e] dark:text-white/50">
                                {timeAgo}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isUnread && (
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
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-[#4e5a7e] dark:text-white/40" />
                    <p className="text-[#4e5a7e] dark:text-white/60">
                      No notifications in this category
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Pagination Controls */}
            {notifications.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-border/40 dark:border-white/10 pt-4">
                <div className="text-sm text-[#4e5a7e] dark:text-white/60">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!canGoPrevious}
                    className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={!canGoNext}
                    className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
