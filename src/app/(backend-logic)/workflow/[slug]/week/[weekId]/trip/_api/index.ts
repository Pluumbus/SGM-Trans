"use server";

import getSupabaseServer from "@/utils/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import { TripAndWeeksIdType, WeekTableType } from "./types";
import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";

export const getUserById = async (userId: string) => {
  const user = await (await clerkClient()).users.getUser(userId);

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.imageUrl,
  };
};

export const getWHCargos = async (
  trip_id: string,
  wDeleted: boolean = false
): Promise<WHCargoType[]> => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("wh_cargos")
    .select("*")
    .eq("trip_id", trip_id);

  if (error) {
    throw new Error(error.message);
  }

  return data as WHCargoType[];
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

export const GetWeeksTripsCargos = async () => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("weeks")
    .select(
      "week_dates,week_number,trips(trip_number,cargos(id,amount,user_id,is_deleted))"
    );
  if (error) throw new Error(error.message);
  return data as {
    week_dates: { end_date: string; start_date: string };
    trips: {
      trip_number: number;
      cargos: {
        id: number;
        amount: { value };
        user_id: string;
        is_deleted: boolean;
      }[];
    }[];
  }[];
};

export const GetDataForUpdateTripNumber = async (
  weekId: string,
  slug: string
) => {
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("weeks")
    .select(
      "table_type,trips(id,trip_number,driver,status,city_to,cargos(weight,trip_id,volume))"
    )
    .eq("table_type", slug);
  // .in("id", [Number(weekId) - 1, Number(weekId + 1)]);
  if (error) throw new Error(error.message);
  return data as {
    table_type: string;
    trips: {
      id: number;
      trip_number: number;
      driver: { driver: string; car: string; state_number: string };
      city_to: string[];
      status: string;
      cargos: {
        trip_id: number;
        weight: string;
        volume: string;
      }[];
    }[];
  }[];
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
