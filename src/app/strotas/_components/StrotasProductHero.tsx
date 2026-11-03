"use client";

import { Pause, Play } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { StrotasWorkspacePreview } from "./StrotasWorkspacePreview";
import { StrotasFitScene } from "./StrotasFitScene";
import { useStrotasIntroActive } from "./StrotasIntro";
import styles from "./StrotasProductHero.module.css";

const durations = [4000, 5000, 4000, 8500];
const labels = [
  "Inspect the source",
  "Configure the tools",
  "Run the plan",
  "Inspect the output",
];
const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionPreference() {
  return false;
}

export function StrotasProductHero({
  intro,
  flow,
}: {
  intro: ReactNode;
  flow: ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const introActive = useStrotasIntroActive();
  const effectivePaused = paused || introActive;
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference
  );
  const activeStep = reducedMotion && !paused ? 3 : step;
  const sceneRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const stepRef = useRef(0);

  function selectStep(index: number) {
    elapsedRef.current = durations
      .slice(0, index)
      .reduce((sum, value) => sum + value, 0);
    stepRef.current = index;
    setStep(index);
    setPaused(true);
    sceneRef.current?.style.setProperty(
      "--demo-progress",
      String(elapsedRef.current / totalDuration)
    );
  }

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const card = scene.closest<HTMLElement>("[data-stack-card]");
    const presented = () =>
      card?.closest<HTMLElement>("[data-strotas-card-stack]")?.dataset
        .stackActive !== "true" || card?.dataset.cardCurrent === "true";
    if (reducedMotion) {
      scene.style.setProperty("--demo-progress", "1");
      return;
    }
    let frame: number | null = null;
    let previousTime: number | null = null;
    let visible = true;
    let mounted = true;

    const stop = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
    };
    const updateStep = (next: number) => {
      if (next !== stepRef.current) {
        stepRef.current = next;
        setStep(next);
      }
    };
    const paint = (time: number) => {
      frame = null;
      if (
        !mounted ||
        effectivePaused ||
        !visible ||
        !presented() ||
        document.hidden
      )
        return;
      const delta =
        previousTime === null ? 0 : Math.min(time - previousTime, 100);
      previousTime = time;
      elapsedRef.current = (elapsedRef.current + delta) % totalDuration;
      let threshold = 0;
      let next = durations.length - 1;
      for (let i = 0; i < durations.length; i += 1) {
        threshold += durations[i];
        if (elapsedRef.current < threshold) {
          next = i;
          break;
        }
      }
      updateStep(next);
      scene.style.setProperty(
        "--demo-progress",
        String(elapsedRef.current / totalDuration)
      );
      frame = window.requestAnimationFrame(paint);
    };
    const start = () => {
      if (
        frame === null &&
        !effectivePaused &&
        visible &&
        presented() &&
        !document.hidden
      )
        frame = window.requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.08 }
    );
    observer.observe(scene);
    const presentation = new MutationObserver(() => {
      if (presented()) start();
      else stop();
    });
    if (card)
      presentation.observe(card, {
        attributes: true,
        attributeFilter: ["data-card-current"],
      });
    const visibilityChanged = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", visibilityChanged);
    start();
    return () => {
      mounted = false;
      stop();
      observer.disconnect();
      presentation.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [effectivePaused, reducedMotion]);

  return (
    <section
      className={styles.hero}
      aria-labelledby="strotas-title"
      data-stack-card
      data-story-chapter="hero"
    >
      <div className={styles.intro}>{intro}</div>
      <div className={styles.product}>
        <StrotasFitScene artwork="hero">
          <div
            ref={sceneRef}
            className={styles.workspace}
            data-strotas-artwork="hero"
            data-strotas-ui="workspace"
            data-preview-step={activeStep}
            data-paused={effectivePaused || reducedMotion}
          >
            <StrotasWorkspacePreview step={activeStep} />
          </div>
        </StrotasFitScene>
        <div className={styles.controls}>
          <div
            className={styles.sequence}
            role="group"
            aria-label="Explore the product demo"
          >
            {labels.map((label, index) => (
              <button
                key={label}
                className={index === activeStep ? styles.current : undefined}
                type="button"
                aria-pressed={index === activeStep}
                onClick={() => selectStep(index)}
              >
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.stepLabel}>{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.playback}
            onClick={() => setPaused((value) => !value)}
            aria-label={
              reducedMotion
                ? "Static product preview"
                : paused
                  ? "Play product demo"
                  : "Pause product demo"
            }
            aria-pressed={paused}
            disabled={reducedMotion}
          >
            {paused || reducedMotion ? (
              <Play size={13} aria-hidden="true" />
            ) : (
              <Pause size={13} aria-hidden="true" />
            )}
            {reducedMotion ? "Still preview" : paused ? "Play" : "Pause"}
          </button>
        </div>
        {flow}
      </div>
    </section>
  );
}
