"use server";

import getSupabaseServer from "@/utils/supabase/server";
import { CargoType, WeekType } from "../../_feature/types";
import { TripType } from "../../_feature/TripCard/TripCard";

export const getCargos = async (): Promise<CargoType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server).from("cargos").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as CargoType[];
};

export const getWeeks = async (): Promise<
  (CargoType & { trips: (TripType & { weeks: WeekType })[] })[]
> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("cargos")
    .select("*, trips(*, weeks(*))");

  if (error) {
    throw new Error(error.message);
  }

  return data as (CargoType & { trips: (TripType & { weeks: WeekType })[] })[];
};
