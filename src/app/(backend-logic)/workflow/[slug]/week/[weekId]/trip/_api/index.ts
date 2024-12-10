"use server";

import getSupabaseServer from "@/utils/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import { TripAndWeeksIdType, WeekTableType } from "./types";

export const getUserById = async (userId: string) => {
  const user = await (await clerkClient()).users.getUser(userId);

  return {
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const getCargos = async (
  trip_id: string,
  wDeleted: boolean = false
): Promise<CargoType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("cargos")
    .select("*")
    .eq("trip_id", trip_id)
    .eq("is_deleted", wDeleted);

  if (error) {
    throw new Error(error.message);
  }

  return data as CargoType[];
};

export const getAllCargos = async (
  field?: string | string[]
): Promise<CargoType[]> => {
  const server = getSupabaseServer();

  const whatToGet = Array.isArray(field) ? field.join(",") : field || "*";

  const { data, error } = await (await server).from("cargos").select(whatToGet);

  if (error) {
    throw new Error(error.message);
  }
  // @ts-ignore
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

export const getTripsByWeekId = async (
  weekId: string
): Promise<TripAndWeeksIdType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("trips")
    .select("*, weeks(*)")
    .eq("week_id", weekId);

  if (error) {
    throw new Error(error.message);
  }

  return data as TripAndWeeksIdType[];
};

export const getWeeks = async (
  type: WeekTableType = "ru"
): Promise<(WeekType & { trips: TripType[] })[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("weeks")
    .select("*, trips(*)")
    .eq("table_type", type);

  if (error) {
    throw new Error(error.message);
  }

  return data as (WeekType & { trips: TripType[] })[];
};

export const getTrips = async (): Promise<TripType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server).from(`trips`).select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as TripType[];
};

export const getJustWeeks = async (type: WeekTableType = "ru") => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from(`weeks`)
    .select("*")
    .eq("table_type", type);

  if (error) {
    throw new Error(error.message);
  }

  return data as WeekType[];
};
