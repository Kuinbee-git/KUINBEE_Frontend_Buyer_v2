"use client";

import { type ReactNode, useEffect, useRef } from "react";
import styles from "./StrotasPageContent.module.css";

/** Fits complete product illustrations inside the desktop presentation. */
export function StrotasFitScene({
  children,
  artwork,
}: {
  children: ReactNode;
  artwork: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;
    const desktop = window.matchMedia(
      "(min-width: 1100px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
    );
    let scheduled: number | null = null;
    const paint = () => {
      scheduled = null;
      if (!desktop.matches) {
        frame.style.removeProperty("--scene-scale");
        return;
      }
      const scale = Math.min(
        1.2,
        frame.clientWidth / content.offsetWidth,
        frame.clientHeight / content.offsetHeight
      );
      frame.style.setProperty("--scene-scale", String(scale));
    };
    const schedule = () => {
      if (scheduled === null) scheduled = requestAnimationFrame(paint);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(frame);
    resize.observe(content);
    desktop.addEventListener("change", schedule);
    paint();
    return () => {
      resize.disconnect();
      desktop.removeEventListener("change", schedule);
      if (scheduled !== null) cancelAnimationFrame(scheduled);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={styles.sceneFrame}
      data-strotas-artwork={artwork}
    >
      <div ref={contentRef} className={styles.sceneContent}>
        {children}
      </div>
    </div>
  );
}
