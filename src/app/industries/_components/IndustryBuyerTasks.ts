export type IndustryBuyerTask = {
  id: string;
  label: string;
  description: string;
  specs: readonly { label: string; value: string }[];
  servicesHref: string;
};

export const industryBuyerTasks = {
  egocentric: [
    {
      id: "robotic-manipulation",
      label: "Robotic manipulation",
      description:
        "Compare first-person demonstrations of hands, tools, and objects through complete task attempts. Check whether the camera view and annotations capture the physical interactions your project needs.",
      specs: [
        {
          label: "Viewpoint",
          value:
            "Camera position, field of view, and hand and object visibility.",
        },
        {
          label: "Coverage",
          value:
            "Tasks, tools, participants, settings, and successful and unsuccessful attempts.",
        },
        {
          label: "Annotations",
          value:
            "Action steps, object interactions, task boundaries, and annotation definitions.",
        },
      ],
      servicesHref: "/data-request/services?q=egocentric",
    },
    {
      id: "activity-understanding",
      label: "Activity understanding",
      description:
        "Longer first-person recordings preserve the context around an action. Compare how activities are defined and labelled, how much of the workflow is recorded, and who takes part.",
      specs: [
        {
          label: "Sequence",
          value:
            "Continuous footage before, during, and after each recorded activity.",
        },
        {
          label: "Context",
          value:
            "People, roles, tools, interruptions, and interactions throughout the workflow.",
        },
        {
          label: "Labels",
          value: "Activity names, start and end times, and annotation rules.",
        },
      ],
      servicesHref: "/data-request/services?q=egocentric",
    },
    {
      id: "spatial-navigation",
      label: "Spatial navigation",
      description:
        "Routes through rooms, aisles, or outdoor spaces capture changing viewpoints and scene transitions. Compare route continuity, environmental coverage, and any motion signals your project needs alongside video.",
      specs: [
        {
          label: "Routes",
          value:
            "Recording duration, scene transitions, and continuity across each route.",
        },
        {
          label: "Settings",
          value:
            "Layouts, lighting, obstacles, and camera movement across recorded environments.",
        },
        {
          label: "Signals",
          value: "Video timestamps and aligned motion or pose, where required.",
        },
      ],
      servicesHref: "/data-request/services?q=egocentric",
    },
  ],
  healthcare: [
    {
      id: "medical-imaging",
      label: "Medical imaging",
      description:
        "An imaging collection needs context about how scans were produced and annotated. Compare the imaging method, represented population, and supporting reports or labels with your project requirements.",
      specs: [
        {
          label: "Acquisition",
          value:
            "Imaging method, body region, acquisition protocol, and file formats.",
        },
        {
          label: "Coverage",
          value:
            "Population, care settings, sites, and devices represented in recordings.",
        },
        {
          label: "Labels",
          value:
            "Label definitions, annotation methods, and reports linked to scans.",
        },
      ],
      servicesHref: "/data-request/services?industries=HEALTHCARE",
    },
    {
      id: "clinical-records",
      label: "Clinical records",
      description:
        "Visits, results, and treatments can describe change over time. Check which records are included, how dates are represented, and how outcomes and missing information are defined.",
      specs: [
        {
          label: "Records",
          value:
            "Visit notes, lab results, treatments, and documented field definitions.",
        },
        {
          label: "Timing",
          value:
            "Observation period, event dates, and length of available follow-up.",
        },
        {
          label: "Definitions",
          value:
            "Outcome labels, missing-value conventions, and documentation of record structure.",
        },
      ],
      servicesHref: "/data-request/services?industries=HEALTHCARE",
    },
    {
      id: "linked-records-signals",
      label: "Linked records and signals",
      description:
        "If your project combines images, clinical records, or physiological signals, establish how those sources connect to the same case. Compare timing, recording boundaries, and gaps across data types.",
      specs: [
        {
          label: "Connections",
          value: "Record identifiers and the method used to link sources.",
        },
        {
          label: "Timing",
          value:
            "Acquisition dates, session boundaries, and synchronization across recorded signals.",
        },
        {
          label: "Completeness",
          value:
            "Missing records, recording gaps, and coverage across data types.",
        },
      ],
      servicesHref: "/data-request/services?industries=HEALTHCARE",
    },
  ],
  voice: [
    {
      id: "speech-recognition",
      label: "Speech recognition",
      description:
        "Compare transcribed speech with the languages, speakers, and recording conditions your system will encounter. Check how transcripts were produced and how their timing connects to the audio.",
      specs: [
        {
          label: "Speakers",
          value:
            "Languages, accents, speaking styles, and coverage across different participants.",
        },
        {
          label: "Recording",
          value:
            "Devices, background sound, microphone distance, and delivered audio format.",
        },
        {
          label: "Transcripts",
          value:
            "Transcription rules, review process, and timing of labelled segments.",
        },
      ],
      servicesHref: "/data-request/services?collectionMethods=AUDIO_COLLECTION",
    },
    {
      id: "conversation-understanding",
      label: "Conversation understanding",
      description:
        "Conversations include pauses, interruptions, and overlapping speech. Compare how recordings preserve these interactions, how speakers are identified, and whether transcripts and labels provide the context your project needs.",
      specs: [
        {
          label: "Interaction",
          value:
            "Speaker count, conversation length, and natural or prompted speech.",
        },
        {
          label: "Turns",
          value:
            "Speaker identification, turn boundaries, and labels for overlapping speech.",
        },
        {
          label: "Context",
          value:
            "Conversation settings, transcripts, and definitions of task or event labels.",
        },
      ],
      servicesHref: "/data-request/services?collectionMethods=AUDIO_COLLECTION",
    },
    {
      id: "speech-synthesis",
      label: "Speech synthesis",
      description:
        "Compare recording consistency, language coverage, and how each audio segment connects to its text. Review the speaker mix, speaking styles, and usage rights for your intended project.",
      specs: [
        {
          label: "Capture",
          value:
            "Microphone, room conditions, recording levels, and delivered audio format.",
        },
        {
          label: "Coverage",
          value:
            "Speakers, languages, text content, and range of speaking styles.",
        },
        {
          label: "Alignment",
          value:
            "Audio segmentation, corresponding text, and conventions for each label.",
        },
      ],
      servicesHref: "/data-request/services?collectionMethods=AUDIO_COLLECTION",
    },
  ],
} as const satisfies Record<
  "egocentric" | "healthcare" | "voice",
  readonly IndustryBuyerTask[]
>;
