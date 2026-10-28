"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  DatasetFileAccessContext,
  DatasetFileAccessPageQuery,
} from "@kuinbee/dataset-preparation-contracts";
import {
  buyerDatasetApi,
  BuyerDatasetError,
  type BuyerFileAudience,
  type BuyerFilePage,
} from "@/services/dataset-content.service";
import { useAuth } from "@/core/providers/AuthProvider";
import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { physicalBytes } from "./content-description";
import { TableMetadataPanel } from "./TableMetadataPanel";

const changedFileCodes = new Set([
  "DRAFT_CHANGED",
  "PUBLICATION_CHANGED",
  "CONTENT_CHANGED",
  "REVIEW_CHANGED",
]);
function fileErrorCode(error: unknown): string | undefined {
  return error && typeof error === "object" && "code" in error
    ? String(error.code)
    : undefined;
}
function FileError({
  error,
  onReload,
}: {
  error: unknown;
  onReload?: () => void;
}) {
  const code = fileErrorCode(error);
  const changed = Boolean(code && changedFileCodes.has(code));
  const message = changed
    ? "The dataset has changed. Reload it before downloading."
    : code === "OBJECT_NOT_ACCEPTED" || code === "INSPECTION_NOT_QUALIFIED"
      ? "This file is temporarily unavailable. Please try again later."
      : getErrorMessage(error);
  return (
    <div className="space-y-3">
      <p role="alert" className="text-sm text-destructive">
        {message}
      </p>
      {changed && onReload && (
        <Button variant="outline" onClick={onReload}>
          Reload dataset
        </Button>
      )}
    </div>
  );
}

