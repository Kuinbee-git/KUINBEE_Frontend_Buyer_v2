"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StrotasEntryScreen,
  STROTAS_INTRO_SESSION_KEY,
} from "./StrotasEntryScreen";
import { useStrotasMotionPreference } from "./StrotasMarkAnimation";
import styles from "./StrotasIntro.module.css";

const IntroContext = createContext(false);
export const useStrotasIntroActive = () => useContext(IntroContext);

export function StrotasIntro({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<"open" | "leaving" | "closed">("open");
  const reducedMotion = useStrotasMotionPreference();
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const active = stage !== "closed" && !reducedMotion;
  const close = useCallback(() => {
    try {
      sessionStorage.setItem(STROTAS_INTRO_SESSION_KEY, "seen");
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    setStage((current) => (current === "open" ? "leaving" : current));
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STROTAS_INTRO_SESSION_KEY) === "seen";
    } catch {
      /* The animation remains dismissible without storage. */
    }
    if (seen || reducedMotion || window.location.hash) {
      const frame = requestAnimationFrame(() => setStage("closed"));
      return () => cancelAnimationFrame(frame);
    }
    playedRef.current = true;
    const timer = window.setTimeout(close, 2000);
    return () => clearTimeout(timer);
  }, [close, reducedMotion]);

  useEffect(() => {
    if (stage !== "leaving") return;
    const timer = window.setTimeout(() => setStage("closed"), 400);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    if (!playedRef.current) return;
    page.inert = active;
    if (!active) {
      if (
        playedRef.current &&
        (!document.activeElement ||
          document.activeElement === document.body ||
          overlayRef.current?.contains(document.activeElement))
      ) {
        page.focus({ preventScroll: true });
      }
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });
    return () => {
      page.inert = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <IntroContext.Provider value={active}>
      <noscript>
        <style>{`.${styles.overlay}{display:none!important}`}</style>
      </noscript>
      <div
        ref={pageRef}
        tabIndex={-1}
        className={styles.page}
        data-strotas-intro-active={active}
      >
        {children}
      </div>
      {active && (
        <div
          ref={overlayRef}
          className={styles.overlay}
          data-intro-state={stage}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-labelledby="strotas-intro-identity"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
            if (event.key === "Tab") {
              event.preventDefault();
              overlayRef.current
                ?.querySelector<HTMLButtonElement>("button")
                ?.focus();
            }
          }}
        >
          <StrotasEntryScreen mode="intro" onContinue={close} />
        </div>
      )}
    </IntroContext.Provider>
  );
}
