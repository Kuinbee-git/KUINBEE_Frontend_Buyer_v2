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
  const prevPathRef = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Simulate progress that accelerates then slows near completion
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 15;
      if (current > 90) current = 90;
      setProgress(current);
    }, 100);
  }, []);

  const completeProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(100);
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    const fullPath = pathname + searchParams.toString();
    const prevFullPath = prevPathRef.current;

    if (fullPath !== prevFullPath) {
      completeProgress();
      prevPathRef.current = fullPath;
    }
  }, [pathname, searchParams, completeProgress]);

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
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <NavigationProgressBar isNavigating={isNavigating} progress={progress} />
  );
}
