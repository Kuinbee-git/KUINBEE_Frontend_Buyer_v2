import type { ReactNode } from "react";
import {
  formatDatasetGeographicCoverage,
  formatDatasetCollectionPeriod,
  isDatasetPreparationProfileFieldApplicable,
  type DatasetPublicDescription,
  type DatasetPreparationProfiles,
} from "@kuinbee/dataset-preparation-contracts";
import {
  contentChoiceLabel,
  contentModalityLabels,
  declaredMeasurement,
  measurementScopeLabels,
} from "./content-description";

export function ContentFacts({
  rows,
}: {
  rows: ReadonlyArray<readonly [string, ReactNode]>;
}) {
  return (
    <dl className="grid gap-x-5 gap-y-3 text-sm sm:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0 break-words whitespace-pre-wrap">
            {value === null || value === undefined || value === ""
              ? "Not specified"
              : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
const label = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (char) => char.toUpperCase());
const profileEnumLabels: Record<string, Record<string, string>> = {
  "audio.transcriptTiming": {
    UNTIMED: "Untimed transcripts",
    TIMED: "Timed transcripts",
    UNKNOWN: "Timing not assessed",
  },
  "video.annotationReferences": {
    WHOLE_ITEM: "Whole clips or items",
    TIME_OR_FRAME: "Times or frames within a video",
    UNKNOWN: "References not assessed",
  },
  "text.languageContent": {
    HUMAN_LANGUAGE: "Human language",
    NON_LANGUAGE: "Other content, such as codes or numbers",
    MIXED: "Human language and other content",
    UNKNOWN: "Unknown",
  },
};
function DescribedValues({
  value,
  profile,
  field,
}: {
  value: unknown;
  profile?: string;
  field?: string;
}) {
  if (value === null || value === undefined) return <span>Not specified</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value !== "object") {
    const options = profileEnumLabels[`${profile}.${field}`],
      raw = String(value);
    return (
      <span>{options && Object.hasOwn(options, raw) ? options[raw] : raw}</span>
    );
  }
  if (Array.isArray(value))
    return value.length ? (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index}>
            <DescribedValues value={item} />
          </li>
        ))}
      </ul>
    ) : (
      <span>None specified</span>
    );
  return (
    <ContentFacts
      rows={Object.entries(value).map(([key, child]) => [
        label(key),
        <DescribedValues
          key={key}
          value={child}
          profile={profile}
          field={key}
        />,
      ])}
    />
  );
}
export function ContentDescription({
  description,
}: {
  description: DatasetPublicDescription;
}) {
  return (
    <div className="space-y-6" data-content-description>
      <ContentFacts
        rows={[
          ["What is uploaded", contentChoiceLabel(description.uploadChoice)],
          [
            "Main types of data",
            contentModalityLabels(description.modalities).join(", "),
          ],
          ["Collection boundary", description.collectionBoundary],
          [
            "Geographic coverage · supplier declared",
            formatDatasetGeographicCoverage(description.geographicCoverage),
          ],
          [
            "Collection or capture period · supplier declared",
            formatDatasetCollectionPeriod(description.collectionPeriod),
          ],
          ["Overview", description.overview],
          ["Description", description.description],
          ["Quality statement", description.dataQuality],
          ["License", description.license],
          [
            "Primary category at submission",
            description.categoriesAtFreeze.primary.name,
          ],
          [
            "Other categories at submission",
            description.categoriesAtFreeze.additional
              .map((item) => item.name)
              .join(", ") || "None specified",
          ],
          ["Source at submission", description.sourceAtFreeze.name],
          ...(description.sourceAtFreeze.description
            ? ([
                [
                  "Source description at submission",
                  description.sourceAtFreeze.description,
                ],
              ] as const)
            : []),
          ...(description.sourceAtFreeze.websiteUrl
            ? ([
                [
                  "Source website at submission",
                  description.sourceAtFreeze.websiteUrl,
                ],
              ] as const)
            : []),
          [
            "Source verification at submission",
            description.sourceAtFreeze.isVerifiedAtFreeze
              ? "Recorded as verified"
              : "Not recorded as verified",
          ],
          ...(description.contexts.length
            ? ([
                [
                  "Capture and domain context",
                  description.contexts
                    .map((value) =>
                      value === "HEALTHCARE"
                        ? "Healthcare"
                        : "First-person / egocentric capture"
                    )
                    .join(", "),
                ],
              ] as const)
            : []),
          ...(description.studyStructure
            ? ([
                ["Statistical study structure", description.studyStructure],
              ] as const)
            : []),
          ...(description.methodology
            ? ([["Methodology", description.methodology]] as const)
            : []),
          ...(description.limitations
            ? ([["Known limitations", description.limitations]] as const)
            : []),
          ...(description.useCases
            ? ([["Possible uses", description.useCases]] as const)
            : []),
        ]}
      />
      <section className="border-t border-border pt-5 space-y-3">
        <h3 className="font-semibold">Collection and uploaded material</h3>
        <p className="text-sm text-muted-foreground">
          Quantities below are supplier declarations. A displayed sample does
          not establish the coverage of unseen full material.
        </p>
        {description.measurements.map((group) => (
          <div key={group.scope}>
            <h4 className="text-sm font-medium">
              {measurementScopeLabels[group.scope]} · supplier declared
            </h4>
            <p className="text-sm text-muted-foreground">
              {group.values.length
                ? group.values.map(declaredMeasurement).join(" · ")
                : "No quantities declared"}
            </p>
          </div>
        ))}
        {description.fullCompleteness !== null && (
          <p className="text-sm">
            Full material declared complete for this defined collection
            boundary: {description.fullCompleteness ? "Yes" : "No"}
          </p>
        )}
        {description.sample && (
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              How the sample represents the collection
            </summary>
            <div className="mt-3">
              <DescribedValues value={description.sample} />
            </div>
          </details>
        )}
      </section>
      {Object.entries(description.profiles).map(([name, profile]) => (
        <details key={name} className="border-t border-border pt-4">
          <summary className="cursor-pointer font-medium">
            {label(name)} details · supplier declared
          </summary>
          <div className="mt-4">
            <DescribedValues
              profile={name}
              value={Object.fromEntries(
                Object.entries(profile).filter(([field]) =>
                  isDatasetPreparationProfileFieldApplicable(
                    name as keyof DatasetPreparationProfiles,
                    field,
                    profile
                  )
                )
              )}
            />
          </div>
        </details>
      ))}
    </div>
  );
}
