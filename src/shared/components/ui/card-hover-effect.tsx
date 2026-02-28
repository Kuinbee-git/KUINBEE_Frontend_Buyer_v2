"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface HoverEffectItem {
    title: string;
    description: string;
    link: string;
    icon?: (props: { className?: string }) => React.ReactNode;
    color?: string;
    comingSoon?: boolean;
}

interface HoverEffectProps {
    items: HoverEffectItem[];
    className?: string;
}

export function HoverEffect({ items, className }: HoverEffectProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
            {items.map((item, idx) => (
                <a
                    key={item.title}
                    href={item.comingSoon ? undefined : item.link}
                    target={item.comingSoon ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={cn(
                        "relative group block rounded-2xl p-6 border transition-all duration-300 ease-out",
                        "bg-white/80 dark:bg-[#1e2847]/60 backdrop-blur-sm",
                        "border-border/40 dark:border-white/10",
                        hoveredIndex === idx
                            ? "shadow-xl scale-[1.02] border-primary/30 dark:border-white/20"
                            : "shadow-sm hover:shadow-lg",
                        item.comingSoon && "cursor-default opacity-80"
                    )}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {/* Gradient overlay on hover */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                            hoveredIndex === idx && "opacity-100",
                            item.color ? `bg-gradient-to-br ${item.color}` : "bg-gradient-to-br from-primary/5 to-primary/0"
                        )}
                    />

                    <div className="relative z-10">
                        {/* Icon + Coming Soon badge */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/80 dark:bg-white/10 transition-colors duration-300 group-hover:bg-muted dark:group-hover:bg-white/15">
                                {item.icon && item.icon({ className: "w-6 h-6" })}
                            </div>
                            {item.comingSoon && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/50 bg-muted dark:bg-white/10 px-2.5 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-foreground dark:text-white mb-2 transition-colors">
                            {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed line-clamp-3">
                            {item.description}
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
}
