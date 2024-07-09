"use client";

import supabase from "@/utils/supabase/client";

export const getDrivers = async () => {
  return await supabase.from(`drivers`).select("*");
};

export const getCars = async () => {
  return await supabase.from(`cars`).select("*");
};

export const getCarsWithTrailers = async () => {
  return await supabase.from(`cars`).select("*, trailers(trailer_id) ");
};

export const getDriversWithCars = async () => {
  return await supabase.from(`drivers`).select(`*, cars(*)`);
};

export const getDriversWithCarsWithTrailers = async () => {
  return await supabase.from("drivers").select(`
    *, cars(*, trailers(*))
  `);
};
