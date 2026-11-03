"use client";

import { useId } from "react";
import styles from "./StrotasFlowScene.module.css";

type GlyphKind =
  | "files"
  | "database"
  | "profile"
  | "clean"
  | "map"
  | "review"
  | "output";

function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <g className={styles.glyph}>
      {kind === "files" && (
        <>
          <path d="M14 7h18l8 8v27H14zM32 7v9h8M20 23h14M20 29h14M20 35h8" />
          <path d="M9 35H5V1h20v3" className={styles.quietGlyph} />
        </>
      )}
      {kind === "database" && (
        <>
          <ellipse cx="24" cy="9" rx="17" ry="7" />
          <path d="M7 9v27c0 4 8 7 17 7s17-3 17-7V9M7 22c0 4 8 7 17 7s17-3 17-7" />
        </>
      )}
      {kind === "profile" && (
        <>
          <path d="M6 37h36M10 29V18M20 29V8M30 29V13M40 29V3" />
          <circle cx="10" cy="13" r="2" />
          <circle cx="20" cy="3" r="2" />
        </>
      )}
      {kind === "clean" && (
        <>
          <path d="M7 10h10M7 21h19M7 32h14M7 43h27M32 10l5 5 8-9M29 32l5 5 11-12" />
        </>
      )}
      {kind === "map" && (
        <>
          <path d="M4 6h8c9 0 10 12 18 12h14M4 23h40M4 40h8c9 0 10-12 18-12h14" />
          <circle cx="4" cy="6" r="3" />
          <circle cx="4" cy="23" r="3" />
          <circle cx="4" cy="40" r="3" />
          <rect x="40" y="14" width="8" height="8" rx="2" />
          <rect x="40" y="24" width="8" height="8" rx="2" />
        </>
      )}
      {kind === "review" && (
        <>
          <circle cx="19" cy="12" r="7" />
          <path d="M5 39v-4a14 14 0 0 1 23-11M30 34l5 5 10-13" />
        </>
      )}
      {kind === "output" && (
        <>
          <path d="M10 9h28v33H10zM16 16h16M16 24h7M28 24h4M16 32h7M28 32h4" />
          <path d="M15 5h27v32M20 1h26v31" className={styles.quietGlyph} />
        </>
      )}
    </g>
  );
}

function Node({
  x,
  y,
  width = 156,
  height = 108,
  label,
  kind,
  primary = false,
  note,
  mobile = false,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  kind: GlyphKind;
  primary?: boolean;
  note?: string;
  mobile?: boolean;
}) {
  const iconScale = primary ? 1.12 : mobile ? 0.75 : 0.88;
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`${styles.node} ${primary ? styles.primaryNode : ""}`}
    >
      <rect width={width} height={height} rx="12" className={styles.nodeFace} />
      <g
        transform={`translate(${width / 2 - 24 * iconScale} ${mobile ? 12 : 20}) scale(${iconScale})`}
      >
        <Glyph kind={kind} />
      </g>
      <text
        x={width / 2}
        y={height - (note ? 32 : 20)}
        textAnchor="middle"
        className={styles.nodeLabel}
      >
        {label}
      </text>
      {note && (
        <text
          x={width / 2}
          y={height - 13}
          textAnchor="middle"
          className={styles.nodeNote}
        >
          {note}
        </text>
      )}
    </g>
  );
}

function Connectors({ mobile = false }: { mobile?: boolean }) {
  const paths = mobile
    ? [
        "M75 103v29",
        "M285 103v29",
        "M75 214v12c0 16 105 3 105 29",
        "M285 214v12c0 16-105 3-105 29",
        "M180 350v16c0 18-105 0-105 25",
        "M145 430h65",
      ]
    : [
        "M196 143h70",
        "M196 297h70",
        "M422 143h30c44 0 19 96 72 96",
        "M422 297h30c44 0 19-58 72-58",
        "M708 239h66",
        "M930 239h65",
      ];
  return (
    <>
      <g className={styles.connectors}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className={styles.records}>
        {paths.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength="100"
            style={{ animationDelay: `${i * -1.15}s` }}
          />
        ))}
      </g>
      <path
        d={mobile ? "M130 174h21" : "M344 89V67c0-16 16-16 32-16h151"}
        className={styles.branch}
      />
    </>
  );
}

