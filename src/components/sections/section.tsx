import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: "default" | "gradient" | "radial" | "dots" | "grid";
}

/**
 * Base section wrapper with standardized spacing and background patterns
 * Used across all landing page sections
 */
export function Section({
  children,
  id,
  className,
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24 overflow-hidden", className)}
    >
      {/* Background patterns */}
      {background !== "default" && (
        <div className="absolute inset-0">
          {background === "gradient" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
            </>
          )}
          {background === "radial" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,34,64,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
            </>
          )}
          {background === "dots" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
              <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.3) 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </>
          )}
          {background === "grid" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] dark:via-[#1a2240]/20 to-background" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,34,64,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
              <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
                  backgroundSize: "64px 64px",
                }}
              />
            </>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
