"use client";
import {
  ClientRequestStatus,
  ClientRequestTypeDTO,
} from "@/app/(client-logic)/client/types";
import { LeadType } from "@/app/api/types";
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

export const setLeadStatus = async ({
  leadId,
  status,
}: {
  leadId: number;
  status: ClientRequestStatus;
}): Promise<ClientRequestTypeDTO[]> => {
  const { user } = useUser();
  const { data, error } = await supabase
    .from("requests")
    .update({
      logist_id: user?.id!,
      status: status,
    })
    .eq("id", leadId)
    .select();

  if (error) {
    throw new Error();
  }
  return data as ClientRequestTypeDTO[];
};

export const addLeadToReview = async ({
  lead,
}: {
  lead: LeadType;
}): Promise<LeadType> => {
  const { user } = useUser();
  const { data, error } = await supabase.from("requests").insert({
    id: lead.id,
    phone_number: lead.phone?.value,
    created_at: lead.date_create,
    logist_id: user?.id,
    status: ClientRequestStatus.IN_REVIEW,
  });

  if (error) {
    throw new Error();
  }
  return data as LeadType;
};

export const setLeadToInReview = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.IN_REVIEW });
};
export const setLeadToRejected = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.REJECTED });
};
export const setLeadToApproved = async ({ reqId }: { reqId: number }) => {
  setRequestStatus({ reqId, status: ClientRequestStatus.APPROVED });
};
