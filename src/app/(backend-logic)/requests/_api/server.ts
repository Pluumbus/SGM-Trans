"use server";

import {
  ClientRequestStatus,
  ClientRequestTypeDTO,
} from "@/app/(client-logic)/client/types";
import getSupabaseServer from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";

export const setRequestStatus = async ({
  reqId,
  status,
}: {
  reqId: number;
  status: ClientRequestStatus;
}): Promise<ClientRequestTypeDTO[]> => {
  const { id } = await currentUser();
  const { data, error } = await (
    await getSupabaseServer()
  )
    .from("requests")
    .update({
      logist_id: id,
      status: status,
    })
    .eq("id", reqId)
    .select();

  if (error) {
    throw new Error();
  }
  return data as ClientRequestTypeDTO[];
};

export const setRequestToInReview = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.IN_REVIEW });
};
export const setRequestToRejected = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.REJECTED });
};
export const setRequestToApproved = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.APPROVED });
};
