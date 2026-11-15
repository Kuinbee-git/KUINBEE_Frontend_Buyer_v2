export const ACCOUNT_SIDEBAR_SECTIONS = {
  profile: [
    {
      title: "PROFILE",
      items: [
        { label: "Personal Information", href: "/account/profile" },
        { label: "Security", href: "/account/security" },
        { label: "Linked Accounts", href: "/account/linked-accounts" },
      ],
    },
    {
      title: "RECORDS",
      items: [{ label: "Orders", href: "/orders" }],
    },
  ],
  preferences: [
    {
      title: "PREFERENCES",
      items: [{ label: "Preferences", href: "/account/preferences" }],
    },
    {
      title: "RECORDS",
      items: [{ label: "Orders", href: "/orders" }],
    },
  ],
  activity: [
    {
      title: "ACTIVITY",
      items: [{ label: "Wishlist", href: "/wishlist" }],
    },
    {
      title: "RECORDS",
      items: [{ label: "Orders", href: "/orders" }],
    },
  ],
  support: [
    {
      title: "SUPPORT",
      items: [
        { label: "Tickets", href: "/account/support/tickets" },
        { label: "Create Ticket", href: "/account/support/create" },
      ],
    },
    {
      title: "RECORDS",
      items: [{ label: "Orders", href: "/orders" }],
    },
  ],
  orders: [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", href: "/account/profile" },
        { label: "Preferences", href: "/account/preferences" },
        { label: "Activity", href: "/account/activity" },
        { label: "Support", href: "/account/support" },
      ],
    },
    {
      title: "RECORDS",
      items: [{ label: "Orders", href: "/orders" }],
    },
  ],
};
