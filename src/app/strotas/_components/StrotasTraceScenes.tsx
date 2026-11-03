import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleDot,
  Columns3,
  FileDown,
  FileSpreadsheet,
  GitBranch,
  GitMerge,
  History,
  LockKeyhole,
  ScanEye,
  ShieldCheck,
  Eraser,
  UserRound,
} from "lucide-react";
import styles from "./StrotasTraceScenes.module.css";

type SceneName = "lineage" | "review";

function Scene({
  name,
  title,
  children,
  label,
}: {
  name: SceneName;
  title: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <div
      className={`${styles.scene} ${styles[name]}`}
      data-strotas-feature-scene={name}
      role="group"
      aria-label={label}
    >
      <div className={styles.chrome}>
        <span className={styles.chromeTitle}>
          {name === "lineage" ? (
            <GitBranch size={15} aria-hidden="true" />
          ) : (
            <ScanEye size={15} aria-hidden="true" />
          )}
          {title}
        </span>
        <span className={styles.previewLabel}>
          Illustrative product preview
        </span>
      </div>
      {children}
    </div>
  );
}

function Artifact({
  name,
  version,
  original = false,
  active = false,
  children,
}: {
  name: string;
  version: string;
  original?: boolean;
  active?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${styles.artifact} ${original ? styles.original : ""} ${active ? styles.activeArtifact : ""}`}
    >
      <div className={styles.artifactTop}>
        <FileSpreadsheet size={18} strokeWidth={1.5} aria-hidden="true" />
        <span className={styles.version}>{version}</span>
      </div>
      <strong>{name}</strong>
      {children && <div className={styles.artifactDetail}>{children}</div>}
      {original && (
        <span className={styles.preserved}>
          <LockKeyhole size={10} aria-hidden="true" />
          Original kept
        </span>
      )}
    </div>
  );
}

function SourceLane({ month, sample }: { month: string; sample: string }) {
  return (
    <div className={styles.sourceLane}>
      <Artifact name={`${month} orders.csv`} version="v1" original>
        <span className={styles.rawValue}>␣{sample}␣</span>
      </Artifact>
      <div className={styles.cleanStep}>
        <span className={styles.toolIcon}>
          <Eraser size={14} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span>Clean</span>
        <ArrowRight size={13} aria-hidden="true" />
      </div>
      <Artifact name={`${month} orders`} version="v2">
        <span className={styles.cleanValue}>{sample}</span>
      </Artifact>
    </div>
  );
}

function ExportJob({ file, source }: { file: string; source: string }) {
  return (
    <div className={styles.exportJob}>
      <span className={styles.exportIcon}>
        <FileDown size={19} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div>
        <strong>{file}</strong>
        <span>Export job · reads {source}</span>
      </div>
      <Check size={13} aria-hidden="true" />
    </div>
  );
}

export function LineageFeatureScene() {
  return (
    <Scene
      name="lineage"
      title="Trace the result"
      label="Illustrative artifact lineage. April and May original order files are preserved as version 1. Cleaning creates version 2 of each artifact. Stitch combines both into Combined orders version 1. One branch transforms field names in Report data version 1 and exports XLSX; another exports Combined orders version 1 as CSV. Export jobs read versions without creating data versions. A separate activity row identifies operator and tool actions."
    >
      <div className={styles.lineageIntro}>
        <span>
          <CircleDot size={13} aria-hidden="true" />
          Selected result
        </span>
        <strong>orders-report.xlsx</strong>
        <span className={styles.traceTag}>Source → change → result</span>
      </div>
      <div className={styles.lineageGraph}>
        <svg
          className={styles.graphConnections}
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M 355 71 C 406 71 414 150 456 150" />
          <path d="M 355 229 C 406 229 414 150 456 150" />
          <path
            className={styles.selectedConnection}
            d="M 634 150 C 674 150 671 72 714 72"
          />
          <path d="M 634 150 C 674 150 671 242 714 242" />
          <circle cx="456" cy="150" r="3" />
          <circle cx="634" cy="150" r="3" />
          <circle className={styles.traceDot} cx="700" cy="79" r="4" />
        </svg>
        <div className={styles.sources}>
          <span className={styles.stageLabel}>
            Two sources. Both preserved.
          </span>
          <SourceLane month="April" sample="Acme Ltd" />
          <SourceLane month="May" sample="Orion Labs" />
        </div>
        <div className={styles.joined}>
          <span className={styles.mobileMerge} aria-hidden="true">
            <ArrowDown size={18} />
          </span>
          <span className={styles.toolBadge}>
            <GitMerge size={15} aria-hidden="true" />
            Stitch
          </span>
          <Artifact name="Combined orders" version="v1">
            <div className={styles.combinedRows}>
              <span>Acme Ltd</span>
              <span>Orion Labs</span>
            </div>
            <span className={styles.artifactNote}>April + May</span>
          </Artifact>
        </div>
        <div className={styles.branches}>
          <div className={styles.reportBranch}>
            <div className={styles.branchHeading}>
              <span className={styles.toolBadge}>
                <Columns3 size={14} aria-hidden="true" />
                Shape report
              </span>
              <span>Selected branch</span>
            </div>
            <Artifact name="Report data" version="v1" active>
              <div className={styles.reportField}>
                <span>customer</span>
                <strong>Acme Ltd</strong>
                <strong>Orion Labs</strong>
              </div>
            </Artifact>
            <span className={styles.exportArrow} aria-hidden="true">
              <ArrowDown size={15} />
            </span>
            <ExportJob file="orders-report.xlsx" source="Report v1" />
          </div>
          <div className={styles.csvBranch}>
            <span className={styles.branchLabel}>
              <GitBranch size={12} aria-hidden="true" />
              Another result, same source
            </span>
            <ExportJob file="combined-orders.csv" source="Combined v1" />
          </div>
        </div>
      </div>
      <div className={styles.fieldTrace}>
        <div className={styles.traceHeading}>
          <Columns3 size={16} aria-hidden="true" />
          <span>Run configuration · Shape report</span>
          <span className={styles.mappingLabel}>
            Rename fields · Values retained
          </span>
        </div>
        <div className={styles.renameFields}>
          <div className={styles.renameField}>
            <span>customer_name</span>
            <ArrowRight size={15} aria-hidden="true" />
            <strong>customer</strong>
          </div>
          <div className={styles.renameField}>
            <span>total</span>
            <ArrowRight size={15} aria-hidden="true" />
            <strong>amount</strong>
          </div>
        </div>
      </div>
      <div className={styles.activity}>
        <div className={styles.activityHeading}>
          <History size={14} aria-hidden="true" />
          <span>Who did what</span>
          <span>Audit record</span>
        </div>
        <div className={styles.activityItems}>
          <div>
            <UserRound size={14} aria-hidden="true" />
            <span>
              <strong>Operator</strong> approved the plan
            </span>
          </div>
          <div>
            <Eraser size={14} aria-hidden="true" />
            <span>
              <strong>Cleaning tool</strong> created April v2
            </span>
          </div>
          <div>
            <FileDown size={14} aria-hidden="true" />
            <span>
              <strong>Export tool</strong> exported Report v1
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

const baselineFields = [
  { name: "order_id", type: "text" },
  { name: "customer_name", type: "text" },
  { name: "total", type: "number" },
];

function SchemaCard({ current = false }: { current?: boolean }) {
  return (
    <div
      className={`${styles.schemaCard} ${current ? styles.currentSchema : styles.baselineSchema}`}
    >
      <div className={styles.schemaHeading}>
        <span className={styles.schemaIcon}>
          <FileSpreadsheet size={19} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <strong>Orders</strong>
          <span>{current ? "New upload" : "Baseline"}</span>
        </div>
        <span className={styles.schemaVersion}>{current ? "v2" : "v1"}</span>
      </div>
      <div className={styles.schemaColumnLabels}>
        <span>Field</span>
        <span>Type</span>
      </div>
      <div className={styles.schemaFields}>
        {baselineFields.map((field) =>
          current && field.name === "customer_name" ? (
            <div className={styles.missingField} key={field.name}>
              <span className={styles.emptyFieldIcon} aria-hidden="true">
                −
              </span>
              <span>customer_name missing</span>
            </div>
          ) : (
            <div
              className={`${styles.schemaField} ${field.name === "customer_name" ? styles.removedField : ""}`}
              key={field.name}
            >
              <span>{field.name}</span>
              <span>{field.type}</span>
            </div>
          )
        )}
      </div>
      <div className={styles.schemaFooter}>
        <Columns3 size={12} aria-hidden="true" />
        {current ? "2 fields in this version" : "3 fields in this version"}
      </div>
    </div>
  );
}

export function ReviewFeatureScene() {
  return (
    <Scene
      name="review"
      title="Understand what changed"
      label="Illustrative schema drift review. Orders version 2 was newly ingested and lacks the customer_name field present in baseline version 1. A configured schema drift policy creates a pending review. The Review Assistant uses baseline, current version, and prior review context to explain the missing field. It does not accept the change or alter the data; the operator's decision is pending."
    >
      <div className={styles.reviewIntro}>
        <span className={styles.reviewSignal}>
          <ScanEye size={15} aria-hidden="true" />
          Schema changed
        </span>
        <span className={styles.policyLabel}>
          <ShieldCheck size={13} aria-hidden="true" />
          Configured review policy
        </span>
      </div>
      <div className={styles.reviewComposition}>
        <div className={styles.schemaComparison}>
          <SchemaCard />
          <div className={styles.schemaDifference} aria-hidden="true">
            <ArrowRight size={18} />
            <span>1 field removed</span>
          </div>
          <SchemaCard current />
        </div>
        <div className={styles.reviewPanel}>
          <div className={styles.reviewPanelHeading}>
            <div>
              <strong>Review assistant</strong>
              <span>Explains the change</span>
            </div>
          </div>
          <div className={styles.reviewAnnotation}>
            <span className={styles.annotationLabel}>Missing field</span>
            <strong>customer_name</strong>
            <p>
              Customer names are missing from v2. Check the source before using
              it in your report.
            </p>
          </div>
          <div className={styles.reviewState}>
            <span>
              Severity <strong>Review</strong>
            </span>
            <span>
              <span className={styles.pendingDot} />
              Pending review
            </span>
          </div>
        </div>
      </div>
      <div className={styles.contextAssembly}>
        <div className={styles.contextHeading}>
          <GitBranch size={15} aria-hidden="true" />
          <strong>Advice with context</strong>
          <span>Grounded in this pipeline</span>
        </div>
        <div className={styles.contextCards}>
          <div>
            <FileSpreadsheet size={17} aria-hidden="true" />
            <span>
              Baseline<strong>Orders · v1</strong>
            </span>
            <Check size={12} aria-hidden="true" />
          </div>
          <div>
            <CircleDot size={17} aria-hidden="true" />
            <span>
              Current version<strong>Orders · v2</strong>
            </span>
            <Check size={12} aria-hidden="true" />
          </div>
          <div>
            <History size={17} aria-hidden="true" />
            <span>
              History<strong>Prior review retained</strong>
            </span>
            <Check size={12} aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className={styles.decisionBoundary}>
        <span className={styles.decisionIcon}>
          <UserRound size={17} aria-hidden="true" />
        </span>
        <div>
          <strong>Decision pending.</strong>
          <span>Data unchanged.</span>
        </div>
        <span>
          <LockKeyhole size={12} aria-hidden="true" />
          You decide what happens next
        </span>
      </div>
    </Scene>
  );
}
