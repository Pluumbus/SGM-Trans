"use client";
import supabase from "@/utils/supabase/client";

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

export const updateTripDriver = async (value: string | any, tripId) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ driver: value })
    .eq("id", Number(tripId));

  if (error) {
    throw new Error();
  }
  return data;
};
