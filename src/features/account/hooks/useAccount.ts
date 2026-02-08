"use client";

import { useState, useEffect } from "react";

// Notifications Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "update",
      title: "Dataset Update Available",
      message: "US Treasury Bond Yields 2024 has been updated with new data.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "purchase",
      title: "Purchase Confirmed",
      message: "Your purchase of India Crop Production Statistics has been confirmed.",
      time: "1 day ago",
      unread: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  return { notifications, markAsRead };
}

// Wishlist Hook
export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      title: "European Energy Grid Analytics",
      supplier: "European Data Coalition",
      category: "Energy & Utilities",
      price: "$599",
      verified: true,
      reviewed: true,
    },
    {
      id: "2",
      title: "Asia-Pacific Trade Routes 2024",
      supplier: "Global Trade Insights",
      category: "Economics & Trade",
      price: "$449",
      verified: true,
      reviewed: false,
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { wishlistItems, removeFromWishlist };
}

// Support Tickets Hook
export function useTickets() {
  const [tickets, setTickets] = useState([
    {
      id: "TKT-001234",
      subject: "Unable to download dataset",
      status: "open",
      createdAt: "2024-12-15",
      lastUpdate: "2 hours ago",
    },
    {
      id: "TKT-001198",
      subject: "Question about license terms",
      status: "resolved",
      createdAt: "2024-12-10",
      lastUpdate: "3 days ago",
    },
  ]);

  return { tickets };
}

// Single Ticket Hook
export function useTicket(ticketId: string) {
  const [ticket, setTicket] = useState({
    id: `TKT-001${ticketId}`,
    subject: "Unable to download dataset",
    status: "open",
    priority: "high",
    createdAt: "2024-12-15",
    messages: [
      {
        id: 1,
        author: "John Doe",
        role: "user",
        message: "I'm having trouble downloading the dataset.",
        timestamp: "2024-12-15T10:30:00Z",
      },
    ],
  });

  return { ticket };
}
