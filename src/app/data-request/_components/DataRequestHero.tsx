"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui";
import Link from "next/link";

const briefDetails = [
  ["Scope", "The fields, entities, or events you need"],
  ["Coverage", "Market, geography, and time period"],
  ["Delivery", "Preferred format, freshness, and timeline"],
];

export function DataRequestHero() {
  return (
    <section className="relative z-10 overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-end gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-primary/30 dark:bg-white/25" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/55 dark:text-white/50">
              Custom data sourcing
            </span>
          </div>
          <h1 className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-primary dark:text-white sm:text-6xl lg:text-7xl">
            Request the data
            <span className="mt-2 block text-primary/55 dark:text-white/65">
              your work depends on.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground dark:text-white/65 md:text-lg">
            Describe the dataset you cannot find. Kuinbee reviews the brief,
            evaluates sourcing options, and coordinates a verified delivery.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <Button
              size="lg"
              className="h-12 bg-primary px-7 text-primary-foreground shadow-sm hover:bg-primary/90"
              onClick={() =>
                document
                  .getElementById("request-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Submit a request
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Link
              href="/data-request/services"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary/20 px-5 text-sm font-medium text-primary/80 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-white/15 dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Browse verified suppliers
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-primary/50 transition-colors hover:text-primary/70 dark:text-white/45 dark:hover:text-white/65"
            >
              See how it works
            </button>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border-y border-primary/15 py-2 dark:border-white/15"
          aria-label="What to include in a data request"
        >
          <p className="py-5 text-sm font-medium text-primary dark:text-white">
            A useful brief defines three things
          </p>
          {briefDetails.map(([label, detail], index) => (
            <div
              key={label}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-primary/10 py-5 dark:border-white/10"
            >
              <span className="font-mono text-xs tabular-nums text-primary/35 dark:text-white/35">
                0{index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground dark:text-white">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-white/55">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </motion.aside>
      </div>
    </section>
  );
}
