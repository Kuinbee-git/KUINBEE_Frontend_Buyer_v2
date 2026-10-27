"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function renderableUrl(url?: string | null) {
  return Boolean(url && (url.startsWith("https://") || /^\/(?!\/)/.test(url)));
}

export function EntityLogo({
  name,
  logoUrl,
  ownerType,
  className,
  imageClassName,
  fallbackClassName,
  sizes = "72px",
}: {
  name: string;
  logoUrl?: string | null;
  ownerType?: "platform" | "supplier";
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  sizes?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = renderableUrl(logoUrl) && failedUrl !== logoUrl;

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#1a2240]/10 bg-[#1a2240]/5 text-[#1a2240] dark:border-white/10 dark:bg-white/5 dark:text-white",
        ownerType === "platform" && "border-[#1a2240] bg-[#1a2240] text-white dark:bg-[#1a2240]",
        className
      )}
      role="img"
      aria-label={`${name} logo`}
      title={name}
    >
      {showImage ? (
        <Image
          src={logoUrl ?? ""}
          alt=""
          fill
          sizes={sizes}
          className={cn("object-contain", imageClassName)}
          onError={() => setFailedUrl(logoUrl ?? null)}
        />
      ) : (
        <span aria-hidden="true" className={cn("text-xs font-semibold tracking-normal", fallbackClassName)}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
