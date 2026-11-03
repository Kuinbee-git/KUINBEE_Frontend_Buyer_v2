import {
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  Combine,
  FileDown,
  FileSpreadsheet,
  GitBranch,
  History,
  Layers3,
  ListChecks,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  Eraser,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import styles from "./StrotasAgentScenes.module.css";

function Scene({
  name,
  label,
  children,
}: {
  name: "agents" | "workflow";
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.scene}
      data-strotas-feature-scene={name}
      role="group"
      aria-label={label}
    >
      <div className={styles.chrome}>
        <span>
          <GitBranch size={17} strokeWidth={1.5} aria-hidden="true" />
          Monthly orders
        </span>
        <span>Illustrative product preview</span>
      </div>
      {children}
    </div>
  );
}

function ContextCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.contextCard}>
      <span className={styles.contextIcon}>
        <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  );
}

function Specialist({
  name,
  task,
  children,
  reason,
}: {
  name: string;
  task: string;
  children: ReactNode;
  reason: string;
}) {
  return (
    <div className={styles.specialist}>
      <span className={styles.specialistPort} aria-hidden="true" />
      <strong>{name}</strong>
      <span className={styles.specialistTask}>{task}</span>
      <div className={styles.specialistConfig}>{children}</div>
      <p>{reason}</p>
      <span className={styles.proposedLabel}>Configuration proposed</span>
    </div>
  );
}

