"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInOnViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Motion wrapper for fade-in on viewport intersection
 * Used throughout landing page sections
 */
export function FadeInOnView({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: FadeInOnViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
