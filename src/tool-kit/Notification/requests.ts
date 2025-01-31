"use client";
import {
  NotificationDTOType,
  NotificationTableType,
} from "@/lib/types/notification.types";
import supabase from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";

export const sendNotification = async (notification: NotificationDTOType) => {
  const { error } = await supabase.from("notifications").insert({
    ...notification,
    view: notification.users.map((e) => ({
      user: e,
      is_read: false,
      is_sent_toast: false,
    })),
  });

  if (error) throw new Error(error.message);
};
export const updateNotificationProperty = async ({
  notification,
  mode = "is_sent_toast",
}: {
  notification: NotificationTableType;
  mode?: "is_read" | "is_sent_toast";
}) => {
  const { user } = useUser();
  const newView =
    mode == "is_sent_toast"
      ? (notification.view.find((e) => e.user == user.id).is_sent_toast = true)
      : (notification.view.find((e) => e.user == user.id).is_read = true);
  const { error } = await supabase
    .from("notifications")
    .update({
      view: newView,
    })
    .eq("id", notification.id);

  if (error) throw new Error(error.message);
};
