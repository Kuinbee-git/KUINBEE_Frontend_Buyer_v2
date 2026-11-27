"use client";

import Link from "next/link";
import { useMotionValue } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  boltSpacing,
  boreDiameter,
  initialBearingCamera,
  type BearingPart,
} from "./bearing-geometry";
import type { BearingPose, GuideMeasurement } from "./supplier-cad-example";
import { SupplierCadExample } from "./supplier-cad-example";
import { SupplierEntryLink } from "./supplier-entry-link";
import styles from "./suppliers-guide.module.css";

type GuideCue = {
  key: string;
  pose: BearingPose;
  evidence: { label: string; value: string; href?: string };
  focus?: BearingPart;
  measurement?: GuideMeasurement;
};
type GuideDetail = { label: string; text: string; cue?: GuideCue };
type GuideStep = GuideCue & {
  title: string;
  caption: string;
  details: GuideDetail[];
};

const sampleFiles = "/images/supplier-resources/bearing-sample";
const drawingFile = `${sampleFiles}/BM-042-B-drawing.pdf`;
const bomFile = `${sampleFiles}/BM-042-B-bom.csv`;

const steps: GuideStep[] = [
  {
    key: "verification",
    pose: { ...initialBearingCamera, boreOffset: 0 },
    evidence: { label: "Source record", value: "BM-042 · Rev B · mm" },
    title: "Verify your account",
    caption:
      "Start with the files you have the right to license. The source record ties the supplier, design revision and units to one assembly.",
    details: [
      {
        label: "What to record",
        text: "For this example, BM-042 is the mount’s assembly ID, B is the drawing and model revision, and every dimension is in millimetres. Document the original designer and the permissions covering each file.",
      },
    ],
  },
  {
    key: "proposal",
    pose: { azimuth: 0.94, elevation: 0.44, boreOffset: 0 },
    evidence: { label: "Model file", value: "BM-042-B.step" },
    title: "Prepare your proposal",
    caption:
      "The exploded view shows what buyers can inspect in the STEP assembly. Pair that file with the matching PDF drawing and a bill of materials so every part has a name, quantity and place in the assembly.",
    details: [
      {
        label: "Mounting hardware",
        text: "From above, you can see how two socket bolts and two washers line up with the housing feet. List each size and quantity once, then use the same part IDs in the model tree.",
        cue: {
          key: "proposal-hardware",
          pose: { azimuth: 0.72, elevation: 0.91, boreOffset: 0 },
          focus: "bolts",
          evidence: {
            label: "Parts list · 2 bolts, 2 washers",
            value: "BM-042-B-bom.csv",
            href: bomFile,
          },
        },
      },
      {
        label: "Bronze bushing and front seal",
        text: `From the front, the bronze bushing defines the Ø${boreDiameter} mm bore. The seal keeps debris out. Record the material of each part so buyers can distinguish the bearing surface from the seal.`,
        cue: {
          key: "proposal-bushing",
          pose: { azimuth: 0.52, elevation: 0.22, boreOffset: 0.34 },
          focus: "bushing",
          evidence: {
            label: "Parts list · Bushing and seal",
            value: "BM-042-B-bom.csv",
            href: bomFile,
          },
        },
      },
      {
        label: "Rear retainer and grease fitting",
        text: "The side view shows the retainer sitting behind the bushing and the lubricant fitting entering from above. Use separate part IDs so a buyer can identify each in the assembly tree.",
        cue: {
          key: "proposal-retainer",
          pose: { azimuth: 1.35, elevation: 0.51, boreOffset: 0 },
          focus: "retainer",
          evidence: {
            label: "Assembly tree · Retainer and fitting",
            value: "BM-042-B.step",
          },
        },
      },
    ],
  },
  {
    key: "pricing",
    pose: { azimuth: 1.03, elevation: 0.62, boreOffset: 0 },
    evidence: {
      label: "Evaluation sample",
      value: "1 assembly · 10 pieces · 3 files",
    },
    title: "Set access and pricing",
    caption:
      "Decide which files buyers can evaluate and describe how that sample relates to the full collection. Submit any paid price for review before sending the proposal.",
    details: [
      {
        label: "What the sample contains",
        text: "One complete mount with its STEP assembly, PDF drawing and parts list. The model shows all ten pieces, including both fasteners and both washers.",
      },
      {
        label: "What the licence covers",
        text: "Specify the assembly and component families available in the full collection, their formats and revisions, and what buyers may do with the files.",
      },
    ],
  },
  {
    key: "review",
    pose: { azimuth: 0.16, elevation: 0.18, boreOffset: 1 },
    focus: "bushing",
    measurement: "bore",
    evidence: {
      label: `Drawing check · Ø${boreDiameter} mm bore`,
      value: "BM-042-B-drawing.pdf",
      href: drawingFile,
    },
    title: "Submit for review",
    caption:
      "Send the model, drawing and parts list together. Check that all three refer to revision B before you submit. If a reviewer spots a mismatch, reply in Submitted proposals and resubmit the corrected package.",
    details: [
      {
        label: "Match the bore diameter",
        text: `The bushing moves clear of the housing so you can see the Ø${boreDiameter} mm measurement across the opening. Check that number in both the STEP geometry and the drawing, using millimetres for both.`,
      },
      {
        label: "Verify the bolt centres",
        text: `The view tilts over the mounting feet to show the ${boltSpacing} mm centre-to-centre spacing. Compare it with the plan view and check that the parts list counts two bolts and two washers.`,
        cue: {
          key: "review-mount",
          pose: { azimuth: 0.36, elevation: 1.13, boreOffset: 0 },
          focus: "bolts",
          measurement: "mount",
          evidence: {
            label: `Drawing check · ${boltSpacing} mm bolt centres`,
            value: "BM-042-B-drawing.pdf",
            href: drawingFile,
          },
        },
      },
    ],
  },
  {
    key: "publication",
    pose: { azimuth: 0.79, elevation: 0.43, boreOffset: 0 },
    evidence: {
      label: "Listing preview",
      value: "Bearing mount assembly · Rev B",
    },
    title: "Publish your listing",
    caption:
      "After approval, publish from My datasets and choose who can see the listing. Use the same assembly name in the listing, the preview and the sample files.",
    details: [
      {
        label: "Details the buyer sees",
        text: "Describe the model format, dimensions, units and included documents. Spell out the scope of the evaluation sample so the buyer knows they’re opening one complete mount with its matching drawing and bill of materials.",
      },
    ],
  },
];

