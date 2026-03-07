"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProviderProps {
  children: ReactNode;
}

/**
 * Lightweight page transition — no exit animation blocking.
 * New page content renders immediately with a quick fade-in.
 */
export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
