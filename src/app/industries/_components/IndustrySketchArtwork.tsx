"use client";

import { useId, type CSSProperties } from "react";
import Image from "next/image";

import { cn } from "@/shared/utils/cn";
import { IndustryGraphiteTone } from "./IndustryGraphiteTone";
import styles from "./IndustrySketchArtwork.module.css";

interface IndustrySketchArtworkProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

/** One source and one image node keep the framing identical in both themes. */
export function IndustrySketchArtwork({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 58vw, 100vw",
  priority = false,
}: IndustrySketchArtworkProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const toneId = `industry-sketch-tone-${instanceId}`;
  return (
    <div
      className={cn(styles.artwork, "relative overflow-hidden", className)}
      data-industry-sketch
    >
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
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={92}
        sizes={sizes}
        className={cn(styles.image, "object-cover", imageClassName)}
        style={
          {
            "--industry-sketch-dark-filter": `url(#${toneId})`,
          } as CSSProperties
        }
      />
    </div>
  );
}
