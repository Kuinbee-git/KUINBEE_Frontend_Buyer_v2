"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Link } from "@/components/router/Link";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useNotificationStore } from "@/core/store/notification.store";

interface NotchNotificationBellProps {
  enabled: boolean;
}

export function NotchNotificationBell({ enabled }: NotchNotificationBellProps) {
  const { data: notificationsData } = useNotifications(
    { unreadOnly: true },
    {
      refetchInterval: 120000,
      enabled,
    }
  );

  const { unreadCount, setUnreadCount } = useNotificationStore();

  React.useEffect(() => {
    if (notificationsData?.items) {
      setUnreadCount(notificationsData.items.length);
    }
  }, [notificationsData, setUnreadCount]);

  if (!enabled) {
    return null;
  }

  return (
    <Link href="/account/activity">
      <button
        className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a2240] dark:bg-white text-white dark:text-[#1a2240] text-[10px] font-semibold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </Link>
  );
}