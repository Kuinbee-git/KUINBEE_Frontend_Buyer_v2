"use client";

import { motion } from "motion/react";
import { ReactNode, CSSProperties } from "react";

interface ScaleOnViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Motion wrapper for scale-in on viewport intersection
 * Used in SecuritySection for central hub
 */
export function ScaleOnView({
  children,
  delay = 0,
  duration = 0.8,
  initialScale = 0.8,
  className,
  style,
}: ScaleOnViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
