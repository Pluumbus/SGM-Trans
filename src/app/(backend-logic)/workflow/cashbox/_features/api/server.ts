"use server";
import getSupabaseServer from "@/utils/supabase/server";
import { CashboxType } from "../../types";

export const getClients = async () => {
  const { data, error } = await (await getSupabaseServer())
    .from("cashbox")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as CashboxType[];
};

export const getClientsNames = async () => {
  const { data, error } = await (await getSupabaseServer())
    .from("cashbox")
    .select("id,client");

  if (error) {
    throw new Error(error.message);
  }

  return data as { id: CashboxType["id"]; client: CashboxType["client"] }[];
};
export const getClient = async (id: number) => {
  const { data, error } = await (await getSupabaseServer())
    .from("cashbox")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data as CashboxType[];
};
