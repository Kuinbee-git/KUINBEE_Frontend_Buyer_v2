import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: {
    icon: ReactNode;
    label: string;
  };
  title: ReactNode;
  description?: string;
  className?: string;
  centered?: boolean;
}

/**
 * Standardized section header with badge, title, and description
 * Used across landing page sections for consistent hierarchy
 */
export function SectionHeader({
  badge,
  title,
  description,
  className,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl mb-20",
        centered && "text-center",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm",
            !centered && "mb-6"
          )}
        >
          {badge.icon}
          <span className="text-sm font-medium text-primary dark:text-white">
            {badge.label}
          </span>
        </div>
      )}
      <h2 className="text-4xl font-semibold text-primary dark:text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground dark:text-white/70">
          {description}
        </p>
      )}
    </div>
  );
}
