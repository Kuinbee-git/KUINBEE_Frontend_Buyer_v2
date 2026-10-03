import { IndustryEditorialPage } from "@/app/industries/_components/IndustryEditorialPage";
import { IndustryBuyerBrief } from "@/app/industries/_components/IndustryBuyerBrief";
import { IndustryMotionOpening } from "@/app/industries/_components/IndustryMotionOpening";
import type { IndustryScene } from "@/app/industries/_components/IndustryPagePrimitives";
import { VoiceScrollStory } from "./VoiceScrollStory";

const scenes: readonly IndustryScene[] = [
  {
    id: "devices-settings",
    label: "Devices and settings",
    title: "Record the conditions people speak in.",
    description:
      "A phone in transit, a headset at a desk, and a room microphone capture different sound. Compare the device, distance, and background noise with the setting where the model will be used.",
    image: "/images/industries/voice/voice-transit-recording-light-v4.webp",
    alt: "Graphite illustration of a woman recording a voice message on a smartphone while seated at a transit station",
    modelUse: "Speech recognition in real environments",
    requirements: [
      { label: "Channel", value: "Phone, headset, or room microphone" },
      { label: "Setting", value: "Distance and background sound" },
      { label: "Audio", value: "Sample rate, encoding, and file format" },
    ],
    href: "/data-request/services?collectionMethods=AUDIO_COLLECTION",
    linkLabel: "Compare audio collection services",
  },
  {
    id: "transcripts-labels",
    label: "Transcripts and labels",
    title: "Connect the words to the recording.",
    description:
      "Transcripts, speaker turns, and timestamps explain what happened in the audio. Check the transcription rules and how labels connect to the sounds they describe.",
    image: "/images/industries/voice/voice-audio-annotation-light-v4.webp",
    alt: "Graphite illustration of an audio annotator wearing headphones and reviewing a waveform and speaker segments on a laptop",
    modelUse: "Training, evaluation, and audio analysis",
    requirements: [
      { label: "Transcript", value: "Words and transcription conventions" },
      { label: "Timing", value: "Utterance, word, or speaker boundaries" },
      { label: "Quality", value: "Review method and missing segments" },
    ],
    href: "/data-request/submit-requirement",
    linkLabel: "Describe a voice data requirement",
  },
];

const questions = [
  {
    title: "How does the model task change the data I need?",
    answer:
      "Speech recognition usually needs transcribed recordings across relevant speakers and settings. Conversation work needs speaker turns and context. Speech synthesis needs consistent recordings, useful text coverage, and suitable usage rights. Audio analysis needs clear event labels and timing.",
  },
  {
    title: "Should I choose scripted or natural speech?",
    answer:
      "Scripted recordings provide control over the words and recording setup. Natural conversations include pauses, interruptions, overlap, and changes in speaking style. Compare those conditions with how people will use your system.",
  },
  {
    title: "What should I check in transcripts and labels?",
    answer:
      "Review transcription conventions, speaker identification, timestamp precision, handling of unclear speech, and the review process. Confirm whether labels describe whole recordings, utterances, words, or individual events.",
  },
  {
    title: "What belongs in a voice collection brief?",
    answer:
      "Specify the intended use, languages, accents, speaker coverage, speaking style, devices, environments, volume, transcripts, labels, formats, and usage needs. Include examples of the conversations or audio events you want to capture.",
  },
] as const;

const routes = [
  {
    label: "Datasets",
    title: "Explore existing voice data",
    description:
      "Inspect published listings for source, coverage, formats, licence, and access details.",
    href: "/datasets?category=voice",
  },
  {
    label: "Collection",
    title: "Compare audio collection services",
    description:
      "Review supplier methods, languages, recording settings, deliverables, and quality processes.",
    href: "/data-request/services?collectionMethods=AUDIO_COLLECTION",
  },
  {
    label: "Custom",
    title: "Share your voice data requirement",
    description:
      "Give Kuinbee your speakers, settings, volume, labels, and delivery needs for review.",
    href: "/data-request/submit-requirement",
  },
] as const;

export function VoicePageContent() {
  return (
    <IndustryEditorialPage
      industry="voice"
      name="Voice"
      opening={
        <IndustryMotionOpening
          industry="voice"
          title="Hear the real world."
          description="Speech and audio data across speakers, languages, and real recording conditions. Explore published datasets and collection services on Kuinbee by coverage, recording setup, transcripts, and labels."
          datasetHref="/datasets?category=voice"
          datasetLabel="Explore voice data"
          storyId="voice-story"
          film={{
            src: "/images/industries/voice/voice-hero-film-v2.mp4",
            poster: "/images/industries/voice/voice-hero-film-v2-poster.webp",
            mobileSrc: "/images/industries/voice/voice-hero-film-mobile-v2.mp4",
            mobilePoster:
              "/images/industries/voice/voice-hero-film-mobile-v2-poster.webp",
            description:
              "Original three-scene sketch sequence: a narrator reading, headset testing, and a voice message in a courtyard. Illustrative, not voice recordings, real transcripts, or a dataset sample.",
          }}
        />
      }
      story={<VoiceScrollStory />}
      buyerBrief={<IndustryBuyerBrief industry="voice" />}
      sceneHeading="The recording setting matters. So do the labels."
      sceneDescription="The same words can arrive through different devices, noise, and conversation styles. The recording and its annotations need to fit the system you are building."
      scenes={scenes}
      questions={questions}
      routes={routes}
      sourcingTitle="Find voice data for the real setting."
      sourcingContext="Explore published voice datasets, compare audio collection services, or send Kuinbee a specific requirement for review."
    />
  );
}
