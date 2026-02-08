import { useState, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status: "NEW" | "READ";
  link?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Dataset Update Available",
      message: "US Treasury Bond Yields 2024 has been updated with new data.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "NEW",
    },
    {
      id: "2",
      title: "Purchase Confirmed",
      message: "Your purchase of India Crop Production Statistics has been confirmed.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "NEW",
    },
    {
      id: "3",
      title: "Access Granted",
      message: "You now have access to Global Carbon Emissions - Q4 2024.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "READ",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" as const } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" as const })));
  };

  return { notifications, markAsRead, markAllAsRead };
}

interface WishlistItem {
  id: string;
  datasetId: string;
  title: string;
  category: string;
  pricingType: "FREE" | "PAID";
  addedAt: string;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: "1",
      datasetId: "DS-2026-001",
      title: "European Energy Grid Analytics",
      category: "Energy & Utilities",
      pricingType: "PAID",
      addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      datasetId: "DS-2026-002",
      title: "Asia-Pacific Trade Routes 2024",
      category: "Economics & Trade",
      pricingType: "PAID",
      addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, removeItem };
}

interface TicketMessage {
  id: string;
  author: "buyer" | "support";
  content: string;
  timestamp: string;
}

interface Ticket {
  ticketNumber: string;
  subject: string;
  category: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      ticketNumber: "TCK-2026-0142",
      subject: "Unable to download dataset",
      category: "Dataset",
      status: "OPEN",
      createdAt: "2026-02-05T10:00:00Z",
      lastUpdated: "2026-02-07T15:30:00Z",
      messages: [],
    },
    {
      ticketNumber: "TCK-2026-0138",
      subject: "Question about license terms",
      category: "Billing",
      status: "CLOSED",
      createdAt: "2026-01-28T14:00:00Z",
      lastUpdated: "2026-01-30T09:00:00Z",
      messages: [],
    },
  ]);

  return { tickets, isLoading: false };
}

export function useTicket(ticketNumber: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTicket({
        ticketNumber: "TCK-2026-0142",
        subject: "Unable to download dataset",
        category: "Dataset",
        status: "OPEN",
        createdAt: "2026-02-05T10:00:00Z",
        lastUpdated: "2026-02-07T15:30:00Z",
        messages: [
          {
            id: "1",
            author: "buyer",
            content: "I'm having trouble downloading the US Treasury Bond Yields dataset. The download link appears to be broken.",
            timestamp: "2026-02-05T10:00:00Z",
          },
          {
            id: "2",
            author: "support",
            content: "Thank you for contacting us. We've looked into this issue and regenerated your download link. Please try again and let us know if you continue to experience problems.",
            timestamp: "2026-02-07T15:30:00Z",
          },
        ],
      });
      setIsLoading(false);
    }, 500);
  }, [ticketNumber]);

  return { ticket, isLoading };
}
