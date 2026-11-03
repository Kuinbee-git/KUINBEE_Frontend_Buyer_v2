"use client";

import {
  type CSSProperties,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import styles from "./StrotasMarkAnimation.module.css";

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeToVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

const incomingPaths = [
  "M 35 105 H 230 C 286 105 298 210 350 210 H 376",
  "M 35 210 H 376",
  "M 35 315 H 230 C 286 315 298 210 350 210 H 376",
];
const outgoingPaths = [
  "M 624 210 H 652 C 708 210 702 161 762 161 H 965",
  "M 624 210 H 965",
  "M 624 210 H 652 C 708 210 702 259 762 259 H 965",
];
const logoBands = [
  { y: 161.5, height: 33, offset: -12 },
  { y: 193.5, height: 33.5, offset: 10 },
  { y: 226, height: 32.5, offset: -8 },
];

function KuinbeeLogoImages() {
  return (
    <>
      <image
        className={styles.brandLight}
        href="/favicon-black.png"
        x="388"
        y="161.5"
        width="224"
        height="97"
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        className={styles.brandDark}
        href="/favicon.svg"
        x="388"
        y="161.5"
        width="224"
        height="97"
        preserveAspectRatio="xMidYMid meet"
      />
    </>
  );
}

export function useStrotasMotionPreference() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/** A brand animation, not a simulation of background work or loading progress. */
export function StrotasMarkAnimation({
  paused = false,
  compact = false,
  intro = false,
}: {
  paused?: boolean;
  compact?: boolean;
  intro?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const reducedMotion = useStrotasMotionPreference();
  const documentHidden = useSyncExternalStore(
    subscribeToVisibility,
    () => document.hidden,
    () => false
  );
  const running = !paused && !documentHidden && inView && !reducedMotion;
  const logoClipId = useId();

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.04 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.animation} ${compact ? styles.compact : ""} ${intro ? styles.intro : ""}`}
      data-strotas-motion
      data-animation-state={
        reducedMotion ? "static" : running ? "playing" : "paused"
      }
      role="img"
      aria-label={
        compact
          ? "Kuinbee logo, presenting Strotas."
          : "Kuinbee’s logo assembles in three bands at the centre of Strotas, then breathes gently as paths draw inward and ordered output paths preserve a trace."
      }
    >
      <svg
        className={styles.flow}
        viewBox={compact ? "360 140 280 140" : "0 0 1000 420"}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {logoBands.map((band, index) => (
            <clipPath
              key={band.y}
              id={`${logoClipId}-band-${index}`}
              clipPathUnits="userSpaceOnUse"
            >
              <rect x="376" y={band.y} width="248" height={band.height} />
            </clipPath>
          ))}
        </defs>
        <g className={styles.architecture}>
          <path d="M 74 78 H 92 M 74 78 V 96 M 908 78 H 926 M 926 78 V 96 M 74 324 H 92 M 74 324 V 342 M 908 342 H 926 M 926 324 V 342" />
          <path className={styles.axis} d="M 500 30 V 69 M 500 351 V 390" />
          <path
            className={styles.crosshair}
            d="M 494 48 H 506 M 494 372 H 506"
          />
          <path
            className={styles.enclosure}
            d="M 371 90 H 386 M 371 90 V 105 M 614 90 H 629 M 629 90 V 105 M 371 315 V 330 M 371 330 H 386 M 614 330 H 629 M 629 315 V 330"
          />
        </g>

        <g className={styles.routeTracks}>
          {incomingPaths.map((path) => (
            <path key={path} d={path} />
          ))}
          {outgoingPaths.map((path) => (
            <path key={path} d={path} />
          ))}
          <path
            className={styles.traceTrack}
            d="M 782 259 V 305 Q 782 318 795 318 H 881"
          />
        </g>

        <g className={styles.routeDraw}>
          {incomingPaths.map((path, index) => (
            <path
              key={path}
              d={path}
              pathLength="100"
              className={styles.drawIncoming}
              style={{ "--signal-index": index } as CSSProperties}
            />
          ))}
          {outgoingPaths.map((path, index) => (
            <path
              key={path}
              d={path}
              pathLength="100"
              className={styles.drawOutgoing}
              style={{ "--signal-index": index } as CSSProperties}
            />
          ))}
        </g>

        <g className={styles.incoming}>
          {incomingPaths.map((path, index) => (
            <path
              className={styles.signal}
              style={{ "--signal-index": index } as CSSProperties}
              pathLength="100"
              key={path}
              d={path}
            />
          ))}
        </g>

        <g className={styles.outgoing}>
          {outgoingPaths.map((path, index) => (
            <path
              className={styles.signal}
              style={{ "--signal-index": index } as CSSProperties}
              pathLength="100"
              key={path}
              d={path}
            />
          ))}
        </g>

        <g className={styles.traceSignal}>
          <path pathLength="100" d="M 782 259 V 305 Q 782 318 795 318 H 881" />
          <circle className={styles.traceEndpoint} cx="881" cy="318" r="3.5" />
        </g>

        <g className={styles.terminals}>
          {[105, 210, 315].map((y) => (
            <circle key={`in-${y}`} cx="35" cy={y} r="3.5" />
          ))}
          {[161, 210, 259].map((y) => (
            <rect
              key={`out-${y}`}
              x="961.5"
              y={y - 3.5}
              width="7"
              height="7"
              rx="1.5"
            />
          ))}
        </g>

        <g className={styles.pulseField}>
          <ellipse
            className={styles.pulseRing}
            cx="500"
            cy="210"
            rx="142"
            ry="85"
          />
          <ellipse
            className={styles.pulseRing}
            cx="500"
            cy="210"
            rx="142"
            ry="85"
            style={{ animationDelay: "700ms" }}
          />
        </g>

        <g className={styles.brandMark} data-strotas-logo>
          <g className={styles.logoAssembly}>
            {logoBands.map((band, index) => (
              <g key={band.y} clipPath={`url(#${logoClipId}-band-${index})`}>
                <g
                  className={styles.logoSlice}
                  data-logo-band={index}
                  style={
                    {
                      "--piece-index": index,
                      "--piece-offset": `${band.offset}px`,
                    } as CSSProperties
                  }
                >
                  <KuinbeeLogoImages />
                </g>
              </g>
            ))}
          </g>
          {/* Keep the assembled mark uncut to avoid seams at small sizes. */}
          <g className={styles.logoComplete} data-logo-complete>
            <KuinbeeLogoImages />
          </g>
        </g>
      </svg>
    </div>
  );
}
