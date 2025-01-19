"use client";

import supabase from "@/utils/supabase/client";
import { ClientRequestType } from "../../types";
import { useUser } from "@clerk/nextjs";

export const getClientRequests = async () => {
  const { user } = useUser();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data as ClientRequestType[];
};
