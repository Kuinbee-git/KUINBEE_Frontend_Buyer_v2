"use client";

import {
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  ChevronRight,
  CircleDashed,
  FileSpreadsheet,
  GitBranch,
  History,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  MessageSquare,
  Table2,
  Eraser,
  type LucideIcon,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import styles from "./StrotasWorkspacePreview.module.css";

type PreviewProps = { step: number; elapsed?: number };
type NodeState = "Complete" | "Proposed" | "Running" | "Ready" | "Pending";

const customerRows = [
  {
    company: "  Acme Ltd  ",
    clean: "Acme Ltd",
    date: "09/23/2026",
    iso: "2026-09-23",
    country: "IN",
  },
  {
    company: " Orion Labs",
    clean: "Orion Labs",
    date: "10/02/2026",
    iso: "2026-10-02",
    country: "GB",
  },
  {
    company: "Nova Data  ",
    clean: "Nova Data",
    date: "09/28/2026",
    iso: "2026-09-28",
    country: "US",
  },
];

function StrotasMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function State({ state }: { state: NodeState }) {
  const complete = state === "Complete";
  return (
    <span className={styles.state} data-state={state}>
      {complete ? (
        <Check size={12} aria-hidden="true" />
      ) : (
        <span className={styles.stateDot} />
      )}
      {complete ? "Success" : state}
    </span>
  );
}

function Node({
  icon: Icon,
  title,
  detail,
  kind,
  state,
  selected = false,
  proposed = false,
  position,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  kind: "Artifact" | "Tool";
  state?: NodeState;
  selected?: boolean;
  proposed?: boolean;
  position?: CSSProperties;
  compact?: boolean;
}) {
  return (
    <div
      className={`${styles.node} ${compact ? styles.compactNode : ""}`}
      style={position}
      data-kind={kind}
      data-selected={selected || undefined}
      data-proposed={proposed || undefined}
    >
      <span className={styles.nodePort} data-port="in" aria-hidden="true" />
      <span className={styles.nodePort} data-port="out" aria-hidden="true" />
      {(kind === "Artifact" || compact) && (
        <span
          className={styles.branchPort}
          data-port={compact ? "top" : "bottom"}
          aria-hidden="true"
        />
      )}
      <div className={styles.nodeTop}>
        <span className={styles.nodeIcon}>
          <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className={styles.nodeKind}>{kind}</span>
      </div>
      <strong className={styles.nodeTitle}>{title}</strong>
      <span className={styles.nodeDetail}>{detail}</span>
      {state && <State state={state} />}
    </div>
  );
}

function Chat({ step }: { step: number }) {
  const replies = [
    "The existing profile shows 3 rows and 3 columns. I can prepare the configuration.",
    "Two cleaning operations, followed by validation. Review the proposed plan.",
    "Plan approved for this demonstration. Cleaning and validation can now run.",
    "v2 passed all three checks. The original v1 is preserved.",
  ];
  return (
    <aside
      className={styles.chat}
      aria-label="Illustrative assistant conversation"
    >
      <div className={styles.panelTitle}>
        <MessageSquare size={15} aria-hidden="true" />
        <strong>Assistant</strong>
        <span className={styles.contextChip}>customer.csv</span>
      </div>
      <div className={styles.chatBody}>
        <div className={styles.userMessage}>
          <span className={styles.avatar} aria-hidden="true">
            Y
          </span>
          <div>
            <span className={styles.speaker}>You</span>
            <p>
              Trim company names and standardize signup dates in customer.csv.
            </p>
          </div>
        </div>
        <div className={styles.agentMessage}>
          <span className={styles.agentAvatar} aria-hidden="true">
            <StrotasMark />
          </span>
          <div>
            <span className={styles.speaker}>Strotas</span>
            <p key={step} className={styles.changedContent}>
              {replies[step]}
            </p>
          </div>
        </div>
        {step === 0 ? (
          <div className={styles.sourceSummary}>
            <div className={styles.sourceSummaryTitle}>
              Source context <span>v1</span>
            </div>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>CSV · UTF-8</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>3 rows × 3 columns</dd>
              </div>
              <div>
                <dt>Company names</dt>
                <dd>Whitespace found</dd>
              </div>
              <div>
                <dt>Date format</dt>
                <dd>MM/DD/YYYY</dd>
              </div>
            </dl>
            <p>Original preserved. No changes made.</p>
          </div>
        ) : (
          <div className={styles.planCard} data-visible>
            <div className={styles.planTitle}>
              <GitBranch size={14} aria-hidden="true" />
              <strong>{step < 2 ? "Proposed plan" : "Plan approved"}</strong>
              {step >= 2 && (
                <Check
                  size={13}
                  className={styles.successIcon}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className={styles.planStep}>
              <span>01</span>
              <div>
                <strong>Clean fields</strong>
                <p>Trim names · Standardize dates</p>
              </div>
            </div>
            <div className={styles.planStep}>
              <span>02</span>
              <div>
                <strong>Validate v2</strong>
                <p>Run the three configured checks</p>
              </div>
            </div>
            <div className={styles.planFooter}>
              <span>
                {step < 2
                  ? "Awaiting operator confirmation"
                  : "Operator confirmed"}
              </span>
              {step >= 2 ? (
                <Check size={13} aria-hidden="true" />
              ) : (
                <CircleDashed size={13} aria-hidden="true" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.chatContext}>
        <span className={styles.contextDot} />
        <span>
          {step === 0
            ? "Existing profile available"
            : step === 1
              ? "Nothing executed yet"
              : step === 2
                ? "Approved Execution"
                : "New version, full history"}
        </span>
      </div>
    </aside>
  );
}

function Canvas({ step }: { step: number }) {
  const cleaningState: NodeState =
    step === 0
      ? "Ready"
      : step === 1
        ? "Proposed"
        : step === 2
          ? "Running"
          : "Complete";
  const validationState: NodeState =
    step < 2 ? "Pending" : step === 2 ? "Ready" : "Complete";
  const selected =
    step === 0
      ? "Source selected"
      : step === 1
        ? "Cleaning configuration"
        : step === 2
          ? "Run in progress"
          : "Output selected";
  const source = (mobile = false) => (
    <Node
      icon={FileSpreadsheet}
      title="customer.csv"
      detail="v1 · 3 rows"
      kind="Artifact"
      selected={step === 0}
      position={mobile ? undefined : { left: "5%", top: "27%" }}
    />
  );
  const cleaning = (mobile = false) => (
    <Node
      icon={Eraser}
      title="Clean fields"
      detail="2 operations"
      kind="Tool"
      state={cleaningState}
      selected={step === 1 || step === 2}
      proposed={step === 1}
      position={mobile ? undefined : { left: "38%", top: "27%" }}
    />
  );
  const output = (mobile = false) => (
    <Node
      icon={Table2}
      title={step === 3 ? "customer.csv" : "Cleaned output"}
      detail={step === 3 ? "v2 · 3 rows" : "v2 · Not produced yet"}
      kind="Artifact"
      selected={step === 3}
      proposed={step < 3}
      position={mobile ? undefined : { left: "71%", top: "27%" }}
    />
  );
  const profile = (mobile = false) => (
    <Node
      icon={ScanLine}
      title="Profile"
      detail="Reads v1"
      kind="Tool"
      state="Complete"
      compact
      position={mobile ? undefined : { left: "5%", top: "70%" }}
    />
  );
  const validation = (mobile = false) => (
    <Node
      icon={ShieldCheck}
      title="Validate"
      detail="Reads v2"
      kind="Tool"
      state={validationState}
      compact
      proposed={step === 1}
      position={mobile ? undefined : { left: "71%", top: "70%" }}
    />
  );
  return (
    <div
      className={styles.canvas}
      aria-label="Illustrative pipeline graph: source v1 flows through Cleaning to output v2; Profile reads v1 and Validate reads v2"
    >
      <div className={styles.canvasTitle}>
        <span>
          <GitBranch size={14} aria-hidden="true" />
          <strong>Pipeline canvas</strong>
        </span>
        <span className={styles.canvasSelection}>{selected}</span>
      </div>
      <div className={styles.graphDesktop} data-run={step === 2}>
        <span
          className={`${styles.horizontalConnection} ${styles.sourceConnection}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.horizontalConnection} ${styles.outputConnection}`}
          data-pending={step < 3}
          aria-hidden="true"
        />
        <span
          className={`${styles.verticalConnection} ${styles.profileConnection}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.verticalConnection} ${styles.validationConnection}`}
          data-pending={step < 3}
          aria-hidden="true"
        />
        <span className={`${styles.edgeLabel} ${styles.sourceEdge}`}>v1</span>
        <span className={`${styles.edgeLabel} ${styles.outputEdge}`}>
          {step === 3 ? "v2" : "output"}
        </span>
        {source()}
        {cleaning()}
        {output()}
        {profile()}
        {validation()}
        <span className={styles.graphNote}>
          <span />
          {step < 2
            ? "One configurable workflow"
            : "Inputs bound to specific versions"}
        </span>
      </div>
      <div className={styles.graphMobile}>
        <div className={styles.mobileBranch}>
          {source(true)}
          <span className={styles.branchConnection} aria-hidden="true" />
          <div className={styles.mobileBranchNode}>{profile(true)}</div>
        </div>
        <span className={styles.mobileConnection}>
          <ArrowDown size={12} aria-hidden="true" />
          <span>v1</span>
        </span>
        <div className={styles.mobileMainNode}>{cleaning(true)}</div>
        <span className={styles.mobileConnection}>
          <ArrowDown size={12} aria-hidden="true" />
          <span>{step === 3 ? "v2" : "output"}</span>
        </span>
        <div className={styles.mobileBranch}>
          {output(true)}
          <span className={styles.branchConnection} aria-hidden="true" />
          <div className={styles.mobileBranchNode}>{validation(true)}</div>
        </div>
      </div>
    </div>
  );
}

function ProfileInspector() {
  return (
    <>
      <div className={styles.inspectorHeading}>
        <span className={styles.inspectorEyebrow}>Source / v1</span>
        <h3>Dataset Passport</h3>
        <span className={styles.existingProfile}>
          <Check size={12} aria-hidden="true" />
          Existing profile
        </span>
      </div>
      <div className={styles.datasetStats}>
        <div>
          <span>Rows</span>
          <strong>3</strong>
        </div>
        <div>
          <span>Columns</span>
          <strong>3</strong>
        </div>
        <div>
          <span>Nulls</span>
          <strong>0</strong>
        </div>
      </div>
      <div className={styles.inspectorSection}>
        <div className={styles.sectionTitle}>
          <Braces size={14} aria-hidden="true" />
          <strong>Column profiles</strong>
        </div>
        <div className={styles.columnProfile}>
          <code>company_name</code>
          <span>String</span>
          <p>Leading / trailing whitespace</p>
        </div>
        <div className={styles.columnProfile}>
          <code>signup_date</code>
          <span>String</span>
          <p>MM/DD/YYYY</p>
        </div>
        <div className={styles.columnProfile}>
          <code>country</code>
          <span>String</span>
          <p>Two-letter codes</p>
        </div>
      </div>
    </>
  );
}

function ConfigurationInspector({ running }: { running: boolean }) {
  return (
    <>
      <div className={styles.inspectorHeading}>
        <span className={styles.inspectorEyebrow}>Cleaning / config 01</span>
        <h3>{running ? "Executing the plan" : "Tool configuration"}</h3>
        <span className={styles.configBadge}>
          {running ? (
            <Check size={12} aria-hidden="true" />
          ) : (
            <SlidersHorizontal size={12} aria-hidden="true" />
          )}
          {running ? "Plan approved" : "Proposed · 2 operations"}
        </span>
      </div>
      <div className={styles.operation}>
        <div className={styles.operationTitle}>
          <span>01</span>
          <strong>Trim whitespace</strong>
          {running && (
            <Check
              size={13}
              className={styles.successIcon}
              aria-hidden="true"
            />
          )}
        </div>
        <code>company_name</code>
        <dl>
          <div>
            <dt>Sides</dt>
            <dd>Both</dd>
          </div>
        </dl>
      </div>
      <div className={styles.operation}>
        <div className={styles.operationTitle}>
          <span>02</span>
          <strong>Standardize dates</strong>
          {running && (
            <span className={styles.tinySpinner} aria-hidden="true" />
          )}
        </div>
        <code>signup_date</code>
        <dl>
          <div>
            <dt>Input</dt>
            <dd>MM/DD/YYYY</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>ISO 8601</dd>
          </div>
        </dl>
      </div>
      <div className={styles.configNote}>
        <ShieldCheck size={14} aria-hidden="true" />
        <span>Validate the output against three configured checks.</span>
      </div>
    </>
  );
}

function OutputInspector() {
  return (
    <>
      <div className={styles.inspectorHeading}>
        <span className={styles.inspectorEyebrow}>Output / v2</span>
        <h3>Validated output</h3>
        <span className={styles.passedBadge}>
          <Check size={12} aria-hidden="true" />3 checks passed
        </span>
      </div>
      <div className={styles.validationChecks}>
        <div>
          <Check size={13} aria-hidden="true" />
          <span>Company name required</span>
        </div>
        <div>
          <Check size={13} aria-hidden="true" />
          <span>Signup date · ISO 8601</span>
        </div>
        <div>
          <Check size={13} aria-hidden="true" />
          <span>Country · 2 characters</span>
        </div>
      </div>
      <div className={styles.inspectorSection}>
        <div className={styles.sectionTitle}>
          <History size={14} aria-hidden="true" />
          <strong>Version history</strong>
        </div>
        <div className={styles.versionRow}>
          <code>v2</code>
          <span>Cleaned</span>
          <span className={styles.activeBadge}>Active</span>
        </div>
        <div className={styles.versionRow}>
          <code>v1</code>
          <span>Original</span>
          <span>Preserved</span>
        </div>
      </div>
      <div className={styles.lineageSection}>
        <div className={styles.sectionTitle}>
          <GitBranch size={14} aria-hidden="true" />
          <strong>Lineage</strong>
        </div>
        <div className={styles.lineage}>
          <code>v1</code>
          <ArrowRight size={12} aria-hidden="true" />
          <span>Cleaning</span>
          <ArrowRight size={12} aria-hidden="true" />
          <code>v2</code>
        </div>
      </div>
    </>
  );
}

function Inspector({ step }: { step: number }) {
  return (
    <aside
      className={styles.inspector}
      aria-label="Selected source, configuration or output details"
    >
      <div className={styles.panelTitle}>
        <SlidersHorizontal size={14} aria-hidden="true" />
        <strong>Inspector</strong>
        <span className={styles.detailTag}>
          {step === 0 ? "Source" : step === 3 ? "Output" : "Cleaning"}
        </span>
      </div>
      <div className={styles.inspectorBody} key={step}>
        {step === 0 ? (
          <ProfileInspector />
        ) : step === 3 ? (
          <OutputInspector />
        ) : (
          <ConfigurationInspector running={step === 2} />
        )}
      </div>
    </aside>
  );
}

function DataPreview({ step }: { step: number }) {
  const [view, setView] = useState<"data" | "schema" | "activity">("data");
  const complete = step === 3;
  return (
    <div
      className={styles.dataPreview}
      aria-label={
        complete
          ? "Cleaned output version 2 with original version 1 preserved"
          : "Original customer data version 1"
      }
    >
      <div className={styles.dataHeading}>
        <div
          className={styles.dataTabs}
          role="group"
          aria-label="Inspect dataset details"
        >
          {(
            [
              ["data", "Data preview"],
              ["schema", "Schema"],
              ["activity", "Activity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className={styles.dataMeta}>
          {complete ? (
            <>
              <Check size={12} aria-hidden="true" />3 rows preserved
            </>
          ) : (
            "Illustrative sample · 3 rows"
          )}
        </span>
      </div>
      {view === "data" && (
        <table>
          <thead>
            <tr>
              <th className={styles.rowIndex} scope="col">
                <span className={styles.srOnly}>Row</span>#
              </th>
              <th scope="col">
                <span>company_name</span>
                <span className={styles.typeLabel}>String</span>
              </th>
              <th scope="col">
                <span>signup_date</span>
                <span className={styles.typeLabel}>String</span>
              </th>
              <th scope="col">
                <span>country</span>
                <span className={styles.typeLabel}>String</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {customerRows.map((row, index) => (
              <tr key={row.clean}>
                <td className={styles.rowIndex}>{index + 1}</td>
                <td
                  className={styles.changedCell}
                  data-changed={complete || undefined}
                >
                  <code key={complete ? "clean" : "raw"}>
                    {complete ? row.clean : row.company}
                  </code>
                  {complete && <Check size={11} aria-hidden="true" />}
                </td>
                <td
                  className={styles.changedCell}
                  data-changed={complete || undefined}
                >
                  <code key={complete ? "iso" : "raw"}>
                    {complete ? row.iso : row.date}
                  </code>
                  {complete && <Check size={11} aria-hidden="true" />}
                </td>
                <td>
                  <code>{row.country}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {view === "schema" && (
        <table
          className={styles.schemaTable}
          aria-label="Customer dataset schema"
        >
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Type</th>
              <th scope="col">Validation rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>company_name</code>
              </td>
              <td>String</td>
              <td>Required</td>
            </tr>
            <tr>
              <td>
                <code>signup_date</code>
              </td>
              <td>String</td>
              <td>ISO 8601</td>
            </tr>
            <tr>
              <td>
                <code>country</code>
              </td>
              <td>String</td>
              <td>Two characters</td>
            </tr>
          </tbody>
        </table>
      )}
      {view === "activity" && (
        <div
          className={styles.activityLog}
          aria-label="Illustrative execution activity"
        >
          <div>
            <span>01</span>
            <strong>Source profiled</strong>
            <code>customer.csv · v1</code>
            <span data-complete>Complete</span>
          </div>
          <div>
            <span>02</span>
            <strong>{step < 2 ? "Execution plan" : "Clean fields"}</strong>
            <code>
              {step < 2
                ? "Awaiting approval"
                : "Trim names · Standardize dates"}
            </code>
            <span data-complete={complete || undefined}>
              {complete ? "Complete" : step === 2 ? "Running" : "Pending"}
            </span>
          </div>
          <div>
            <span>03</span>
            <strong>Validate output</strong>
            <code>
              {complete ? "3 checks passed · v2" : "3 configured checks"}
            </code>
            <span data-complete={complete || undefined}>
              {complete ? "Complete" : "Pending"}
            </span>
          </div>
        </div>
      )}
      <div className={styles.datasetFooter}>
        <span>
          <span className={styles.stateDot} />
          {complete
            ? "Output v2 · Original v1 retained"
            : "Original v1 · Read-only preview"}
        </span>
        <span>
          3 rows<span className={styles.footerSeparator}>/</span>3 columns
        </span>
      </div>
    </div>
  );
}

export function StrotasWorkspacePreview({ step: requestedStep }: PreviewProps) {
  const step = Math.max(0, Math.min(3, Math.trunc(requestedStep)));
  const runLabel =
    step === 0
      ? "Ready"
      : step === 1
        ? "Plan proposed"
        : step === 2
          ? "Running"
          : "Succeeded";
  return (
    <div
      className={styles.workspace}
      role="group"
      aria-label="Strotas illustrative product preview: chat, configurable pipeline canvas, node inspector and versioned data"
      data-strotas-step={step}
      data-testid="strotas-workspace-preview"
    >
      <div className={styles.toolbar}>
        <div className={styles.workspaceBrand}>
          <StrotasMark />
          <strong>Strotas</strong>
          <span className={styles.toolbarDivider} />
          <span className={styles.projectName}>Customer data preparation</span>
        </div>
        <span className={styles.previewLabel}>Product preview</span>
      </div>
      <div className={styles.projectToolbar}>
        <div className={styles.breadcrumb}>
          <span>Workspace</span>
          <ChevronRight size={12} aria-hidden="true" />
          <strong>Customer preparation</strong>
        </div>
        <div className={styles.runControls}>
          <span className={styles.authority}>
            <ShieldCheck size={12} aria-hidden="true" />
            Approved Execution
          </span>
          <span
            className={styles.runStatus}
            data-running={step === 2 || undefined}
            data-complete={step === 3 || undefined}
          >
            {step === 3 ? (
              <Check size={12} aria-hidden="true" />
            ) : (
              <span className={styles.stateDot} />
            )}
            {runLabel}
          </span>
        </div>
      </div>
      <div className={styles.workSurface}>
        <Chat step={step} />
        <Canvas step={step} />
        <Inspector step={step} />
      </div>
      <DataPreview step={step} />
    </div>
  );
}
