"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useCustomCollectionServices } from "@/hooks/api/useCustomCollection";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { CustomCollectionService } from "@/types/custom-collection.types";
import { DataRequestSectionHeading } from "./DataRequestSectionHeading";

const featuredServicesQuery = {
  page: 1,
  pageSize: 6,
  sort: "NEWEST" as const,
};

export function CustomCollectionServicesSection() {
  const { data, isLoading } = useCustomCollectionServices(
    featuredServicesQuery
  );
  const services = data?.items ?? [];

  if (!isLoading && services.length === 0) {
    return null;
  }

  return (
    <section
      id="supplier-services"
      className="relative z-10 scroll-mt-24 overflow-hidden py-16 md:py-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <DataRequestSectionHeading
            eyebrow="Reviewed suppliers"
            title="Explore collection services"
          />
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-7 text-muted-foreground dark:text-white/60">
              Start with an approved supplier capability that fits your brief,
              or continue to the open request form below.
            </p>
            <Link
              href="/data-request/services"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75 dark:text-white dark:hover:text-white/75"
            >
              Browse all collection services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[390px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}

        {!isLoading && services.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/data-request/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-white/[0.05] dark:hover:bg-white/[0.1]"
            >
              View all services <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: CustomCollectionService;
  index: number;
}) {
  const revision = service.publishedRevision;
  const supplierInitials = service.supplier.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link
        href={`/data-request/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-primary/[0.06] dark:bg-white/[0.06]">
          {revision.coverImage ? (
            <Image
              src={revision.coverImage.url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(26,34,64,0.04),rgba(26,34,64,0.1))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08))]">
              <span className="text-5xl font-medium tracking-[-0.05em] text-primary/20 dark:text-white/20">
                {supplierInitials || "KS"}
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Kuinbee reviewed
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70 dark:text-white/60">
            {revision.primaryCategory.name}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-primary dark:text-white">
            {revision.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground dark:text-white/60">
            {revision.shortDescription}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground dark:text-white/50">
            <Clock className="h-3.5 w-3.5" />
            {revision.estimatedTurnaroundMinDays}–
            {revision.estimatedTurnaroundMaxDays} days
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
            <span className="min-w-0 truncate text-muted-foreground dark:text-white/60">
              {service.supplier.displayName}
            </span>
            <span className="inline-flex shrink-0 items-center font-medium text-primary dark:text-white">
              View service
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
