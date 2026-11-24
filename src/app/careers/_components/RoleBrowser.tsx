"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CopyAction } from "@/features/landing/components/CopyAction";
import styles from "@/features/landing/components/PublicInformation.module.css";

interface JobOpening {
  id: number;
  title: string;
  location: string;
  type: string;
  overview: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  preferred?: string[];
  example: string;
  gain?: string[];
  compensation?: string;
  jdLink?: string;
}

const jobOpenings: JobOpening[] = [
  {
    id: 1,
    title: "Marketing Intern",
    location: "Remote",
    type: "3–6 Months",
    overview:
      "Help people who buy data understand what Kuinbee has to offer. You’ll plan campaigns, write the copy, and use the response to decide what to try next.",
    about:
      "Our audience ranges from researchers looking for a specific dataset to businesses commissioning a collection. The same announcement can mean different things to each group. Your job is to work out who would find a dataset useful and give them a reason to take a closer look.",
    responsibilities: [
      "Plan LinkedIn posts and campaigns around a particular audience, a question they have, and the action you want them to take.",
      "Work with the sales and data teams to understand what a dataset covers. Turn those details into posts, campaign briefs, and clear calls to action.",
      "Try different messages across organic and paid channels. Keep track of what changed so the team can interpret the results.",
      "Follow a campaign beyond publication. Compare clicks and enquiries, read the questions people ask, and use what you learn to shape the next brief.",
    ],
    requirements: [
      "You understand how LinkedIn and other digital channels reach different audiences.",
      "You can explain a technical subject in plain language and edit your own copy for accuracy, tone, and length.",
      "You’re comfortable putting a first version in front of people, accepting feedback, and trying again.",
    ],
    preferred: ["Familiarity with startups or the data industry is helpful."],
    gain: [
      "Take a campaign from the initial idea through publication and review, with work you can explain from start to finish.",
      "Learn how a startup chooses which audiences and channels to invest in. Strong performance may lead to a full-time opportunity.",
    ],
    example:
      "For a new dataset listing, you might interview the data team, write a LinkedIn post for researchers, and compare the questions it attracts with the ones sales hears from business buyers.",
  },
  {
    id: 3,
    title: "HR Intern",
    location: "Remote",
    type: "3–6 Months",
    overview:
      "Help hire the people who build and run Kuinbee. You’ll work across sourcing, interviews, and onboarding, keeping candidates informed as they move through the process.",
    about:
      "A developer, a salesperson, and a data operations specialist bring different evidence of their work. You’ll learn what each team needs, where to look for candidates, and which questions help the hiring team make a decision.",
    responsibilities: [
      "Talk with the hiring team about the work an opening involves, then use that brief to source candidates and write relevant outreach.",
      "Review applications for evidence of the skills the role needs. Keep clear notes on what a candidate has demonstrated and what still needs a conversation.",
      "Arrange interviews, confirm availability, collect feedback, and make sure candidates hear about the next step.",
      "Help new joiners prepare for their first day. Keep onboarding information up to date and flag questions that come up repeatedly.",
      "Contribute to recruitment posts and team engagement activities that give people an accurate picture of working at Kuinbee.",
    ],
    requirements: [
      "You write clearly, listen carefully, and follow up even when an interview schedule changes.",
      "You can keep several applications moving at once and handle candidate information with discretion.",
      "You’re curious about startup hiring and can recognise relevant work in projects, portfolios, or practical experience.",
    ],
    gain: [
      "Gain hands-on experience across the hiring cycle and see how a growing team turns a role brief into a hire.",
      "A longer-term role may be available based on performance.",
    ],
    example:
      "When two interviewers give different feedback, you might pull together the specific examples behind each view, identify the open question, and help the team plan a focused follow-up.",
  },
  {
    id: 5,
    title: "Full Stack Developer",
    location: "Pune / Remote",
    type: "Full-time / Contract",
    overview:
      "Build the parts of Kuinbee that buyers and suppliers use to discover and exchange data. You’ll work across React interfaces, application services, and databases.",
    about:
      "The marketplace, community, and analytics features rely on many of the same records. A change to how a dataset is stored can affect what appears in search, what its detail page shows, and who can access it. This role follows those connections from the interface down to the query.",
    responsibilities: [
      "Develop and maintain front-end and back-end features, from the first user action through validation, storage, and the response shown on screen.",
      "Design APIs that connect catalogue records, community features, and analytics. Make their behaviour clear for empty results, invalid input, and failed requests.",
      "Investigate slow screens and endpoints in data-heavy workflows. Measure the request, examine the database query, and check the effect of your change.",
      "Keep access checks, tests, and error handling close to the features they protect. Make changes that other engineers can understand and maintain.",
    ],
    requirements: [
      "2–5 years of full-stack development experience.",
      "Proficiency with JavaScript or TypeScript, React, Node.js, and Python.",
      "Experience designing and querying SQL and NoSQL databases, including choosing a data model that fits the access pattern.",
      "Familiarity with deploying and running applications on AWS or Google Cloud.",
    ],
    preferred: [
      "Experience building applications that work with large or frequently queried datasets.",
    ],
    example:
      "If catalogue filters become slow as listings grow, you might trace a search from the React form to its API and database query, improve the bottleneck, and verify that pagination and results still agree.",
    jdLink:
      "https://drive.google.com/drive/folders/1G3cnOK5S2NS67slNsD7Wq75UD0-R9LYW?usp=drive_link",
  },
  {
    id: 9,
    title: "AI Developer",
    location: "Pune / Remote",
    type: "Full-time",
    overview:
      "Build models that turn Kuinbee’s data into forecasts, classifications, and other useful outputs. You’ll take models from an initial baseline through evaluation and deployment.",
    about:
      "The work spans text, images, and tabular records. A model that performs well in an experiment also needs to handle the inputs, response times, and volume of the service that will use it. You’ll work with data engineers to connect those two parts of the job.",
    responsibilities: [
      "Translate an analytics or automation problem into a prediction task. Decide what the model should return and how to judge whether it is useful.",
      "Prepare structured and unstructured data for training and evaluation. Check how missing fields, inconsistent labels, or repeated records affect the result.",
      "Build baselines for NLP, classification, and forecasting tasks. Compare candidate models and examine the examples where they disagree or fail.",
      "Deploy models as part of a data pipeline or service. Work with data engineers on input formats, inference performance, and behaviour when new data arrives.",
      "Measure the trade-offs between accuracy, latency, and scale before choosing a model for real-time use.",
    ],
    requirements: [
      "2–5 years of experience developing machine learning or AI systems.",
      "Proficiency in Python and scikit-learn, with experience using TensorFlow or PyTorch.",
      "A strong grounding in data preprocessing, natural language processing, and predictive modelling.",
      "Experience deploying models using cloud ML tooling such as AWS SageMaker or Google Cloud Vertex AI.",
    ],
    preferred: [
      "Knowledge of large language models, data augmentation, or recommender systems.",
    ],
    example:
      "For automated classification, you might compare a text classifier against a simple baseline, review the categories it confuses, and time inference on representative records before integrating it into a pipeline.",
    jdLink:
      "https://drive.google.com/drive/folders/1C2Ge50dKvsupTBZNE6QrExIh5YnYEFSz?usp=drive_link",
  },
];

