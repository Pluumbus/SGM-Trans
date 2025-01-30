"use client";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import supabase from "@/utils/supabase/client";
import { isArray } from "lodash";
import { useParams } from "next/navigation";
import { WeekTableType } from "./types";

export const updateTripStatus = async (value: string | any, tripId) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ status: value })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
  return data;
};

export const deleteCargo = async (cargoId: number | number[]) => {
  if (isArray(cargoId)) {
    cargoId.forEach(async (e) => {
      const { error } = await supabase
        .from("cargos")
        .update({ is_deleted: true })
        .eq("id", Number(e));
      if (error) {
        throw new Error();
      }
    });
    return;
  } else {
    const { data, error } = await supabase
      .from("cargos")
      .update({ is_deleted: true })
      .eq("id", Number(cargoId));

    if (error) {
      throw new Error();
    }
    return data;
  }
};

export const setTripToNextWeek = async ({
  trip,
  weekType,
}: {
  trip: TripType;
  weekType: WeekTableType;
}) => {
  const { data: nextWeek } = await supabase
    .from("weeks")
    .select("id")
    .order("id", {})
    .gt("id", trip.week_id)
    .eq("table_type", weekType)
    .maybeSingle();

  if (!nextWeek) {
    throw new Error("Следующей недели нет");
  }

  const { data, error } = await supabase
    .from("trips")
    .update({ week_id: nextWeek.id })
    .eq("id", Number(trip.id));
  if (error) {
    throw new Error();
  }
  return nextWeek;
};
export const updateTripDate = async (
  value: string | any,
  tripId,
  dateIn: boolean
) => {
  if (dateIn) {
    const { data, error } = await supabase
      .from("trips")
      .update({ date_in: value })
      .eq("id", Number(tripId));

    if (error) {
      throw new Error();
    }
    return data;
  }

  const { data, error } = await supabase
    .from("trips")
    .update({ date_out: value })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
};

export const updateTripRespUser = async (value: string | any, tripId) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ user_id: value })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
  return data;
};

export const updateTripDriver = async (
  value: TripType["driver"],
  tripId: number
) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ driver: value })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
  return data;
};

export const updateTripNumber = async (newNum: number, tripId: number) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ trip_number: newNum })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
  return data;
};

export const updateExchangeRate = async (value: string, tripId: number) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ exchange_rate: value })
    .eq("id", tripId);
  if (error) {
    throw new Error();
  }
  return data;
};
