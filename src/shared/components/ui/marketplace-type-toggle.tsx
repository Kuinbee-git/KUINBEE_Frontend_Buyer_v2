"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database, Wrench } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type MarketplaceType = "datasets" | "services";
let marketplaceTransitionTimer: number | undefined;

interface MarketplaceTypeToggleProps {
  active: MarketplaceType;
  query?: string;
  datasetsTotal?: number;
  servicesTotal?: number;
  className?: string;
}

export function MarketplaceTypeToggle({
  active,
  query,
  datasetsTotal,
  servicesTotal,
  className,
}: MarketplaceTypeToggleProps) {
  const router = useRouter();
  const [visibleActive, setVisibleActive] = useState(active);
  const datasetsHref = query
    ? `/datasets?q=${encodeURIComponent(query)}`
    : "/datasets";
  const servicesHref = query
    ? `/data-request/services?q=${encodeURIComponent(query)}`
    : "/data-request/services";

  useEffect(() => {
    router.prefetch(datasetsHref);
    router.prefetch(servicesHref);
  }, [datasetsHref, router, servicesHref]);

  const navigateTo = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: MarketplaceType
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (target === active) {
      event.preventDefault();
      return;
    }

    setVisibleActive(target);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.documentElement;
    const transitionClass =
      target === "services"
        ? "marketplace-transition-forward"
        : "marketplace-transition-backward";

    root.classList.remove(
      "marketplace-transition-forward",
      "marketplace-transition-backward"
    );
    void root.offsetWidth;
    root.classList.add(transitionClass);

    document.body.animate([{ opacity: 1 }, { opacity: 0.9 }, { opacity: 1 }], {
      duration: 240,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });

    if (marketplaceTransitionTimer) {
      window.clearTimeout(marketplaceTransitionTimer);
    }
    marketplaceTransitionTimer = window.setTimeout(() => {
      root.classList.remove(transitionClass);
      marketplaceTransitionTimer = undefined;
    }, 280);
  };

  return (
    <div
      className={cn(
        "relative grid h-11 grid-cols-2 items-center rounded-xl border border-[#1a2240]/15 bg-[#1a2240]/[0.035] p-1 dark:border-white/15 dark:bg-white/[0.06]",
        className
      )}
      aria-label="Marketplace result type"
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg border shadow-sm",
          "transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          visibleActive === "services"
            ? "translate-x-full border-rose-200/80 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-500/15"
            : "translate-x-0 border-[#2b61eb]/15 bg-white dark:border-white/10 dark:bg-white/10"
        )}
      />
      <ToggleItem
        href={datasetsHref}
        icon={Database}
        label="Datasets"
        count={datasetsTotal}
        active={visibleActive === "datasets"}
        activeColor="text-[#2b61eb] dark:text-white"
        onActivate={(event) => navigateTo(event, "datasets")}
      />
      <ToggleItem
        href={servicesHref}
        icon={Wrench}
        label="Services"
        count={servicesTotal}
        active={visibleActive === "services"}
        activeColor="text-rose-600 dark:text-rose-300"
        onActivate={(event) => navigateTo(event, "services")}
      />
    </div>
  );
}

function ToggleItem({
  href,
  icon: Icon,
  label,
  count,
  active,
  activeColor,
  onActivate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  count?: number;
  active: boolean;
  activeColor: string;
  onActivate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onActivate}
      className={cn(
        "relative z-10 inline-flex min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        "transition-colors duration-200 ease-out motion-reduce:transition-none",
        active ? activeColor : "text-muted-foreground hover:text-foreground"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      {count != null && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums leading-none transition-colors duration-200",
            active
              ? "bg-current/10 text-current"
              : "bg-black/[0.05] text-muted-foreground dark:bg-white/10"
          )}
        >
          {count.toLocaleString()}
        </span>
      )}
    </Link>
  );
}
