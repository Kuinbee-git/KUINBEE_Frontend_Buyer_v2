"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Bell, Heart, Trash2 } from "lucide-react";

export function ActivityTab() {
  const notifications = [
    {
      id: 1,
      title: "Dataset Update Available",
      message: "US Treasury Bond Yields 2024 has been updated with new data.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Purchase Confirmed",
      message: "Your purchase of India Crop Production Statistics has been confirmed.",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      title: "Access Granted",
      message: "You now have access to Global Carbon Emissions - Q4 2024.",
      time: "3 days ago",
      unread: false,
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      title: "European Energy Grid Analytics",
      category: "Energy & Utilities",
      price: "$599",
    },
    {
      id: 2,
      title: "Asia-Pacific Trade Routes 2024",
      category: "Economics & Trade",
      price: "$449",
    },
  ];

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
                    notification.unread
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
                        {notification.unread && (
                          <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#4e5a7e] dark:text-white/60">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#4e5a7e] dark:text-white/50 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center py-8">
              No notifications yet.
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-border/40 dark:border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
            >
              Mark All as Read
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wishlist
          </CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Datasets you're interested in purchasing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wishlistItems.length > 0 ? (
            <div className="space-y-3">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/30 dark:bg-white/5 border border-border/40 dark:border-white/10"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-[#1a2240] dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold text-[#1a2240] dark:text-white mt-2">
                      {item.price}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center py-8">
              Your wishlist is empty.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
