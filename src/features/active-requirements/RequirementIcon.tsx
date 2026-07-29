import { FileCheck2, Headphones, Images, Layers3, Video } from "lucide-react";
import type { RequirementKind } from "./active-requirements.data";

export function RequirementIcon({
  kind,
  className,
}: {
  kind: RequirementKind;
  className?: string;
}) {
  const props = { className, "aria-hidden": true as const };

  switch (kind) {
    case "audio":
      return <Headphones {...props} />;
    case "image":
      return <Images {...props} />;
    case "video":
      return <Video {...props} />;
    case "multimodal":
      return <Layers3 {...props} />;
    case "compliance":
      return <FileCheck2 {...props} />;
  }
}
