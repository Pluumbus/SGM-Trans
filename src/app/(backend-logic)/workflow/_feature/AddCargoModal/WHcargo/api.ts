"use client";

import supabase from "@/utils/supabase/client";
import { WHCargoType } from "./types";

export const addWHCargo = async (data: WHCargoType) => {
  const { error } = await supabase.from("wh_cargos").insert(data);
  if (error) throw new Error(error.message);
};

export const updateWHCargo = async (data: WHCargoType) => {
  const { error } = await supabase
    .from("wh_cargos")
    .update(data)
    .eq("id", data.id);
  if (error) throw new Error(error.message);
};
