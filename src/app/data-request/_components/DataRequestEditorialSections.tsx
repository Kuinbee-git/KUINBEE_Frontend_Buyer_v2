"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  ChartSpline,
  Earth,
  LibraryBig,
  MessageCircleQuestion,
  Microscope,
  TimerReset,
  Workflow,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { DataRequestSectionHeading } from "./DataRequestSectionHeading";

const useCases = [
  {
    icon: ChartSpline,
    title: "Market intelligence",
    description:
      "Competitive landscapes, company universes, pricing signals, and consumer behaviour.",
  },
  {
    icon: Microscope,
    title: "Academic research",
    description:
      "Structured evidence for studies, papers, institutions, and longitudinal analysis.",
  },
  {
    icon: Workflow,
    title: "Business intelligence",
    description:
      "Reliable inputs for dashboards, forecasting, operations, and strategic planning.",
  },
  {
    icon: BrainCircuit,
    title: "AI and machine learning",
    description:
      "Cleaned, labeled, and documented datasets for training and evaluating models.",
  },
];

const assurances = [
  {
    icon: BadgeCheck,
    title: "Quality reviewed",
    description: "Validation and compliance checks before delivery.",
  },
  {
    icon: Earth,
    title: "Broad coverage",
    description: "Suppliers across industries, markets, and geographies.",
  },
  {
    icon: TimerReset,
    title: "Scoped timelines",
    description:
      "Feasibility and delivery expectations set before work begins.",
  },
  {
    icon: Workflow,
    title: "Ready to use",
    description: "Formats designed for analytics and operational workflows.",
  },
];

export function DataUseCasesSection() {
  return (
    <section className="relative z-10 overflow-hidden py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
        <DataRequestSectionHeading
          eyebrow="Common briefs"
          title={
            <>
              Data for decisions,
              <span className="block text-primary/55 dark:text-white/60">
                research, and models
              </span>
            </>
          }
          description="Requests can span industries, geographies, formats, and levels of specialization. These are common starting points—not limits."
        />

        <div className="border-t border-primary/15 dark:border-white/15">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="grid grid-cols-[2.5rem_1fr] gap-5 border-b border-primary/10 py-6 dark:border-white/10 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:items-center"
            >
              <useCase.icon
                aria-hidden="true"
                strokeWidth={1.6}
                className="h-6 w-6 text-primary/60 dark:text-white/60"
              />
              <h3 className="text-base font-medium text-foreground dark:text-white">
                {useCase.title}
              </h3>
              <p className="col-start-2 text-sm leading-6 text-muted-foreground dark:text-white/55 sm:col-start-3">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyKuinbeeSection() {
  return (
    <section className="relative z-10 overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <DataRequestSectionHeading
          eyebrow="Why Kuinbee"
          title="A managed path to custom data"
          description="Kuinbee coordinates supplier review, scope, quality, and delivery so your request stays accountable."
        />

        <div className="mt-16 grid border-y border-primary/15 dark:border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map((item) => (
            <div
              key={item.title}
              className="border-b border-primary/10 px-1 py-7 dark:border-white/10 sm:px-6 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <item.icon
                aria-hidden="true"
                strokeWidth={1.6}
                className="h-6 w-6 text-primary/65 dark:text-white/65"
              />
              <h3 className="mt-6 text-base font-medium text-foreground dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-white/55">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DataRequestQuestionsCta() {
  return (
    <section className="relative z-10 overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-primary/15 bg-primary px-6 py-10 text-white shadow-2xl shadow-primary/10 dark:border-white/10 dark:bg-card dark:shadow-black/20 sm:px-10 md:py-12 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Need help with the brief?
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.025em] sm:text-4xl">
              Talk through the requirement before you submit.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              Our team can help clarify scope, feasibility, expected fields, and
              the most useful delivery format.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              size="lg"
              className="h-11 bg-white text-primary shadow-sm hover:bg-white/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <Link href="/support">
                <MessageCircleQuestion className="h-4 w-4" />
                Contact support
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Link href="/datasets">
                <LibraryBig className="h-4 w-4" />
                Browse datasets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
