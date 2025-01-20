"use client";
import {
  ClientRequestStatus,
  ClientRequestTypeDTO,
} from "@/app/(client-logic)/client/types";
import supabase from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";

export const getRequests = async (): Promise<
  Array<ClientRequestTypeDTO & { trip_id: number }>
> => {
  const { user } = useUser();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .or(`logist_id.eq.${user.id},logist_id.eq.""`);

  if (error) {
    throw new Error();
  }
  return data as Array<ClientRequestTypeDTO & { trip_id: number }>;
};

export const setRequestStatus = async ({
  reqId,
  status,
}: {
  reqId: number;
  status: ClientRequestStatus;
}): Promise<ClientRequestTypeDTO[]> => {
  const { user } = useUser();
  const { data, error } = await supabase
    .from("requests")
    .update({
      logist_id: user?.id!,
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
