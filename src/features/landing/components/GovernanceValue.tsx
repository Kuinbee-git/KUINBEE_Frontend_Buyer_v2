import {
  ArrowRight,
  BadgeCheck,
  Check,
  Database,
  FileCheck2,
  FileText,
  Fingerprint,
  FolderLock,
  HelpCircle,
  ScanLine,
  ShieldCheck,
  Tag,
} from "lucide-react";
import styles from "./GovernanceValue.module.css";

const controls = [
  {
    id: "supplier",
    label: "Supplier identity",
    icon: Fingerprint,
    question: "Who supplies it?",
    answer: "Identity verified",
  },
  {
    id: "source",
    label: "Dataset source",
    icon: Database,
    question: "Where is it from?",
    answer: "Source details listed",
  },
  {
    id: "pricing",
    label: "Upfront pricing",
    icon: Tag,
    question: "What will it cost?",
    answer: "Price shown upfront",
  },
  {
    id: "review",
    label: "Dataset review",
    icon: FileCheck2,
    question: "Has it been reviewed?",
    answer: "Reviewed before publication",
  },
  {
    id: "license",
    label: "Usage terms",
    icon: FileText,
    question: "How can I use it?",
    answer: "License terms on the listing",
  },
  {
    id: "access",
    label: "Managed access",
    icon: FolderLock,
    question: "Where is my data?",
    answer: "Purchased data in your library",
  },
] as const;

export function GovernanceValue() {
  return (
    <section
      id="governance"
      aria-labelledby="governance-title"
      className={styles.section}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              Marketplace governance
            </p>
            <h2 id="governance-title" className={styles.title}>
              Know the data.
              <br />
              <span>Before you buy.</span>
            </h2>
          </div>
          <p className={styles.intro}>
            A file is only the starting point.
            <span>
              Kuinbee brings the supplier, source, price, review, terms, and
              access into the picture.
            </span>
          </p>
        </div>

        <div className={styles.comparison}>
          <article
            className={styles.unresolved}
            aria-labelledby="governance-file-title"
            data-governance-view="unresolved"
          >
            <div className={styles.panelHeader}>
              <p className={styles.panelEyebrow}>
                <span className={styles.openDot} aria-hidden="true" />A file on
                its own
              </p>
              <h3 id="governance-file-title">
                The data.
                <span>Without the details.</span>
              </h3>
            </div>

            <div className={styles.looseScene}>
              <svg
                className={styles.brokenConnections}
                viewBox="0 0 440 332"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M118 48 L158 64 L196 127" />
                <path d="M322 65 L285 79 L245 127" />
                <path d="M118 158 L169 167" />
                <path d="M322 181 L270 170" />
                <path d="M120 290 L160 275 L195 205" />
                <path d="M322 303 L282 281 L245 208" />
              </svg>

              <div className={styles.looseFile} aria-hidden="true">
                <FileText size={37} strokeWidth={1.15} />
                <span>dataset.zip</span>
                <div className={styles.fileLines}>
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.fileQuestion}>?</span>
              </div>

              <dl className={styles.questions}>
                {controls.map((control) => (
                  <div
                    key={control.id}
                    className={styles.uncertainty}
                    data-control={control.id}
                  >
                    <dt>{control.label}</dt>
                    <dd>
                      <HelpCircle size={12} aria-hidden="true" />
                      {control.question}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.unresolvedFooter}>
              <HelpCircle size={20} strokeWidth={1.5} aria-hidden="true" />
              <p>
                <strong>Six questions still open.</strong>
                <span>The context is yours to piece together.</span>
              </p>
            </div>
          </article>

          <div className={styles.bridge} aria-hidden="true">
            <ArrowRight size={23} strokeWidth={1.6} />
          </div>

          <article
            className={styles.resolved}
            aria-labelledby="governance-kuinbee-title"
            data-governance-view="kuinbee"
          >
            <div className={styles.panelHeader}>
              <p className={styles.panelEyebrow}>
                <ShieldCheck size={15} aria-hidden="true" />
                With Kuinbee
              </p>
              <h3 id="governance-kuinbee-title">
                The data.
                <span>And the details.</span>
              </h3>
              <ShieldCheck
                className={styles.brandSeal}
                size={64}
                strokeWidth={1}
                aria-hidden="true"
              />
            </div>

            <div className={styles.governedListing}>
              <div className={styles.listingHeader}>
                <span>
                  <Database size={15} aria-hidden="true" />
                  Marketplace controls
                </span>
                <span>
                  <BadgeCheck size={14} aria-hidden="true" />
                  In place
                </span>
              </div>
              <dl className={styles.answers}>
                {controls.map((control) => {
                  const Icon = control.icon;

                  return (
                    <div
                      key={control.id}
                      className={styles.answer}
                      data-control={control.id}
                    >
                      <dt>
                        <span className={styles.answerIcon} aria-hidden="true">
                          <Icon size={18} strokeWidth={1.5} />
                        </span>
                        <span>{control.label}</span>
                        <Check
                          className={styles.answerCheck}
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </dt>
                      <dd>{control.answer}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className={styles.resolvedFooter}>
              <span>
                <FileCheck2 size={17} aria-hidden="true" />
                Review
              </span>
              <ArrowRight size={13} aria-hidden="true" />
              <span>
                <ScanLine size={17} aria-hidden="true" />
                Evaluate
              </span>
              <ArrowRight size={13} aria-hidden="true" />
              <span>
                <FolderLock size={17} aria-hidden="true" />
                Access
              </span>
            </div>
          </article>
        </div>
        <p className={styles.caption}>
          An illustrative view of the context around a dataset.
        </p>
      </div>
    </section>
  );
}
