import { User, Settings, Activity, MessageSquare } from "lucide-react";

export const ACCOUNT_SIDEBAR_SECTIONS = {
  profile: {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/account/profile",
  },
  preferences: {
    id: "preferences",
    label: "Preferences",
    icon: Settings,
    href: "/account/preferences",
  },
  activity: {
    id: "activity",
    label: "Activity",
    icon: Activity,
    href: "/account/activity",
  },
  support: {
    id: "support",
    label: "Support",
    icon: MessageSquare,
    href: "/account/support",
  },
};
