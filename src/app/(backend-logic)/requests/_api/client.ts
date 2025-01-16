"use server";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import getSupabaseServer from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";

export const getRequests = async (): Promise<
  Array<ClientRequestTypeDTO & { trip_id: number }>
> => {
  const user = await currentUser();
  const { data, error } = await (await getSupabaseServer())
    .from("requests")
    .select("*")
    .or(`logist_id.eq.${user.id},logist_id.eq.""`);

  if (error) {
    throw new Error();
  }
  return data as Array<ClientRequestTypeDTO & { trip_id: number }>;
};

export const getRequestsFromBitrix = async () => {
  try {
    const response = await fetch(
      "https://sgmtrans.bitrix24.kz/rest/1/oew0v8mg8fzaa9o3/crm.lead.list.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }
    const data = await response.json();
    return data.filter((e) => e.STATUS_ID !== "JUNK");
  } catch (err) {
    throw new Error(err);
  }
};