export function BuyerFilePanel({
  audience,
  datasetId,
  contentId,
  publicationId,
  onReload,
  showTableMetadata = true,
}: {
  audience: BuyerFileAudience;
  datasetId: string;
  contentId: string;
  publicationId?: string;
  onReload?: () => void;
  showTableMetadata?: boolean;
}) {
  const { user, isAuthenticated } = useAuth();
  const actorId = isAuthenticated ? user?.id : undefined;
  const selection =
    audience === "SAMPLE"
      ? { scope: "PUBLISHED" as const, component: "SAMPLE" as const }
      : { scope: "GRANTED" as const, component: "FULL" as const };
  const context = useQuery({
    queryKey: [
      "dataset-file-context",
      actorId,
      audience,
      datasetId,
      contentId,
      publicationId,
    ],
    enabled: Boolean(actorId),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async ({ signal }) => {
      const result = await buyerDatasetApi.fileContext(
        audience,
        datasetId,
        selection,
        signal
      );
      if (
        result.contentId !== contentId ||
        (audience === "SAMPLE" && result.publicationId !== publicationId)
      )
        throw new BuyerDatasetError(
          "The dataset has changed. Reload it before downloading.",
          "PUBLICATION_CHANGED",
          409
        );
      return result;
    },
  });
  if (!actorId)
    return (
      <p className="text-sm text-muted-foreground">
        Sign in to view available{" "}
        {audience === "SAMPLE" ? "sample" : "owned Dataset"} files.
      </p>
    );
  if (context.isPending) return <p role="status">Checking file access…</p>;
  if (context.isError)
    return (
      <div className="space-y-3">
        <FileError error={context.error} onReload={onReload} />
        {!changedFileCodes.has(fileErrorCode(context.error) ?? "") && (
          <Button variant="outline" onClick={() => void context.refetch()}>
            Retry file access
          </Button>
        )}
      </div>
    );
  return (
    <FileInventory
      key={JSON.stringify([actorId, context.data])}
      audience={audience}
      context={context.data}
      actorId={actorId}
      onReload={onReload}
      showTableMetadata={showTableMetadata}
    />
  );
}
function FileInventory({
  audience,
  context,
  actorId,
  onReload,
  showTableMetadata,
}: {
  audience: BuyerFileAudience;
  context: DatasetFileAccessContext;
  actorId: string;
  onReload?: () => void;
  showTableMetadata: boolean;
}) {
  const [cursors, setCursors] = useState<Array<string | undefined>>([
    undefined,
  ]);
  const query: DatasetFileAccessPageQuery = {
    scope: context.scope,
    component: context.component,
    contentId: context.contentId,
    contentGeneration: context.contentGeneration,
    ...(context.workflowRevision === null
      ? {}
      : { expectedWorkflowRevision: context.workflowRevision }),
    afterId: cursors.at(-1),
    limit: 20,
  };
  const page = useQuery({
    queryKey: [
      "dataset-reader-files",
      actorId,
      audience,
      context.datasetId,
      query,
    ],
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: ({ signal }) =>
      buyerDatasetApi.files(audience, context.datasetId, query, signal),
  });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Download all available{" "}
        {audience === "SAMPLE" ? "sample" : "owned Dataset"} files together as a
        ZIP, or choose an individual file. Folder paths are preserved.
      </p>
      <BundleDownload
        audience={audience}
        context={context}
        actorId={actorId}
        onReload={onReload}
      />
      {page.isPending ? (
        <p role="status">Loading selected files…</p>
      ) : page.isError ? (
        <FileError error={page.error} onReload={onReload} />
      ) : (
        <>
          <p className="text-sm">
            {page.data.total}{" "}
            {audience === "SAMPLE" ? "sample" : "owned full material"}{" "}
            {page.data.total === 1 ? "file" : "files"}
          </p>
          <ul className="divide-y divide-border">
            {page.data.items.map((member) => (
              <li key={member.id} className="py-4">
                <ReaderFile
                  audience={audience}
                  actorId={actorId}
                  context={context}
                  member={member}
                  onReload={onReload}
                  showTableMetadata={showTableMetadata}
                />
              </li>
            ))}
          </ul>
          {!page.data.items.length && <p>No selected files are recorded.</p>}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              disabled={cursors.length === 1}
              onClick={() => setCursors((value) => value.slice(0, -1))}
            >
              Previous file page
            </Button>
            <span className="text-sm">Page {cursors.length}</span>
            <Button
              variant="outline"
              disabled={!page.data.nextCursor}
              onClick={() => {
                const next = page.data.nextCursor;
                if (next) setCursors((value) => [...value, next.afterId]);
              }}
            >
              Next file page
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
function ReaderFile({
  audience,
  actorId,
  context,
  member,
  onReload,
  showTableMetadata,
}: {
  audience: BuyerFileAudience;
  actorId: string;
  context: DatasetFileAccessContext;
  member: BuyerFilePage["items"][number];
  onReload?: () => void;
  showTableMetadata: boolean;
}) {
  const { user, isAuthenticated } = useAuth();
  const live = useRef(false),
    inFlight = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null);
  useLayoutEffect(() => {
    live.current = isAuthenticated && user?.id === actorId;
    return () => {
      live.current = false;
    };
  }, [actorId, isAuthenticated, user?.id]);
  const exact = {
    scope: context.scope,
    component: context.component,
    contentId: context.contentId,
    contentGeneration: context.contentGeneration,
    ...(context.workflowRevision === null
      ? {}
      : { expectedWorkflowRevision: context.workflowRevision }),
    memberId: member.id,
  };
  function assertCurrent() {
    if (!live.current)
      throw new Error("Sign in again before requesting these files.");
  }
  async function perform(task: () => Promise<void>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      assertCurrent();
      await task();
    } catch (problem) {
      setError(problem);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  const download = () =>
    perform(async () => {
      const result = await buyerDatasetApi.download(
        audience,
        context.datasetId,
        { ...exact, downloadIntentId: crypto.randomUUID() }
      );
      assertCurrent();
      if (Date.parse(result.expiresAt) <= Date.now())
        throw new Error("The link expired. Request a fresh download.");
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  return (
    <div className="space-y-3 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-medium break-words">
            {member.relativePath ??
              member.originalFileName ??
              "File name not recorded"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {physicalBytes(member.measuredSizeBytes)}
          </p>
        </div>
        <Button variant="outline" disabled={busy} onClick={download}>
          Download file
        </Button>
      </div>
      {showTableMetadata && (
        <TableMetadataPanel
          sourceKey={JSON.stringify([actorId, audience, context, member.id])}
          enabled={isAuthenticated && user?.id === actorId}
          load={(filters, signal) =>
            buyerDatasetApi.tableMetadata(
              audience,
              context.datasetId,
              { ...filters, ...exact, limit: filters.limit },
              signal
            )
          }
        />
      )}
      {error ? <FileError error={error} onReload={onReload} /> : null}
    </div>
  );
}

function BundleDownload({
  audience,
  context,
  actorId,
  onReload,
}: {
  audience: BuyerFileAudience;
  context: DatasetFileAccessContext;
  actorId: string;
  onReload?: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const current = useRef(false),
    inFlight = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null);
  useLayoutEffect(() => {
    current.current = isAuthenticated && user?.id === actorId;
    return () => {
      current.current = false;
    };
  }, [actorId, isAuthenticated, user?.id]);
  async function download() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      if (!current.current) throw Error("Sign in again before downloading.");
      const bundle = await buyerDatasetApi.bundle(audience, context.datasetId, {
        scope: context.scope,
        component: context.component,
        contentId: context.contentId,
        contentGeneration: context.contentGeneration,
        ...(context.workflowRevision === null
          ? {}
          : { expectedWorkflowRevision: context.workflowRevision }),
        downloadIntentId: crypto.randomUUID(),
      });
      if (!current.current)
        throw Error("Your account changed. Request the download again.");
      const link = document.createElement("a");
      link.href = bundle.url;
      link.download = bundle.fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (failure) {
      setError(failure);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="space-y-2">
      <Button disabled={busy} onClick={() => void download()}>
        {busy
          ? "Preparing download…"
          : audience === "SAMPLE"
            ? "Download sample"
            : "Download all files"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Your browser shows download progress. If it is interrupted, retry the
        download or choose individual files.
      </p>
      {error ? <FileError error={error} onReload={onReload} /> : null}
    </div>
  );
}
