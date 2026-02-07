import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

interface CTABoxProps {
  title: string;
  description: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  centered?: boolean;
  className?: string;
}

/**
 * CTA box for section-level calls to action
 * Used in GovernanceValue and SupplierSection
 */
export function CTABox({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  centered = true,
  className,
}: CTABoxProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-primary/20 dark:border-white/20 bg-gradient-to-br from-[#1a2240]/[0.08] via-[#2d3a5f]/[0.05] to-[#1a2240]/[0.03] dark:bg-gradient-to-br dark:from-white/10 dark:via-white/8 dark:to-white/5 p-8 backdrop-blur-sm shadow-md",
        centered && "text-center",
        className
      )}
    >
      <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3">
        {title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground dark:text-white/70 mb-6",
          centered && "max-w-2xl mx-auto"
        )}
      >
        {description}
      </p>
      <div
        className={cn(
          "flex flex-wrap gap-4",
          centered ? "items-center justify-center" : ""
        )}
      >
        <Button
          size="lg"
          className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
          asChild
        >
          <Link href={primaryCTA.href}>{primaryCTA.label}</Link>
        </Button>
        {secondaryCTA && (
          <Button
            variant="outline"
            size="lg"
            className="border-primary/20 dark:border-white/20 bg-transparent text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10"
            asChild
          >
            <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