const cueByKey = new Map(
  steps.flatMap((step) => [
    [step.key, step] as const,
    ...step.details.flatMap((detail) =>
      detail.cue ? [[detail.cue.key, detail.cue] as const] : []
    ),
  ])
);

const wideLayout = "(min-width: 68rem) and (min-height: 30rem)";

function ExampleDetails() {
  const hasProductionCollection =
    process.env.NEXT_PUBLIC_APP_ENV === "production";

  return (
    <div className={styles.creditText}>
      <strong>About this example</strong>
      <p>
        The bearing mount, drawing and parts list are examples for this
        walkthrough.
      </p>
      {hasProductionCollection && (
        <Link href="/datasets/cmvqyaj1s0001hynvd0mnfn9z">
          View Kuinbee’s engineering CAD collection
        </Link>
      )}
    </div>
  );
}

export function SuppliersGuide({ supplierQuery }: { supplierQuery: string }) {
  const layout = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const orbit = useMotionValue(steps[0].pose);
  const [current, setCurrent] = useState({
    step: steps[0].key,
    cue: steps[0] as GuideCue,
  });

  useEffect(() => {
    const frame = figure.current;
    const root = layout.current;
    if (!frame || !root) return;
    const desktop = window.matchMedia(wideLayout);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cues = Array.from(
      root.querySelectorAll<HTMLElement>("[data-model-cue]")
    );
    let pending = 0;

    const update = () => {
      pending = 0;
      root.toggleAttribute(
        "data-supplier-guide-pace",
        desktop.matches && !reduce.matches
      );
      const height = window.innerHeight;
      const bounds = frame.getBoundingClientRect();
      const top = parseFloat(window.getComputedStyle(frame).top);
      frame.toggleAttribute(
        "data-stuck",
        !desktop.matches && bounds.top <= top + 1
      );
      const line = desktop.matches
        ? Math.min(height * 0.39, 355)
        : Math.max(135, Math.min(height - 64, Math.round(bounds.bottom + 52)));
      let index = 0;
      while (
        index + 1 < cues.length &&
        cues[index + 1].getBoundingClientRect().top <= line
      )
        index++;
      const active = cues[index];
      const cue = cueByKey.get(active.dataset.modelCue ?? "") ?? steps[0];
      const step =
        active.closest<HTMLElement>("[data-guide-step]")?.dataset.guideStep ??
        steps[0].key;
      const before =
        cueByKey.get(cues[index - 1]?.dataset.modelCue ?? "") ?? cue;
      const topOfCue = active.getBoundingClientRect().top;
      const after = cues[index + 1]?.getBoundingClientRect().top;
      const distance = Math.min(
        225,
        Math.max(85, ((after ?? topOfCue + 280) - topOfCue) * 0.67)
      );
      const amount = reduce.matches
        ? 1
        : Math.min(1, Math.max(0, (line - topOfCue + 12) / distance));
      const progress = amount * amount * (3 - 2 * amount);
      const blend = (from: number, to: number) => from + (to - from) * progress;
      const pose = {
        azimuth: blend(before.pose.azimuth, cue.pose.azimuth),
        elevation: blend(before.pose.elevation, cue.pose.elevation),
        boreOffset: blend(before.pose.boreOffset, cue.pose.boreOffset),
      };
      const last = orbit.get();
      if (
        last.azimuth !== pose.azimuth ||
        last.elevation !== pose.elevation ||
        last.boreOffset !== pose.boreOffset
      )
        orbit.set(pose);
      setCurrent((previous) =>
        previous.cue.key === cue.key ? previous : { step, cue }
      );
    };

    const schedule = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);
    const observer =
      "ResizeObserver" in window ? new ResizeObserver(schedule) : undefined;
    observer?.observe(root);
    observer?.observe(frame);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
      root.removeAttribute("data-supplier-guide-pace");
      observer?.disconnect();
      cancelAnimationFrame(pending);
    };
  }, [orbit]);

  return (
    <section
      id="guide"
      className={styles.section}
      aria-labelledby="publishing-guide-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="publishing-guide-title">From source to listing</h2>
          <Popover>
            <PopoverTrigger
              type="button"
              className={styles.credit}
              aria-label="About the engineering CAD example"
            >
              Example · Engineering CAD <Info size={16} aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              collisionPadding={12}
              className="max-w-[calc(100vw-1.5rem)]"
              aria-label="About the engineering CAD example"
            >
              <ExampleDetails />
            </PopoverContent>
          </Popover>
          <noscript>
            <ExampleDetails />
          </noscript>
        </header>
        <div ref={layout} className={styles.layout}>
          <div ref={figure} className={styles.sharedArt}>
            <SupplierCadExample
              opened={current.step !== "verification"}
              cue={current.cue.key}
              focus={current.cue.focus ?? null}
              measurement={current.cue.measurement}
              evidence={current.cue.evidence}
              orbit={orbit}
            />
          </div>
          <ol className={styles.steps} role="list">
            {steps.map(({ key: id, title, caption, details }, index) => (
              <li
                key={id}
                id={`guide-${id}`}
                className={styles.step}
                data-guide-step={id}
                data-model-cue={id}
                data-current={current.step === id ? "" : undefined}
              >
                <div className={styles.stepCopy}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{caption}</p>
                    <dl className={styles.details}>
                      {details.map(({ label, text, cue }) => {
                        return (
                          <div
                            key={label}
                            data-model-cue={cue?.key}
                            data-reading={
                              cue && current.cue.key === cue.key
                                ? ""
                                : undefined
                            }
                          >
                            <dt>{label}</dt>
                            <dd>{text}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <SupplierEntryLink className={styles.contact} query={supplierQuery}>
          Apply to become a supplier <ArrowRight size={16} aria-hidden="true" />
        </SupplierEntryLink>
      </div>
    </section>
  );
}
