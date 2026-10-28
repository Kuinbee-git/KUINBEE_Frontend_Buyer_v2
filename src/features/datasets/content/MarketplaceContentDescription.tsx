import type { ReactNode } from "react";
import { Beaker, CheckCircle2, Lightbulb, TriangleAlert } from "lucide-react";
import {
  formatDatasetGeographicCoverage,
  formatDatasetCollectionPeriod,
  type DatasetPublicDescription,
  type DatasetPreparationProfiles,
} from "@kuinbee/dataset-preparation-contracts";
import { ContentFacts, DescribedValues } from "./ContentDescription";
import { buyerProfileFields } from "./buyer-profile-fields";
import { declaredMeasurement } from "./content-description";

export const datasetPanelClass =
  "bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5 sm:p-6 shadow-sm";

export function DatasetDetailSection({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28">
      <h2 className="text-lg font-semibold text-foreground dark:text-white mb-4">
        {title}
      </h2>
      <div className={datasetPanelClass}>{children}</div>
    </section>
  );
}

const fieldLabels: Record<string, string> = {
  formatNotes: "File formats",
  unitNotes: "Units and scale",
  assemblyStructure: "Assembly structure",
  nativeSourceAvailability: "Native CAD files",
  parametricHistoryAvailability: "Feature history",
  annotationAvailability: "Annotations",
  annotationMeaning: "Annotation details",
  dictionaryAvailability: "Data dictionary",
  columnMeaningNotes: "Column descriptions",
  alignmentNotes: "Transcript alignment",
  channelNotes: "Sensor readings",
  calibrationAvailability: "Calibration",
  calibrationMeaning: "Calibration details",
  transcriptAvailability: "Transcripts",
  transcriptMeaning: "Transcript details",
};
const profileLabel = (name: string) =>
  ({ cad: "CAD", images: "Image", sensors: "Sensor" })[
    name as "cad" | "images" | "sensors"
  ] ?? name.replace(/^./, (character) => character.toUpperCase());

export function MarketplaceContentDescription({
  description,
}: {
  description: DatasetPublicDescription;
}) {
  const profiles = Object.entries(description.profiles)
    .map(([name, profile]) => ({
      name,
      values: buyerProfileFields(
        name as keyof DatasetPreparationProfiles,
        profile
      ),
    }))
    .filter((profile) => Object.keys(profile.values).length > 0);
  const coverageRows = [
    ...(description.geographicCoverage?.state === "KNOWN"
      ? [
          [
            "Geographic coverage",
            formatDatasetGeographicCoverage(description.geographicCoverage),
          ] as const,
        ]
      : []),
    ...(description.collectionPeriod?.state === "KNOWN"
      ? [
          [
            "Collection period",
            formatDatasetCollectionPeriod(description.collectionPeriod),
          ] as const,
        ]
      : []),
    ...(description.contexts.length
      ? [
          [
            "Data context",
            description.contexts
              .map((value) =>
                value === "HEALTHCARE" ? "Healthcare" : "First-person capture"
              )
              .join(", "),
          ] as const,
        ]
      : []),
    ...(description.studyStructure
      ? [
          [
            "Study structure",
            description.studyStructure.toLowerCase().replaceAll("_", " "),
          ] as const,
        ]
      : []),
  ];
  const measurements = description.measurements.filter((group) =>
    group.values.some((value) => value.state !== "UNKNOWN")
  );
  const sampleRows = description.sample
    ? [
        ["Sample contents", description.sample.coverage],
        ["Sample selection", description.sample.selectionMethod],
        ["Not included", description.sample.omissionNotes],
      ].filter(
        (row): row is [string, string] =>
          typeof row[1] === "string" && row[1].trim().length > 0
      )
    : [];
  return (
    <div className="space-y-8" data-content-description>
      <DatasetDetailSection title="About This Dataset">
        <div className="space-y-5 text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
          <p className="whitespace-pre-wrap">{description.description}</p>
          <div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">
              Collection Scope
            </h3>
            <p className="whitespace-pre-wrap">
              {description.collectionBoundary}
            </p>
          </div>
          {[
            {
              title: "Data Quality",
              value: description.dataQuality,
              icon: CheckCircle2,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              title: "Use Cases",
              value: description.useCases,
              icon: Lightbulb,
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              title: "Limitations",
              value: description.limitations,
              icon: TriangleAlert,
              color: "text-orange-600 dark:text-orange-400",
            },
            {
              title: "Methodology",
              value: description.methodology,
              icon: Beaker,
              color: "text-blue-600 dark:text-blue-400",
            },
          ].map(({ title, value, icon: Icon, color }) =>
            value ? (
              <div key={title}>
                <h3 className="flex items-center gap-2 font-semibold text-foreground dark:text-white mb-2">
                  <Icon className={`size-4 shrink-0 ${color}`} />
                  {title}
                </h3>
                <p className="whitespace-pre-wrap">{value}</p>
              </div>
            ) : null
          )}
        </div>
      </DatasetDetailSection>
      {profiles.map(({ name, values }) => (
        <details key={name} open={name === "cad"} className={datasetPanelClass}>
          <summary className="cursor-pointer font-semibold text-foreground dark:text-white">
            {profileLabel(name)} specifications
          </summary>
          <div className="mt-5">
            <ContentFacts
              rows={Object.entries(values).map(([field, value]) => [
                fieldLabels[field] ??
                  field
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/^./, (character) => character.toUpperCase()),
                <DescribedValues
                  key={field}
                  profile={name}
                  field={field}
                  value={value}
                />,
              ])}
            />
          </div>
        </details>
      ))}
      {(sampleRows.length > 0 || measurements.length > 0) && (
        <DatasetDetailSection title="Sample and Coverage">
          <div className="space-y-5">
            {measurements.map((group) => (
              <div key={group.scope}>
                <h3 className="text-sm font-semibold mb-1">
                  {group.scope === "REPRESENTED_COLLECTION"
                    ? "Collection size"
                    : group.scope === "SAMPLE_MATERIAL"
                      ? "Sample size"
                      : "Full dataset size"}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  {group.values
                    .filter((value) => value.state !== "UNKNOWN")
                    .map(declaredMeasurement)
                    .join(" · ")}
                </p>
              </div>
            ))}
            {sampleRows.length > 0 && <ContentFacts rows={sampleRows} />}
          </div>
        </DatasetDetailSection>
      )}
      {coverageRows.length > 0 && (
        <DatasetDetailSection title="Location and Coverage">
          <ContentFacts rows={coverageRows} />
        </DatasetDetailSection>
      )}
    </div>
  );
}
