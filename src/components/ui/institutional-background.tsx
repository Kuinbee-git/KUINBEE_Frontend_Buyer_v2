"use client";

/**
 * InstitutionalBackground Component
 * 
 * Reusable gradient background with dot and cross patterns
 * matching the Kuinbee institutional design language
 */

interface InstitutionalBackgroundProps {
  variant?: "default" | "subtle";
  className?: string;
}

export function InstitutionalBackground({
  variant = "default",
  className = "",
}: InstitutionalBackgroundProps) {
  if (variant === "subtle") {
    return (
      <div className={`absolute inset-0 ${className}`}>
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Light mode: subtle grey gradient, Dark mode: navy gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:bg-gradient-to-br dark:from-[#1a2240] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
      
      {/* Dot pattern overlay - for light mode (increased visibility) */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.12) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
          opacity: 0.7,
        }}
      />
      
      {/* Cross pattern overlay - for light mode (increased visibility) */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231a2240' fillOpacity='0.18'%3E%3Cpath d='M0 20 L1 20 L1 21 L0 21 Z M20 0 L21 0 L21 1 L20 1 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />
      
      {/* Dot pattern overlay - for dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
          opacity: 0.2,
        }}
      />
      
      {/* Cross pattern overlay - for dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M0 20 L1 20 L1 21 L0 21 Z M20 0 L21 0 L21 1 L20 1 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
          opacity: 0.1,
        }}
      />
    </div>
  );
}
