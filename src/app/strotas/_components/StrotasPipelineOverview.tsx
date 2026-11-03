import styles from "./StrotasPipelineOverview.module.css";

export const pipelineStages = [
  {
    name: "Ingest",
    title: "Connect your sources",
    description:
      "Bring data into one workflow while keeping the original intact.",
    details: [
      "Files, databases and APIs",
      "Scheduled or event-driven inputs",
      "Original data preserved",
    ],
  },
  {
    name: "Profile",
    title: "Understand the data",
    description:
      "Inspect structure and quality before deciding what to change.",
    details: [
      "Column types and cardinality",
      "Nulls and distributions",
      "Outlier patterns",
    ],
  },
  {
    name: "Map",
    title: "Align the schema",
    description: "Map changing source fields to a consistent target structure.",
    details: [
      "Explicit field mappings",
      "Version-specific bindings",
      "A shared canonical schema",
    ],
  },
  {
    name: "Transform",
    title: "Shape the output",
    description:
      "Review the proposed operations and approve the plan before it runs.",
    details: [
      "Clean and normalize fields",
      "Join and reshape datasets",
      "AI-assisted configuration",
    ],
  },
  {
    name: "Validate",
    title: "Check every result",
    description:
      "Test the output against your rules and inspect failures before moving on.",
    details: [
      "Required fields and types",
      "Explicit quality rules",
      "Visible check results",
    ],
  },
  {
    name: "Publish",
    title: "Prepare trusted assets",
    description:
      "Make reviewed, versioned outputs available for downstream work.",
    details: [
      "Versioned datasets",
      "Documented schemas",
      "Controlled delivery",
    ],
  },
  {
    name: "Monitor",
    title: "See what changes",
    description:
      "Compare incoming data with a baseline and investigate its downstream impact.",
    details: [
      "Schema and value changes",
      "Freshness and volume",
      "Traceable impact review",
    ],
  },
];

export function StrotasPipelineOverview() {
  return (
    <div className={styles.workspace} data-strotas-pipeline-overview>
      <div className={styles.toolbar}>
        <span>
          <strong>Strotas</strong>
          <span className={styles.divider}>/</span>Pipeline overview
        </span>
        <span className={styles.preview}>Product preview</span>
      </div>
      <div className={styles.flow} aria-label="Pipeline stages">
        {pipelineStages.map((stage, index) => (
          <span key={stage.name}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            {stage.name}
          </span>
        ))}
      </div>
      <div className={styles.stages}>
        {pipelineStages.map((stage, index) => (
          <div key={stage.name} className={styles.stage}>
            <p className={styles.label}>
              {String(index + 1).padStart(2, "0")}
              <span>{stage.name}</span>
            </p>
            <h3>{stage.title}</h3>
            <p className={styles.description}>{stage.description}</p>
            <ul>
              {stage.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        Your sources. Your rules. A traceable path to the output.
      </div>
    </div>
  );
}
