import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { DataRequestBackground } from "@/app/data-request/_components/DataRequestBackground";
import { Link } from "@/components/router/Link";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { cn } from "@/shared/utils/cn";

export interface IndustryRoute {
  label: string;
  title: string;
  description: string;
  href: string;
}

export interface IndustryScene {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  lightImage?: string;
  alt: string;
  modelUse: string;
  requirements: readonly { label: string; value: string }[];
  href: string;
  linkLabel: string;
}

export function IndustryPageFrame({
  children,
  allowSticky = false,
}: {
  children: ReactNode;
  allowSticky?: boolean;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <div
        data-industry-content
        className={cn(
          "relative isolate",
          allowSticky ? "overflow-clip bg-background" : "overflow-hidden"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 dark:hidden",
            allowSticky ? "h-[800px]" : "bottom-0"
          )}
        >
          <DataRequestBackground />
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 hidden dark:block",
            allowSticky ? "h-[800px]" : "bottom-0"
          )}
        >
          <InstitutionalBackground />
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className={allowSticky ? "relative" : "relative z-10"}>
          {children}
        </div>
      </div>
      <LandingFooter />
    </main>
  );
}

export function IndustryKicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-9 bg-primary/25 dark:bg-white/25" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70 dark:text-white/65">
        {children}
      </p>
    </div>
  );
}

interface IndustryArtworkProps {
  src?: string;
  srcLight?: string;
  srcDark?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function IndustryArtwork({
  src,
  srcLight,
  srcDark,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 58vw, 100vw",
  priority = false,
}: IndustryArtworkProps) {
  const lightSource = srcLight ?? src ?? srcDark;
  const darkSource = srcDark ?? src ?? srcLight;

  if (!lightSource || !darkSource) {
    return null;
  }

  if (lightSource === darkSource) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={lightSource}
          alt={alt}
          fill
          priority={priority}
          quality={92}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={lightSource}
        alt={alt}
        fill
        priority={priority}
        quality={92}
        sizes={sizes}
        className={cn("object-cover dark:hidden", imageClassName)}
      />
      <Image
        src={darkSource}
        alt={alt}
        fill
        priority={priority}
        quality={92}
        sizes={sizes}
        className={cn("hidden object-cover dark:block", imageClassName)}
      />
    </div>
  );
}

interface IndustryActionBarProps {
  industry: string;
  title: ReactNode;
  context: string;
  routes: readonly IndustryRoute[];
}

export function IndustryActionBar({
  industry,
  title,
  context,
  routes,
}: IndustryActionBarProps) {
  return (
    <section className="px-5 pb-24 pt-12 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32">
      <div className="mx-auto grid max-w-7xl gap-10 border-y border-primary/15 py-10 dark:border-white/15 sm:py-12 lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className="lg:col-span-5">
          <IndustryKicker>Kuinbee for {industry}</IndustryKicker>
          <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-primary dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground dark:text-white/60">
            {context}
          </p>
        </div>

        <nav
          aria-label={`${industry} data actions`}
          className="border-t border-primary/12 dark:border-white/12 lg:col-span-7"
        >
          {routes.map((route) => (
            <Link
              key={route.title}
              href={route.href}
              className="group -mx-3 grid gap-2 rounded-lg border-b border-primary/12 px-3 py-5 transition-[background-color,border-color] duration-300 hover:border-primary/30 hover:bg-primary/[0.035] focus-visible:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:border-white/12 dark:hover:border-white/30 dark:hover:bg-white/[0.045] dark:focus-visible:bg-white/[0.045] sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-5"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/65 dark:text-white/60">
                {route.label}
              </span>
              <span>
                <span className="block font-semibold text-primary dark:text-white">
                  {route.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground dark:text-white/55">
                  {route.description}
                </span>
              </span>
              <ArrowUpRight
                className="hidden h-4 w-4 text-primary/60 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 dark:text-white/60 dark:group-hover:text-white sm:block motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
