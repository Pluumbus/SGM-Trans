"use client";

import supabase from "@/utils/supabase/client";
import { CargoType } from "../../types";

export type GetCitiesFromTheWeekType = { cargos: CargoType[] }[];

export const getCargosFromTheWeek = async (
  id: number
): Promise<GetCitiesFromTheWeekType> => {
  const { data, error } = await supabase
    .from("trips")
    .select("cargos(*)")
    .eq("week_id", id);
  if (error) throw new Error(error.message);

  return data as GetCitiesFromTheWeekType;
};
