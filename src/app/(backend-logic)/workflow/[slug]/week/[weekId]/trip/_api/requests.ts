"use client";
import supabase from "@/utils/supabase/client";
import { isArray } from "lodash";

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

export const updateTripDate = async (
  value: string | any,
  tripId,
  dateIn: boolean,
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
  return data;
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
  value: { driver: string; car: string; state_number: string },
  tripId: number,
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
