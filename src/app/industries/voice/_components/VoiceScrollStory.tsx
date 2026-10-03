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
import { IndustryGraphiteTone } from "@/app/industries/_components/IndustryGraphiteTone";
import { cn } from "@/shared/utils/cn";
import { voiceStoryChapters, type VoiceStoryChapter } from "./VoiceStoryData";
import styles from "./VoiceScrollStory.module.css";

const storyMedia =
  "(min-width: 1024px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)";
const chapterPositions = [0.12, 0.66, 0.98] as const;
const artwork =
  "/images/industries/voice/voice-natural-recording-light-v4.webp";

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

function between(value: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function chapterFor(progress: number) {
  return progress < 0.3 ? 0 : progress < 0.74 ? 1 : 2;
}

function artworkTone(id: string): CSSProperties {
  return { "--study-dark-filter": `url(#${id})` } as CSSProperties;
}

// A fixed schematic signal: no audio playback, recorded sample, or inferred
// annotation is implied. Scroll changes its layout, never its underlying data.
const waveform = Array.from({ length: 112 }, (_, index) => {
  const inPause = (index > 37 && index < 45) || (index > 80 && index < 88);
  const envelope = inPause
    ? 0.08
    : 0.25 + Math.abs(Math.sin(index * 0.31)) * 0.75;
  // Quantize once: Math.sin's final binary digit can differ between the SSR
  // runtime and a browser. Stable SVG attributes avoid hydration warnings.
  return Number(
    ((7 + Math.abs(Math.sin(index * 1.73)) * 35) * envelope).toFixed(3)
  );
});

function SpeechStudy({
  progress,
  idPrefix,
  compact = false,
}: {
  progress: number;
  idPrefix: string;
  compact?: boolean;
}) {
  const arrange = compact ? 0 : between(progress, 0.24, 0.47);
  const source = compact ? 0 : between(progress, 0.77, 0.94);
  const signal = between(progress, 0.01, 0.2);
  const alignment = between(progress, 0.44, 0.51) * (1 - source);
  const imageWidth = mix(mix(840, 530, arrange), 344, source);
  const imageX = mix(mix(180, 20, arrange), 24, source);
  const imageY = mix(mix(14, 65, arrange), 130, source);
  const waveX = mix(mix(252, 653, arrange), 44, source);
  const waveY = mix(mix(495, 158, arrange), 414, source);
  const waveWidth = mix(mix(696, 502, arrange), 304, source);
  const waveHeight = mix(1, 0.55, source);
  const waveOpacity = mix(0.85, 0.6, source);

  return (
    <div
      className={cn(styles.study, compact && styles.compactStudy)}
      data-voice-study
      data-scene-progress={progress.toFixed(3)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={compact ? "180 14 840 560" : "0 0 1200 600"}
        fill="none"
        className={styles.scene}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <IndustryGraphiteTone id={`${idPrefix}-dark-tone`} />
          <clipPath id={`${idPrefix}-art`}>
            <rect width="1536" height="1024" rx="8" />
          </clipPath>
          <clipPath id={`${idPrefix}-signal`}>
            <rect x="0" y="-50" width={112 * signal} height="100" />
          </clipPath>
        </defs>

        <svg
          x={imageX}
          y={imageY}
          width={imageWidth}
          height={(imageWidth * 2) / 3}
          viewBox="0 0 1536 1024"
        >
          <image
            href={artwork}
            width="1536"
            height="1024"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${idPrefix}-art)`}
            className={styles.artwork}
            style={artworkTone(`${idPrefix}-dark-tone`)}
          />
        </svg>

        <g
          transform={`translate(${waveX} ${waveY}) scale(${waveWidth / 112} ${waveHeight})`}
          opacity={waveOpacity}
          className={styles.signal}
        >
          <path
            d="M0 0H112"
            stroke="currentColor"
            strokeWidth="0.12"
            opacity="0.3"
          />
          <g clipPath={`url(#${idPrefix}-signal)`}>
            {waveform.map((height, index) => (
              <path
                key={index}
                d={`M${index + 0.5} ${-height}V${height}`}
                stroke="currentColor"
                strokeWidth="0.45"
              />
            ))}
          </g>
        </g>

        <g opacity={alignment} className={styles.signal}>
          <path
            d="M653 205H820M851 205H1011M1038 205H1155"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M653 202V212M820 202V212M851 202V212M1011 202V212M1038 202V212M1155 202V212"
            stroke="currentColor"
            opacity="0.5"
          />
          <path
            d="M653 222V270M851 222V270M1038 222V270"
            stroke="currentColor"
            strokeDasharray="3 6"
            opacity="0.25"
          />
        </g>

        <path
          d={`M${imageX + imageWidth + 20} ${imageY + (imageWidth * 2) / 3 - 56}H${mix(612, 441, source)}`}
          stroke="currentColor"
          strokeWidth="1"
          opacity={arrange * 0.15}
        />
      </svg>

      {!compact && (
        <>
          <div
            className={styles.alignment}
            style={{
              opacity: alignment,
              visibility: alignment > 0 ? "visible" : "hidden",
            }}
            aria-hidden={alignment < 0.5}
          >
            <p className={styles.annotationLabel}>Illustrative alignment</p>
            <div className={styles.words}>
              <span>Let’s meet</span>
              <span>at the station.</span>
              <span>Around noon?</span>
            </div>
            <div className={styles.turns}>
              <p>
                <span>Speaker A</span>Let’s meet at the station.
              </p>
              <p>
                <span>Speaker B</span>Around noon?
              </p>
            </div>
            <p className={styles.annotationNote}>
              Words · segments · speaker turns
            </p>
          </div>
          <div
            className={styles.brief}
            style={{
              opacity: source,
              visibility: source > 0 ? "visible" : "hidden",
            }}
            aria-hidden={source < 0.5}
          >
            <p className={styles.annotationLabel}>A clearer voice brief</p>
            <dl>
              <div>
                <dt>01 / Coverage</dt>
                <dd>Languages, speakers, and real-use scenarios.</dd>
              </div>
              <div>
                <dt>02 / Capture</dt>
                <dd>Devices, noise, speaking style, and audio formats.</dd>
              </div>
              <div>
                <dt>03 / Labels & usage</dt>
                <dd>Transcripts, timing, review methods, and usage terms.</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </div>
  );
}

function ChapterDetails({
  chapter,
  showQuestions = false,
}: {
  chapter: VoiceStoryChapter;
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

export function VoiceScrollStory() {
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
  const current = voiceStoryChapters[active];

  function chooseChapter(index: number) {
    const element = track.current;
    if (!element) return;
    if (!enhanced) {
      document
        .getElementById(`voice-story-${voiceStoryChapters[index].id}`)
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
      id="voice-story"
      data-story-track
      data-enhanced={enhanced}
      aria-labelledby="voice-story-heading"
      className={cn(styles.track, "px-5 sm:px-6 lg:px-8")}
    >
      <div data-story-stage className={cn(styles.stage, "mx-auto max-w-7xl")}>
        <div className={styles.rail}>
          <h2 id="voice-story-heading">From a conversation to a requirement</h2>
          <nav aria-label="Voice story chapters">
            {voiceStoryChapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                aria-current={enhanced && active === index ? "step" : undefined}
                aria-controls={
                  enhanced
                    ? "voice-motion-caption"
                    : `voice-story-${chapter.id}`
                }
                data-current={enhanced && active === index}
                onClick={() => chooseChapter(index)}
              >
                <span>0{index + 1}</span>
                {chapter.label}
              </button>
            ))}
          </nav>
        </div>

        {enhanced ? (
          <>
            <div id="voice-motion-caption" className={styles.caption}>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </div>
            <figure className={styles.figure}>
              <SpeechStudy progress={progress} idPrefix="voice-live-story" />
              <figcaption>
                <span>
                  Concept illustration. Schematic labels, not audio or a dataset
                  sample.
                </span>
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
                    : "/datasets?category=voice"
                }
                className={styles.action}
              >
                {active === 2
                  ? "Describe your voice data need"
                  : "Explore voice data"}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.staticChapters}>
            {voiceStoryChapters.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`voice-story-${chapter.id}`}
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
                {index === 0 ? (
                  <figure className={styles.figure}>
                    <SpeechStudy
                      progress={chapterPositions[index]}
                      idPrefix="voice-static-story"
                      compact
                    />
                    <figcaption>
                      Concept illustration. Schematic signal, not recorded
                      audio.
                    </figcaption>
                  </figure>
                ) : index === 1 ? (
                  <div className={styles.staticAlignment}>
                    <p className={styles.annotationLabel}>
                      Illustrative transcript & turns
                    </p>
                    <svg
                      viewBox="0 0 560 100"
                      fill="none"
                      className={styles.staticSignal}
                      aria-hidden="true"
                      focusable="false"
                    >
                      {waveform.map((height, point) => (
                        <path
                          key={point}
                          d={`M${point * 5 + 2.5} ${50 - height}V${50 + height}`}
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                    <div className={styles.turns}>
                      <p>
                        <span>Speaker A</span>Let’s meet at the station.
                      </p>
                      <p>
                        <span>Speaker B</span>Around noon?
                      </p>
                    </div>
                    <p className={styles.annotationNote}>
                      Schematic words and timing. No audio playback or automated
                      annotation.
                    </p>
                  </div>
                ) : (
                  <dl className={styles.staticBrief}>
                    <div>
                      <dt>01 / Coverage</dt>
                      <dd>Languages, speakers, and real-use scenarios.</dd>
                    </div>
                    <div>
                      <dt>02 / Capture</dt>
                      <dd>
                        Devices, noise, speaking style, and audio formats.
                      </dd>
                    </div>
                    <div>
                      <dt>03 / Labels & usage</dt>
                      <dd>
                        Transcripts, timing, review methods, and usage terms.
                      </dd>
                    </div>
                  </dl>
                )}
                <ChapterDetails chapter={chapter} showQuestions />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
