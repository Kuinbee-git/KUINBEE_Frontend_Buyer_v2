import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContentProps {
  children: ReactNode;
  maxWidth?: "default" | "wide" | "full";
  className?: string;
}

/**
 * Content wrapper for section body
 * Controls max-width and horizontal padding
 */
export function SectionContent({
  children,
  maxWidth = "default",
  className,
}: SectionContentProps) {
  return (
    <div
      className={cn(
        "relative mx-auto px-6",
        maxWidth === "default" && "max-w-7xl",
        maxWidth === "wide" && "max-w-[1600px]",
        maxWidth === "full" && "max-w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
