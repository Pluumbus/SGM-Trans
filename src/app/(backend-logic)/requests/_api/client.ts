"use client";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import supabase from "@/utils/supabase/client";

export const getRequests = async (): Promise<ClientRequestTypeDTO[]> => {
  const { data, error } = await supabase.from("requests").select("*");

  if (error) {
    throw new Error();
  }
  return data as ClientRequestTypeDTO[];
};
