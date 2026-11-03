"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useLenis } from "lenis/react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { StrotasProductHero } from "./StrotasProductHero";
import { StrotasIntro } from "./StrotasIntro";
import { StrotasCardStack } from "./StrotasCardStack";
import { StrotasFitScene } from "./StrotasFitScene";
import {
  pipelineStages,
  StrotasPipelineOverview,
} from "./StrotasPipelineOverview";
import {
  SchemaMappingScene,
  QualityGateScene,
  PublishedAssetScene,
} from "./StrotasDataScenes";
import { AgentPlanningScene, CustomWorkflowScene } from "./StrotasAgentScenes";
import { LineageFeatureScene, ReviewFeatureScene } from "./StrotasTraceScenes";
import styles from "./StrotasPageContent.module.css";

const sections = [
  {
    id: "strotas-pipeline-title",
    number: "01",
    label: "The complete pipeline",
    nav: "Pipeline",
    title: "From source to trusted output.",
    description:
      "Seven connected stages bring your data into shape. Inspect the inputs, configure each operation, and follow the result through the pipeline.",
    details: [
      "Original sources preserved",
      "AI-assisted, human-approved plans",
      "Versioned, reviewable outputs",
    ],
    artwork: "pipeline",
    Scene: StrotasPipelineOverview,
  },
  {
    id: "strotas-agents-title",
    number: "02",
    label: "Agent collaboration",
    nav: "Agents",
    title: "Tell it the outcome.",
    description:
      "Describe the result you need. Specialist agents inspect the dataset and propose a plan you can review before execution.",
    details: [
      "Dataset context shared between agents",
      "Visible reasoning and tool configuration",
      "You approve the execution plan",
    ],
    artwork: "agents",
    Scene: AgentPlanningScene,
  },
  {
    id: "strotas-build-title",
    number: "03",
    label: "Custom workflows",
    nav: "Workflows",
    title: "Your workflow. Your rules.",
    description:
      "Connect cleaning, joining, mapping and validation tools on one canvas. Configure the operations and see exactly which versions they read and produce.",
    details: [
      "Configure each tool independently",
      "Combine sources and reshape fields",
      "Inspect the output at every step",
    ],
    artwork: "workflow",
    Scene: CustomWorkflowScene,
  },
  {
    id: "strotas-mapping-title",
    number: "04",
    label: "Schema mapping",
    nav: "Mapping",
    title: "One consistent schema.",
    description:
      "Map source fields to a shared schema. When an input changes, review the mapping for that version and keep the downstream contract explicit.",
    details: [
      "Source-to-target field mappings",
      "Mappings bound to source versions",
      "A canonical structure for downstream work",
    ],
    artwork: "mapping",
    Scene: SchemaMappingScene,
  },
  {
    id: "strotas-quality-title",
    number: "05",
    label: "Data quality",
    nav: "Quality",
    title: "Know what passed. See what didn’t.",
    description:
      "Define the checks your data must pass. Review validation results, inspect failed rows and decide what is ready to move forward.",
    details: [
      "Required fields, formats and value rules",
      "Visible results for each check",
      "Failures kept available for review",
    ],
    artwork: "quality",
    Scene: QualityGateScene,
  },
  {
    id: "strotas-lineage-title",
    number: "06",
    label: "Lineage & versions",
    nav: "Lineage",
    title: "Every result has a history.",
    description:
      "Trace an output back to its inputs, tools and execution. Each result has its own version history, so the original stays available for comparison.",
    details: [
      "Inspect upstream and downstream dependencies",
      "Follow version-specific connections",
      "Keep original and derived data separate",
    ],
    artwork: "lineage",
    Scene: LineageFeatureScene,
  },
  {
    id: "strotas-review-title",
    number: "07",
    label: "Change detection & review",
    nav: "Review",
    title: "Spot the change. See the impact.",
    description:
      "Compare new data with a baseline to spot changes in structure and values. Review the differences with AI assistance and follow their downstream impact.",
    details: [
      "Baseline-to-current comparisons",
      "Schema and record-level differences",
      "Review the impact before approving changes",
    ],
    artwork: "review",
    Scene: ReviewFeatureScene,
  },
  {
    id: "strotas-outputs-title",
    number: "08",
    label: "Versioned outputs",
    nav: "Outputs",
    title: "A dataset you can stand behind.",
    description:
      "Bring the data, schema and validation evidence together in a versioned asset. Make reviewed results available for your next workflow or downstream team.",
    details: [
      "Data and schema in one place",
      "Quality results attached to the output",
      "Controlled access and delivery",
    ],
    artwork: "outputs",
    Scene: PublishedAssetScene,
  },
];

function StoryChapter({ chapter }: { chapter: (typeof sections)[number] }) {
  const { id, number, label, title, description, details, artwork, Scene } =
    chapter;
  const chapterRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = chapterRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={chapterRef}
      className={styles.section}
      aria-labelledby={id}
      data-story-visible={visible}
      data-story-chapter={artwork}
      data-stack-card
      id={
        artwork === "pipeline"
          ? "pipeline"
          : artwork === "workflow"
            ? "strotas-workflow"
            : undefined
      }
    >
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>
            <span>{number}</span>
            {label}
          </p>
          <h2 id={id}>{title}</h2>
          <p className={styles.chapterDescription}>{description}</p>
          <ul className={styles.chapterDetails}>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <StrotasFitScene artwork={artwork}>
          <Scene />
        </StrotasFitScene>
      </div>
    </section>
  );
}

