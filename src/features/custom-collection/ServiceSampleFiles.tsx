"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/core/providers/AuthProvider";
import { useModal } from "@/core/providers/ModalProvider";
import { downloadCustomServiceSample } from "@/services/custom-collection.service";
import type { CustomCollectionSampleFile } from "@/types/custom-collection.types";

export function ServiceSampleFiles({
  slug,
  revisionId,
  files = [],
}: {
  slug: string;
  revisionId: string;
  files?: CustomCollectionSampleFile[];
}) {
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const actor = isAuthenticated ? user?.id : undefined;
  const current = useRef(actor);
  const mounted = useRef(true);
  useEffect(() => {
    current.current = actor;
    mounted.current = true;
    return () => {
      mounted.current = false;
      current.current = undefined;
    };
  }, [actor, slug, revisionId]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function download(file: CustomCollectionSampleFile) {
    if (!actor) {
      openModal("login");
      return;
    }
    const startedActor = actor;
    setBusy(file.id);
    setError(null);
    try {
      const result = await downloadCustomServiceSample(
        slug,
        revisionId,
        file.id
      );
      if (!mounted.current || current.current !== startedActor) return;
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.fileName;
      link.rel = "noopener";
      link.click();
    } catch (err) {
      if (mounted.current && current.current === startedActor)
        setError(
          err instanceof Error
            ? err.message
            : "Could not download this sample. Please try again."
        );
    } finally {
      if (mounted.current) setBusy(null);
    }
  }
  if (!files.length) return null;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Free samples</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore examples of this service. Contact the supplier about usage
          rights and project requirements.
        </p>
      </div>
      <ul className="space-y-3">
        {files
          .filter((file) => file.status === "READY")
          .map((file) => (
            <li
              key={file.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <FileText
                  className="mt-1 h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium">
                    {file.fileName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Number(file.sizeBytes) >= 1_000_000_000
                      ? `${(Number(file.sizeBytes) / 1_000_000_000).toFixed(2)} GB`
                      : `${(Number(file.sizeBytes) / 1_000_000).toFixed(2)} MB`}{" "}
                    · Free sample
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="shrink-0"
                disabled={Boolean(busy)}
                onClick={() => void download(file)}
              >
                {busy === file.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {actor ? "Download sample" : "Sign in to download"}
              </Button>
            </li>
          ))}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
