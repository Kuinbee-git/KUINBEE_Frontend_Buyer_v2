"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  DatasetFileAccessContext,
  DatasetFileAccessPageQuery,
  DatasetFileObservationQuery,
} from "@kuinbee/dataset-preparation-contracts";
import {
  buyerDatasetApi,
  type BuyerFileAudience,
  type BuyerFilePage,
  type BuyerFileObservations,
} from "@/services/dataset-content.service";
import { useAuth } from "@/core/providers/AuthProvider";
import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { ContentFacts } from "./ContentDescription";
import { physicalBytes } from "./content-description";

export function BuyerFilePanel({
  audience,
  datasetId,
  contentId,
  publicationId,
}: {
  audience: BuyerFileAudience;
  datasetId: string;
  contentId: string;
  publicationId?: string;
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
        throw new Error(
          "This selected material changed. Refresh the listing or your recorded access before continuing."
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
        <p role="alert">{getErrorMessage(context.error)}</p>
        <Button variant="outline" onClick={() => void context.refetch()}>
          Refresh file access
        </Button>
      </div>
    );
  return (
    <FileInventory
      key={JSON.stringify([actorId, context.data])}
      audience={audience}
      context={context.data}
      actorId={actorId}
    />
  );
}
function FileInventory({
  audience,
  context,
  actorId,
}: {
  audience: BuyerFileAudience;
  context: DatasetFileAccessContext;
  actorId: string;
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
        Each download checks your current access and file security. ZIP entries
        are inspected references inside one physical file; they are not separate
        download rights.
      </p>
      {page.isPending ? (
        <p role="status">Loading selected files…</p>
      ) : page.isError ? (
        <p role="alert">{getErrorMessage(page.error)}</p>
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
}: {
  audience: BuyerFileAudience;
  actorId: string;
  context: DatasetFileAccessContext;
  member: BuyerFilePage["items"][number];
}) {
  const { user, isAuthenticated } = useAuth();
  const live = useRef(false),
    inFlight = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [observed, setObserved] = useState<{
    query: DatasetFileObservationQuery;
    page: BuyerFileObservations;
  } | null>(null);
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
      setError(getErrorMessage(problem));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  const inspect = (query: DatasetFileObservationQuery) =>
    perform(async () => {
      const page = await buyerDatasetApi.observations(
        audience,
        context.datasetId,
        query
      );
      assertCurrent();
      setObserved({ query, page });
    });
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
            {member.originalFileName ?? "File name not recorded"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {member.role.toLowerCase().replaceAll("_", " ")} ·{" "}
            {physicalBytes(member.measuredSizeBytes)}
          </p>
        </div>
        <Button variant="outline" disabled={busy} onClick={download}>
          Download {audience === "SAMPLE" ? "sample" : "file"}
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
      <details>
        <summary className="cursor-pointer text-sm font-medium">
          Format observations and file checks
        </summary>
        <div className="mt-4 space-y-3">
          <ContentFacts
            rows={[
              ["Recorded file security", member.inspection.securityState],
              ["Recorded check outcome", member.inspection.recordedOutcome],
              [
                "Recorded evidence is current",
                member.inspection.current ? "Yes" : "No",
              ],
              ["Path", member.relativePath],
            ]}
          />
          <p className="text-xs text-muted-foreground">
            Recorded checks do not establish current download eligibility.
            Format observations do not establish a domain, permitted use or
            unseen collection coverage.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() =>
                inspect({
                  ...exact,
                  evidenceId: member.membershipEvidenceId,
                  limit: 10,
                })
              }
            >
              Recorded format observations
            </Button>
            {member.inspection.currentEvidenceId &&
              member.inspection.currentEvidenceId !==
                member.membershipEvidenceId && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    inspect({
                      ...exact,
                      evidenceId: member.inspection.currentEvidenceId!,
                      limit: 10,
                    })
                  }
                >
                  Current format observations
                </Button>
              )}
          </div>
          {observed && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {observed.page.total} observations · backend observed ·{" "}
                {observed.page.evidenceRelationship
                  .toLowerCase()
                  .replaceAll("_", " ")}
              </p>
              <ul className="space-y-4">
                {observed.page.items.map((item) => (
                  <li key={item.id}>
                    <ContentFacts
                      rows={[
                        ["Inspection profile", item.profileId],
                        ["Inspection result", item.result],
                        ["Observed scope", item.scope],
                        [
                          "Measured size",
                          physicalBytes(item.measuredSizeBytes),
                        ],
                        ...Object.entries(item.facts).map(
                          ([key, value]) =>
                            [
                              key,
                              value === null ? "Not measured" : String(value),
                            ] as const
                        ),
                        ...(item.source.kind === "LOGICAL_ENTRY"
                          ? ([
                              [
                                "Archive entry identity",
                                item.source.logicalEntryId,
                              ],
                              [
                                "Archive entry locator",
                                JSON.stringify(item.source.locator),
                              ],
                            ] as const)
                          : []),
                      ]}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={busy || !observed.query.afterId}
                  onClick={() =>
                    inspect({ ...observed.query, afterId: undefined })
                  }
                >
                  First observation page
                </Button>
                <Button
                  variant="outline"
                  disabled={busy || !observed.page.nextCursor}
                  onClick={() => {
                    if (observed.page.nextCursor)
                      void inspect(observed.page.nextCursor);
                  }}
                >
                  Next observation page
                </Button>
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
