"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProgressBarProps {
  isNavigating: boolean;
  progress: number;
}

/**
 * Pure UI component for the progress bar — no hooks.
 * Controlled by the parent logic component.
 */
export function NavigationProgressBar({
  isNavigating,
  progress,
}: NavigationProgressBarProps) {
  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px]"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 8px var(--primary, #3b82f6), 0 0 2px var(--primary, #3b82f6)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Logic component — handles useSearchParams and state.
 * Wrapped in Suspense by the layout.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevUrlRef = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCurrentUrl = useCallback(() => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  }, [pathname, searchParams]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    clearTimers();
    setIsNavigating(true);
    setProgress(8);

    // Simulate progress that accelerates then slows near completion
    let current = 8;
    intervalRef.current = setInterval(() => {
      const step = current < 45 ? 10 : current < 75 ? 6 : 2.5;
      current += step;
      if (current > 92) current = 92;
      setProgress(current);
    }, 100);
    
    // Safety net: never leave the line hanging if a transition stalls.
    safetyTimeoutRef.current = setTimeout(() => {
      setProgress(95);
    }, 2200);
  }, [clearTimers]);

  const completeProgress = useCallback(() => {
    clearTimers();
    setProgress(100);
    completeTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, [clearTimers]);

  useEffect(() => {
    const currentUrl = getCurrentUrl();
    const previousUrl = prevUrlRef.current;

    if (!previousUrl) {
      prevUrlRef.current = currentUrl;
      return;
    }

    if (currentUrl !== previousUrl) {
      if (isNavigating) {
        completeProgress();
      }
      prevUrlRef.current = currentUrl;
    }
  }, [getCurrentUrl, isNavigating, completeProgress]);

  // Intercept link clicks to start the progress bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Only trigger for internal navigation that changes the path
      try {
        const url = new URL(href, window.location.origin);
        const nextUrl = `${url.pathname}${url.search}`;
        const currentUrl = `${window.location.pathname}${window.location.search}`;

        if (
          url.origin === window.location.origin &&
          nextUrl !== currentUrl
        ) {
          startProgress();
        }
      } catch {
        // Invalid URL, ignore
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <NavigationProgressBar isNavigating={isNavigating} progress={progress} />
  );
}
