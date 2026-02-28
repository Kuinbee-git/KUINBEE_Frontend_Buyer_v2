"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/core/providers";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please sign in to access your account");
      // Delay redirect to allow toast to display
      setTimeout(() => {
        redirect("/");
      }, 500);
    }
  }, [isAuthenticated, isLoading]);

  // If still loading, show nothing (prevents layout shift)
  if (isLoading) {
    return null;
  }

  // If not authenticated, show nothing (will redirect after toast)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
