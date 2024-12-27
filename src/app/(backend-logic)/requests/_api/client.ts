"use server";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import getSupabaseServer from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";

export const getRequests = async (): Promise<ClientRequestTypeDTO[]> => {
  const user = await currentUser();
  const { data, error } = await (await getSupabaseServer())
    .from("requests")
    .select("*")
    .or(`logist_id.eq.${user.id},logist_id.eq.""`);

  if (error) {
    throw new Error();
  }
  return data as ClientRequestTypeDTO[];
};
