"use client";

import {
  CarsType,
  DriversType,
  DriversWithCars,
  TrailersType,
} from "@/lib/references/drivers/feature/types";
import supabase from "@/utils/supabase/client";

export const getDrivers = async () => {
  const { data, error } = await supabase.from(`drivers`).select(`*`);

  if (error) {
    throw new Error(error.message);
  }
  return data as DriversType[];
};

export const getCars = async (type?: CarsType["car_type"]) => {
  const { data, error } = type
    ? await supabase.from(`cars`).select(`*`).eq("car_type", type)
    : await supabase.from(`cars`).select(`*`);

  if (error) {
    throw new Error(error.message);
  }
  return data as CarsType[];
};

export const getTrailers = async () => {
  const { data, error } = await supabase.from(`trailers`).select(`*`);

  if (error) {
    throw new Error(error.message);
  }
  return data as TrailersType[];
};

export const getCarsWithTrailers = async () => {
  return await supabase.from(`cars`).select("*, trailers(trailer_id) ");
};

export const getDriversWithCars = async () => {
  const { data, error } = await supabase.from(`drivers`).select(`*, cars(*)`);

  if (error) {
    throw new Error(error.message);
  }
  return data as DriversWithCars[];
};

export const getDriversWithCarsWithTrailers = async () => {
  return await supabase.from("drivers").select(`
    *, cars(*, trailers(*))
  `);
};
