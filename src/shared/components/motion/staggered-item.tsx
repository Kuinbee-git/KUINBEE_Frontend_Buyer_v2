"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface StaggeredItemProps {
  children: ReactNode;
  index: number;
  baseDelay?: number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Motion wrapper for staggered item animations
 * Used in SecuritySection for orbiting features
 */
export function StaggeredItem({
  children,
  index,
  baseDelay = 0.4,
  staggerDelay = 0.1,
  duration = 0.6,
  className,
  style,
}: StaggeredItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay: baseDelay + index * staggerDelay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
