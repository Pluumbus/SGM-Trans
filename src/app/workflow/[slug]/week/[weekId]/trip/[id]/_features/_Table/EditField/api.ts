"use client";
import supabase from "@/utils/supabase/client";

export const editCargo = async (
  column: string,
  value: string | any,
  cargoId
) => {
  const { data, error } = await supabase
    .from("cargos")
    .update({ [column]: value })
    .eq("id", Number(cargoId))
    .select();

  if (error) {
    throw new Error();
  }
  return data;
};
