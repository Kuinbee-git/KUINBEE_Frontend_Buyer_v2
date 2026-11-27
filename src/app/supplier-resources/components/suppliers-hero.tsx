"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowDown, ArrowRight, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { SupplierEntryLink } from "./supplier-entry-link";
import styles from "./suppliers-hero.module.css";

const filmPath = "/images/supplier-resources/supplier-industries";
const compactViewport = "(max-width: 640px)";

function followSection(event: MouseEvent<HTMLAnchorElement>) {
  // Keep native fragment navigation and the target section's scroll margin.
  event.stopPropagation();
}

export function SuppliersHero({ supplierQuery }: { supplierQuery: string }) {
  const film = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const video = film.current;
    const container = frame.current;
    if (!video || !container) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia(compactViewport);
    let inView = false;
    let resumeAt = 0;

    const syncPlayback = () => {
      if (motion.matches || document.hidden || !inView) {
        video.pause();
        if (motion.matches) delete video.dataset.ready;
        return;
      }

      const source = filmPath + (viewport.matches ? "-mobile.mp4" : ".mp4");
      if (video.getAttribute("src") !== source) {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resumeAt = video.currentTime;
        }
        delete video.dataset.ready;
        video.src = source;
      }
      if (video.paused && !video.error) {
        video.play().catch((error: DOMException) => {
          if (error.name !== "AbortError") delete video.dataset.ready;
        });
      }
    };

    const restorePosition = () => {
      if (resumeAt > 0) video.currentTime = resumeAt;
      resumeAt = 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(container);
    video.addEventListener("loadedmetadata", restorePosition);
    viewport.addEventListener("change", syncPlayback);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", restorePosition);
      viewport.removeEventListener("change", syncPlayback);
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="supplier-hero-title">
      <div className={styles.frame} ref={frame}>
        <video
          ref={film}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          disablePictureInPicture
          className={styles.video}
          onPlaying={(event) => {
            event.currentTarget.dataset.ready = "true";
          }}
          onError={(event) => {
            delete event.currentTarget.dataset.ready;
          }}
        />
        <picture className={styles.poster}>
          <source
            media={compactViewport}
            srcSet={`${filmPath}-mobile-egocentric.webp`}
          />
          {/* The art-directed poster stays in place if video cannot play. */}
          <img
            src={`${filmPath}-egocentric.webp`}
            width={1600}
            height={780}
            alt=""
            fetchPriority="high"
          />
        </picture>
        <div className={styles.overlay}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Supplier resources</p>
            <h1 id="supplier-hero-title">
              Publish your data
              <br />
              on Kuinbee.
            </h1>
            <p className={styles.lead}>
              Prepare your sample, set your terms, and get your dataset ready
              for review.
            </p>
            <div className={styles.actions}>
              <SupplierEntryLink
                className={styles.primary}
                query={supplierQuery}
              >
                Start your supplier application
                <ArrowRight size={16} aria-hidden="true" />
              </SupplierEntryLink>
              <a
                className={styles.contact}
                href="#guide"
                onClick={followSection}
              >
                Read the publishing guide
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <Popover>
          <PopoverTrigger
            type="button"
            className={styles.filmInfo}
            aria-label="About the footage"
          >
            <Info size={19} aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={6}
            collisionPadding={12}
            aria-label="About the footage"
            className="max-w-[calc(100vw-1.5rem)] text-sm"
          >
            <p className="font-semibold">About the footage</p>
            <p className="my-2 leading-relaxed text-muted-foreground">
              The kitchen scenes come from Diffraction’s Egocentric Kitchen
              Capture Sample. The healthcare and voice recordings feature
              footage from Pexels.
            </p>
            <a
              className="font-medium underline underline-offset-4"
              href="/images/supplier-resources/credits.txt"
            >
              Sources and licences
            </a>
          </PopoverContent>
        </Popover>
      </div>
      <nav className={styles.links} aria-label="More supplier resources">
        <a href="#listing-practices" onClick={followSection}>
          Listing best practices <ArrowDown size={14} aria-hidden="true" />
        </a>
        <a href="#faq" onClick={followSection}>
          Supplier FAQs <ArrowDown size={14} aria-hidden="true" />
        </a>
      </nav>
    </section>
  );
}