function Report({ mobile = false }: { mobile?: boolean }) {
  return (
    <g
      transform={mobile ? "translate(151 143)" : "translate(527 20)"}
      className={styles.report}
    >
      <rect width={mobile ? 58 : 170} height={62} rx="10" />
      <path
        d={
          mobile ? "M17 15h24M17 23h16M17 31h20" : "M16 17h23M16 25h17M16 33h23"
        }
        className={styles.reportGlyph}
      />
      <text
        x={mobile ? 29 : 58}
        y={mobile ? 49 : 29}
        textAnchor={mobile ? "middle" : undefined}
        className={styles.reportLabel}
      >
        {mobile ? "Report" : "Profile report"}
      </text>
    </g>
  );
}

export function StrotasFlowScene() {
  const prefix = `strotas-canvas-${useId().replace(/:/g, "")}`;
  return (
    <figure className={styles.scene}>
      <svg
        viewBox="0 0 1200 400"
        fill="none"
        className={styles.desktop}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`${prefix}-grid`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.8" className={styles.gridDot} />
          </pattern>
        </defs>
        <rect
          x="12"
          y="0"
          width="1176"
          height="400"
          rx="16"
          fill={`url(#${prefix}-grid)`}
          className={styles.grid}
        />
        <Connectors />
        <Node x={40} y={89} label="Files" kind="files" />
        <Node x={40} y={243} label="Database" kind="database" />
        <Node x={266} y={89} label="Profile" kind="profile" />
        <Node x={266} y={243} label="Clean" kind="clean" />
        <Report />
        <Node
          x={524}
          y={177}
          width={184}
          height={124}
          label="Map"
          kind="map"
          primary
        />
        <Node
          x={774}
          y={177}
          height={124}
          label="Review"
          kind="review"
          note="If configured"
        />
        <Node
          x={995}
          y={185}
          width={164}
          height={108}
          label="Versioned output"
          kind="output"
        />
        <g className={styles.port}>
          <circle cx="524" cy="239" r="4" />
          <circle cx="708" cy="239" r="4" />
        </g>
      </svg>
      <svg
        viewBox="0 0 360 496"
        fill="none"
        className={styles.mobile}
        aria-hidden="true"
      >
        <Connectors mobile />
        <Node
          x={20}
          y={21}
          width={110}
          height={82}
          label="Files"
          kind="files"
          mobile
        />
        <Node
          x={230}
          y={21}
          width={110}
          height={82}
          label="Database"
          kind="database"
          mobile
        />
        <Node
          x={20}
          y={132}
          width={110}
          height={82}
          label="Profile"
          kind="profile"
          mobile
        />
        <Node
          x={230}
          y={132}
          width={110}
          height={82}
          label="Clean"
          kind="clean"
          mobile
        />
        <Report mobile />
        <Node
          x={109}
          y={255}
          width={142}
          height={95}
          label="Map"
          kind="map"
          primary
          mobile
        />
        <Node
          x={5}
          y={391}
          width={140}
          height={91}
          label="Review"
          kind="review"
          note="If configured"
          mobile
        />
        <Node
          x={210}
          y={391}
          width={145}
          height={91}
          label="Versioned output"
          kind="output"
          mobile
        />
      </svg>
      <figcaption className={styles.accessibleCaption}>
        An illustrative Strotas graph: a file and database connect to profiling
        and cleaning tools, then a mapping tool and versioned output. A profile
        report branches from the flow. This example includes a configured review
        step; tools and permissions can be arranged for the pipeline. The moving
        strokes follow the connections and do not represent a live run.
      </figcaption>
    </figure>
  );
}
