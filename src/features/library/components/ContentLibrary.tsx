"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  buyerDatasetApi,
  type BuyerLibraryItem,
} from "@/services/dataset-content.service";
import { useAuth } from "@/core/providers/AuthProvider";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { Button } from "@/shared/components/ui/button";
import {
  ContentDescription,
  ContentFacts,
} from "@/features/datasets/content/ContentDescription";
import { BuyerFilePanel } from "@/features/datasets/content/BuyerFilePanel";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";

const accessLabels: Record<BuyerLibraryItem["recordedAccess"], string> = {
  RECORDED: "Recorded access",
  EXPIRED: "Expired",
  REVOKED: "Revoked",
  UNRESOLVED: "Access reference unresolved",
};
function LibraryRecord({
  item,
  showTitle = true,
}: {
  item: BuyerLibraryItem;
  showTitle?: boolean;
}) {
  const description =
    item.representation === "CONTENT" ? item.description : null;
  return (
    <article
      className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm p-5 space-y-4"
      data-library-record={item.datasetId}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {showTitle ? (
          <h3 className="text-lg font-semibold break-words">
            {item.title ?? "Historical title unavailable"}
          </h3>
        ) : (
          <h2 className="text-lg font-semibold">Access record</h2>
        )}
        <span className="text-sm text-muted-foreground">
          {accessLabels[item.recordedAccess]}
        </span>
      </div>
      <ContentFacts
        rows={[
          ["Dataset number", item.datasetUniqueId],
          [
            "Access type",
            item.accessType === "PURCHASE" ? "Purchased" : "Free claim",
          ],
          ["Granted", new Date(item.grantedAt).toLocaleString()],
          [
            "Metadata",
            description
              ? "Captured for your granted content"
              : item.representation === "LEGACY"
                ? "Current title; historical metadata was not recorded"
                : "Historical metadata unresolved",
          ],
          ["License at grant", description?.license],
          ["Category at grant", description?.categoriesAtFreeze.primary.name],
          [
            "Expires",
            item.expiresAt
              ? new Date(item.expiresAt).toLocaleString()
              : "No expiry recorded",
          ],
        ]}
      />
      <p className="text-xs text-muted-foreground">
        A recorded entitlement is separate from current file availability and
        security checks. Current listings can describe different content.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          className="text-sm font-medium underline"
          href={`/library/access/${item.datasetId}`}
        >
          View recorded access
        </Link>
        <Link
          className="text-sm text-muted-foreground underline"
          href={`/datasets/${item.datasetId}`}
        >
          View current listing
        </Link>
      </div>
    </article>
  );
}
export function ContentMyDatasets() {
  const { user, isAuthenticated } = useAuth(),
    [page, setPage] = useState(1);
  const actorId = isAuthenticated ? user?.id : undefined;
  const result = useQuery({
    queryKey: ["library", "content-0.21", actorId, "list", { page }],
    enabled: Boolean(actorId),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: ({ signal }) =>
      buyerDatasetApi.library({ page, pageSize: 20 }, signal),
  });
  if (!actorId) return <p>Sign in to view your library.</p>;
  if (result.isPending)
    return <p role="status">Loading recorded Dataset access…</p>;
  if (result.isError)
    return (
      <div className="space-y-3">
        <p role="alert">{getErrorMessage(result.error)}</p>
        <Button variant="outline" onClick={() => void result.refetch()}>
          Retry library
        </Button>
      </div>
    );
  const pages = Math.max(
    1,
    Math.ceil(result.data.total / result.data.pageSize)
  );
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">My datasets</h2>
      <p className="text-sm text-muted-foreground">
        {result.data.total} recorded{" "}
        {result.data.total === 1 ? "Dataset" : "Datasets"}
      </p>
      {!result.data.items.length ? (
        <p>No Dataset access is recorded on this page.</p>
      ) : (
        result.data.items.map((item) => (
          <LibraryRecord key={item.datasetId} item={item} />
        ))
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((value) => value - 1)}
        >
          Previous library page
        </Button>
        <span className="text-sm">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          disabled={page >= pages}
          onClick={() => setPage((value) => value + 1)}
        >
          Next library page
        </Button>
      </div>
    </div>
  );
}
export function ContentLibraryAccess({ datasetId }: { datasetId: string }) {
  const { user, isAuthenticated } = useAuth();
  const actorId = isAuthenticated ? user?.id : undefined;
  const result = useQuery({
    queryKey: ["library", "content-0.21", actorId, "record", datasetId],
    enabled: Boolean(actorId && datasetId),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: ({ signal }) => buyerDatasetApi.libraryItem(datasetId, signal),
  });
  return (
    <div className="min-h-screen relative">
      <div className="relative z-50">
        <NotchNavigation />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>
      <main className="relative mx-auto max-w-6xl px-6 pt-32 pb-16 space-y-5">
        <Link
          href="/library"
          className="text-sm text-muted-foreground underline"
        >
          Back to library
        </Link>
        {!actorId ? (
          <p>Sign in to view your recorded access.</p>
        ) : result.isPending ? (
          <p role="status">Loading recorded access…</p>
        ) : result.isError ? (
          <div className="space-y-3">
            <p role="alert">{getErrorMessage(result.error)}</p>
            <Button variant="outline" onClick={() => void result.refetch()}>
              Retry recorded access
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold break-words">
              {result.data.item.title ?? "Historical title unavailable"}
            </h1>
            <LibraryRecord item={result.data.item} showTitle={false} />
            {result.data.item.representation === "CONTENT" && (
              <>
                {result.data.item.description ? (
                  <section className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 p-5 space-y-4">
                    <h2 className="text-xl font-semibold">
                      Description captured for your access
                    </h2>
                    <ContentDescription
                      description={result.data.item.description}
                    />
                  </section>
                ) : (
                  <p>
                    Historical description could not be resolved. Today’s
                    publication is not substituted.
                  </p>
                )}
                {result.data.item.recordedAccess === "RECORDED" &&
                result.data.item.material ? (
                  <section className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 p-5 space-y-4">
                    <h2 className="text-xl font-semibold">
                      Granted full material
                    </h2>
                    <BuyerFilePanel
                      audience="LIBRARY"
                      datasetId={datasetId}
                      contentId={result.data.item.material.contentId}
                    />
                  </section>
                ) : (
                  <p role="status">
                    Files are unavailable for this{" "}
                    {accessLabels[
                      result.data.item.recordedAccess
                    ].toLowerCase()}{" "}
                    record.
                  </p>
                )}
              </>
            )}
            {result.data.item.representation === "LEGACY" && (
              <LegacyRecordedDownload
                key={actorId + datasetId + result.data.item.recordedUploadId}
                item={result.data.item}
                actorId={actorId}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
function LegacyRecordedDownload({
  item,
  actorId,
}: {
  item: Extract<BuyerLibraryItem, { representation: "LEGACY" }>;
  actorId: string;
}) {
  const { user, isAuthenticated } = useAuth();
  const live = useRef(false),
    inFlight = useRef(false);
  const [error, setError] = useState<string | null>(null),
    [busy, setBusy] = useState(false);
  useLayoutEffect(() => {
    live.current = isAuthenticated && user?.id === actorId;
    return () => {
      live.current = false;
    };
  }, [actorId, isAuthenticated, user?.id]);
  async function download() {
    if (inFlight.current || !live.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await buyerDatasetApi.legacyLibraryDownload(item);
      if (!live.current) return;
      if (Date.parse(result.expiresAt) <= Date.now())
        throw new Error("The link expired. Request a fresh download.");
      const link = document.createElement("a");
      link.href = result.url;
      link.download = "";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (problem) {
      setError(getErrorMessage(problem));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 p-5 space-y-4">
      <h2 className="text-xl font-semibold">Original recorded file</h2>
      <p className="text-sm text-muted-foreground">
        Your original recorded file is checked before download. If its reference
        cannot be resolved, today’s content is not substituted. Historical
        format, license and assessment facts are not inferred from the current
        listing.
      </p>
      {error && <p role="alert">The recorded file is unavailable. {error}</p>}
      <Button
        variant="outline"
        disabled={
          busy || item.recordedAccess !== "RECORDED" || !item.recordedUploadId
        }
        onClick={download}
      >
        Download original file
      </Button>
    </section>
  );
}
