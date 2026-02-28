"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/core/providers";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function MyDatasetsLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please sign in to view your datasets");
      // Delay redirect to allow toast to display
      setTimeout(() => {
        redirect("/");
      }, 500);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
