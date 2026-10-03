/** Illustrative sourcing metadata, not a patient record or available listing. */
export const healthcareExampleRecord = {
  reference: "DEMO-014",
  fields: [
    { label: "Join key", value: "Case + visit ID" },
    { label: "Files", value: "Report + JSON" },
    { label: "Timing", value: "Visit timestamp" },
  ],
  note: "Check the linking method and field dictionary.",
} as const;

export const healthcareExampleBrief = [
  {
    label: "Population",
    value: "Adults · outpatient imaging",
    detail: "Define age range and care setting.",
  },
  {
    label: "Records",
    value: "Images + linked reports",
    detail: "Specify case and visit connections.",
  },
  {
    label: "Labels",
    value: "Label guide + review method",
    detail: "Confirm definitions and annotation scope.",
  },
  {
    label: "Delivery",
    value: "Files + manifest",
    detail: "Request formats, dictionary, and access terms.",
  },
] as const;

export const healthcareStoryChapters = [
  {
    id: "context",
    label: "Context",
    title: "The scan is only the beginning.",
    description:
      "An image comes from a particular method, device, and care setting. Compare the acquisition details and represented population before deciding whether a collection fits your project.",
    fields: [
      { label: "Acquisition", value: "Method, body region, and protocol" },
      { label: "Coverage", value: "Population, sites, and devices" },
    ],
    questions: [
      "Which acquisition methods, sites, and devices are represented?",
      "Does the population and care setting match your intended use?",
    ],
  },
  {
    id: "linkage",
    label: "Linkage",
    title: "Keep each record connected.",
    description:
      "A scan, its report, and a later visit are different records. If your project needs them together, inspect the linking method, available dates, and documentation of missing or unmatched records.",
    fields: [
      { label: "Connections", value: "Case and visit identifiers" },
      { label: "Timing", value: "Event dates and follow-up coverage" },
    ],
    questions: [
      "How do images, reports, and visits connect to the same case?",
      "How are missing records and unavailable follow-up documented?",
    ],
  },
  {
    id: "brief",
    label: "Brief",
    title: "Source the evidence your model needs.",
    description:
      "On Kuinbee, compare published datasets and supplier collection services, or submit a specific requirement for review. Define the population, records, labels, and delivery needs—and confirm the relevant usage and access conditions.",
    fields: [
      { label: "Compare", value: "Coverage, labels, and deliverables" },
      { label: "Confirm", value: "Usage rights and access conditions" },
    ],
    questions: [
      "Can an existing collection cover the data and connections you need?",
      "Which requirements need a supplier collection or a custom brief?",
    ],
  },
] as const;

export type HealthcareStoryChapter = (typeof healthcareStoryChapters)[number];
