import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Database,
  FileJson2,
  GitBranch,
  GitMerge,
  Layers3,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import styles from "./StrotasDataScenes.module.css";

const sampleRows = [
  { id: "CUS_001", amount: "124.00", country: "IN" },
  { id: "CUS_002", amount: "86.50", country: "GB" },
];

function Scene({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.scene} role="group" aria-label={label}>
      <div className={styles.sceneLabel}>
        <span className={styles.labelDot} />
        <span>{title}</span>
        <span className={styles.exampleLabel}>Illustrative workflow</span>
      </div>
      {children}
    </div>
  );
}

function Connection() {
  return (
    <div className={styles.connection} aria-hidden="true">
      <span />
      <ArrowRight size={17} />
    </div>
  );
}

function Fields({ canonical = false }: { canonical?: boolean }) {
  return (
    <dl className={styles.fieldList}>
      <div className={styles.changedField}>
        <dt>
          <code>{canonical ? "customer_id" : "customer_ref"}</code>
        </dt>
        <dd>string</dd>
      </div>
      <div>
        <dt>
          <code>order_total</code>
        </dt>
        <dd>decimal</dd>
      </div>
      <div>
        <dt>
          <code>country</code>
        </dt>
        <dd>string</dd>
      </div>
    </dl>
  );
}

