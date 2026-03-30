"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Rss } from "lucide-react";

interface RssSubscribeActionsProps {
  fallbackUrl: string;
}

export function RssSubscribeActions({ fallbackUrl }: RssSubscribeActionsProps) {
  const [localRssUrl, setLocalRssUrl] = useState(fallbackUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalRssUrl(`${window.location.origin}/feed.xml`);
    }
  }, []);

  // Always use fallbackUrl (production) for Feedly since it can't reach localhost
  const feedlyUrl = useMemo(
    () => `https://feedly.com/i/subscription/feed/${encodeURIComponent(fallbackUrl)}`,
    [fallbackUrl]
  );

  const copyRssLink = async () => {
    try {
      await navigator.clipboard.writeText(localRssUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={copyRssLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-sm transition-colors hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied RSS Link" : "Copy RSS Link"}
        </button>

        <a
          href={feedlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 text-[#1a2240] dark:text-white/85 font-semibold text-sm transition-colors hover:bg-[#1a2240]/5 dark:hover:bg-white/10 border border-[#1a2240]/15 dark:border-white/20"
        >
          <Rss className="w-4 h-4" />
          Open in Feedly
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <p className="text-xs text-[#4e5a7e] dark:text-white/50">
        RSS feeds open as XML and are intended for RSS apps.
      </p>
    </div>
  );
}
