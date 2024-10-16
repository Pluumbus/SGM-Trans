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
