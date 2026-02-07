import { Link } from "@/components/router/Link";
import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  datasets: string;
  href: string;
  comingSoon?: boolean;
  className?: string;
}

/**
 * Category card for data registry organization
 * Used in DataCategories section
 */
export function CategoryCard({
  name,
  description,
  icon: Icon,
  datasets,
  href,
  comingSoon = false,
  className,
}: CategoryCardProps) {
  const content = (
    <>
      {/* Dataset count badge */}
      <div className="absolute top-6 right-6">
        <span
          className={`text-sm font-medium ${
            comingSoon ? "text-muted-foreground" : "text-white"
          }`}
        >
          {datasets}
        </span>
        {!comingSoon && (
          <span className="ml-1 text-xs text-white/80">datasets</span>
        )}
      </div>

      {/* Icon */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
          comingSoon
            ? "bg-muted/50 ring-1 ring-primary/10 dark:ring-white/10"
            : "bg-white/20 ring-1 ring-white/30"
        }`}
      >
        <Icon
          className={`h-6 w-6 ${
            comingSoon ? "text-muted-foreground" : "text-white"
          }`}
        />
      </div>

      {/* Content */}
      <h3
        className={`text-xl font-medium ${
          comingSoon ? "text-foreground/60" : "text-white"
        }`}
      >
        {name}
      </h3>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          comingSoon ? "text-muted-foreground/70" : "text-white/80"
        }`}
      >
        {description}
      </p>

      {/* Arrow */}
      {!comingSoon && (
        <div className="mt-4 flex items-center gap-1 text-sm text-white/80 transition-all group-hover:text-white group-hover:gap-2">
          <span>View Category</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </>
  );

  const baseClassName = cn(
    "group relative overflow-hidden rounded-lg transition-all p-6",
    comingSoon
      ? "pointer-events-none border border-dashed border-primary/20 dark:border-white/20 bg-gradient-to-br from-muted/40 to-muted/20 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-sm"
      : "border border-primary/30 dark:border-white/30 bg-gradient-to-br from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5 backdrop-blur-xl hover:shadow-xl hover:scale-[1.02]",
    className
  );

  return (
    <Link href={href} className={baseClassName}>
      {content}
    </Link>
  );
}
