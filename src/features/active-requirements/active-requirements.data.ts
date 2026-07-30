export type RequirementKind =
  | "audio"
  | "image"
  | "video"
  | "multimodal"
  | "compliance";

export interface ActiveRequirement {
  id: string;
  slug: string;
  title: string;
  kind: RequirementKind;
  type: string;
  typeDetails?: string[];
  summary: string;
  specifications: string[];
  volume?: string[];
  deliveryDate?: string;
}

export const activeRequirements: ActiveRequirement[] = [
  {
    id: "AR-001",
    slug: "doctor-patient-conversation",
    title: "Doctor Patient Conversation",
    kind: "audio",
    type: "Audio",
    summary:
      "Existing off-the-shelf doctor-patient conversation audio is required.",
    specifications: ["Existing OTS data only; no custom data"],
    volume: ["Up to 4,000 hours"],
  },
  {
    id: "AR-002",
    slug: "contracts-dataset",
    title: "Contracts Dataset",
    kind: "compliance",
    type: "Source, Licensing and Compliance",
    summary:
      "A contracts dataset with clear provenance and commercial usage rights.",
    specifications: [
      "Information about dataset origin",
      "Licensing information",
      "Commercial usage rights",
    ],
  },
  {
    id: "AR-003",
    slug: "infographic-image-dataset",
    title: "Infographic Image Dataset",
    kind: "image",
    type: "Images from diverse subject areas",
    typeDetails: [
      "Business and Finance",
      "Healthcare and Medical",
      "Education",
      "Science and Technology",
      "Environment and Sustainability",
      "Government and Public Information",
      "Marketing and Social Media",
      "Statistics and Data Visualisation",
      "Process Flow Diagrams",
      "Fitness and Wellness",
      "Timelines",
      "Organisational Charts",
      "Maps",
      "Comparison Charts",
      "Product Information",
      "Safety Instructions",
      "Travel and Tourism",
      "Food and Nutrition",
    ],
    summary:
      "A large OTS collection of high-resolution infographic images across diverse subject areas.",
    specifications: [
      "Off-the-shelf data",
      "JPEG, PNG or WebP format; WebP preferred",
      "Minimum resolution: 512 × 512 px",
      "Preferred resolution: 1024 × 1024 px",
    ],
    volume: ["10 lakh images"],
  },
  {
    id: "AR-004",
    slug: "live-data-calls-agentic-filmmaking-edit-packs",
    title: "Live Data Calls",
    kind: "video",
    type: "Agentic Filmmaking Edit Packs V1.2",
    summary:
      "Source assets and complete editing project files for agentic filmmaking workflows.",
    specifications: [
      "Raw footage or source assets in any file type",
      "Preferred final delivery: edited video, NLE project file (.prproj, DaVinci or Avid), EDL, and metadata or notes",
    ],
    volume: ["Sample: 5–10 projects", "Target: 300–500 projects"],
    deliveryDate: "August 24, 2026",
  },
  {
    id: "AR-005",
    slug: "call-centre-speech-dataset",
    title: "Call Centre Speech Dataset",
    kind: "audio",
    type: "Speech — Hindi and US English",
    summary:
      "High-quality customer-agent call recordings covering diverse speakers and call scenarios.",
    specifications: [
      "Audio sample rate: 44 kHz",
      "Clear, high-quality call recordings",
      "Real customer-agent conversations or realistic simulated conversations",
      "A variety of call scenarios, including customer support, inquiries, complaints and sales",
      "Speaker diversity across gender, age and accent",
      "Proper transcription and speaker diarization preferred",
    ],
  },
  {
    id: "AR-006",
    slug: "unscripted-two-person-conversational-audio-video",
    title: "Unscripted Two-Person Conversational Audio-Video Dataset",
    kind: "multimodal",
    type: "Audio and Video",
    summary:
      "Synchronized, consented recordings of natural conversations between two adults.",
    specifications: [
      "Two adults engaged in a natural, friendly conversation as friends or family members, not strangers",
      "Webcam recording at 1080p or higher and 30 fps, with faces clearly visible and good lighting",
      "48 kHz audio with one microphone per speaker and separate audio tracks",
      "Four files per session: Speaker 1 video, Speaker 2 video, Speaker 1 audio and Speaker 2 audio",
      "Audio and video synchronized within 40 ms",
      "Session duration: 10–60 minutes",
      "Multiple languages with a balanced distribution",
      "Verbatim transcripts with speaker labels and timestamps",
      "Signed participant consent permitting commercial and AI/ML use",
      "Participants must be 18 years or older",
      "Maximum contribution of three hours per participant",
      "No scripted conversations, AI-generated content or minors",
    ],
  },
  {
    id: "AR-007",
    slug: "generic-image-and-short-video",
    title: "Generic Image and Short Video",
    kind: "multimodal",
    type: "OTS generic content for videos and images",
    summary:
      "Private, sublicensable image and short-video datasets, with annotated content preferred.",
    specifications: [
      "Annotated datasets are highly preferred",
      "High-quality raw or non-annotated generic datasets will also be considered",
      "Closed-source only: open-source, web-scraped or publicly available data will not be accepted",
      "Full sublicensing rights must be granted for all provided media",
    ],
    volume: [
      "Short videos: 150 bundles, with 3000 video files per bundle",
      "Images: 300 bundles, with 3,000 images per bundle",
    ],
  },
  {
    id: "AR-008",
    slug: "real-world-meeting-audio",
    title: "Real-World Meeting Audio",
    kind: "audio",
    type: "Multilingual audio",
    typeDetails: [
      "English",
      "Spanish",
      "German",
      "French",
      "Italian",
      "Portuguese",
      "Chinese",
      "Japanese",
      "Arabic",
    ],
    summary:
      "Real-world multilingual meeting audio, preferably with human-produced transcripts.",
    specifications: [
      "Human-transcribed meeting audio datasets preferred",
      "Audio-only datasets are also accepted when transcripts are not available",
    ],
  },
  {
    id: "AR-009",
    slug: "low-ego-data-collection",
    title: "Low Ego Data Collection Requirement",
    kind: "video",
    type: "Landscape video",
    summary:
      "Wide-field landscape video captured in an accepted delivery format.",
    specifications: [
      "Resolution: 2 megapixels",
      "Frame rate: 30 fps",
      "Video format: MP4 with H.264 encoding",
      "H.265/HEVC and raw PNG or JPEG frames are not accepted",
      "Diagonal field of view: 120° to 170°",
      "Aspect ratio: landscape",
    ],
  },
];

export function getActiveRequirement(slug: string) {
  return activeRequirements.find((requirement) => requirement.slug === slug);
}
