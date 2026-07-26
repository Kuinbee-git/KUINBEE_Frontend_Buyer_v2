"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

type Option = {
  index: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
};

const options: Option[] = [
  {
    index: "01",
    eyebrow: "OTS Datasets",
    title: "Browse Datasets",
    summary: "Ready-to-use data, priced upfront.",
    description:
      "Thousands of off-the-shelf, verified datasets across finance, climate, health and transport. Transparent pricing, instant access.",
    features: ["Instant access", "Verified suppliers", "Transparent pricing"],
    href: "/datasets",
    cta: "Browse datasets",
  },
  {
    index: "02",
    eyebrow: "Custom Collection",
    title: "Browse Services",
    summary: "Data that doesn't exist yet, built to spec.",
    description:
      "Commission a verified supplier to collect, clean and deliver a custom dataset scoped to your exact requirements.",
    features: ["Scoped delivery", "Kuinbee reviewed", "End-to-end managed"],
    href: "/data-request/services",
    cta: "Browse services",
  },
];

const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

function OptionCard({
  option,
  revealOnHover,
}: {
  option: Option;
  revealOnHover: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const open = revealOnHover ? hovered : true;

  const trackPointer = useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty(
        "--px",
        `${((event.clientX - rect.left) / rect.width) * 100}%`,
      );
      card.style.setProperty(
        "--py",
        `${((event.clientY - rect.top) / rect.height) * 100}%`,
      );
    },
    [],
  );

  return (
    <Link
      ref={cardRef}
      href={option.href}
      onPointerMove={trackPointer}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        transitionTimingFunction: EASE,
        transform:
          open && revealOnHover ? "translateY(-3px)" : "translateY(0)",
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-7 outline-none",
        "bg-gradient-to-br from-[#1a2240]/97 via-[#242f52]/94 to-[#2d3a5f]/97 text-[#f7f8fa] backdrop-blur-xl",
        "dark:from-white/15 dark:via-white/10 dark:to-white/5 dark:text-[#f1f5f9]",
        "transition-[transform,border-color,box-shadow] duration-500",
        "focus-visible:ring-2 focus-visible:ring-[#1a2240]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transform-none",
        "md:h-[28.5rem] md:p-9",
        open
          ? "border-primary/30 dark:border-white/30 shadow-[0_1px_2px_-1px_rgb(0_0_0/0.2),0_18px_36px_-20px_rgb(0_0_0/0.5)] dark:shadow-[0_20px_40px_-26px_rgb(0_0_0/0.7)]"
          : "border-primary/15 dark:border-white/10 shadow-none",
      )}
    >
      {/* cursor-following wash — light mode (blue tint) */}
      <span
        aria-hidden="true"
        className="dark:hidden pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(22rem circle at var(--px, 50%) var(--py, 0%), rgba(43,97,235,0.08), transparent 70%)",
        }}
      />
      {/* cursor-following wash — dark mode (white glow) */}
      <span
        aria-hidden="true"
        className="hidden dark:block pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(22rem circle at var(--px, 50%) var(--py, 0%), rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      {/* top hairline accent */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px origin-left transition-transform duration-700",
          "bg-[#2b61eb]/50 dark:bg-white/40",
          open ? "scale-x-100" : "scale-x-0",
        )}
        style={{ transitionTimingFunction: EASE }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <p
          className={cn(
            "text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500",
            open ? "text-[#e2e8f0]/90" : "text-[#e2e8f0]/55",
          )}
        >
          {option.eyebrow}
        </p>
        <span
          className={cn(
            "font-mono text-[0.8rem] transition-all duration-500",
            open
              ? "tracking-[0.22em] text-[#e2e8f0]/75"
              : "tracking-normal text-[#e2e8f0]/45",
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          {option.index}
        </span>
      </div>

      <div className="relative mt-8 flex flex-col md:mt-10">
        <h2
          className="text-[1.6rem] font-semibold tracking-tight text-[#f1f5f9] transition-transform duration-500 motion-reduce:transform-none md:text-[2rem]"
          style={{
            transitionTimingFunction: EASE,
            transform:
              open && revealOnHover ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          {option.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-current/55">
          {option.summary}
        </p>

        <div
          className="overflow-hidden transition-all duration-[600ms]"
          style={{
            transitionTimingFunction: EASE,
            maxHeight: open ? "18rem" : 0,
            opacity: open ? 1 : 0,
          }}
        >
          <p
            className="max-w-md pt-5 text-sm leading-relaxed text-current/55 transition-all duration-500 motion-reduce:transform-none"
            style={{
              transitionTimingFunction: EASE,
              transitionDelay: open ? "80ms" : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(6px)",
            }}
          >
            {option.description}
          </p>

          <ul className="mt-5 border-t border-current/15">
            {option.features.map((feature, i) => (
              <li
                key={feature}
                className="flex items-center gap-3 border-b border-current/15 py-2 text-sm text-current/80 transition-all duration-500 last:border-b-0 motion-reduce:transform-none"
                style={{
                  transitionTimingFunction: EASE,
                  transitionDelay: open ? `${140 + i * 70}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-px w-3 shrink-0 bg-[#2b61eb]/70"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold md:mt-10">
        <span className="relative">
          {option.cta}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500",
              open ? "scale-x-100" : "scale-x-0",
            )}
            style={{ transitionTimingFunction: EASE }}
          />
        </span>
        <span aria-hidden="true" className="relative block h-4 w-4 overflow-hidden">
          <span
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 motion-reduce:transform-none"
            style={{
              transitionTimingFunction: EASE,
              transform: open ? "translateX(120%)" : "translateX(0)",
            }}
          >
            &rarr;
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 motion-reduce:hidden"
            style={{
              transitionTimingFunction: EASE,
              transform: open ? "translateX(0)" : "translateX(-120%)",
            }}
          >
            &rarr;
          </span>
        </span>
      </span>
    </Link>
  );
}

export function MarketplaceOptions() {
  const [revealOnHover, setRevealOnHover] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (not (pointer: coarse))",
    );
    const sync = () => setRevealOnHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {options.map((option) => (
        <OptionCard
          key={option.title}
          option={option}
          revealOnHover={revealOnHover}
        />
      ))}
    </div>
  );
}
