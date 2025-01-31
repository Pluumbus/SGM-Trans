import { GeneralTableType } from "./general.types";

type NotificationType = "warning" | "danger" | "success" | "default";

export type NotificationDTOType = {
  /**
   * @type users - List of user IDs who will receive the notification.
   * This should be an array of strings, where each string represents a unique user ID (usually retrieved from Clerk or your database).
   */
  users: string[];

  /**
   * @type type - The type of the notification.
   * This defines the category or importance of the notification, e.g.:
   * - "warning": For alerts requiring attention.
   * - "danger": For critical errors or urgent actions.
   * - "success": For positive feedback or successful actions.
   * - "default": For neutral or general notifications.
   */
  type?: NotificationType;

  /**
   * @type message - The content of the notification.
   * This is a short message or description that will be displayed to the user (e.g., "Your profile has been updated").
   */
  message: string;

  view?: {
    is_read: boolean;
    is_sent_toast: boolean;
    user: string;
  }[];

  when?: string;
};

export type NotificationTableType = NotificationDTOType & GeneralTableType;
