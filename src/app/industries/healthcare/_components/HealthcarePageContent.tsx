import { IndustryEditorialPage } from "@/app/industries/_components/IndustryEditorialPage";
import { IndustryBuyerBrief } from "@/app/industries/_components/IndustryBuyerBrief";
import { IndustryMotionOpening } from "@/app/industries/_components/IndustryMotionOpening";
import type { IndustryScene } from "@/app/industries/_components/IndustryPagePrimitives";
import { HealthcareScrollStory } from "./HealthcareScrollStory";

const scenes: readonly IndustryScene[] = [
  {
    id: "clinical-records",
    label: "Clinical records",
    title: "Follow the record through care.",
    description:
      "Visits, lab results, treatments, and follow-up each tell part of the story. Their order and connection matter when a project needs to understand change over time.",
    image:
      "/images/industries/healthcare/healthcare-clinical-consultation-light-v3.webp",
    alt: "Pencil sketch of a physician discussing a clinical record on a tablet with an older patient",
    modelUse: "Clinical language, progression, and outcomes",
    requirements: [
      { label: "Records", value: "Visits, lab results, treatments" },
      { label: "Timing", value: "Observation period and follow-up" },
      { label: "Labels", value: "Outcome definitions and missing records" },
    ],
    href: "/data-request/services?industries=HEALTHCARE",
    linkLabel: "Explore healthcare collection services",
  },
  {
    id: "physiological-signals",
    label: "Physiological signals",
    title: "Understand the conditions behind the signal.",
    description:
      "A waveform or wearable recording needs its device, sampling rate, and session details. Movement, gaps, and event labels help explain what the recording can support.",
    image:
      "/images/industries/healthcare/healthcare-patient-monitoring-light-v3.webp",
    alt: "Pencil sketch of a nurse fitting a fingertip sensor to a seated patient beside a small monitor",
    modelUse: "Monitoring and physiological analysis",
    requirements: [
      { label: "Signals", value: "Waveforms or wearable recordings" },
      { label: "Session", value: "Device, sampling rate, and timing" },
      { label: "Review", value: "Recording gaps and event definitions" },
    ],
    href: "/data-request/submit-requirement",
    linkLabel: "Describe your healthcare data need",
  },
];

const questions = [
  {
    title: "What should I compare in a medical imaging dataset?",
    answer:
      "Start with the imaging method, body region, acquisition protocol, and site or device coverage. Then review available reports, labels, annotation methods, and file formats against your project requirements.",
  },
  {
    title: "When should I explore a collection service?",
    answer:
      "Compare existing datasets first when the population, data type, setting, and time period fit. Explore collection services when you need specific coverage, a recording protocol, linked records, or a particular annotation approach.",
  },
  {
    title: "What belongs in a healthcare data brief?",
    answer:
      "Describe the project purpose and intended setting. Specify the population, geography, data type, collection period, volume, labels, formats, and access requirements. Say which records must connect to the same case or visit.",
  },
  {
    title: "How should I compare what will be delivered?",
    answer:
      "Review file formats, field definitions, identifiers, timestamps, missing-value conventions, annotation files, and supporting documentation. Confirm the usage rights and access conditions you need.",
  },
] as const;

const routes = [
  {
    label: "Datasets",
    title: "Explore existing healthcare data",
    description:
      "Inspect published listings for source, coverage, formats, licence, and access details.",
    href: "/datasets?q=healthcare",
  },
  {
    label: "Collection",
    title: "Compare healthcare collection services",
    description:
      "Review supplier methods, care settings, coverage, deliverables, and quality processes.",
    href: "/data-request/services?industries=HEALTHCARE",
  },
  {
    label: "Custom",
    title: "Share your healthcare requirement",
    description:
      "Give Kuinbee your population, data type, labels, and delivery needs for review.",
    href: "/data-request/submit-requirement",
  },
] as const;

export function HealthcarePageContent() {
  return (
    <IndustryEditorialPage
      industry="healthcare"
      name="Healthcare"
      opening={
        <IndustryMotionOpening
          industry="healthcare"
          title="See the whole clinical picture."
          description="Imaging, clinical records, and physiological signals. Source data with the context your healthcare AI project needs."
          datasetHref="/datasets?q=healthcare"
          datasetLabel="Explore healthcare data"
          storyId="healthcare-story"
          film={{
            src: "/images/industries/healthcare/healthcare-hero-film-v2.mp4",
            poster:
              "/images/industries/healthcare/healthcare-hero-film-v2-poster.webp",
            mobileSrc:
              "/images/industries/healthcare/healthcare-hero-film-mobile-v2.mp4",
            mobilePoster:
              "/images/industries/healthcare/healthcare-hero-film-mobile-v2-poster.webp",
            description:
              "Original three-scene sketch sequence: radiology review, microscope work in a laboratory, and wrist-sensor research. Illustrative, not patient data, clinical findings, or a dataset sample.",
          }}
        />
      }
      story={<HealthcareScrollStory />}
      buyerBrief={<IndustryBuyerBrief industry="healthcare" />}
      sceneHeading="Different records. A shared clinical context."
      sceneDescription="A scan, a consultation, and a measurement capture different parts of care. Choose the data types and connections that your project actually needs."
      scenes={scenes}
      questions={questions}
      routes={routes}
      sourcingTitle="Source data for your healthcare project."
      sourcingContext="Explore published datasets, compare healthcare collection services, or send Kuinbee a specific requirement for review."
      note="Scenes and diagrams are illustrations. Verify each listing’s suitability, usage rights, and access conditions for your project."
    />
  );
}
