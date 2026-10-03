export const egocentricStoryHero = {
  headline: "See the task unfold.",
  intro:
    "First-person video, actions, and context. Find data that matches the way your model needs to see the world.",
} as const;

export const egocentricStoryChapters = [
  {
    id: "capture",
    label: "Capture",
    title: "Start with the participant’s view.",
    description:
      "A first-person recording moves with the wearer. Camera position, hand visibility, and continuous footage determine what a model can observe about the task.",
    fields: [
      { label: "Viewpoint", value: "Camera placement and field of view" },
      { label: "Visibility", value: "Hands, tools, and task continuity" },
    ],
    questions: [
      "Are hands, tools, and objects visible throughout the task?",
      "Does the camera setup match the viewpoint you need?",
    ],
  },
  {
    id: "structure",
    label: "Structure",
    title: "Connect the action to the record.",
    description:
      "Labels and timestamps give an interaction structure. When audio or motion is included, check how it stays aligned with the video—not just whether it exists.",
    fields: [
      { label: "Actions", value: "Label definitions and step boundaries" },
      { label: "Alignment", value: "Video timing; optional audio or motion" },
    ],
    questions: [
      "What does each action label mean, and where does it begin?",
      "How are any additional signals aligned with the video?",
    ],
  },
  {
    id: "source",
    label: "Source",
    title: "Turn the task into a clear brief.",
    description:
      "On Kuinbee, inspect dataset listings, compare supplier collection methods, or submit a custom requirement for review. Begin with the task, coverage, and usage your project needs.",
    fields: [
      { label: "Coverage", value: "Tasks, participants, and conditions" },
      { label: "Review", value: "Labels, formats, and usage terms" },
    ],
    questions: [
      "Does an existing dataset cover the task and its variations?",
      "Are the labels, delivery formats, and usage terms suitable?",
    ],
  },
] as const;

export type EgocentricStoryChapter = (typeof egocentricStoryChapters)[number];
