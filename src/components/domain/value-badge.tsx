import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  className?: string;
}

/**
 * Value badge with colored accent border (4px left)
 * Used in SupplierSection for "Why Suppliers Choose Kuinbee"
 */
export function ValueBadge({
  icon: Icon,
  title,
  description,
  borderColor,
  iconBgColor,
  iconColor,
  className,
}: ValueBadgeProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border-2 border-primary/20 dark:border-white/20 bg-background dark:bg-white/5 p-6 shadow-sm hover:shadow-md transition-all duration-200",
        borderColor,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent shadow-sm",
            iconBgColor
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
