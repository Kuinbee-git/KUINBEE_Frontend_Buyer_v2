/**
 * Notification types
 */

import { PaginationQuery } from "./api.types";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListQuery extends PaginationQuery {
  unreadOnly?: boolean;
}
