"use server";

import { NotificationTableType } from "@/lib/types/notification.types";
import getSupabaseServer from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";

export const getNotifications = async () => {
  const user = await currentUser();

  const { data, error } = await (await getSupabaseServer())
    .from("notifications")
    .select("*")
    .contains("users", [user.id]);

  if (error) throw new Error(error.message);

  return data as NotificationTableType[];
};
