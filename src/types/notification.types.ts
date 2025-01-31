import { GeneralTableType } from "./general.types";

type NotificationType = "warning" | "danger" | "success" | "default";

export type NotificationDTOType = {
  users: string[];
  message: string;
  view?: {
    is_read: boolean;
    is_sent_toast: boolean;
    user: string;
  }[];
  type?: NotificationType;
};

export type NotificationQueueDTOType = NotificationDTOType & {
  delay_at: string;
  recurring: boolean | null;
  interval: string | null;
};

export type NotificationQueueTableType = NotificationQueueDTOType &
  GeneralTableType;
export type NotificationTableType = NotificationDTOType & GeneralTableType;
