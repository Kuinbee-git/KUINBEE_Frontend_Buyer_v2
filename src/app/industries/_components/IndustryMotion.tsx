"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import styles from "./IndustryInteractions.module.css";

export function IndustryMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.root}>{children}</div>
    </MotionConfig>
  );
}

export function IndustryReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn(styles.reveal, className)}
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
