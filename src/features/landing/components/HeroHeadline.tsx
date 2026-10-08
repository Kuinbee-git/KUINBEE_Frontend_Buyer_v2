"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const PHRASES = ["for AI Training", "for Research", "for Analytics"];
const PHRASE_INTERVAL_MS = 2500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerReducedMotionSnapshot = () => true;

const phraseVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.01, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const letterVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
  exit: {
    y: -20,
    opacity: 0,
    filter: "blur(10px)",
    transition: { duration: 0.48, ease: "easeInOut" },
  },
};

const staticLetterVariants: Variants = {
  hidden: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0 },
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0 },
  },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export function HeroHeadline() {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion !== false) return;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setPhraseIndex((index) => (index + 1) % PHRASES.length);
      }
    }, PHRASE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const shouldAnimate = reducedMotion === false;
  const phrase = PHRASES[shouldAnimate ? phraseIndex : 0];

  return (
    <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
      <span className="sr-only">
        Dataset Marketplace for AI training, research, and analytics.
      </span>
      <span aria-hidden="true" className="block">
        Dataset Marketplace
      </span>
      <span
        aria-hidden="true"
        className="relative block h-[1.25em] text-primary/70 dark:text-white/80"
      >
        <AnimatePresence
          key={shouldAnimate ? "animated" : "static"}
          mode="wait"
          initial={false}
        >
          <motion.span
            key={phrase}
            className="absolute inset-0 whitespace-nowrap"
            variants={
              shouldAnimate
                ? phraseVariants
                : { hidden: {}, visible: {}, exit: {} }
            }
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {Array.from(phrase).map((letter, index) => (
              <motion.span
                key={`${phrase}-${index}`}
                className="inline-block whitespace-pre"
                variants={shouldAnimate ? letterVariants : staticLetterVariants}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
