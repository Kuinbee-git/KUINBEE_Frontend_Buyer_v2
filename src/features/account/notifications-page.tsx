"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Bell, CheckCircle2, Trash2, Settings } from "lucide-react";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "update",
      title: "Dataset Update Available",
      message: "US Treasury Bond Yields 2024 has been updated with new data.",
      time: "2 hours ago",
      unread: true,
      category: "datasets",
    },
    {
      id: 2,
      type: "purchase",
      title: "Purchase Confirmed",
      message: "Your purchase of India Crop Production Statistics has been confirmed.",
      time: "1 day ago",
      unread: true,
      category: "orders",
    },
    {
      id: 3,
      type: "access",
      title: "Access Granted",
      message: "You now have access to Global Carbon Emissions - Q4 2024.",
      time: "3 days ago",
      unread: false,
      category: "datasets",
    },
    {
      id: 4,
      type: "alert",
      title: "New Dataset Alert",
      message: "European Energy Grid Analytics matching your interests is now available.",
      time: "5 days ago",
      unread: false,
      category: "recommendations",
    },
    {
      id: 5,
      type: "system",
      title: "Account Security",
      message: "Your password was successfully updated.",
      time: "1 week ago",
      unread: false,
      category: "account",
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, unread: false })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      update: "🔄",
      purchase: "💳",
      access: "🔓",
      alert: "🔔",
      system: "⚙️",
    };
    return icons[type as keyof typeof icons] || "📢";
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6 bg-muted/30 dark:bg-white/5">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="datasets" className="text-xs">
                  Datasets
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-xs">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="text-xs">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="account" className="text-xs">
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          notification.unread
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
                              {notification.unread && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-[#4e5a7e] dark:text-white/60 mb-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-[#4e5a7e] dark:text-white/50">
                              {notification.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {notification.unread && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
