"use client";

import { getImageProps } from "next/image";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import styles from "./StrotasCinematicHero.module.css";

const frames = [
  { src: "/strotas/hero/raw-v4.png", label: "Raw inputs" },
  { src: "/strotas/hero/flow-v4.png", label: "Configurable flow" },
  { src: "/strotas/hero/ready-v4.png", label: "Versioned outputs" },
] as const;

const mobileImageProps = getImageProps({
  src: "/strotas/hero/ready-mobile-v4.png",
  alt: "",
  fill: true,
  sizes: "calc(100vw - 32px)",
}).props;

const responsiveFrames = frames.map((frame, index) => ({
  ...frame,
  imageProps: getImageProps({
    src: frame.src,
    alt: "",
    fill: true,
    sizes: "(max-width: 1600px) 100vw, 1600px",
    loading: "eager",
    fetchPriority: index === 0 ? "high" : "auto",
  }).props,
}));

function smoothStep(start: number, end: number, value: number) {
  const position = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return position * position * (3 - 2 * position);
}

export function StrotasCinematicHero({ intro }: { intro?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(new Set<number>());
  const mountedRef = useRef(false);
  const repaintRef = useRef<() => void>(() => {});

  const markReady = useCallback((index: number, image: HTMLImageElement) => {
    const decoded = image.decode
      ? image.decode().catch(() => undefined)
      : Promise.resolve();
    void decoded.then(() => {
      loadedRef.current.add(index);
      if (mountedRef.current) repaintRef.current();
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 900px)");
    let staticMode = reducedMotion.matches || compactViewport.matches;
    let visible = true;
    let scheduledFrame: number | null = null;

    const paint = () => {
      scheduledFrame = null;
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      const bounds = section.getBoundingClientRect();
      const scrollRange = Math.max(1, bounds.height - window.innerHeight);
      const progress = staticMode
        ? 1
        : Math.min(1, Math.max(0, -bounds.top / scrollRange));
      const firstTransition = smoothStep(0.08, 0.42, progress);
      const secondTransition = smoothStep(0.58, 0.92, progress);
      const weights = [
        1 - firstTransition,
        firstTransition * (1 - secondTransition),
        secondTransition,
      ];
      const available = [...loadedRef.current];

      // Keep a decoded sculpture visible if a fast scroll outruns image loading.
      if (available.length > 0) {
        const nearest = available.reduce((best, index) =>
          Math.abs(index - progress * 2) < Math.abs(best - progress * 2)
            ? index
            : best
        );
        let pendingWeight = 0;
        weights.forEach((weight, index) => {
          if (!loadedRef.current.has(index)) {
            pendingWeight += weight;
            weights[index] = 0;
          }
        });
        weights[nearest] += pendingWeight;
      } else {
        weights[0] = 1;
        weights[1] = 0;
        weights[2] = 0;
      }

      weights.forEach((weight, index) =>
        stage.style.setProperty(`--frame-${index}`, weight.toFixed(4))
      );
      const captionIndex = weights.reduce(
        (best, weight, index) => (weight > weights[best] ? index : best),
        0
      );
      weights.forEach((_, index) =>
        stage.style.setProperty(
          `--caption-${index}`,
          index === captionIndex ? "1" : "0"
        )
      );
      stage.style.setProperty("--flow-progress", progress.toFixed(4));
    };

    const schedule = () => {
      if (scheduledFrame === null)
        scheduledFrame = window.requestAnimationFrame(paint);
    };
    repaintRef.current = schedule;
    const onScroll = () => {
      if (!staticMode && visible && !document.hidden) schedule();
    };
    const onModeChange = () => {
      staticMode = reducedMotion.matches || compactViewport.matches;
      schedule();
    };
    const onVisibilityChange = () => {
      if (!document.hidden) schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onModeChange);
    compactViewport.addEventListener("change", onModeChange);
    paint();

    return () => {
      mountedRef.current = false;
      repaintRef.current = () => {};
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onModeChange);
      compactViewport.removeEventListener("change", onModeChange);
      if (scheduledFrame !== null) window.cancelAnimationFrame(scheduledFrame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.scene}
      aria-label="Strotas data flow concept"
      data-strotas-cinematic="hero"
    >
      <div ref={stageRef} className={styles.stage}>
        {intro && <div className={styles.intro}>{intro}</div>}
        <figure className={styles.figure}>
          <div className={styles.artwork} data-strotas-artwork="hero">
            {responsiveFrames.map((frame, index) => (
              <picture key={frame.src} className={styles.picture}>
                <source
                  media="(max-width: 639px)"
                  srcSet={mobileImageProps.srcSet}
                  sizes={mobileImageProps.sizes}
                />
                {/* getImageProps retains Next optimization for this art-directed picture. */}
                <img
                  {...frame.imageProps}
                  alt=""
                  className={`${styles.frame} ${styles[`frame${index}`]}`}
                  aria-hidden="true"
                  ref={(image) => {
                    if (image?.complete && image.naturalWidth > 0)
                      markReady(index, image);
                  }}
                  onLoad={(event) => markReady(index, event.currentTarget)}
                />
              </picture>
            ))}
          </div>
          <div className={styles.stageFooter} aria-hidden="true">
            <div className={styles.stageCaption}>
              {frames.map((frame, index) => (
                <span key={frame.label} className={styles[`caption${index}`]}>
                  {frame.label}
                </span>
              ))}
            </div>
            <span className={styles.progressTrack}>
              <span className={styles.progressFill} />
            </span>
          </div>
          <figcaption className={styles.accessibleCaption}>
            An illustrative Strotas concept: scattered porcelain and navy data
            tiles pass through smoked-glass layers and become a precise record
            lattice. The three image compositions suggest raw inputs, a
            configurable flow and versioned outputs; this sculpture is not a
            live product interface or a fixed sequence of required tools.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
