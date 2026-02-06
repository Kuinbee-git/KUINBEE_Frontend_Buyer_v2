/**
 * Date formatting utilities
 */

import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(date: string | Date, formatStr = "PPP"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatDateTime(
  date: string | Date,
  formatStr = "PPP p"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}
