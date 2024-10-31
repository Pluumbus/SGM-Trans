"use client";

import supabase from "@/utils/supabase/client";
import { ClientRequestType } from "../../types";

export const addClientRequest = async (dataToInsert: ClientRequestType) => {
  const { error } = await supabase.from("requests").insert(dataToInsert);

  if (error) {
    throw new Error(error.message);
  }
};
