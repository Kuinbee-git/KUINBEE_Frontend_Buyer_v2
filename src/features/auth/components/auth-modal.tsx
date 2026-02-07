"use client";

import { ReactNode, useEffect, useState } from "react";
import { Link } from "@/components/router/Link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface AuthModalProps {
  children: ReactNode;
  onClose?: () => void;
}

/**
 * Auth modal component providing institutional modal overlay
 * Used by login and signup modals - Kuinbee design system
 * Matches category card glassmorphic styling
 */
export function AuthModal({ children, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        router.push("/");
      }
    }, 200); // Match animation duration
  };

  // Animate in on mount
  useEffect(() => {
    // Small delay to ensure animation triggers
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Dark overlay backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal container with scroll */}
      <div className={cn(
        "relative w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto scrollbar-thin",
        "transition-all duration-200 ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Modal card - matching category card styling */}
        <div className={cn(
          "relative overflow-hidden rounded-lg transition-all p-6 sm:p-8",
          "border border-primary/30 dark:border-white/30",
          "bg-gradient-to-br from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5",
          "backdrop-blur-xl shadow-2xl"
        )}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Kuinbee branding */}
          <div className="mb-6 sm:mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-xl font-semibold tracking-tight text-white">
                Kuinbee
              </span>
            </Link>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