export function StrotasPageContent() {
  const [email, setEmail] = useState("");
  const [state, handleSubmit] = useForm("xdkwzkgj");
  const lenis = useLenis();
  function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.submitting || !email.trim()) return;
    const data = new FormData();
    data.append("email", email.trim());
    data.append("source", "Strotas Waitlist");
    void handleSubmit(data);
  }
  function followAnchor(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const hash = event.currentTarget.hash;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const stack = target.closest<HTMLElement>("[data-strotas-card-stack]");
    const index = Number(target.dataset.stackIndex);
    const pinned = stack?.dataset.stackActive === "true";
    const position = pinned
      ? stack.getBoundingClientRect().top +
        window.scrollY +
        index * Number(stack.dataset.stackStep)
      : target.getBoundingClientRect().top + window.scrollY - 96;
    if (lenis) {
      lenis.scrollTo(position, {
        duration: 0.9,
        immediate: reducedMotion || pinned,
      });
    } else {
      window.scrollTo({
        behavior: reducedMotion || pinned ? "instant" : "smooth",
        top: position,
      });
    }
    window.history.pushState(null, "", hash);
  }
  return (
    <StrotasIntro>
      <div className={styles.page}>
        <div className={styles.navigation}>
          <LandingHeader />
        </div>
        <main className={styles.deckMain}>
          <StrotasCardStack
            labels={[
              "Overview",
              ...sections.map((chapter) => chapter.nav),
              "Early access",
            ]}
          >
            <StrotasProductHero
              flow={
                <a
                  href="#pipeline"
                  onClick={followAnchor}
                  className={styles.heroFlow}
                  aria-label="Explore the seven pipeline stages"
                >
                  {pipelineStages.map((stage) => (
                    <span key={stage.name}>{stage.name}</span>
                  ))}
                </a>
              }
              intro={
                <div className={styles.heroIntro}>
                  <div className={styles.heroCopy}>
                    <div className={styles.brandLine}>
                      <span>
                        Strotas{" "}
                        <span className={styles.byKuinbee}>by Kuinbee</span>
                      </span>
                      <span className={styles.availability}>Coming soon</span>
                    </div>
                    <h1 id="strotas-title" className={styles.heroTitle}>
                      Build your <span>data flow.</span>
                    </h1>
                    <p className={styles.heroDescription}>
                      An AI-native workspace for your data pipelines. Design the
                      flow, review the plan, and inspect every result.
                    </p>
                  </div>
                  <div className={styles.heroActions}>
                    <a
                      href="#waitlist"
                      onClick={followAnchor}
                      className={styles.primaryLink}
                    >
                      Join the waitlist{" "}
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                    <p className={styles.heroNote}>
                      Coming soon. Join the waitlist for early access.
                    </p>
                  </div>
                </div>
              }
            />
            {sections.map((chapter) => (
              <StoryChapter key={chapter.id} chapter={chapter} />
            ))}
            <section
              id="waitlist"
              className={styles.waitlistSection}
              aria-labelledby="strotas-waitlist-title"
              data-stack-card
            >
              <div className={`${styles.container} ${styles.waitlistGrid}`}>
                <div className={styles.waitlistCopy}>
                  <p className={styles.sectionLabel}>
                    <span>09</span>Early access
                  </p>
                  <h2 id="strotas-waitlist-title">Build with more clarity.</h2>
                  <p>
                    Strotas is taking shape. Leave your email for product
                    updates and the opportunity to explore it early.
                  </p>
                  <div className={styles.waitlistTrail} aria-hidden="true">
                    <span>Your data</span>
                    <ArrowRight size={14} />
                    <span>Your agents</span>
                    <ArrowRight size={14} />
                    <span>Traceable results</span>
                  </div>
                </div>
                <div className={styles.waitlistCard}>
                  {state.succeeded ? (
                    <div
                      className={styles.success}
                      role="status"
                      aria-live="polite"
                    >
                      <span>
                        <Check size={24} aria-hidden="true" />
                      </span>
                      <h3>You’re on the list.</h3>
                      <p>
                        We’ll reach out when Strotas is ready for early
                        partners.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={submitWaitlist}
                      className={styles.waitlistForm}
                    >
                      <label htmlFor="strotas-waitlist-email">
                        Your email address
                      </label>
                      <div className={styles.emailField}>
                        <Mail size={17} aria-hidden="true" />
                        <input
                          id="strotas-waitlist-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          disabled={state.submitting}
                          aria-describedby={
                            state.errors ? "strotas-email-error" : undefined
                          }
                          aria-invalid={
                            state.errors?.getFieldErrors("email").length
                              ? true
                              : undefined
                          }
                        />
                      </div>
                      <div
                        id="strotas-email-error"
                        className={styles.fieldError}
                      >
                        <ValidationError
                          prefix="Email"
                          field="email"
                          errors={state.errors}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={state.submitting || !email.trim()}
                        className={styles.waitlistSubmit}
                      >
                        {state.submitting
                          ? "Joining the waitlist…"
                          : "Join the waitlist"}
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                      {state.errors && (
                        <p className={styles.formError} role="alert">
                          We couldn’t add you just now. Please try again.
                        </p>
                      )}
                      <p className={styles.formFinePrint}>
                        Product updates and early access.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </StrotasCardStack>
        </main>
        <LandingFooter />
      </div>
    </StrotasIntro>
  );
}
