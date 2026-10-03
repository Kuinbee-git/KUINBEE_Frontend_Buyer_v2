"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/components/router/Link";
import { cn } from "@/shared/utils/cn";
import { EgocentricMotionScene } from "./EgocentricMotionScene";
import {
  egocentricStoryChapters,
  type EgocentricStoryChapter,
} from "./EgocentricStoryData";
import styles from "./EgocentricScrollStory.module.css";

const storyMedia =
  "(min-width: 1024px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)";
const chapterPositions = [0.1, 0.68, 0.98] as const;

function subscribeToStoryMedia(onChange: () => void) {
  const query = window.matchMedia(storyMedia);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readStoryMedia() {
  return window.matchMedia(storyMedia).matches;
}

function readServerMedia() {
  return false;
}

function chapterFor(progress: number) {
  return progress < 0.3 ? 0 : progress < 0.74 ? 1 : 2;
}

function ChapterDetails({
  chapter,
  showQuestions = false,
}: {
  chapter: EgocentricStoryChapter;
  showQuestions?: boolean;
}) {
  return (
    <div className={styles.details}>
      <dl className={styles.fields}>
        {chapter.fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      {showQuestions && (
        <div className={styles.questions}>
          <p>Questions to take to a supplier</p>
          <ul>
            {chapter.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function EgocentricScrollStory() {
  const track = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const enhanced = useSyncExternalStore(
    subscribeToStoryMedia,
    readStoryMedia,
    readServerMedia
  );
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 80px", "end end"],
  });
  // One progress clock drives the scene, chapter copy, and rail together.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (enhanced) setProgress(value);
  });
  const active = chapterFor(progress);
  const current = egocentricStoryChapters[active];

  function chooseChapter(index: number) {
    const element = track.current;
    if (!element) return;
    if (!enhanced) {
      document
        .getElementById(`egocentric-story-${egocentricStoryChapters[index].id}`)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    const start = element.getBoundingClientRect().top + window.scrollY - 80;
    const distance = element.offsetHeight - window.innerHeight + 80;
    const position = start + distance * chapterPositions[index];
    if (lenis) lenis.scrollTo(position, { duration: 0.7 });
    else window.scrollTo({ top: position, behavior: "smooth" });
  }

  return (
    <section
      ref={track}
      id="egocentric-story"
      data-story-track
      data-enhanced={enhanced}
      aria-labelledby="egocentric-story-heading"
      className={cn(styles.track, "px-5 sm:px-6 lg:px-8")}
    >
      <div data-story-stage className={cn(styles.stage, "mx-auto max-w-7xl")}>
        <div className={styles.rail}>
          <h2 id="egocentric-story-heading">
            From an interaction to a requirement
          </h2>
          <nav aria-label="Egocentric story chapters">
            {egocentricStoryChapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                aria-current={enhanced && active === index ? "step" : undefined}
                aria-controls={
                  enhanced
                    ? "egocentric-motion-caption"
                    : `egocentric-story-${chapter.id}`
                }
                onClick={() => chooseChapter(index)}
                data-current={enhanced && active === index}
              >
                <span>0{index + 1}</span>
                {chapter.label}
              </button>
            ))}
          </nav>
        </div>

        {enhanced ? (
          <>
            <div id="egocentric-motion-caption" className={styles.caption}>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </div>
            <figure className={styles.figure}>
              <EgocentricMotionScene
                progress={progress}
                idPrefix="live-story"
                className={styles.scene}
              />
              <figcaption>
                <span>Concept illustration. Not a dataset sample.</span>
                <span className={styles.scrollHint}>
                  Scroll to unfold <ArrowDown size={12} aria-hidden="true" />
                </span>
              </figcaption>
            </figure>
            <div className={styles.bottom}>
              <ChapterDetails chapter={current} />
              <Link
                href={
                  active === 2
                    ? "/data-request/submit-requirement"
                    : "/datasets?q=egocentric"
                }
                className={styles.action}
              >
                {active === 2
                  ? "Describe your data need"
                  : "Explore egocentric data"}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.staticChapters}>
            {egocentricStoryChapters.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`egocentric-story-${chapter.id}`}
                className={styles.staticChapter}
              >
                <div className={styles.caption}>
                  <div>
                    <p className={styles.chapterNumber}>
                      0{index + 1} / {chapter.label}
                    </p>
                    <h3>{chapter.title}</h3>
                  </div>
                  <p>{chapter.description}</p>
                </div>
                <figure className={styles.figure}>
                  <EgocentricMotionScene
                    progress={chapterPositions[index]}
                    compact
                    idPrefix={`static-story-${chapter.id}`}
                    className={styles.scene}
                  />
                  <figcaption>
                    Concept illustration. Not a dataset sample.
                  </figcaption>
                </figure>
                <ChapterDetails chapter={chapter} showQuestions />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
