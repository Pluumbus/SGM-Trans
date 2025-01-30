"use client";
import supabase from "@/utils/supabase/client";
import { CashboxType } from "../../types";
import { CashboxTableType } from "@/lib/types/cashbox.types";

export const getClients = async () => {
  const { data, error } = await supabase.from("cashbox").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as CashboxTableType[];
};

export const getClientsNames = async () => {
  const { data, error } = await supabase.from("cashbox").select("id,client");

  if (error) {
    throw new Error(error.message);
  }

  return data as { id: CashboxType["id"]; client: CashboxType["client"] }[];
};

export const getClient = async (id: number) => {
  const { data, error } = await supabase
    .from("cashbox")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CashboxType;
};