function subscribeToRole(change: () => void) {
  window.addEventListener("hashchange", change);
  return () => window.removeEventListener("hashchange", change);
}

function currentRole() {
  return window.location.hash;
}
function serverRole() {
  return "";
}

function notifyRoleChange() {
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function RoleBrowser() {
  const hash = useSyncExternalStore(subscribeToRole, currentRole, serverRole);
  const returnFocus = useRef<HTMLButtonElement | null>(null);

  const setAnimationOrigin = useCallback((card: HTMLDivElement | null) => {
    if (!card) return;
    const trigger = document.getElementById(`view-role-${card.dataset.roleId}`);
    if (!trigger) return;

    function measure() {
      if (!card || !trigger) return;
      const row = trigger.getBoundingClientRect();
      if (row.bottom <= 0 || row.top >= window.innerHeight) {
        card.removeAttribute("data-row-visible");
        return;
      }
      // Use layout dimensions so an in-flight transform cannot shift the target.
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      card.style.setProperty(
        "--row-x",
        `${row.left + row.width / 2 - window.innerWidth / 2}px`
      );
      card.style.setProperty(
        "--row-y",
        `${row.top - (window.innerHeight - height) / 2}px`
      );
      card.style.setProperty(
        "--row-inset",
        `${Math.max(0, (width - row.width) / 2)}px`
      );
      card.style.setProperty(
        "--row-bottom",
        `${Math.max(0, height - row.height)}px`
      );
      card.dataset.rowVisible = "true";
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function openRole(id: number, trigger: HTMLButtonElement) {
    returnFocus.current = trigger;
    window.history.pushState({ careersPreview: true }, "", `#role-${id}`);
    notifyRoleChange();
  }

  function closeRole() {
    if (window.history.state?.careersPreview) {
      window.history.back();
    } else {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      notifyRoleChange();
    }
  }

  return (
    <section aria-labelledby="open-positions">
      <div className={styles.boardHeading}>
        <h2 id="open-positions" className={styles.sectionTitle}>
          Open positions
        </h2>
        <span>
          {jobOpenings.length} {jobOpenings.length === 1 ? "role" : "roles"}
        </span>
      </div>
      {jobOpenings.length === 0 && <p>There are currently no openings.</p>}
      {jobOpenings.map((job) => (
        <Dialog
          key={job.id}
          open={hash === `#role-${job.id}`}
          onOpenChange={(open) => {
            if (!open) closeRole();
          }}
        >
          <button
            id={`view-role-${job.id}`}
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => openRole(job.id, event.currentTarget)}
            className={styles.job}
            aria-label={`View ${job.title} role`}
          >
            <span className={styles.roleName}>{job.title}</span>
            <span className={styles.conditions}>
              {job.location}
              <small>{job.type}</small>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
          <DialogContent
            ref={setAnimationOrigin}
            data-role-id={job.id}
            className={styles.preview}
            overlayClassName={`bg-black/45 motion-reduce:animate-none ${styles.previewOverlay}`}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              returnFocus.current?.focus({ preventScroll: true });
              returnFocus.current = null;
            }}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              returnFocus.current ??= document.querySelector<HTMLButtonElement>(
                `#view-role-${job.id}`
              );
              document
                .getElementById(`preview-title-${job.id}`)
                ?.focus({ preventScroll: true });
            }}
          >
            <header className={styles.previewHeader}>
              <DialogTitle className={styles.previewTitle}>
                <span id={`preview-title-${job.id}`} tabIndex={-1}>
                  {job.title}
                </span>
              </DialogTitle>
              <div className={styles.previewMeta}>
                <p>
                  {job.location} · {job.type}
                </p>
                <CopyAction key={job.id} roleId={job.id} />
              </div>
            </header>
            <div
              key={job.id}
              className={styles.previewBody}
              tabIndex={0}
              role="region"
              aria-label={`${job.title} description`}
              data-lenis-prevent
            >
              <DialogDescription className={styles.overview}>
                {job.overview}
              </DialogDescription>
              {job.jdLink && (
                <Button variant="link" className="px-0" asChild>
                  <a
                    href={job.jdLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Job description
                  </a>
                </Button>
              )}
              <div className={styles.jobDetails}>
                <p>{job.about}</p>
                {[
                  { title: "Responsibilities", items: job.responsibilities },
                  { title: "What you’ll bring", items: job.requirements },
                  { title: "Helpful experience", items: job.preferred },
                  { title: "What you’ll gain", items: job.gain },
                ].map(({ title, items }) =>
                  items?.length ? (
                    <div key={title}>
                      <h3>{title}</h3>
                      <ul>
                        {items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                )}
                <div>
                  <h3>Example project</h3>
                  <p>{job.example}</p>
                </div>
                {job.compensation && (
                  <div>
                    <h3>Compensation</h3>
                    <p>{job.compensation}</p>
                  </div>
                )}
              </div>
            </div>
            <footer className={styles.jobActions}>
              <Button asChild>
                <a
                  href={`mailto:info@kuinbee.com?subject=${encodeURIComponent("Application for " + job.title)}`}
                >
                  Apply by email <ArrowRight />
                </a>
              </Button>
            </footer>
          </DialogContent>
        </Dialog>
      ))}
    </section>
  );
}
