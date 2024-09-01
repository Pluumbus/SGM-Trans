"use server";

import getSupabaseServer from "@/utils/supabase/server";
import { CargoType, WeekType } from "../../_feature/types";
import { TripType } from "../../_feature/TripCard/TripCard";
import { clerkClient } from "@clerk/nextjs/server";

export const getUserById = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  return {
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const getCargos = async (trip_id: string): Promise<CargoType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("cargos")
    .select("*")
    .eq("trip_id", trip_id);

  if (error) {
    throw new Error(error.message);
  }

  return data as CargoType[];
};

export const getCargosByTripId = async (
  trip_id: number | string
): Promise<CargoType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("cargos")
    .select("*")
    .eq("trip_id", trip_id);

  if (error) {
    throw new Error(error.message);
  }

  return data as CargoType[];
};

export const getTripsByWeekId = async (weekId: number): Promise<TripType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("trips")
    .select("*")
    .eq("week_id", weekId);

  if (error) {
    throw new Error(error.message);
  }

  return data as TripType[];
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

export const getJustWeeks = async () => {
  const server = getSupabaseServer();
  const { data, error } = await (await server).from(`weeks`).select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as WeekType[];
};
