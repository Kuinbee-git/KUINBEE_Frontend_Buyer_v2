import { IndustryEditorialPage } from "@/app/industries/_components/IndustryEditorialPage";
import { IndustryBuyerBrief } from "@/app/industries/_components/IndustryBuyerBrief";
import type { IndustryScene } from "@/app/industries/_components/IndustryPagePrimitives";
import { EgocentricScrollStory } from "./EgocentricScrollStory";
import { EgocentricMotionOpening } from "./EgocentricMotionOpening";

const scenes: readonly IndustryScene[] = [
  {
    id: "collaboration",
    label: "Collaborative work",
    title: "Understand the work between people.",
    description:
      "Shared tools, spoken instructions, and another person’s actions change what the wearer sees. First-person footage records handovers and shared tool use for models that recognize collaborative activity.",
    image:
      "/images/industries/egocentric/egocentric-collaborative-task-v1.webp",
    lightImage:
      "/images/industries/egocentric/egocentric-collaborative-task-light-v2.webp",
    alt: "First-person pencil sketch of a participant working on a camera with a colleague at a workbench",
    modelUse: "Wearable assistance & activity understanding",
    requirements: [
      { label: "Capture", value: "First-person video with task context" },
      { label: "Labels", value: "Tool use, handovers, instructions" },
      { label: "Variation", value: "People, roles, visibility, workflows" },
    ],
    href: "/data-request/services?q=egocentric",
    linkLabel: "Explore collection services",
  },
  {
    id: "navigation",
    label: "Spatial navigation",
    title: "Follow the task as the world changes.",
    description:
      "Movement connects one interaction to the next. Longer sequences show changing viewpoints, obstacles, and scene transitions that isolated clips can miss.",
    image:
      "/images/industries/egocentric/egocentric-spatial-navigation-v1.webp",
    lightImage:
      "/images/industries/egocentric/egocentric-spatial-navigation-light-v2.webp",
    alt: "First-person pencil sketch of a person carrying a parcel through warehouse aisles",
    modelUse: "Spatial reasoning & embodied systems",
    requirements: [
      { label: "Capture", value: "Video across routes and transitions" },
      { label: "Signals", value: "Motion or pose, where required" },
      { label: "Variation", value: "Routes, layouts, lighting, obstacles" },
    ],
    href: "/data-request/submit-requirement",
    linkLabel: "Describe your collection need",
  },
];

const questions = [
  {
    title: "What makes first-person footage different?",
    answer:
      "The camera moves with the participant. Hands, objects, movement, and partial visibility become part of the record. For buyers, that means evaluating camera placement and real task conditions alongside resolution or volume.",
  },
  {
    title: "Should I buy existing data or request collection?",
    answer:
      "Start with existing datasets when the activities, environments, and capture setup fit your project. Explore collection services when you need a particular workflow, participant group, sensor combination, or annotation scheme.",
  },
  {
    title: "What should I put in a collection brief?",
    answer:
      "Describe the task and setting first. Then specify participant coverage, viewpoint, recording length, sensors, labels, expected volume, and delivery format. Include successful and unsuccessful attempts if both matter to the model.",
  },
  {
    title: "What should I review before choosing a dataset?",
    answer:
      "Check representative footage, capture specifications, task coverage, annotation definitions, synchronization, and missing segments. Review the available source, licence, and access information, and confirm any requirements that are not covered in the listing.",
  },
];

const routes = [
  {
    label: "Datasets",
    title: "Search existing egocentric data",
    description:
      "Explore published listings and inspect source, format, licence, and access details.",
    href: "/datasets?q=egocentric",
  },
  {
    label: "Collection",
    title: "Compare collection services",
    description:
      "Review supplier methods, coverage, deliverables, and quality processes.",
    href: "/data-request/services?q=egocentric",
  },
  {
    label: "Custom",
    title: "Submit your data requirement",
    description:
      "Give Kuinbee the task, coverage, signals, and delivery requirements to review.",
    href: "/data-request/submit-requirement",
  },
];

export function EgocentricPageContent() {
  return (
    <IndustryEditorialPage
      industry="egocentric"
      name="Egocentric"
      opening={<EgocentricMotionOpening />}
      story={<EgocentricScrollStory />}
      buyerBrief={<IndustryBuyerBrief industry="egocentric" />}
      sceneHeading="Different tasks. Different data needs."
      sceneDescription="An assembly task, a shared workflow, and a route through a building need different coverage. Match the recording conditions to the behavior your model must understand."
      scenes={scenes}
      questions={questions}
      routes={routes}
      sourcingTitle="A practical route to the right data."
      sourcingContext="Kuinbee brings published datasets and supplier collection services into one sourcing workflow. Compare the available details, or submit the task, coverage, and delivery needs of a custom project for review."
    />
  );
}
