"use client";

import supabase from "@/utils/supabase/client";

// export const updateTrailerData = async (id, value) => {
//   const { data, error } = await supabase
//     .from("cars")
//     .update({ trailer_id: value })
//     .eq("id", id);

//   if (error) {
//     throw new Error();
//   }

//   return data;
// };

// export const updateDriverData = async (id, value) => {
//   const { data, error } = await supabase
//     .from("drivers")
//     .update({ car_id: value })
//     .eq("id", id);

//   if (error) {
//     throw new Error();
//   }

//   return data;
// };

export const setDriver = async (driver: string) => {
  const { error } = await supabase.from("drivers").insert({ name: driver });
  if (error) throw new Error(error.message);
};

export const setCar = async (car: { name: string; state_number: string }) => {
  const { data, error } = await supabase
    .from("cars")
    .insert({ car: car.name, state_number: car.state_number });

  if (error) throw new Error(error.message);
};

export const setCarGazell = async (gazelle: {
  name;
  state_number;
  driver_name;
  passport_number;
  passport_date;
  passport_issued;
}) => {
  const { data, error: carsError } = await supabase
    .from("cars")
    .insert({
      car: gazelle.name,
      state_number: gazelle.state_number,
      car_type: "gazell",
    })
    .select("id")
    .single();

  const { error: driverError } = await supabase.from("drivers").insert({
    name: gazelle.driver_name,
    passport_data: {
      id: gazelle.passport_number,
      date: gazelle.passport_date,
      issued: gazelle.passport_issued,
    },
    car_type: "gazell",
    car_id: data.id,
  });

  if (carsError || driverError)
    throw new Error(carsError.message + " | " + driverError.message);
};

export const setTrailer = async (trailer: {
  name: string;
  state_number: string;
}) => {
  const { error } = await supabase
    .from("trailers")
    .insert({ trailer: trailer.name, state_number: trailer.state_number });

  if (error) throw new Error(error.message);
};

export const deleteObj = async (id: number, table: string) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
