"use client";
import supabase from "@/utils/supabase/client";

export const updateTripStatus = async (value: string | any, tripId) => {
  const { data, error } = await supabase
    .from("trips")
    .update({ status: value })
    .eq("id", Number(tripId));

  if (error) {
    console.log(error);
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
    console.log(error);
    throw new Error();
  }
  return data;
};
