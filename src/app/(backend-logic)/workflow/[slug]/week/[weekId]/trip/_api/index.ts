"use client";
import { clerkClient } from "@clerk/nextjs/server";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import { TripAndWeeksIdType, WeekTableType } from "./types";
import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";
import supabase from "@/utils/supabase/client";

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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const whatToGet = Array.isArray(field) ? field.join(",") : field || "*";

  const { data, error } = await supabase.from("cargos").select(whatToGet);

  if (error) {
    throw new Error(error.message);
  }
  // @ts-ignore
  return data as CargoType[];
};

export const GetWeeksTripsCargos = async () => {
  const { data, error } = await supabase
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

export const getCargosByTripId = async (
  trip_id: number | string
): Promise<CargoType[]> => {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from("weeks")
    .select("*, trips(*)")
    .eq("table_type", type);

  if (error) {
    throw new Error(error.message);
  }

  return data as (WeekType & { trips: TripType[] })[];
};

export const getTrips = async (): Promise<TripType[]> => {
  const { data, error } = await supabase.from(`trips`).select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as TripType[];
};

export const getJustWeeks = async (type: WeekTableType = "ru") => {
  const { data, error } = await supabase
    .from(`weeks`)
    .select("*")
    .eq("table_type", type);

  if (error) {
    throw new Error(error.message);
  }

  return data as WeekType[];
};
