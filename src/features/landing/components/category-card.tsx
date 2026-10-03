import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Link } from "@/components/router/Link";

interface CategoryCardProps {
  index: string;
  name: string;
  eyebrow: string;
  description: string;
  imageLight: string;
  imageDark: string;
  imageAlt: string;
  exploreHref?: string;
  exploreLabel?: string;
  buyHref: string;
  sellHref: string;
}

/**
 * Full-bleed editorial panel used in the landing-page category index.
 */
export function CategoryCard({
  index,
  name,
  eyebrow,
  description,
  imageLight,
  imageDark,
  imageAlt,
  exploreHref,
  exploreLabel,
  buyHref,
  sellHref,
}: CategoryCardProps) {
  return (
    <article className="group relative isolate flex min-h-[42rem] overflow-hidden rounded-[1.75rem] border border-black/[0.11] bg-white/70 text-[#17191d] shadow-[0_28px_70px_-50px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.18] hover:shadow-[0_34px_80px_-48px_rgba(15,23,42,0.58)] dark:border-white/[0.12] dark:bg-[#071426]/70 dark:text-white dark:hover:border-white/[0.2] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[46rem] md:min-h-[40rem] lg:min-h-[45rem]">
      <Image
        src={imageLight}
        alt={imageAlt}
        fill
        className={`-z-20 object-cover object-top opacity-90 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03] ${imageLight === imageDark ? "dark:opacity-80 dark:mix-blend-normal" : "dark:hidden"} motion-reduce:transform-none motion-reduce:transition-none md:object-contain lg:object-cover`}
        sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, calc(100vw - 40px)"
        quality={75}
      />

      {imageLight !== imageDark && (
        <Image
          src={imageDark}
          alt={imageAlt}
          fill
          className="-z-20 hidden object-cover object-top opacity-80 transition-transform duration-500 group-hover:scale-[1.03] dark:block motion-reduce:transform-none motion-reduce:transition-none md:object-contain lg:object-cover"
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, calc(100vw - 40px)"
          quality={75}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 34%, rgba(248,249,250,0.74) 60%, rgba(248,249,250,0.9) 77%, rgba(248,249,250,0.92) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,20,38,0.02) 0%, rgba(7,20,38,0.08) 34%, rgba(7,20,38,0.78) 61%, rgba(7,20,38,0.9) 77%, rgba(7,20,38,0.92) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="flex min-h-full w-full flex-1 flex-col">
        <div className="flex items-center gap-3 px-6 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/[0.65] md:px-5 lg:px-7 lg:pt-7">
          <span className="tabular-nums text-white">{index}</span>
          <span className="h-px w-7 shrink-0 bg-white/45" />
          <span>{eyebrow}</span>
        </div>

        <div className="mt-auto">
          <div className="px-6 pb-7 md:px-5 lg:px-7 lg:pb-8">
            <div
              className="mb-5 h-0.5 w-10 origin-left rounded-full bg-black/65 transition-[width] duration-500 group-hover:w-20 group-focus-within:w-20 dark:bg-white/75 motion-reduce:transition-none"
              aria-hidden="true"
            />
            <h3 className="text-[2.35rem] font-semibold leading-none tracking-[-0.045em] md:text-[2rem] lg:text-[2.6rem]">
              {name}
            </h3>
            <p className="mt-5 text-[15px] leading-7 text-black/60 dark:text-white/[0.68] md:min-h-[10rem] md:text-sm md:leading-6 lg:min-h-[8.25rem] lg:text-[15px] lg:leading-7 xl:min-h-[7rem]">
              {description}
            </p>
          </div>

          {exploreHref && exploreLabel && (
            <Link
              href={exploreHref}
              className="group/explore flex min-h-16 items-center justify-between gap-4 border-t border-black/[0.1] bg-black/[0.025] px-6 py-4 transition-colors duration-300 hover:bg-black/[0.05] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/70 dark:border-white/[0.12] dark:bg-white/[0.045] dark:hover:bg-white/[0.075] dark:focus-visible:ring-white md:px-5 lg:px-7"
            >
              <span className="flex flex-col gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-black/40 dark:text-white/[0.45]">
                  Industry page
                </span>
                <span className="text-sm font-semibold text-black/85 dark:text-white">
                  {exploreLabel}
                </span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-black/50 transition-[color,transform] duration-300 group-hover/explore:-translate-y-0.5 group-hover/explore:translate-x-0.5 group-hover/explore:text-black dark:text-white/65 dark:group-hover/explore:text-white motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          )}

          <div className="grid grid-cols-2 border-t border-black/[0.1] dark:border-white/[0.12]">
            <Link
              href={buyHref}
              aria-label={`Buy ${name} data`}
              className="group/action flex min-h-20 items-end justify-between gap-2 border-r border-black/[0.1] px-5 py-4 transition-colors duration-300 hover:bg-black/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/70 dark:border-white/[0.12] dark:hover:bg-white/[0.065] dark:focus-visible:ring-white md:px-4 lg:min-h-24 lg:px-6 lg:py-5"
            >
              <span className="flex flex-col gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-black/40 dark:text-white/[0.45]">
                  Marketplace
                </span>
                <span className="text-sm font-semibold text-black/85 dark:text-white">
                  Buy data
                </span>
              </span>
              <ArrowUpRight
                className="mb-0.5 h-4 w-4 shrink-0 text-black/50 transition-[color,transform] duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5 group-hover/action:text-black dark:text-white/65 dark:group-hover/action:text-white motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>

            <Link
              href={sellHref}
              aria-label={`Sell ${name} data`}
              className="group/action flex min-h-20 items-end justify-between gap-2 px-5 py-4 transition-colors duration-300 hover:bg-black/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/70 dark:hover:bg-white/[0.065] dark:focus-visible:ring-white md:px-4 lg:min-h-24 lg:px-6 lg:py-5"
            >
              <span className="flex flex-col gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-black/40 dark:text-white/[0.45]">
                  Supply
                </span>
                <span className="text-sm font-semibold text-black/85 dark:text-white">
                  Sell data
                </span>
              </span>
              <ArrowUpRight
                className="mb-0.5 h-4 w-4 shrink-0 text-black/50 transition-[color,transform] duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5 group-hover/action:text-black dark:text-white/65 dark:group-hover/action:text-white motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-black/0 transition-colors duration-500 group-hover:border-black/[0.13] group-focus-within:border-black/[0.13] dark:border-white/0 dark:group-hover:border-white/25 dark:group-focus-within:border-white/25"
        aria-hidden="true"
      />
    </article>
  );
}
