"use client";

import { useState, type ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import styles from "./IndustryInteractions.module.css";

export function IndustryAccordion({
  items,
  compact = false,
}: {
  items: readonly { id: string; title: string; content: ReactNode }[];
  compact?: boolean;
}) {
  const [openItem, setOpenItem] = useState("");
  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openItem}
      onValueChange={setOpenItem}
      className="border-t border-primary/12 dark:border-white/12"
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="group border-b border-primary/12 dark:border-white/12"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "group/trigger flex w-full items-center justify-between gap-5 text-left font-medium text-primary transition-colors duration-200 hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:text-white dark:hover:text-white/80",
                compact
                  ? "min-h-11 py-3 text-sm"
                  : "min-h-16 py-5 text-[15px] leading-6"
              )}
            >
              {item.title}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            forceMount
            aria-hidden={openItem !== item.id}
            className={styles.disclosure}
          >
            <div
              className="min-h-0 overflow-hidden"
              inert={openItem !== item.id}
            >
              <div
                className={cn(
                  "text-muted-foreground",
                  compact ? "pb-4 pt-1" : "max-w-2xl pb-6 pr-5"
                )}
              >
                {item.content}
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
