"use client";
import supabase from "@/utils/supabase/client";

export const changeClientBalance = async (clientId: number, value: number) => {
  const { data, error } = await supabase
    .from("cashbox")
    .update({ current_balance: value })
    .eq("id", Number(clientId));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
