import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  stepNumber: string;
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
  className?: string;
}

/**
 * Workflow step card with numbered badge and colored icon
 * Used in SupplierSection for "Supplier Workflow"
 */
export function WorkflowStep({
  stepNumber,
  icon: Icon,
  title,
  description,
  iconColor,
  iconBgColor,
  className,
}: WorkflowStepProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-primary/20 dark:border-white/20 bg-background dark:bg-white/5 p-6 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-[#1a2240] via-[#242f52] to-[#2d3a5f] dark:from-white/15 dark:via-white/12 dark:to-white/10 text-white dark:text-white text-sm font-bold shadow-sm">
          {stepNumber}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 dark:border-transparent shadow-sm",
            iconBgColor
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
