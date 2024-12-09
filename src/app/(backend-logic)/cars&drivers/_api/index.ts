"use server";
import getSupabaseServer from "@/utils/supabase/server";
import {
  CarsType,
  DriversType,
  FullDriversType,
  TrailersType,
} from "../../../../lib/references/drivers/feature/types";

const server = getSupabaseServer();

export const getFullGazellsData = async () => {
  const { data, error } = await (await server)
    .from("cars")
    .select("*,drivers(*)")
    .eq("car_type", "gazell");

  if (error) {
    throw new Error(error.message);
  }
  return data as FullDriversType[];
};
