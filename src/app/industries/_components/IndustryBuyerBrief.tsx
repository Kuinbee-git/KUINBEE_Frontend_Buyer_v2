"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Link } from "@/components/router/Link";
import { cn } from "@/shared/utils/cn";
import { industryBuyerTasks } from "./IndustryBuyerTasks";
import { IndustryReveal } from "./IndustryMotion";
import { IndustryKicker } from "./IndustryPagePrimitives";

type Industry = "egocentric" | "healthcare" | "voice";

export function IndustryBuyerBrief({ industry }: { industry: Industry }) {
  const [selectedTask, setSelectedTask] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const tasks = industryBuyerTasks[industry];
  const activeTask = tasks[selectedTask];

  function navigateTasks(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown":
        nextIndex = (index + 1) % tasks.length;
        break;
      case "ArrowUp":
        nextIndex = (index + tasks.length - 1) % tasks.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tasks.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelectedTask(nextIndex);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <section
      aria-labelledby={`${industry}-buyer-brief-heading`}
      className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <IndustryReveal className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-4">
            <IndustryKicker>Your data brief</IndustryKicker>
            <h2
              id={`${industry}-buyer-brief-heading`}
              className="mt-5 scroll-mt-24 max-w-xl text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.035em] text-primary dark:text-white sm:text-[2.5rem]"
            >
              Start with the model’s task.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:col-span-8 lg:pb-1">
            Select a use case to compare the details that belong in your data
            brief.
          </p>
        </IndustryReveal>

        <div className="mt-8 grid items-start gap-7 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          <IndustryReveal className="lg:col-span-4">
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Choose a model use case"
              className="border-y border-primary/12 py-1 dark:border-white/12"
            >
              {tasks.map((task, index) => (
                <button
                  key={task.id}
                  ref={(element) => {
                    buttons.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`${industry}-brief-task-${task.id}`}
                  aria-selected={selectedTask === index}
                  aria-controls={`${industry}-brief-panel-${task.id}`}
                  tabIndex={selectedTask === index ? 0 : -1}
                  onClick={() => setSelectedTask(index)}
                  onKeyDown={(event) => navigateTasks(event, index)}
                  className={cn(
                    "group relative flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition-colors duration-200 hover:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:hover:bg-white/[0.045]",
                    selectedTask === index
                      ? "font-semibold text-primary dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {selectedTask === index && (
                    <motion.span
                      aria-hidden="true"
                      layoutId={`${industry}-brief-task-indicator`}
                      className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary dark:bg-white"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 220, damping: 28 }
                      }
                    />
                  )}
                  <span>{task.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-[opacity,transform] duration-200 motion-reduce:transform-none",
                      selectedTask === index
                        ? "opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50 group-focus-visible:translate-x-0 group-focus-visible:opacity-50"
                    )}
                  />
                </button>
              ))}
            </div>
          </IndustryReveal>

          <IndustryReveal className="min-w-0 lg:col-span-8" delay={0.06}>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {activeTask.label}. {activeTask.description}
            </p>
            {/* Overlapping grid cells reserve the tallest brief at every width. */}
            <div className="grid">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  id={`${industry}-brief-panel-${task.id}`}
                  role="tabpanel"
                  aria-labelledby={`${industry}-brief-task-${task.id}`}
                  aria-hidden={selectedTask !== index}
                  inert={selectedTask !== index}
                  tabIndex={selectedTask === index ? 0 : -1}
                  initial={false}
                  animate={{
                    opacity: selectedTask === index ? 1 : 0,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.18,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "col-start-1 row-start-1 min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                    selectedTask === index
                      ? "visible"
                      : "invisible pointer-events-none"
                  )}
                >
                  <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground sm:text-base">
                    {task.description}
                  </p>
                  <dl className="mt-6 grid gap-5 border-t border-primary/12 pt-5 dark:border-white/12 lg:grid-cols-3 lg:gap-7">
                    {task.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-3 lg:block"
                      >
                        <dt className="text-sm font-medium text-primary dark:text-white/85">
                          {spec.label}
                        </dt>
                        <dd className="text-sm leading-6 text-muted-foreground lg:mt-2">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={task.servicesHref}
                    className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline decoration-primary/25 underline-offset-4 transition-colors duration-300 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:text-white/85 dark:decoration-white/25"
                  >
                    Explore collection services
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transform-none"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </IndustryReveal>
        </div>
      </div>
    </section>
  );
}
