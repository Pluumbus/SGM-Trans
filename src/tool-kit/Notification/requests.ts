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
  userId,
  mode = "is_sent_toast",
}: {
  notification: NotificationTableType;
  userId: string;
  mode?: "is_read" | "is_sent_toast";
}) => {
  const updatedView = notification.view.map((entry) =>
    entry.user === userId ? { ...entry, [mode]: true } : entry
  );

  const { error } = await supabase
    .from("notifications")
    .update({ view: updatedView })
    .eq("id", notification.id);

  if (error) throw new Error(error.message);
};