export function SchemaMappingScene() {
  return (
    <Scene
      title="Version-specific mapping"
      label="Illustrative version-specific mapping from a changed source field to a consistent canonical target"
    >
      <div className={styles.mappingGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <FileJson2 size={17} />
            <strong>Source</strong>
            <span className={styles.badge}>NEW VERSION</span>
          </div>
          <div className={styles.sourceRename}>
            <code>customerId</code>
            <ArrowRight size={14} aria-hidden="true" />
            <code>customer_ref</code>
          </div>
          <Fields />
        </div>
        <Connection />
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <GitMerge size={17} />
            <strong>Mapping</strong>
          </div>
          <div className={styles.mappingBody}>
            <div className={styles.mappingPair}>
              <code>customer_ref</code>
              <ArrowRight size={15} aria-hidden="true" />
              <code>customer_id</code>
            </div>
            <span className={styles.quietLabel}>
              Bound to this source version
            </span>
          </div>
        </div>
        <Connection />
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <Layers3 size={17} />
            <strong>Canonical</strong>
            <span className={styles.badge}>SCHEMA v1</span>
          </div>
          <div className={styles.schemaIdentity}>
            <code>customers</code>
            <LockKeyhole size={13} aria-hidden="true" />
          </div>
          <Fields canonical />
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <GitBranch size={14} />
        <span>New mapping. New data version. Original version preserved.</span>
      </div>
    </Scene>
  );
}

export function ApprovalFlowScene() {
  return (
    <Scene
      title="Supervised workflow"
      label="Illustrative supervised workflow in which a person reviews the AI proposal before execution; permissions are configurable"
    >
      <div className={styles.approvalGrid}>
        <div className={[styles.panel, styles.proposalPanel].join(" ")}>
          <div className={styles.panelHeading}>
            <Sparkles size={17} />
            <strong>Proposed plan</strong>
            <span className={styles.badge}>AI-ASSISTED</span>
          </div>
          <ol className={styles.planList}>
            <li>
              <span>01</span>
              <div>
                <strong>Map fields</strong>
                <code>customer_ref → customer_id</code>
              </div>
              <GitMerge size={18} aria-hidden="true" />
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Normalise values</strong>
                <code>india → IN</code>
              </div>
              <Layers3 size={18} aria-hidden="true" />
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Validate</strong>
                <code>customer_id · country</code>
              </div>
              <ShieldCheck size={18} aria-hidden="true" />
            </li>
          </ol>
        </div>
        <Connection />
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <UserRound size={17} />
            <strong>Human review</strong>
            <span className={styles.badge}>BEFORE EXECUTION</span>
          </div>
          <div className={styles.reviewBody}>
            <span className={styles.featureIcon}>
              <UserRound size={30} strokeWidth={1.3} />
            </span>
            <strong>Approval required</strong>
            <div
              className={styles.reviewOptions}
              role="group"
              aria-label="Possible review decisions"
            >
              <span>Accept</span>
              <span>Revise</span>
              <span>Decline</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <LockKeyhole size={14} />
        <span>Supervised example · Permissions are configurable.</span>
      </div>
    </Scene>
  );
}

export function QualityGateScene() {
  const records = [
    { sequence: "01", id: "CUS_001", country: "IN", amount: "124.00" },
    { sequence: "02", id: "CUS_002", country: "GB", amount: "86.50" },
    { sequence: "03", id: "missing", country: "US", amount: "210.00" },
  ];
  return (
    <Scene
      title="Validation report"
      label="Illustrative validation report: two sample records meet the rules, but a missing required field blocks the whole dataset version"
    >
      <div className={styles.qualityGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <FileJson2 size={17} />
            <strong>Record evidence</strong>
            <span className={styles.badge}>3 RECORDS</span>
          </div>
          <div className={styles.records}>
            {records.map((record) => (
              <div
                key={record.sequence}
                className={[
                  styles.record,
                  record.id === "missing" ? styles.failedRecord : "",
                ].join(" ")}
              >
                <div className={styles.recordHeader}>
                  <span>RECORD {record.sequence}</span>
                  {record.id === "missing" ? (
                    <CircleAlert size={13} />
                  ) : (
                    <Check size={13} />
                  )}
                </div>
                <code className={styles.recordId}>{record.id}</code>
                <div className={styles.recordValues}>
                  <code>{record.country}</code>
                  <code>{record.amount}</code>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.recordLegend}>
            <code>customer_id · country · order_total</code>
          </div>
        </div>
        <Connection />
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <ShieldCheck size={17} />
            <strong>Rules</strong>
          </div>
          <dl className={styles.ruleList}>
            <div>
              <dt>
                <code>customer_id</code>
              </dt>
              <dd>Required</dd>
            </div>
            <div>
              <dt>
                <code>country</code>
              </dt>
              <dd>Two letters</dd>
            </div>
            <div>
              <dt>
                <code>order_total</code>
              </dt>
              <dd>Numeric</dd>
            </div>
          </dl>
          <div className={styles.ruleSeverity}>
            Required-field severity: block
          </div>
        </div>
        <Connection />
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <Database size={17} />
            <strong>Version status</strong>
          </div>
          <div className={styles.resultBody}>
            <strong className={styles.blockedLabel}>BLOCKED</strong>
            <code>03 · customer_id missing</code>
            <span className={styles.quietLabel}>
              The whole version is blocked.
            </span>
          </div>
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <CircleAlert size={14} />
        <span>
          Resolve the required-field issue before this version can proceed.
        </span>
      </div>
    </Scene>
  );
}

export function PublishedAssetScene() {
  return (
    <Scene
      title="Versioned output"
      label="An independent illustrative validated dataset version with a Dataset Passport, separate source lineage, and configured drift monitoring"
    >
      <div className={styles.outputGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <Database size={17} />
            <strong>customers.canonical</strong>
            <span className={styles.badge}>DATASET v1 · SCHEMA v1</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.datasetTable}>
              <caption>Separate example · Validated dataset version</caption>
              <thead>
                <tr>
                  <th scope="col">
                    customer_id <small>string</small>
                  </th>
                  <th scope="col">
                    order_total <small>decimal</small>
                  </th>
                  <th scope="col">
                    country <small>string</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.amount}</td>
                    <td>{row.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <Layers3 size={17} />
            <strong>Dataset Passport</strong>
          </div>
          <ul className={styles.passportFacts}>
            <li>
              <Check size={14} /> Field definitions
            </li>
            <li>
              <Check size={14} /> Column profiles
            </li>
            <li>
              <Check size={14} /> Validation results
            </li>
            <li>
              <Check size={14} /> Schema &amp; drift findings
            </li>
          </ul>
        </div>
      </div>
      <div
        className={styles.lineageTrail}
        role="group"
        aria-label="Separate lineage trail: source version, mapping, canonical version, exported copy"
      >
        <span>
          <FileJson2 size={14} /> Source version
        </span>
        <Connection />
        <span>
          <GitMerge size={14} /> Mapping
        </span>
        <Connection />
        <span>
          <Layers3 size={14} /> Canonical version
        </span>
        <Connection />
        <span>
          <Database size={14} /> Exported copy
        </span>
      </div>
      <div className={styles.sceneFooter}>
        <Radar size={14} />
        <span>
          Configured monitoring · Schema drift &amp; outdated dependencies
        </span>
      </div>
    </Scene>
  );
}
