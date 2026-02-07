import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  className?: string;
}

/**
 * Trust badge component used in hero and throughout landing page
 * Shows verification, governance, pricing, auditability indicators
 */
export function TrustBadge({
  icon: Icon,
  label,
  iconColor,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-muted-foreground dark:text-white/70",
        className
      )}
    >
      <Icon className={cn("h-5 w-5", iconColor)} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
