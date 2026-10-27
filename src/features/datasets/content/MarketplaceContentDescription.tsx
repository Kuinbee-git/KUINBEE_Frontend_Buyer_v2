import type { ReactNode } from "react";
import {
  Beaker,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import {
  formatDatasetGeographicCoverage,
  formatDatasetCollectionPeriod,
  isDatasetPreparationProfileFieldApplicable,
  type DatasetPublicDescription,
  type DatasetPreparationProfiles,
} from "@kuinbee/dataset-preparation-contracts";
import { ContentFacts, DescribedValues } from "./ContentDescription";
import {
  declaredMeasurement,
  measurementScopeLabels,
} from "./content-description";

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

const profileLabel = (name: string) =>
  name === "cad"
    ? "CAD"
    : name.replace(/^./, (character) => character.toUpperCase());

export function MarketplaceContentDescription({
  description,
}: {
  description: DatasetPublicDescription;
}) {
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
      {Object.entries(description.profiles).map(([name, profile]) => (
        <details key={name} open={name === "cad"} className={datasetPanelClass}>
          <summary className="cursor-pointer font-semibold text-foreground dark:text-white">
            {profileLabel(name)} details · provider declared
          </summary>
          <div className="mt-5">
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
      <DatasetDetailSection title="Collection and Sample Coverage">
        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed mb-5">
          Collection quantities and coverage are provided by the supplier. The
          sample is a subset of the collection.
        </p>
        <div className="space-y-5">
          {description.measurements
            .filter((group) =>
              group.values.some((value) => value.state !== "UNKNOWN")
            )
            .map((group) => (
              <div key={group.scope}>
                <h3 className="text-sm font-semibold mb-1">
                  {measurementScopeLabels[group.scope]}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  {group.values
                    .filter((value) => value.state !== "UNKNOWN")
                    .map(declaredMeasurement)
                    .join(" · ")}
                </p>
              </div>
            ))}
          {description.sample && (
            <div className="border-t border-border/40 dark:border-white/10 pt-5">
              <h3 className="text-sm font-semibold mb-4">
                How the sample represents the collection
              </h3>
              <DescribedValues value={description.sample} />
            </div>
          )}
          {description.fullCompleteness !== null && (
            <p className="text-sm text-muted-foreground">
              Full material declared complete for this collection:{" "}
              {description.fullCompleteness ? "Yes" : "No"}
            </p>
          )}
        </div>
      </DatasetDetailSection>
      <DatasetDetailSection title="Location and Coverage">
        <ContentFacts
          rows={[
            [
              "Geographic coverage",
              formatDatasetGeographicCoverage(description.geographicCoverage),
            ],
            [
              "Collection period",
              formatDatasetCollectionPeriod(description.collectionPeriod),
            ],
            ...(description.contexts.length
              ? [
                  [
                    "Capture and domain context",
                    description.contexts
                      .map((value) =>
                        value === "HEALTHCARE"
                          ? "Healthcare"
                          : "First-person / egocentric capture"
                      )
                      .join(", "),
                  ] as const,
                ]
              : []),
            ...(description.studyStructure
              ? [
                  [
                    "Statistical study structure",
                    description.studyStructure,
                  ] as const,
                ]
              : []),
          ]}
        />
      </DatasetDetailSection>
      <DatasetDetailSection title="Source and License">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {description.sourceAtFreeze.name}
            </h3>
            {description.sourceAtFreeze.description && (
              <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                {description.sourceAtFreeze.description}
              </p>
            )}
            {description.sourceAtFreeze.websiteUrl && (
              <a
                href={description.sourceAtFreeze.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                Visit Website
              </a>
            )}
          </div>
          <div className="border-t border-border/40 dark:border-white/10 pt-5">
            <ContentFacts
              rows={[
                ["License", description.license],
                [
                  "Source verification",
                  description.sourceAtFreeze.isVerifiedAtFreeze
                    ? "Recorded as verified"
                    : "Not recorded as verified",
                ],
              ]}
            />
          </div>
        </div>
      </DatasetDetailSection>
    </div>
  );
}
