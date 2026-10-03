export const voiceStoryChapters = [
  {
    id: "record",
    label: "Record",
    title: "Start with the way people actually speak.",
    description:
      "A conversation carries more than words. Speakers, pauses, distance, and background sound shape the recording. Begin with the situations your system will encounter.",
    fields: [
      { label: "People", value: "Languages, accents, and speaking styles" },
      { label: "Conditions", value: "Device, distance, and background sound" },
    ],
    questions: [
      "Are the speakers and recording conditions relevant to your model?",
      "Is the speech scripted, spontaneous, or conversational?",
    ],
  },
  {
    id: "align",
    label: "Align",
    title: "Give the sound a readable structure.",
    description:
      "Transcripts connect words to audio. Speaker turns and timing describe who spoke and when. Ask how pauses, overlap, and unclear speech are labelled—not just whether a transcript exists.",
    fields: [
      { label: "Words", value: "Transcription rules and review method" },
      { label: "Timing", value: "Segments, speaker turns, and boundaries" },
    ],
    questions: [
      "Do labels describe recordings, utterances, or individual words?",
      "How are overlapping or unclear speech and missing segments handled?",
    ],
  },
  {
    id: "source",
    label: "Source",
    title: "Turn the listening task into a sourcing brief.",
    description:
      "On Kuinbee, explore published datasets, compare audio collection services, or submit a specific requirement for review. Match coverage, recordings, labels, and usage terms to the system you are building.",
    fields: [
      {
        label: "Coverage",
        value: "Speakers, languages, scenarios, and volume",
      },
      { label: "Delivery", value: "Audio, labels, formats, and usage terms" },
    ],
    questions: [
      "Does an existing collection cover the settings and speaker mix you need?",
      "Are the delivered labels, formats, and usage terms suitable?",
    ],
  },
] as const;

export type VoiceStoryChapter = (typeof voiceStoryChapters)[number];
