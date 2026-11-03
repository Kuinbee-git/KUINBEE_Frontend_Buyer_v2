"use client";

import Link from "next/link";
import { ArrowRight, Moon, Pause, Play, Sun } from "lucide-react";
import { useTheme } from "@/core/providers/ThemeProvider";
import { useState } from "react";
import { StrotasLogoReveal } from "./StrotasLogoReveal";
import {
  StrotasMarkAnimation,
  useStrotasMotionPreference,
} from "./StrotasMarkAnimation";
import styles from "./StrotasEntryScreen.module.css";

type ScreenMode = "intro" | "screensaver" | "loading";
export const STROTAS_INTRO_SESSION_KEY = "strotas-intro-v5";

export function StrotasEntryScreen({
  mode,
  onContinue,
  variant = "logo",
}: {
  mode: ScreenMode;
  onContinue?: () => void;
  variant?: "logo" | "legacy";
}) {
  const [paused, setPaused] = useState(false);
  const reducedMotion = useStrotasMotionPreference();
  const { setTheme } = useTheme();
  const isScreensaver = mode === "screensaver";

  return (
    <div
      className={styles.screen}
      data-strotas-screen={mode}
      data-entry-variant={variant}
    >
      <div className={styles.identity}>
        {variant === "legacy" ? (
          <StrotasMarkAnimation
            compact={mode === "loading"}
            intro={mode === "intro"}
            paused={paused}
          />
        ) : (
          <StrotasLogoReveal compact={mode === "loading"} paused={paused} />
        )}
        <div className={styles.wordmark}>
          <h2 id={`strotas-${mode}-identity`}>Strotas</h2>
          <p>
            {variant === "legacy"
              ? "AI-native pipeline software"
              : "by Kuinbee"}
          </p>
          {variant === "legacy" && (
            <div className={styles.availability}>
              <span>Coming soon</span>
              <span aria-hidden="true">·</span>
              {isScreensaver ? (
                <Link href="/strotas#waitlist">Waitlist open</Link>
              ) : (
                <span>Waitlist open</span>
              )}
            </div>
          )}
        </div>
        {mode === "loading" && (
          <p className={styles.loading} role="status">
            Loading Strotas…
          </p>
        )}
      </div>
      <div className={styles.controls}>
        {isScreensaver && (
          <>
            <button
              className={styles.iconControl}
              type="button"
              aria-label="Toggle color theme"
              title="Toggle color theme"
              onClick={() =>
                setTheme(
                  document.documentElement.classList.contains("dark")
                    ? "light"
                    : "dark"
                )
              }
            >
              <Sun className={styles.sun} size={16} aria-hidden="true" />
              <Moon className={styles.moon} size={16} aria-hidden="true" />
            </button>
            {!reducedMotion && (
              <button
                className={styles.iconControl}
                type="button"
                aria-label={
                  paused ? "Play Strotas animation" : "Pause Strotas animation"
                }
                title={paused ? "Play animation" : "Pause animation"}
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? (
                  <Play size={15} aria-hidden="true" />
                ) : (
                  <Pause size={15} aria-hidden="true" />
                )}
              </button>
            )}
            <Link
              className={styles.iconControl}
              href="/strotas"
              aria-label="Explore Strotas"
              title="Explore Strotas"
              onClick={() => {
                try {
                  sessionStorage.setItem(STROTAS_INTRO_SESSION_KEY, "seen");
                } catch {
                  /* The page remains reachable when storage is unavailable. */
                }
              }}
            >
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </>
        )}
        {mode === "intro" && (
          <button
            className={styles.iconControl}
            type="button"
            onClick={onContinue}
            aria-label="Explore Strotas"
            title="Skip intro and explore Strotas"
          >
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
