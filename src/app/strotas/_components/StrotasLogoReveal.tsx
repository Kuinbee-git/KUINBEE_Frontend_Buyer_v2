"use client";

import { useStrotasMotionPreference } from "./StrotasMarkAnimation";
import styles from "./StrotasLogoReveal.module.css";

export function StrotasLogoReveal({
  paused = false,
  compact = false,
}: {
  paused?: boolean;
  compact?: boolean;
}) {
  const reducedMotion = useStrotasMotionPreference();

  return (
    <div
      className={styles.reveal}
      data-strotas-logo-reveal
      data-compact={compact}
      data-animation-state={
        reducedMotion ? "static" : paused ? "paused" : "playing"
      }
      aria-hidden="true"
    >
      <svg
        className={styles.mark}
        viewBox="0 0 56 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path pathLength="1" d="M8 43 19 14" />
        <path pathLength="1" d="M20 57 39 7" />
        <path pathLength="1" d="M39 47 50 18" />
      </svg>
    </div>
  );
}
