import { LucideIcon } from "lucide-react";

interface ValueBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function ValueBadge({ title, description, icon: Icon, className }: ValueBadgeProps) {
  return (
    <div
      className={`group relative rounded-2xl border border-primary/10 dark:border-white/8 bg-background dark:bg-white/[0.03] overflow-hidden transition-all duration-300 hover:border-primary/25 dark:hover:border-white/15 hover:shadow-md hover:-translate-y-0.5 p-6 flex flex-col gap-4 ${className ?? ""}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-white/15 to-transparent" />

      <div className="flex-shrink-0 w-fit rounded-xl p-3 bg-primary/6 dark:bg-white/6 border border-primary/10 dark:border-white/8 transition-colors duration-300 group-hover:bg-primary/10 dark:group-hover:bg-white/10">
        <Icon className="w-5 h-5 text-primary dark:text-white/80" strokeWidth={1.5} />
      </div>

      <div>
        <h3 className="font-semibold text-foreground dark:text-white mb-2 text-base">
          {title}
        </h3>
        <p className="text-muted-foreground dark:text-white/55 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
