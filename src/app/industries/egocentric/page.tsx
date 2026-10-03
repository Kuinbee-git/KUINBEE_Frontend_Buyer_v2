import type { Metadata } from "next";

import { generateMetadata as genMeta } from "@/core/config";
import { EgocentricPageContent } from "./_components/EgocentricPageContent";

export const metadata: Metadata = genMeta({
  title: "Egocentric Data for AI and Robotics | Kuinbee",
  description:
    "Explore first-person video, image, audio, and sensor data for computer vision, robotics, wearable AI, and embodied systems.",
  keywords: [
    "egocentric data",
    "first-person video data",
    "robotics training data",
    "embodied AI data",
    "wearable AI data",
  ],
  path: "/industries/egocentric",
});

export default function EgocentricIndustryPage() {
  return <EgocentricPageContent />;
}
