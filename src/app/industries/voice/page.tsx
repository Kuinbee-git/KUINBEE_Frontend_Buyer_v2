import type { Metadata } from "next";

import { generateMetadata as genMeta } from "@/core/config";
import { VoicePageContent } from "./_components/VoicePageContent";

export const metadata: Metadata = genMeta({
  title: "Voice and Speech Data for AI | Kuinbee",
  description:
    "Explore voice and speech datasets across languages, speakers, devices, environments, and annotation formats.",
  keywords: [
    "voice data",
    "speech datasets",
    "conversational audio data",
    "speech recognition data",
    "voice AI data",
  ],
  path: "/industries/voice",
});

export default function VoiceIndustryPage() {
  return <VoicePageContent />;
}
