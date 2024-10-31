"use server";

import getSupabaseServer from "@/utils/supabase/server";
import { ClientRequestType } from "../../types";
import { currentUser } from "@clerk/nextjs/server";

export const getClientRequests = async () => {
  const user = currentUser();
  const { data, error } = await (
    await getSupabaseServer()
  )
    .from("requests")
    .select("*")
    .eq("user_id", (await user).id);

  if (error) {
    throw new Error(error.message);
  }

  return data as ClientRequestType[];
};
