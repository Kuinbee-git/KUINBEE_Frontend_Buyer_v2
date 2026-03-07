"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Next.js template.tsx — re-mounted on every navigation by the framework.
 * No `key` prop needed; avoids shifting Radix UI's useId counter.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
