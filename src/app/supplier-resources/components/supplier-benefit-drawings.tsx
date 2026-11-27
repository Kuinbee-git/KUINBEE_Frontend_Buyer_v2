import type { ReactNode } from "react";
import styles from "./suppliers-value.module.css";

function Drawing({ children }: { children: ReactNode }) {
  return (
    <svg
      className={styles.drawing}
      viewBox="0 0 264 100"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function DiscoveryDrawing() {
  return (
    <Drawing>
      <g stroke="var(--rule)">
        <path d="M6 14h144M6 38h144M6 62h144M6 86h144" />
        {[26, 50, 74].map((y) => (
          <g key={y} transform={`translate(0 ${y})`}>
            <path d="M12 -3h7v6h-7z" fill="var(--stock)" />
            <path d="M27 -2h53m-53 5h34m42 -3h28" />
          </g>
        ))}
      </g>
      <g className={styles.lens}>
        <path d="m117 66 18 17" stroke="var(--ink)" strokeWidth="4" />
        <circle
          cx="100"
          cy="49"
          r="26"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="1.7"
        />
        <circle cx="100" cy="49" r="22" stroke="var(--rule)" />
        <path d="M87 45h23m-23 8h15" stroke="var(--ink)" strokeWidth="2" />
      </g>
      <path d="M127 43h17l10-12h15" stroke="var(--line)" />
      <g transform="translate(174 31)">
        <path d="m0 0 3 3 6-7" stroke="var(--verified)" strokeWidth="1.9" />
        <text x="15" y="4">
          Reviewed
        </text>
      </g>
    </Drawing>
  );
}

export function EnquiryDrawing() {
  return (
    <Drawing>
      <path
        d="M11 39 58 11l47 28v44H11z"
        fill="var(--stock)"
        stroke="var(--line)"
      />
      <g className={styles.letter}>
        <rect
          x="21"
          y="21"
          width="74"
          height="51"
          rx="2"
          fill="var(--paper)"
          stroke="var(--line)"
        />
        <text x="30" y="41" className={styles.inkLabel}>
          @
        </text>
        <path d="M50 35h32m-52 13h44m-44 6h25" stroke="var(--rule)" />
      </g>
      <path
        d="m11 39 47 26 47-26v42q0 3-3 3H14q-3 0-3-3z"
        fill="var(--paper)"
        stroke="var(--ink)"
      />
      <path d="m12 81 34-25m58 25L71 56" stroke="var(--line)" />
      <path d="M105 61h16l12-12h16" stroke="var(--line)" />
      <circle
        cx="160"
        cy="49"
        r="9"
        fill="var(--paper)"
        stroke="var(--verified)"
      />
      <path
        className={styles.trace}
        pathLength="1"
        d="m156 49 3 3 5-6"
        stroke="var(--verified)"
        strokeWidth="1.6"
      />
      <text x="176" y="53">
        Verified email
      </text>
    </Drawing>
  );
}

export function PriceDrawing() {
  return (
    <Drawing>
      {[22, 50, 78].map((y) => (
        <g key={y} transform={`translate(10 ${y - 6})`} stroke="var(--line)">
          <rect width="20" height="13" rx="2" fill="var(--paper)" />
          <path d="m1 2 9 6 9-6" />
        </g>
      ))}
      <g className={styles.priceLines} stroke="var(--line)" strokeWidth="1.4">
        <path pathLength="1" d="M35 22h28c27 0 23 28 52 28h24" />
        <path pathLength="1" d="M35 50h104" />
        <path pathLength="1" d="M35 78h28c27 0 23-28 52-28h24" />
      </g>
      <path
        d="m130 50 18-20h89q4 0 4 4v32q0 4-4 4h-89z"
        fill="var(--stock)"
        stroke="var(--ink)"
        strokeWidth="1.3"
      />
      <circle cx="146" cy="50" r="3" fill="var(--paper)" stroke="var(--line)" />
      <text x="161" y="55" className={styles.inkLabel}>
        Your price
      </text>
    </Drawing>
  );
}

export function GovernanceDrawing() {
  return (
    <Drawing>
      <path d="M12 9h78l17 17v61H12z" fill="var(--paper)" stroke="var(--ink)" />
      <path d="M90 9v17h17" fill="var(--stock)" stroke="var(--line)" />
      <text x="22" y="40" className={styles.inkLabel}>
        Licence
      </text>
      <path d="M22 52h64m-64 7h49m-49 16h62" stroke="var(--rule)" />
      <path
        className={styles.trace}
        pathLength="1"
        d="M24 72c6-3 9-14 11-10 1 5-6 13-3 12l8-6c2-1 0 5 2 5l6-3h9"
        stroke="var(--ink)"
      />
      <g stroke="var(--line)">
        <path d="M107 50h20q7 0 7-7v-9q0-6 7-6h13m-27 22q7 0 7 7v9q0 6 7 6h13" />
        <circle cx="155" cy="28" r="2" fill="var(--paper)" />
        <circle cx="155" cy="72" r="2" fill="var(--paper)" />
      </g>
      <text x="166" y="32">
        Source
      </text>
      <text x="166" y="76">
        Schema
      </text>
    </Drawing>
  );
}

export function FolioDrawing() {
  return (
    <Drawing>
      <path
        d="M10 82V33q0-3 3-3h51l8 7h147v45z"
        fill="var(--stock)"
        stroke="var(--line)"
      />
      <g className={styles.folioPage} style={{ transformOrigin: "32px 86px" }}>
        <path d="M18 13h104v68H18z" fill="var(--paper)" stroke="var(--line)" />
        <text x="27" y="33">
          Sample
        </text>
        <path d="M27 40h29" stroke="var(--rule)" />
      </g>
      <g className={styles.folioPage} style={{ transformOrigin: "102px 85px" }}>
        <path d="M84 21h107v60H84z" fill="var(--paper)" stroke="var(--line)" />
        <text x="94" y="41">
          Method
        </text>
        <path d="M94 48h33" stroke="var(--rule)" />
      </g>
      <g className={styles.folioPage} style={{ transformOrigin: "164px 84px" }}>
        <path d="M151 29h83v52h-83z" fill="var(--paper)" stroke="var(--line)" />
        <text x="161" y="49">
          Use cases
        </text>
      </g>
      <path
        d="M7 54h69l9 7h155l-6 24q-1 4-5 4H18q-4 0-5-4z"
        fill="var(--stock)"
        stroke="var(--ink)"
        strokeWidth="1.3"
      />
    </Drawing>
  );
}
