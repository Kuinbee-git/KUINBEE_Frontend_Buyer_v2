"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  /** Content to render when the section enters the viewport */
  children: ReactNode;
  /** Minimum height for the placeholder to prevent layout shift */
  minHeight?: number;
  /** IntersectionObserver rootMargin — preload before visible (default: 200px) */
  rootMargin?: string;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional fallback skeleton to show before the section is visible */
  fallback?: ReactNode;
}

/**
 * LazySection — renders children only when the section scrolls near the viewport.
 *
 * Uses IntersectionObserver with a configurable rootMargin (default 200px)
 * so content begins loading slightly before the user reaches it.
 * A minimal skeleton placeholder is shown until then, sized via `minHeight`
 * to prevent layout shift.
 */
export function LazySection({
  children,
  minHeight = 200,
  rootMargin = "200px",
  className,
  fallback,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (isVisible) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {fallback ?? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-muted/60 dark:bg-white/10 rounded w-1/3" />
            <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
