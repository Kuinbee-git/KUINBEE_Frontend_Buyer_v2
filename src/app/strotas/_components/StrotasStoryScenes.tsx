import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  FileSpreadsheet,
  GitBranch,
  History,
  ShieldCheck,
  Space,
  WandSparkles,
} from "lucide-react";
import styles from "./StrotasStoryScenes.module.css";

const customers = [
  {
    name: "Acme Ltd",
    before: "  Acme Ltd  ",
    leading: "  ",
    trailing: "  ",
    date: "09/23/2026",
    cleanedDate: "2026-09-23",
    country: "IN",
  },
  {
    name: "Orion Labs",
    before: " Orion Labs",
    leading: " ",
    trailing: "",
    date: "10/02/2026",
    cleanedDate: "2026-10-02",
    country: "GB",
  },
  {
    name: "Nova Data",
    before: "Nova Data  ",
    leading: "",
    trailing: "  ",
    date: "09/28/2026",
    cleanedDate: "2026-09-28",
    country: "US",
  },
];

function Scene({
  name,
  label,
  children,
}: {
  name: "source" | "plan" | "check" | "history";
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.scene} ${name === "history" ? styles.history : ""}`}
      role="group"
      aria-label={label}
      data-strotas-story-scene={name}
    >
      <div className={styles.context}>
        <span>
          <FileSpreadsheet size={15} aria-hidden="true" />
          customer.csv
        </span>
        <span>Illustrative example</span>
      </div>
      {children}
    </div>
  );
}

function RawName({ customer }: { customer: (typeof customers)[number] }) {
  return (
    <span className={styles.rawName} aria-label={customer.before}>
      <span className={styles.whitespace}>{customer.leading}</span>
      {customer.name}
      <span className={styles.whitespace}>{customer.trailing}</span>
    </span>
  );
}

function CustomerSheet({
  clean = false,
  attention = false,
  history = false,
}: {
  clean?: boolean;
  attention?: boolean;
  history?: boolean;
}) {
  return (
    <div
      className={`${styles.sheet} ${clean ? styles.cleanedSheet : styles.originalSheet}`}
      data-attention={attention || undefined}
    >
      <div className={styles.sheetHeading}>
        <span className={styles.sheetIcon}>
          <FileSpreadsheet size={20} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <strong>{clean ? "Cleaned data" : "Original data"}</strong>
          <span>
            {clean
              ? "The result of your approved plan"
              : history
                ? "Preserved exactly as uploaded"
                : "Exactly as uploaded"}
          </span>
        </div>
        <span className={styles.version}>{clean ? "v2" : "v1"}</span>
      </div>
      <table className={styles.customerTable}>
        <caption className={styles.srOnly}>
          {clean
            ? "Cleaned customer data version 2"
            : "Original customer data version 1"}
          : three rows, company names, signup dates and unchanged country codes
        </caption>
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Signup date</th>
            <th scope="col">Country</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.name}>
              <td className={attention ? styles.nameAttention : undefined}>
                {clean ? (
                  <span>{customer.name}</span>
                ) : (
                  <RawName customer={customer} />
                )}
                {attention && index === 0 && (
                  <span className={styles.cellAnchor} aria-hidden="true">
                    1
                  </span>
                )}
              </td>
              <td className={attention ? styles.dateAttention : undefined}>
                <span>{clean ? customer.cleanedDate : customer.date}</span>
                {attention && index === 0 && (
                  <span className={styles.cellAnchor} aria-hidden="true">
                    2
                  </span>
                )}
              </td>
              <td>{customer.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.sheetFooter}>
        <span>
          {clean ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <span className={styles.quietDot} />
          )}
          {clean
            ? "3 rows kept · Countries unchanged"
            : "3 rows · No values changed"}
        </span>
        {history && (
          <span className={styles.preservedLabel}>
            {clean ? "Active" : "Preserved"}
          </span>
        )}
      </div>
    </div>
  );
}

export function SourceStoryScene() {
  return (
    <Scene
      name="source"
      label="The original customer.csv has three rows. Company names have extra spaces and signup dates will change to year-first format. No values have changed."
    >
      <div className={styles.sourceComposition}>
        <CustomerSheet attention />
        <div className={styles.attentionNotes}>
          <div className={styles.attentionNote}>
            <span className={styles.noteNumber}>1</span>
            <div>
              <strong>Extra spaces</strong>
              <p>Around company names</p>
            </div>
            <Space size={19} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className={styles.attentionNote}>
            <span className={styles.noteNumber}>2</span>
            <div>
              <strong>Date format</strong>
              <p>Use the format you need.</p>
            </div>
            <CalendarDays size={19} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <span className={styles.unchangedNote}>
            <ShieldCheck size={14} aria-hidden="true" />
            Your original stays intact.
          </span>
        </div>
      </div>
    </Scene>
  );
}

export function PlanStoryScene() {
  return (
    <Scene
      name="plan"
      label="An illustrative operator asks to trim company names and standardize signup dates. Two proposed changes are shown before and after together, and the operator approves this supervised cleaning and checking workflow."
    >
      <div className={styles.request}>
        <span className={styles.requestAvatar} aria-hidden="true">
          You
        </span>
        <div>
          <span className={styles.requestLabel}>Your request</span>
          <p>
            Trim company names and standardize signup dates in customer.csv.
          </p>
        </div>
      </div>
      <div className={styles.changeCards}>
        <div className={styles.changeCard}>
          <div className={styles.changeCardHeading}>
            <span className={styles.operationNumber}>01</span>
            <div>
              <strong>Remove extra spaces</strong>
              <span>Company names</span>
            </div>
            <Space size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className={styles.comparisonHeading}>
            <span>Before</span>
            <span />
            <span>After</span>
          </div>
          {customers.map((customer) => (
            <div className={styles.valueComparison} key={customer.name}>
              <RawName customer={customer} />
              <span className={styles.changeArrow} aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.5} />
              </span>
              <span className={styles.afterValue}>{customer.name}</span>
            </div>
          ))}
          <div className={styles.changeCardFooter}>
            Trim both sides. Keep every name.
          </div>
        </div>
        <div className={styles.changeCard}>
          <div className={styles.changeCardHeading}>
            <span className={styles.operationNumber}>02</span>
            <div>
              <strong>Standardize dates</strong>
              <span>Signup dates</span>
            </div>
            <CalendarDays size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className={styles.comparisonHeading}>
            <span>Before</span>
            <span />
            <span>After</span>
          </div>
          {customers.map((customer) => (
            <div className={styles.valueComparison} key={customer.name}>
              <span>{customer.date}</span>
              <span className={styles.changeArrow} aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.5} />
              </span>
              <span className={styles.afterValue}>{customer.cleanedDate}</span>
            </div>
          ))}
          <div className={styles.changeCardFooter}>
            Month / day / year → Year / month / day
          </div>
        </div>
      </div>
      <div className={styles.approvedStrip}>
        <span>
          <CheckCheck size={17} aria-hidden="true" />
          <strong>Reviewed and approved by you</strong>
          <span
            className={styles.workflowQualifier}
            aria-label="Approved Execution in this illustrative workflow"
          >
            You approve first in this workflow.
          </span>
        </span>
        <span className={styles.workflow}>
          <WandSparkles size={15} aria-hidden="true" />
          Clean
          <ArrowRight size={14} aria-hidden="true" />
          <ShieldCheck size={15} aria-hidden="true" />
          Check
        </span>
      </div>
    </Scene>
  );
}

export function CheckStoryScene() {
  return (
    <Scene
      name="check"
      label="The cleaned version retains all three rows and countries. Three configured checks pass: company names are present, signup dates use ISO 8601, and country codes are two characters."
    >
      <div className={styles.checkComposition}>
        <CustomerSheet clean />
        <div className={styles.checkReport}>
          <div className={styles.readyMark}>
            <Check size={37} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <span className={styles.checkLabel}>Your checks</span>
          <h3>Ready.</h3>
          <p className={styles.checkSummary}>3 checks passed</p>
          <div className={styles.checkRows}>
            <div>
              <span>
                <Check size={15} aria-hidden="true" />
              </span>
              <strong>Names present</strong>
              <span>3 / 3</span>
            </div>
            <div>
              <span>
                <Check size={15} aria-hidden="true" />
              </span>
              <strong>Dates consistent</strong>
              <span>Year first</span>
            </div>
            <div>
              <span>
                <Check size={15} aria-hidden="true" />
              </span>
              <strong>Country format</strong>
              <span>2 characters</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.qualityAssurance}>
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Checks run against the whole result. No rows are silently removed.
        </span>
      </div>
    </Scene>
  );
}

export function HistoryStoryScene() {
  return (
    <Scene
      name="history"
      label="Both customer.csv versions remain visible: original v1 is preserved, cleaned and checked v2 is active. Version history is separate from the change trail, which shows source v1 through Cleaning to v2; validation checks v2 without creating another version."
    >
      <div className={styles.historySheets}>
        <div className={styles.historyOriginal}>
          <CustomerSheet history />
        </div>
        <div className={styles.historyCurrent}>
          <CustomerSheet clean history />
        </div>
      </div>
      <div className={styles.historyDetails}>
        <div className={styles.versionHistory}>
          <div className={styles.detailHeading}>
            <History size={16} aria-hidden="true" />
            <strong>Version history</strong>
          </div>
          <div className={styles.historyEntry}>
            <span className={styles.historyPoint} />
            <span className={styles.historyVersion}>v1</span>
            <strong>Original</strong>
            <span>Preserved</span>
          </div>
          <div className={styles.historyEntry}>
            <span className={`${styles.historyPoint} ${styles.activePoint}`} />
            <span className={styles.historyVersion}>v2</span>
            <strong>Cleaned and checked</strong>
            <span className={styles.activeLabel}>Active</span>
          </div>
        </div>
        <div className={styles.changeHistory}>
          <div className={styles.detailHeading}>
            <GitBranch size={16} aria-hidden="true" />
            <strong>How it changed</strong>
          </div>
          <div className={styles.lineageTrail}>
            <span>v1</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>
              <WandSparkles size={15} aria-hidden="true" />
              Cleaning
            </span>
            <ArrowRight size={16} aria-hidden="true" />
            <span className={styles.activeVersion}>v2</span>
          </div>
          <p>
            <Check size={13} aria-hidden="true" />
            Checks leave your data unchanged.
          </p>
        </div>
      </div>
    </Scene>
  );
}
