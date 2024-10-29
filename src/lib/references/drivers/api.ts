"use client";

import { DriversType, DriversWithCars } from "@/app/cars&drivers/_api/types";
import supabase from "@/utils/supabase/client";

export const getDrivers = async () => {
  const {data, error} =  await supabase.from(`drivers`).select(`*`)

  if (error ) {
    throw new Error(error.message);
  }
  return data as DriversType[];
};

export const getCars = async () => {
  return await supabase.from(`cars`).select("*");
};

export const getCarsWithTrailers = async () => {
  return await supabase.from(`cars`).select("*, trailers(trailer_id) ");
};

export const getDriversWithCars = async () => {
  const {data, error} =  await supabase.from(`drivers`).select(`*, cars(*)`)

  if (error ) {
    throw new Error(error.message);
  }
  return data as DriversWithCars[];
};

export const getDriversWithCarsWithTrailers = async () => {
  return await supabase.from("drivers").select(`
    *, cars(*, trailers(*))
  `);
};
