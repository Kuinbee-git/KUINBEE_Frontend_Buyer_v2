"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { FileText } from "lucide-react";
import {
  bearingParts,
  drawBearing,
  type BearingCamera,
  type BearingPart,
} from "./bearing-geometry";
import styles from "./suppliers-guide.module.css";

const parts = Object.entries(bearingParts) as [
  BearingPart,
  (typeof bearingParts)[BearingPart],
][];
const previewSeparation = 90;

export type BearingPose = BearingCamera & { boreOffset: number };
export type GuideMeasurement = "bore" | "mount";

export function SupplierCadExample({
  opened,
  cue,
  focus,
  evidence,
  measurement,
  orbit,
}: {
  opened: boolean;
  cue: string;
  focus: BearingPart | null;
  evidence: { label: string; value: string; href?: string };
  measurement?: GuideMeasurement;
  orbit: MotionValue<BearingPose>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const hasOpened = useRef(false);
  const interacted = useRef(false);
  const updateViewer = useRef<
    | ((
        separation: number,
        selection: BearingPart | null,
        measurement?: GuideMeasurement
      ) => void)
    | null
  >(null);
  const field = useId();
  const partsLabel = useId();
  const [value, setValue] = useState(0);
  const [override, setOverride] = useState<{
    cue: string;
    part: BearingPart | null;
  }>();
  const selected = override?.cue === cue ? override.part : focus;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context || !("ResizeObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let displayed = 0;
    let target = 0;
    let selection: BearingPart | null = null;
    let measurement: GuideMeasurement | undefined;
    let camera = orbit.get();
    let goal = camera;
    let frame = 0;
    let previousTime = 0;

    const paint = () => {
      if (width <= 0 || height <= 0) return;
      drawBearing(
        context,
        width,
        height,
        displayed,
        selection,
        measurement === "bore" && selection === "bushing",
        camera,
        camera.boreOffset * Math.min(displayed / 0.6, 1),
        measurement === "mount" && selection === "bolts"
      );
    };

    const atGoal = () =>
      Math.abs(target - displayed) < 0.001 &&
      Math.abs(camera.azimuth - goal.azimuth) < 0.002 &&
      Math.abs(camera.elevation - goal.elevation) < 0.002 &&
      Math.abs(camera.boreOffset - goal.boreOffset) < 0.002;

    const advance = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      const easing = 1 - Math.exp(-elapsed / 77);
      const approach = (from: number, to: number) =>
        from + (to - from) * easing;
      // Camera changes and part movement share a frame so callouts stay attached.
      displayed = approach(displayed, target);
      camera = {
        azimuth: approach(camera.azimuth, goal.azimuth),
        elevation: approach(camera.elevation, goal.elevation),
        boreOffset: approach(camera.boreOffset, goal.boreOffset),
      };
      if (atGoal()) {
        displayed = target;
        camera = goal;
        previousTime = 0;
      } else {
        frame = requestAnimationFrame(advance);
      }
      paint();
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };

    const render = () => {
      if (motion.matches || atGoal()) {
        stop();
        displayed = target;
        camera = goal;
        paint();
      } else if (!frame) {
        frame = requestAnimationFrame(advance);
      }
    };

    updateViewer.current = (next, nextSelection, nextMeasurement) => {
      target = next;
      selection = nextSelection;
      measurement = nextMeasurement;
      render();
    };
    const unsubscribe = orbit.on("change", (pose) => {
      goal = pose;
      render();
    });

    const resize = () => {
      ({ width, height } = element.getBoundingClientRect());
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
      setReady(true);
    };

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(element);
    resize();

    motion.addEventListener("change", render);
    return () => {
      stop();
      sizeObserver.disconnect();
      unsubscribe();
      motion.removeEventListener("change", render);
      updateViewer.current = null;
    };
  }, [orbit]);

  useEffect(() => {
    updateViewer.current?.(value / 100, selected, measurement);
  }, [value, selected, measurement]);

  useEffect(() => {
    if (opened && !hasOpened.current) {
      hasOpened.current = true;
      if (!interacted.current) setValue(previewSeparation);
    }
  }, [opened]);

  const markInteraction = () => {
    interacted.current = true;
  };

  function inspect(part: BearingPart) {
    markInteraction();
    const next = selected === part ? null : part;
    setOverride({ cue, part: next });
    if (next) setValue((current) => Math.max(current, previewSeparation));
  }

  return (
    <div className={styles.art}>
      <div className={styles.assembly}>
        <div className={styles.assemblyArtwork} aria-hidden="true">
          <div className={styles.artLabel}>
            <strong>Bearing mount</strong>
            <span>
              {selected
                ? bearingParts[selected].purpose
                : "STEP assembly · 10 pieces"}
            </span>
          </div>
          <div className={styles.assemblyViewport}>
            <canvas ref={canvas} data-ready={ready ? "" : undefined} />
          </div>
        </div>
        <div className={styles.assemblyControls}>
          <div className={styles.evidence} data-model-evidence>
            <FileText size={15} aria-hidden="true" />
            <span>{evidence.label}</span>
            {evidence.href ? (
              <a href={evidence.href} download>
                {evidence.value}
              </a>
            ) : (
              <strong>{evidence.value}</strong>
            )}
          </div>
          <div className={styles.rangeHeadline}>
            <label htmlFor={field}>Separate the parts</label>
            <output htmlFor={field} aria-hidden="true">
              {value}%
            </output>
          </div>
          <input
            id={field}
            type="range"
            min={0}
            max={100}
            value={value}
            aria-valuetext={
              value === 0
                ? "Assembled"
                : value === 100
                  ? "Fully exploded"
                  : `${value} percent separated`
            }
            disabled={!ready}
            onPointerDown={markInteraction}
            onFocus={markInteraction}
            onChange={(event) => {
              markInteraction();
              setValue(event.currentTarget.valueAsNumber);
            }}
          />
          <div className={styles.rangeEnds} aria-hidden="true">
            <span>Assembled</span>
            <span>Exploded</span>
          </div>
        </div>
        <p className="sr-only" role="status">
          {override?.cue === cue && selected
            ? `${bearingParts[selected].name}. ${bearingParts[selected].purpose}`
            : ""}
        </p>
        <div className={styles.partPanel}>
          <strong className={styles.partHeading} id={partsLabel}>
            Inspect a component
          </strong>
          <div
            className={styles.partPicker}
            role="group"
            aria-labelledby={partsLabel}
          >
            {parts.map(([part, { name, colour }]) => (
              <button
                key={part}
                type="button"
                disabled={!ready}
                aria-pressed={selected === part}
                onClick={() => inspect(part)}
              >
                <span aria-hidden="true" style={{ backgroundColor: colour }} />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
