"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  StrotasEntryScreen,
  STROTAS_INTRO_SESSION_KEY,
} from "./StrotasEntryScreen";
import styles from "./StrotasAnimationGallery.module.css";

const CinematicStudy = dynamic(() =>
  import("./StrotasCinematicHero").then((module) => module.StrotasCinematicHero)
);
const FlowStudy = dynamic(() =>
  import("./StrotasFlowScene").then((module) => module.StrotasFlowScene)
);

const versions = [
  {
    id: "logo",
    label: "Logo reveal",
    description:
      "The new intro. A quiet logo reveal, a wordmark, and a clean fade into the page.",
    badge: "New",
  },
  {
    id: "previous-intro",
    label: "Previous intro",
    description:
      "The previous opening animation: the Kuinbee mark assembling between animated input and output paths.",
    badge: "Previous",
  },
  {
    id: "cinematic",
    label: "Cinematic study",
    description:
      "An earlier hero animation. Scroll through the sculpture’s three compositions.",
    badge: "Earlier hero",
  },
  {
    id: "flow",
    label: "Flow study",
    description:
      "An earlier hero concept showing the pipeline as an animated diagram.",
    badge: "Earlier hero",
  },
] as const;

export function StrotasAnimationGallery({
  initialVersion,
}: {
  initialVersion?: string;
}) {
  const [selected, setSelected] = useState(
    versions.find((version) => version.id === initialVersion) ?? versions[0]
  );
  const [replay, setReplay] = useState(0);

  return (
    <main className={styles.gallery}>
      <header className={styles.header}>
        <Link
          href="/strotas"
          className={styles.back}
          onClick={() => {
            try {
              sessionStorage.setItem(STROTAS_INTRO_SESSION_KEY, "seen");
            } catch {
              /* Storage is optional. */
            }
          }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Strotas
        </Link>
        <div className={styles.heading}>
          <div>
            <p>STROTAS / MOTION</p>
            <h1>A quieter first impression.</h1>
          </div>
          <button
            className={styles.replay}
            type="button"
            onClick={() => setReplay((value) => value + 1)}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Replay
          </button>
        </div>
        <nav className={styles.versions} aria-label="Animation versions">
          {versions.map((version) => (
            <button
              type="button"
              key={version.id}
              aria-pressed={selected.id === version.id}
              onClick={() => {
                setSelected(version);
                window.history.replaceState(
                  null,
                  "",
                  `/strotas/animation?version=${version.id}`
                );
              }}
            >
              {version.label}
              <span>{version.badge}</span>
            </button>
          ))}
        </nav>
        <p className={styles.description} aria-live="polite">
          {selected.description}
        </p>
      </header>
      <div
        className={styles.preview}
        key={`${selected.id}-${replay}`}
        data-animation-preview={selected.id}
      >
        {selected.id === "logo" && <StrotasEntryScreen mode="screensaver" />}
        {selected.id === "previous-intro" && (
          <StrotasEntryScreen mode="screensaver" variant="legacy" />
        )}
        {selected.id === "cinematic" && <CinematicStudy />}
        {selected.id === "flow" && (
          <div className={styles.flowStudy}>
            <FlowStudy />
          </div>
        )}
      </div>
    </main>
  );
}
