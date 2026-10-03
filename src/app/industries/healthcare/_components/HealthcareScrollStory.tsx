"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Link } from "@/components/router/Link";
import { cn } from "@/shared/utils/cn";
import { IndustryGraphiteTone } from "@/app/industries/_components/IndustryGraphiteTone";
import {
  healthcareExampleBrief,
  healthcareExampleRecord,
  healthcareStoryChapters,
  type HealthcareStoryChapter,
} from "./HealthcareStoryData";
import styles from "./HealthcareScrollStory.module.css";

const storyMedia =
  "(min-width: 1024px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)";
const chapterPositions = [0.1, 0.59, 0.98] as const;
const studyArtwork =
  "/images/industries/healthcare/healthcare-imaging-capture-light-v4.webp";

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

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function between(value: number, from: number, to: number) {
  const progress = clamp((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function chapterFor(progress: number) {
  return progress < 0.3 ? 0 : progress < 0.76 ? 1 : 2;
}

function artworkTone(id: string): CSSProperties {
  return { "--study-dark-filter": `url(#${id})` } as CSSProperties;
}

function LinkedReportContents() {
  return (
    <>
      <p className={styles.frameEyebrow}>Example linked report</p>
      <strong className={styles.recordReference}>
        {healthcareExampleRecord.reference}
      </strong>
      <dl className={styles.reportFields}>
        {healthcareExampleRecord.fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.reportFootnote}>{healthcareExampleRecord.note}</p>
    </>
  );
}

function BriefFields() {
  return (
    <>
      {healthcareExampleBrief.map((field) => (
        <div key={field.label}>
          <dt>{field.label}</dt>
          <dd>
            <span className={styles.fieldValue}>{field.value}</span>
            <span className={styles.fieldHint}>{field.detail}</span>
          </dd>
        </div>
      ))}
    </>
  );
}

function MobileEvidenceScene({
  progress,
  idPrefix,
}: {
  progress: number;
  idPrefix: string;
}) {
  const chapter = chapterFor(progress);
  const illustration = (
    <svg
      viewBox="0 0 1200 800"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={styles.mobileIllustration}
    >
      <defs>
        <IndustryGraphiteTone id={`${idPrefix}-mobile-dark-tone`} />
      </defs>
      <image
        className={styles.studyImage}
        href={studyArtwork}
        width="1200"
        height="800"
        preserveAspectRatio="xMidYMid slice"
        style={artworkTone(`${idPrefix}-mobile-dark-tone`)}
      />
    </svg>
  );
  return (
    <div className={styles.mobileStudy}>
      {chapter === 0 ? (
        <>
          {illustration}
          <p className={styles.mobileAcquisition}>
            <span>Acquisition context</span>
            Method · protocol · site
          </p>
        </>
      ) : chapter === 1 ? (
        <>
          <div className={styles.mobileRecordPair}>
            <div>
              {illustration}
              <p>Image and visit</p>
            </div>
            <div className={styles.mobileReport}>
              <LinkedReportContents />
            </div>
          </div>
          <ol className={styles.mobileTimeline}>
            <li>
              <strong>Acquisition</strong>
              <span>Image + event time</span>
            </li>
            <li>
              <strong>Linked record</strong>
              <span>Shared case + visit ID</span>
            </li>
            <li>
              <strong>Follow-up</strong>
              <span>Check date + availability</span>
            </li>
          </ol>
          <p className={styles.mobileAvailability}>
            Ask how missing reports and unavailable follow-up are recorded.
          </p>
        </>
      ) : (
        <>
          <div className={styles.mobileBriefHeading}>
            {illustration}
            <p>
              <span>Illustrative sourcing example</span>
              Your healthcare data brief
            </p>
          </div>
          <dl className={styles.mobileBriefFields}>
            <BriefFields />
          </dl>
        </>
      )}
    </div>
  );
}

/** Example sourcing metadata; no real patient identifiers or clinical findings. */
function EvidenceScene({
  progress,
  idPrefix,
  compact = false,
}: {
  progress: number;
  idPrefix: string;
  compact?: boolean;
}) {
  const linkage = between(progress, 0.3, 0.5);
  const brief = between(progress, 0.76, 0.94);
  const connections = between(progress, 0.48, 0.57) * (1 - brief);
  const image = {
    x: mix(mix(130, 50, linkage), 50, brief),
    y: mix(mix(24, 48, linkage), 42, brief),
    width: mix(mix(940, 560, linkage), 320, brief),
    height: mix(mix(540, 374, linkage), 214, brief),
  };
  const report = {
    x: mix(700, 50, brief),
    y: mix(64, 304, brief),
    width: mix(370, 320, brief),
    height: mix(322, 272, brief),
  };
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div
      className={cn(styles.evidenceCanvas, compact && styles.compactScene)}
      data-healthcare-evidence-scene
      data-scene-progress={progress.toFixed(3)}
    >
      <svg
        className={styles.sceneSvg}
        viewBox="0 0 1200 640"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <IndustryGraphiteTone id={id("dark-tone")} />
          <clipPath id={id("image-clip")}>
            <rect
              x={image.x}
              y={image.y}
              width={image.width}
              height={image.height}
              rx="3"
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#${id("image-clip")})`}>
          <image
            className={styles.studyImage}
            href={studyArtwork}
            x={image.x}
            y={image.y}
            width={image.width}
            height={image.height}
            preserveAspectRatio="xMidYMid slice"
            style={artworkTone(id("dark-tone"))}
          />
        </g>
        <rect
          x={image.x}
          y={image.y}
          width={image.width}
          height={image.height}
          rx="3"
          stroke="currentColor"
          strokeOpacity="0.16"
        />

        {/* The capture resolves into a linked image/report pair. */}
        <g opacity={linkage}>
          <rect
            x={report.x}
            y={report.y}
            width={report.width}
            height={report.height}
            rx="3"
            fill="var(--background)"
            stroke="currentColor"
            strokeOpacity="0.22"
          />
        </g>

        <g opacity={connections}>
          <path
            d="M330 422v78h550V386"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - between(progress, 0.48, 0.56)}
          />
          <path d="M80 535H1110" stroke="currentColor" strokeOpacity="0.28" />
          {[180, 580, 1020].map((x, index) => (
            <g key={x}>
              <path
                d={`M${x} 523v24`}
                stroke="currentColor"
                strokeOpacity="0.45"
              />
              <circle
                cx={x}
                cy="535"
                r="5"
                fill="var(--background)"
                stroke="currentColor"
                strokeOpacity={index === 2 ? "0.32" : "0.75"}
                strokeDasharray={index === 2 ? "2 2" : undefined}
              />
            </g>
          ))}
        </g>

        {/* The same source records remain beside a buyer-authored brief. */}
        <g opacity={brief}>
          <path
            d="M370 149h38v132h32M370 440h38V281h32"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <rect
            x="440"
            y="42"
            width="710"
            height="500"
            rx="3"
            fill="var(--background)"
            stroke="currentColor"
            strokeOpacity="0.22"
          />
        </g>
      </svg>

      {/* Native HTML stays crisp and exposes visible example metadata to readers. */}
      <div
        aria-hidden={linkage > 0.01}
        className={styles.captureNote}
        style={{ opacity: 1 - linkage }}
      >
        <span>Acquisition context</span>
        <strong>Method · protocol · site</strong>
      </div>
      <div
        aria-hidden={linkage < 0.99}
        className={styles.reportNote}
        data-compact={brief > 0.5}
        style={{
          opacity: linkage,
          left: `${(report.x + 28) / 12}%`,
          top: `${(report.y + 25) / 6.4}%`,
          width: `${(report.width - 56) / 12}%`,
          height: `${(report.height - 42) / 6.4}%`,
        }}
      >
        <LinkedReportContents />
      </div>
      <div
        aria-hidden={connections < 0.99}
        className={styles.timelineNotes}
        style={{ opacity: connections }}
      >
        <div>
          <strong>Acquisition</strong>
          <span>Image + event time</span>
        </div>
        <div>
          <strong>Linked record</strong>
          <span>Shared case + visit ID</span>
        </div>
        <div>
          <strong>Follow-up</strong>
          <span>Check date + availability</span>
        </div>
      </div>
      <div
        aria-hidden={brief < 0.99}
        className={styles.briefSheet}
        style={{ opacity: brief }}
      >
        <p>Illustrative sourcing example</p>
        <strong>Your healthcare data brief</strong>
        <dl>
          <BriefFields />
        </dl>
      </div>
      {compact && (
        <MobileEvidenceScene progress={progress} idPrefix={idPrefix} />
      )}
    </div>
  );
}

function ChapterDetails({
  chapter,
  showQuestions = false,
}: {
  chapter: HealthcareStoryChapter;
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

export function HealthcareScrollStory() {
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
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (enhanced) setProgress(value);
  });
  const active = chapterFor(progress);
  const current = healthcareStoryChapters[active];

  function chooseChapter(index: number) {
    const element = track.current;
    if (!element) return;
    if (!enhanced) {
      document
        .getElementById(`healthcare-story-${healthcareStoryChapters[index].id}`)
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
      id="healthcare-story"
      data-story-track
      data-enhanced={enhanced}
      aria-labelledby="healthcare-story-heading"
      className={cn(styles.track, "px-5 sm:px-6 lg:px-8")}
    >
      <div data-story-stage className={cn(styles.stage, "mx-auto max-w-7xl")}>
        <div className={styles.rail}>
          <h2 id="healthcare-story-heading">From a record to a requirement</h2>
          <nav aria-label="Healthcare story chapters">
            {healthcareStoryChapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                aria-current={enhanced && active === index ? "step" : undefined}
                aria-controls={
                  enhanced
                    ? "healthcare-motion-caption"
                    : `healthcare-story-${chapter.id}`
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
            <div id="healthcare-motion-caption" className={styles.caption}>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </div>
            <figure className={styles.figure}>
              <EvidenceScene progress={progress} idPrefix="healthcare-live" />
              <figcaption>
                <span>Illustrative study. No real patient data.</span>
                <span className={styles.scrollHint}>
                  Scroll to connect <ArrowDown size={12} aria-hidden="true" />
                </span>
              </figcaption>
            </figure>
            <div className={styles.bottom}>
              <ChapterDetails chapter={current} />
              <Link
                href={
                  active === 2
                    ? "/data-request/submit-requirement"
                    : "/datasets?q=healthcare"
                }
                className={styles.action}
              >
                {active === 2
                  ? "Describe your data need"
                  : "Explore healthcare data"}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.staticChapters}>
            {healthcareStoryChapters.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`healthcare-story-${chapter.id}`}
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
                  <EvidenceScene
                    progress={chapterPositions[index]}
                    idPrefix={`healthcare-static-${chapter.id}`}
                    compact
                  />
                  <figcaption>
                    Illustrative study. No real patient data.
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
