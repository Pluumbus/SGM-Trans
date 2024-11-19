"use client";

import supabase from "@/utils/supabase/client";

export const updateTrailerData = async (id, value) => {
  const { data, error } = await supabase
    .from("cars")
    .update({ trailer_id: value })
    .eq("id", id);

  if (error) {
    throw new Error();
  }

  return data;
};

export const updateDriverData = async (id, value) => {
  console.log("id:", id, "value:", value);
  const { data, error } = await supabase
    .from("drivers")
    .update({ car_id: value })
    .eq("id", id);

  if (error) {
    throw new Error();
  }

  return data;
};

export const setDriver = async (driver: string) => {
  const { data, error } = await supabase
    .from("drivers")
    .insert({ name: driver });

  if (error) {
    throw new Error(error.message);
  }
};

export const setCar = async (car: { input1: string; input2: string }) => {
  const { data, error } = await supabase
    .from("cars")
    .insert({ car: car.input1, state_number: car.input2 });

  if (error) {
    throw new Error(error.message);
  }
};

export const setTrailer = async (trailer: {
  input1: string;
  input2: string;
}) => {
  const { data, error } = await supabase
    .from("trailers")
    .insert({ trailer: trailer.input1, state_number: trailer.input2 });

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteObj = async (id: number, table: string) => {
  const { data, error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
