import { User, Settings, Activity, MessageSquare } from "lucide-react";

export const ACCOUNT_SIDEBAR_SECTIONS = {
  profile: {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/account?tab=profile",
  },
  preferences: {
    id: "preferences",
    label: "Preferences",
    icon: Settings,
    href: "/account?tab=preferences",
  },
  activity: {
    id: "activity",
    label: "Activity",
    icon: Activity,
    href: "/account?tab=activity",
  },
  support: {
    id: "support",
    label: "Support",
    icon: MessageSquare,
    href: "/account?tab=support",
  },
};