export function AgentPlanningScene() {
  return (
    <Scene
      name="agents"
      label="Illustrative planning preview. An operator asks to combine April and May orders. The Planning Agent reads dataset passports, past decisions and source history, and coordinates Cleaning, Stitching and Transformation specialists to propose a plan. In this Approved Execution example, deterministic tools run only after operator approval. No data is being changed in this preview."
    >
      <div className={styles.planningBoard}>
        <div className={styles.planningInput}>
          <div className={styles.requestCard}>
            <span className={styles.eyebrow}>Your request</span>
            <p>Combine monthly orders into one consistent report.</p>
            <div className={styles.requestFiles}>
              <span>
                <FileSpreadsheet size={13} aria-hidden="true" />
                April
              </span>
              <span>
                <FileSpreadsheet size={13} aria-hidden="true" />
                May
              </span>
            </div>
          </div>
          <div className={styles.contextStack}>
            <span className={styles.contextHeading}>With your context</span>
            <ContextCard icon={ScanLine} title="Dataset passport">
              <p>Two files. Same fields.</p>
              <span className={styles.contextFields}>
                order_id · customer_name · total
              </span>
            </ContextCard>
            <ContextCard icon={History} title="Past decisions">
              <p>Keep order IDs unchanged.</p>
            </ContextCard>
            <ContextCard icon={Layers3} title="Source history">
              <p>April and May originals preserved.</p>
            </ContextCard>
          </div>
        </div>

        <div className={styles.planningTeam}>
          <div className={styles.planner}>
            <div>
              <span>Coordinates the specialists</span>
              <strong>Planning agent</strong>
            </div>
            <span className={styles.plannerContext}>Context informed</span>
          </div>
          <div className={styles.teamConnections} aria-hidden="true">
            <i className={styles.teamStem} />
            <i className={styles.teamBus} />
            <i className={styles.teamBranch} />
            <i className={styles.teamBranch} />
            <i className={styles.teamBranch} />
          </div>
          <div className={styles.specialists}>
            <Specialist
              name="Cleaning"
              task="Trim customer names"
              reason="Remove extra spaces; keep every row."
            >
              <span className={styles.fieldChip}>customer_name</span>
              <span className={styles.settingLine}>
                <span>Trim</span>
                <strong>Both sides</strong>
              </span>
            </Specialist>
            <Specialist
              name="Stitching"
              task="Combine the months"
              reason="Stack both months. Keep every row."
            >
              <span className={styles.monthPair}>
                <span>April</span>
                <span>+</span>
                <span>May</span>
              </span>
              <span className={styles.settingLine}>
                <span>Rows</span>
                <strong>Keep all</strong>
              </span>
            </Specialist>
            <Specialist
              name="Transformation"
              task="Shape the report"
              reason="Rename fields; keep their values."
            >
              <span className={styles.smallMapping}>
                <span>customer_name</span>
                <ArrowDown size={13} aria-hidden="true" />
                <strong>customer</strong>
              </span>
              <span className={styles.settingLine}>
                <span>total</span>
                <span>→ amount</span>
              </span>
            </Specialist>
          </div>
          <div className={styles.teamCaption}>
            AI proposes the settings. Tools perform the work.
          </div>
        </div>

        <div className={styles.planResult}>
          <div className={styles.planResultHeading}>
            <span className={styles.eyebrow}>Proposed plan</span>
            <span className={styles.planCount}>3 steps</span>
          </div>
          <div className={styles.planSteps}>
            <div>
              <span>01</span>
              <strong>Clean each month</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Combine the rows</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Shape the report</strong>
            </div>
          </div>
          <div className={styles.reportShape}>
            <span>
              <FileSpreadsheet size={16} strokeWidth={1.5} aria-hidden="true" />
              Proposed report
            </span>
            <div>
              <strong>order_id</strong>
              <span>Unchanged</span>
            </div>
            <div>
              <strong>customer</strong>
              <span>From customer_name</span>
            </div>
            <div>
              <strong>amount</strong>
              <span>From total</span>
            </div>
          </div>
          <div className={styles.approvalPanel}>
            <ShieldCheck size={21} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <strong>You approve first.</strong>
              <span>Tools wait for your review.</span>
            </div>
            <span
              className={styles.authority}
              aria-label="Approved Execution in this illustrative workflow"
            >
              In this workflow
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

type FlowNodeProps = {
  icon: LucideIcon;
  title: ReactNode;
  detail: string;
  kind: "Data" | "Tool" | "Export job";
  version?: string;
  selected?: boolean;
  className?: string;
};

function FlowNode({
  icon: Icon,
  title,
  detail,
  kind,
  version,
  selected,
  className = "",
}: FlowNodeProps) {
  return (
    <div
      className={`${styles.flowNode} ${className}`}
      data-kind={kind}
      data-selected={selected || undefined}
    >
      <span className={styles.inPort} aria-hidden="true" />
      <span className={styles.outPort} aria-hidden="true" />
      <div className={styles.flowNodeTop}>
        <Icon size={22} strokeWidth={1.35} aria-hidden="true" />
        {version ? <span>{version}</span> : <span>{kind}</span>}
      </div>
      <strong>{title}</strong>
      <span className={styles.flowDetail}>{detail}</span>
    </div>
  );
}

function Filename({ month }: { month: "april" | "may" }) {
  return (
    <>
      orders-
      <wbr />
      {month}.csv
    </>
  );
}

function ReportBadge({ kind }: { kind: "profile" | "validate" }) {
  return (
    <div className={styles.reportBadge}>
      {kind === "profile" ? (
        <ScanLine size={16} strokeWidth={1.4} aria-hidden="true" />
      ) : (
        <ListChecks size={16} strokeWidth={1.4} aria-hidden="true" />
      )}
      <div>
        <strong>{kind === "profile" ? "Profile" : "Validate"}</strong>
        <span>{kind === "profile" ? "Data overview" : "Check results"}</span>
      </div>
    </div>
  );
}

function MonthlyInput({ month }: { month: "april" | "may" }) {
  return (
    <div className={styles.mobileInputLane}>
      <FlowNode
        icon={FileSpreadsheet}
        title={<Filename month={month} />}
        detail="Original"
        kind="Data"
        version="v1"
      />
      <FlowNode icon={Eraser} title="Clean" detail="Trim names" kind="Tool" />
      <FlowNode
        icon={FileSpreadsheet}
        title={<Filename month={month} />}
        detail="Cleaned"
        kind="Data"
        version="v2"
      />
    </div>
  );
}

export function CustomWorkflowScene() {
  return (
    <Scene
      name="workflow"
      label="Illustrative custom workflow. April and May order datasets each retain original v1 and create cleaned v2. Stitch combines the compatible files into Combined orders v1. Transformation reads that single dataset and produces Report data v1 with customer_name renamed to customer and total renamed to amount. A separate XLSX export job reads the report. Profile produces metadata and Validate produces findings; neither creates a data version."
    >
      <div className={styles.workflowToolbar}>
        <span>
          <span className={styles.workflowDot} />
          Your custom pipeline
        </span>
        <span className={styles.workflowApproval}>
          <ShieldCheck size={14} aria-hidden="true" />
          This plan is approved
        </span>
      </div>

      <div className={styles.workflowCanvas}>
        <div className={styles.desktopFlow}>
          <div className={styles.sourceColumn}>
            <FlowNode
              icon={FileSpreadsheet}
              title={<Filename month="april" />}
              detail="Original"
              kind="Data"
              version="v1"
              className={styles.topNode}
            />
            <ReportBadge kind="profile" />
            <FlowNode
              icon={FileSpreadsheet}
              title={<Filename month="may" />}
              detail="Original"
              kind="Data"
              version="v1"
              className={styles.bottomNode}
            />
          </div>
          <div className={styles.cleanColumn}>
            <FlowNode
              icon={Eraser}
              title="Clean"
              detail="Trim names"
              kind="Tool"
              className={styles.topNode}
            />
            <FlowNode
              icon={Eraser}
              title="Clean"
              detail="Trim names"
              kind="Tool"
              className={styles.bottomNode}
            />
          </div>
          <div className={styles.cleanedColumn}>
            <FlowNode
              icon={FileSpreadsheet}
              title={<Filename month="april" />}
              detail="Cleaned"
              kind="Data"
              version="v2"
              className={styles.topNode}
            />
            <FlowNode
              icon={FileSpreadsheet}
              title={<Filename month="may" />}
              detail="Cleaned"
              kind="Data"
              version="v2"
              className={styles.bottomNode}
            />
          </div>
          <div className={styles.mergeColumn}>
            <span className={styles.mergeConnections} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <FlowNode
              icon={Combine}
              title="Stitch"
              detail="Keep all rows"
              kind="Tool"
              className={styles.centerNode}
            />
          </div>
          <div className={styles.combinedColumn}>
            <FlowNode
              icon={Layers3}
              title="Combined orders"
              detail="April + May"
              kind="Data"
              version="v1"
              className={styles.centerNode}
            />
          </div>
          <div className={styles.mapColumn}>
            <FlowNode
              icon={Braces}
              title="Shape report"
              detail="Rename fields"
              kind="Tool"
              selected
              className={styles.centerNode}
            />
          </div>
          <div className={styles.outputColumn}>
            <ReportBadge kind="validate" />
            <FlowNode
              icon={FileSpreadsheet}
              title="Report data"
              detail="Aligned fields"
              kind="Data"
              version="v1"
              className={styles.centerNode}
            />
            <FlowNode
              icon={FileDown}
              title="XLSX export"
              detail="Separate export job"
              kind="Export job"
              className={styles.exportNode}
            />
          </div>
        </div>

        <div className={styles.mobileFlow}>
          <div className={styles.mobileInputPair}>
            <MonthlyInput month="april" />
            <MonthlyInput month="may" />
          </div>
          <div className={styles.mobileMerge} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className={styles.mobileOutputChain}>
            <FlowNode
              icon={Combine}
              title="Stitch"
              detail="Keep all rows"
              kind="Tool"
            />
            <FlowNode
              icon={Layers3}
              title="Combined orders"
              detail="April + May"
              kind="Data"
              version="v1"
            />
            <FlowNode
              icon={Braces}
              title="Shape report"
              detail="Rename fields"
              kind="Tool"
              selected
            />
            <FlowNode
              icon={FileSpreadsheet}
              title="Report data"
              detail="Aligned fields"
              kind="Data"
              version="v1"
            />
            <FlowNode
              icon={FileDown}
              title="XLSX export"
              detail="Separate export job"
              kind="Export job"
            />
          </div>
          <div className={styles.mobileReports}>
            <ReportBadge kind="profile" />
            <ReportBadge kind="validate" />
          </div>
        </div>
      </div>

      <div className={styles.configurationPanel}>
        <div className={styles.fieldMapping}>
          <div className={styles.configurationHeading}>
            <Braces size={19} strokeWidth={1.4} aria-hidden="true" />
            <strong>Transform</strong>
            <span>Rename fields</span>
          </div>
          <div className={styles.mappingHeaders}>
            <span>From your data</span>
            <span>Renamed field</span>
          </div>
          <div className={styles.mappingRow}>
            <span>order_id</span>
            <ArrowRight size={14} aria-hidden="true" />
            <strong>order_id</strong>
          </div>
          <div className={styles.mappingRow}>
            <span>customer_name</span>
            <ArrowRight size={14} aria-hidden="true" />
            <strong>customer</strong>
          </div>
          <div className={styles.mappingRow}>
            <span>total</span>
            <ArrowRight size={14} aria-hidden="true" />
            <strong>amount</strong>
          </div>
        </div>
        <div className={styles.toolSettings}>
          <div className={styles.configurationHeading}>
            <SlidersHorizontal size={18} strokeWidth={1.4} aria-hidden="true" />
            <strong>Your tool settings</strong>
          </div>
          <div>
            <span>Clean</span>
            <strong>Trim both sides</strong>
          </div>
          <div>
            <span>Stitch</span>
            <strong>Matching headers</strong>
          </div>
          <div>
            <span>Duplicates</span>
            <strong>Keep all rows</strong>
          </div>
        </div>
        <div className={styles.workflowFootnote}>
          <span className={styles.footnoteIcon}>
            <ShieldCheck size={25} strokeWidth={1.35} aria-hidden="true" />
          </span>
          <strong>Originals stay intact.</strong>
          <p>Each data card keeps its own version history.</p>
          <span>
            <Check size={13} aria-hidden="true" /> Export leaves report data
            unchanged.
          </span>
        </div>
      </div>
    </Scene>
  );
}
