"use client";
import supabase from "@/utils/supabase/client";
import { useCargosField } from "../../Contexts";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";

export const editCargo = async (
  column: string,
  value: string | any,
  cargoId
) => {
  const { data, error } = await supabase
    .from("cargos")
    .update({ [column]: value })
    .eq("id", Number(cargoId));

  if (error) {
    throw new Error();
  }
  return data;
};
export const editWHCargo = async (
  column: string,
  value: string | any,
  whCargoId: string | number
) => {
  const { data, error } = await supabase
    .from("wh_cargos")
    .update({ [column]: value })
    .eq("id", Number(whCargoId));

  if (error) {
    throw new Error();
  }
  return data;
};
