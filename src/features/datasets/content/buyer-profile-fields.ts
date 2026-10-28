import {
  isDatasetPreparationProfileFieldApplicable,
  type DatasetPreparationProfiles,
} from "@kuinbee/dataset-preparation-contracts";

// Explicit buyer-facing fields. New preparation/admin fields never become UI by enumeration.
const fields: Record<keyof DatasetPreparationProfiles, readonly string[]> = {
  cad: [
    "formatNotes",
    "assemblyStructure",
    "unitNotes",
    "nativeSourceAvailability",
    "parametricHistoryAvailability",
    "annotationAvailability",
    "annotationMeaning",
  ],
  tabular: [
    "recordUnit",
    "columnMeaningNotes",
    "unitNotes",
    "missingValueConventions",
    "tableRelationshipNotes",
    "dictionaryAvailability",
  ],
  audio: [
    "content",
    "languages",
    "recordingContext",
    "transcriptAvailability",
    "transcriptMeaning",
    "transcriptTiming",
    "annotationAvailability",
    "annotationMeaning",
    "speakerCoverage",
    "alignmentNotes",
  ],
  images: [
    "subject",
    "captureContext",
    "annotationAvailability",
    "annotationMeaning",
    "classDefinitions",
    "coverage",
  ],
  video: [
    "content",
    "viewpoint",
    "audioContext",
    "annotationAvailability",
    "annotationMeaning",
    "timingConvention",
    "annotationReferences",
  ],
  text: [
    "recordUnit",
    "languageContent",
    "languages",
    "annotationAvailability",
    "annotationMeaning",
    "recordConvention",
  ],
  sensors: [
    "channels",
    "channelNotes",
    "sessionRelationships",
    "timestampMeaning",
    "timeOrigin",
    "synchronization",
    "synchronizationNotes",
    "calibrationAvailability",
    "calibrationMeaning",
    "coordinateConventions",
  ],
  egocentric: ["mounting", "activities", "environment", "additionalStreams"],
  healthcare: [
    "recordMeaning",
    "setting",
    "identifierHandling",
    "participantCoverage",
  ],
};
const placeholder = new Set(["UNKNOWN", "NOT_APPLICABLE", "NO_CLAIM"]);
export function buyerProfileFields(
  name: keyof DatasetPreparationProfiles,
  profile: Record<string, unknown>
) {
  return Object.fromEntries(
    fields[name]
      .filter((field) => {
        const value = profile[field];
        return (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(
            typeof value === "string" &&
            placeholder.has(value) &&
            field !== "transcriptTiming" &&
            field !== "annotationReferences"
          ) &&
          !(Array.isArray(value) && !value.length) &&
          isDatasetPreparationProfileFieldApplicable(name, field, profile)
        );
      })
      .map((field) => [field, profile[field]])
  );
}
