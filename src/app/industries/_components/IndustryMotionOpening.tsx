"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Link } from "@/components/router/Link";
import { IndustryGraphiteTone } from "./IndustryGraphiteTone";
import styles from "./IndustryMotionOpening.module.css";

export interface IndustryMotionOpeningProps {
  industry: "egocentric" | "healthcare" | "voice";
  title: string;
  description: string;
  datasetHref: string;
  datasetLabel: string;
  storyId: string;
  film: {
    src: string;
    poster: string;
    mobileSrc: string;
    mobilePoster: string;
    description: string;
  };
}

const preferenceReady = 1;
const preferenceReducedMotion = 2;
const preferenceSaveData = 4;
const preferenceDocumentHidden = 8;
const preferenceMobile = 16;
const egocentricMobileMedia = "(max-width: 639px)";
const portraitMobileMedia =
  "(max-width: 639px), (max-width: 1023px) and (orientation: portrait)";

type DataConnection = EventTarget & { saveData?: boolean };
type PlaybackIntent = "auto" | "play" | "pause";
type VideoStatus = "loading" | "ready" | "failed";

const industryPages = [
  { industry: "egocentric", label: "Egocentric" },
  { industry: "healthcare", label: "Healthcare" },
  { industry: "voice", label: "Voice" },
] as const;

function getDataConnection() {
  return (navigator as Navigator & { connection?: DataConnection }).connection;
}

function readVideoPreferences(mobileMedia: string) {
  if (typeof window === "undefined") return 0;
  return (
    preferenceReady |
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? preferenceReducedMotion
      : 0) |
    (getDataConnection()?.saveData ? preferenceSaveData : 0) |
    (document.hidden ? preferenceDocumentHidden : 0) |
    (window.matchMedia(mobileMedia).matches ? preferenceMobile : 0)
  );
}

function subscribeToVideoPreferences(
  onChange: () => void,
  mobileMedia: string
) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia(mobileMedia);
  const connection = getDataConnection();
  motionQuery.addEventListener("change", onChange);
  mobileQuery.addEventListener("change", onChange);
  connection?.addEventListener("change", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    motionQuery.removeEventListener("change", onChange);
    mobileQuery.removeEventListener("change", onChange);
    connection?.removeEventListener("change", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function readServerVideoPreferences() {
  return 0;
}

/** A separate original, illustrative backdrop; not dataset footage. */
export function IndustryMotionOpening({
  industry,
  title,
  description,
  datasetHref,
  datasetLabel,
  storyId,
  film,
}: IndustryMotionOpeningProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const toneId = `industry-opening-tone-${instanceId}`;
  const positiveTone = industry !== "egocentric";
  const mobileMedia =
    industry === "egocentric" ? egocentricMobileMedia : portraitMobileMedia;
  const videoId = `${industry}-opening-video`;
  const titleId = `${industry}-opening-title`;
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intent, setIntent] = useState<PlaybackIntent>("auto");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("loading");
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const subscribePreferences = useCallback(
    (onChange: () => void) =>
      subscribeToVideoPreferences(onChange, mobileMedia),
    [mobileMedia]
  );
  const getPreferences = useCallback(
    () => readVideoPreferences(mobileMedia),
    [mobileMedia]
  );
  const preferences = useSyncExternalStore(
    subscribePreferences,
    getPreferences,
    readServerVideoPreferences
  );
  const ready = Boolean(preferences & preferenceReady);
  const reducedMotion = Boolean(preferences & preferenceReducedMotion);
  const saveData = Boolean(preferences & preferenceSaveData);
  const documentHidden = Boolean(preferences & preferenceDocumentHidden);
  const mobile = Boolean(preferences & preferenceMobile);
  const currentSource = mobile ? film.mobileSrc : film.src;
  const canLoadVideo =
    ready && ((!reducedMotion && !saveData) || intent !== "auto");
  const videoFailed = failedSource === currentSource;
  const videoReady =
    canLoadVideo &&
    !videoFailed &&
    videoStatus === "ready" &&
    loadedSource === currentSource;

  useEffect(() => {
    const element = mediaRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const wantsPlayback =
      intent === "play" || (intent === "auto" && !reducedMotion && !saveData);
    const canPlay =
      ready && isVisible && !documentHidden && !videoFailed && wantsPlayback;
    if (!canPlay) {
      video.pause();
      return;
    }
    void video.play().catch(() => {});
    return () => video.pause();
  }, [
    currentSource,
    documentHidden,
    intent,
    isVisible,
    mobile,
    ready,
    reducedMotion,
    saveData,
    videoFailed,
  ]);

  function togglePlayback() {
    if (isPlaying) {
      setIntent("pause");
      videoRef.current?.pause();
      return;
    }
    setIntent("play");
    if (ready && isVisible && !documentHidden && !videoFailed) {
      void videoRef.current?.play().catch(() => {});
    }
  }

  return (
    <section
      className={styles.opening}
      aria-labelledby={titleId}
      data-industry-opening
      data-industry={industry}
      style={
        positiveTone
          ? ({
              "--industry-opening-dark-filter": `url(#${toneId})`,
            } as CSSProperties)
          : undefined
      }
    >
      {positiveTone && (
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
          className={styles.toneDefs}
        >
          <defs>
            <IndustryGraphiteTone id={toneId} />
          </defs>
        </svg>
      )}
      <figure className={styles.backdrop}>
        <div ref={mediaRef} className={styles.media}>
          <picture className={styles.fallback} data-visible={!videoReady}>
            <source media={mobileMedia} srcSet={film.mobilePoster} />
            <img
              src={film.poster}
              width={industry === "egocentric" ? 1920 : 2520}
              height={industry === "egocentric" ? 1080 : 1200}
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <video
            ref={videoRef}
            id={videoId}
            className={styles.video}
            data-ready={videoReady}
            src={canLoadVideo ? currentSource : undefined}
            muted
            loop={!reducedMotion}
            playsInline
            preload={
              canLoadVideo && !reducedMotion && !saveData ? "auto" : "none"
            }
            aria-hidden="true"
            onLoadedData={() => {
              setVideoStatus("ready");
              setLoadedSource(currentSource);
            }}
            onPlaying={() => {
              setIsPlaying(true);
              setVideoStatus("ready");
              setLoadedSource(currentSource);
            }}
            onPause={() => setIsPlaying(false)}
            onEmptied={() => {
              setVideoStatus("loading");
              setLoadedSource(null);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setIntent("pause");
            }}
            onError={() => {
              setVideoStatus("failed");
              setFailedSource(currentSource);
              setIsPlaying(false);
            }}
          />
        </div>
        <figcaption className="sr-only">{film.description}</figcaption>
      </figure>
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.copy}>
          <h1 id={titleId} className={styles.title}>
            {title}
          </h1>
          <p className="sr-only">{description}</p>
          <div className={styles.actions}>
            <Link href={datasetHref} className={styles.primaryLink}>
              {datasetLabel} <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <a href={`#${storyId}`} className={styles.exploreLink}>
              Follow the story <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
          <nav className={styles.industryNav} aria-label="Industry pages">
            {industryPages.map((page) => (
              <Link
                key={page.industry}
                href={`/industries/${page.industry}`}
                className={styles.industryLink}
                aria-current={page.industry === industry ? "page" : undefined}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
        {!videoFailed && (
          <button
            type="button"
            className={styles.motionControl}
            onClick={togglePlayback}
            aria-controls={videoId}
          >
            {isPlaying ? "Pause background video" : "Play background video"}
          </button>
        )}
      </div>
    </section>
  );
}
